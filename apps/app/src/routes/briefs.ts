/**
 * [ONEWEEKBRIEF_BRIEFS] POST /api/briefs — validates, persists, returns invoice URL.
 *
 * Body:    { tier: "standard" | "pro" | "monitor", scope_md: string, email: string }
 * Returns: { brief_id: string, invoice_url: string, invoice_id: string }
 *
 * Rate limit: 5 submissions per IP per hour.
 */

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db/index.js";
import { users, briefs, orders, events } from "../db/schema.js";
import { logger } from "../lib/logger.js";
import { checkRateLimit } from "../lib/rate-limit.js";
import { isPlanId, PLANS, createNowpaymentsInvoice } from "../lib/nowpayments.js";
import { eq } from "drizzle-orm";
import type { OneWeekBriefEnv } from "../types/hono.js";

export const briefsRoute = new Hono<OneWeekBriefEnv>();

const tierToSla: Record<string, number> = {
  standard: 72,
  pro: 24,
  monitor: 24
};

const createBriefBody = z.object({
  tier: z.string().min(1),
  scope_md: z.string().min(10).max(10000),
  email: z.string().email()
});

briefsRoute.post(
  "/",
  zValidator("json", createBriefBody, (result, c) => {
    if (!result.success) {
      return c.json(
        { error: "bad_request", message: "Invalid request body.", issues: result.error.issues },
        400
      );
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    const correlationId = c.get("correlationId");
    const ip = c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown";

    // ── Rate limit ──
    const { allowed, retryAfterMs } = checkRateLimit(ip, "brief_submit");
    if (!allowed) {
      c.header("Retry-After", String(Math.ceil(retryAfterMs / 1000)));
      return c.json(
        { error: "rate_limited", message: "Too many brief submissions. Try again later.", retryAfterMs },
        429
      );
    }

    // ── Validate tier ──
    if (!isPlanId(body.tier)) {
      return c.json(
        {
          error: "unknown_plan",
          message: `Unknown plan: ${body.tier}. Allowed: ${Object.keys(PLANS).join(", ")}.`
        },
        400
      );
    }

    const plan = PLANS[body.tier];

    try {
      // ── Upsert user by email ──
      let user = await db.query.users.findFirst({
        where: eq(users.email, body.email)
      });

      if (!user) {
        // [ONEWEEKBRIEF_SCHEMA_DRIFT_2026-06-02] The live `users` table has a
        // NOT NULL `password_hash` column inherited from the open-saas
        // scaffold. The brief flow uses Postmark magic-link auth, so we
        // write an empty string to satisfy the constraint. This is a
        // deliberate, documented divergence from the open-saas default.
        const [inserted] = await db
          .insert(users)
          .values({ email: body.email, passwordHash: "" })
          .returning();
        user = inserted;
        logger.info({ userId: user.id, correlationId }, "Created new user");
      }

      // ── Insert brief ──
      const [brief] = await db
        .insert(briefs)
        .values({
          userId: user.id,
          scopeMd: body.scope_md,
          tier: body.tier,
          status: "submitted",
          slaHours: tierToSla[body.tier] ?? 72
        })
        .returning();

      logger.info({ briefId: brief.id, userId: user.id, tier: body.tier, correlationId }, "Brief created");

      // ── Insert submitted event ──
      await db.insert(events).values({
        briefId: brief.id,
        type: "submitted",
        payload: { tier: body.tier, correlationId }
      });

      // ── Create NOWPayments invoice ──
      const baseUrl = appUrlFromRequest(c.req.raw);
      const invoice = await createNowpaymentsInvoice({ plan, baseUrl, briefId: brief.id });

      // ── Insert order row ──
      await db.insert(orders).values({
        briefId: brief.id,
        invoiceId: invoice.id,
        amountCents: plan.priceUsd * 100
      });

      logger.info(
        { briefId: brief.id, invoiceId: invoice.id, correlationId },
        "Invoice created"
      );

      return c.json(
        {
          brief_id: brief.id,
          invoice_url: invoice.invoice_url,
          invoice_id: invoice.id
        },
        201
      );
    } catch (err) {
      logger.error({ err, correlationId }, "Failed to create brief");
      throw err;
    }
  }
);

function appUrlFromRequest(request: Request): string {
  const fromEnv = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return new URL(request.url).origin;
}
