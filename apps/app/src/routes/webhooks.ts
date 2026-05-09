/**
 * [ONEWEEKBRIEF_WEBHOOKS] POST /api/webhooks/nowpayments
 *
 * NOWPayments IPN handler. On verified payment_status = finished:
 *   1. Write events.engine_started row
 *   2. Push to Redis Stream brief.submitted
 *   3. Update briefs.status = in_progress
 *   4. Send Postmark queue confirmation email
 *
 * Never trusts an unverified payload.
 */

import { Hono } from "hono";
import { db } from "../db/index.js";
import { briefs, orders, events, users } from "../db/schema.js";
import { logger } from "../lib/logger.js";
import { optionalEnv } from "../lib/env.js";
import { verifyNowpaymentsIpn } from "../lib/nowpayments.js";
import { pushBriefSubmitted } from "../lib/redis.js";
import { sendQueueConfirmation } from "../lib/postmark.js";
import { eq } from "drizzle-orm";

export const webhooksRoute = new Hono();

webhooksRoute.post("/", async (c) => {
  const correlationId = c.get("correlationId");
  const secret = optionalEnv("NOWPAYMENTS_IPN_SECRET");

  if (!secret) {
    return c.json(
      { error: "missing_env", missing: "NOWPAYMENTS_IPN_SECRET", message: "Webhook handler is not configured." },
      503
    );
  }

  const rawBody = await c.req.text();
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return c.json({ error: "invalid_payload", message: "Body was not valid JSON." }, 400);
  }

  const signature = c.req.header("x-nowpayments-sig");
  const verified = verifyNowpaymentsIpn(payload, signature, secret);
  if (!verified) {
    return c.json({ error: "signature_invalid" }, 401);
  }

  const status = stringValue(payload.payment_status) ?? "";
  const paid = ["finished", "confirmed"].includes(status.toLowerCase());
  const orderId = stringValue(payload.order_id) ?? stringValue(payload.payment_id) ?? "nowpayments_unknown";

  logger.info(
    { orderId, status, paid, correlationId },
    "NOWPayments IPN verified"
  );

  if (!paid) {
    return c.json({ ok: true, verified: true, paid: false, order_id: orderId, status });
  }

  // ── Find the brief by order_id ──
  // order_id format: oneweekbrief_<tier>_<brief_id>
  const briefId = extractBriefIdFromOrderId(orderId);
  if (!briefId) {
    logger.warn({ orderId, correlationId }, "Could not extract brief_id from order_id");
    return c.json({ ok: true, verified: true, paid, order_id: orderId, status, note: "brief_id not extracted" });
  }

  try {
    // ── Update order paid_at ──
    await db
      .update(orders)
      .set({ paidAt: new Date() })
      .where(eq(orders.invoiceId, String(payload.payment_id ?? orderId)));

    // ── Update brief status ──
    await db
      .update(briefs)
      .set({ status: "in_progress" })
      .where(eq(briefs.id, briefId));

    // ── Write engine_started event ──
    await db.insert(events).values({
      briefId,
      type: "engine_started",
      payload: { orderId, status, correlationId }
    });

    // ── Push to Redis Stream ──
    const brief = await db.query.briefs.findFirst({
      where: eq(briefs.id, briefId),
      with: {
        user: true
      }
    });

    if (brief) {
      await pushBriefSubmitted(briefId, brief.tier);

      // ── Send queue confirmation email ──
      if (brief.user?.email) {
        await sendQueueConfirmation({
          to: brief.user.email,
          briefId,
          tier: brief.tier
        });
      }
    }

    logger.info({ briefId, orderId, correlationId }, "Payment processed, engine started");

    return c.json({
      ok: true,
      verified: true,
      paid: true,
      order_id: orderId,
      brief_id: briefId,
      status
    });
  } catch (err) {
    logger.error({ err, briefId, orderId, correlationId }, "Failed to process payment webhook");
    throw err;
  }
});

function stringValue(value: unknown): string | undefined {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return undefined;
}

function extractBriefIdFromOrderId(orderId: string): string | undefined {
  // order_id format: oneweekbrief_<tier>_<brief_id>
  const parts = orderId.split("_");
  if (parts.length >= 3 && parts[0] === "oneweekbrief") {
    return parts.slice(2).join("_"); // in case brief_id contains underscores
  }
  return undefined;
}
