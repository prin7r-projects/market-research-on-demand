/**
 * [ONEWEEKBRIEF_NOWPAYMENTS] Server-side helpers for NOWPayments hosted invoices.
 *
 * Copied from apps/landing/lib/nowpayments.ts so the backend can create invoices
 * directly without proxying through the landing app.
 */

import crypto from "node:crypto";
import { MissingEnvError, optionalEnv } from "./env.js";

export type PlanId = "standard" | "pro" | "monitor";

export type Plan = {
  id: PlanId;
  name: string;
  priceUsd: number;
  description: string;
};

export const PLANS: Record<PlanId, Plan> = {
  standard: {
    id: "standard",
    name: "OneWeekBrief — Standard brief",
    priceUsd: 499,
    description: "Single market-research dossier, 72-hour SLA, 8-15 round-tripped sources, junior editor pass."
  },
  pro: {
    id: "pro",
    name: "OneWeekBrief — Pro brief",
    priceUsd: 1490,
    description: "Single market-research dossier, 24-hour SLA, 15-25 round-tripped sources, senior editor signature."
  },
  monitor: {
    id: "monitor",
    name: "OneWeekBrief — Monitor (monthly)",
    priceUsd: 2490,
    description: "Four Pro dossiers per month with monthly delta-rerun, library search, and Slack delivery. Three seats."
  }
};

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && value in PLANS;
}

export type CreateInvoiceInput = {
  plan: Plan;
  baseUrl: string;
  briefId: string;
};

export type NowpaymentsInvoice = {
  id: string;
  invoice_url: string;
  raw: Record<string, unknown>;
};

export async function createNowpaymentsInvoice(input: CreateInvoiceInput): Promise<NowpaymentsInvoice> {
  const apiKey = optionalEnv("NOWPAYMENTS_API_KEY");
  if (!apiKey) throw new MissingEnvError("NOWPAYMENTS_API_KEY");

  const sandbox = (optionalEnv("NOWPAYMENTS_SANDBOX") ?? "false").toLowerCase() === "true";
  const apiBase = sandbox ? "https://api-sandbox.nowpayments.io" : "https://api.nowpayments.io";

  const orderId = `oneweekbrief_${input.plan.id}_${input.briefId}`;

  const body = {
    price_amount: input.plan.priceUsd,
    price_currency: "usd",
    order_id: orderId,
    order_description: input.plan.description,
    ipn_callback_url: `${input.baseUrl}/api/webhooks/nowpayments`,
    success_url: `${input.baseUrl}/?order=${orderId}&status=paid`,
    cancel_url: `${input.baseUrl}/?order=${orderId}&status=cancelled`,
    is_fee_paid_by_user: false,
    is_fixed_rate: false
  };

  const response = await fetch(`${apiBase}/v1/invoice`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    parsed = { raw: text };
  }
  if (!response.ok) {
    throw new Error(`NOWPayments returned HTTP ${response.status}: ${text.slice(0, 500)}`);
  }

  const invoiceUrl = typeof parsed.invoice_url === "string" ? parsed.invoice_url : "";
  const invoiceId = typeof parsed.id === "string" || typeof parsed.id === "number" ? String(parsed.id) : orderId;

  if (!invoiceUrl) {
    throw new Error("NOWPayments response did not include invoice_url");
  }

  return {
    id: invoiceId,
    invoice_url: invoiceUrl,
    raw: parsed
  };
}

/* ------------------------------------------------------------------ */
/* HMAC-SHA512 IPN verification                                       */
/* ------------------------------------------------------------------ */

function timingSafeEqualHex(left: string, right: string): boolean {
  const a = left.trim().toLowerCase();
  const b = right.trim().toLowerCase();
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObject);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = sortObject((value as Record<string, unknown>)[key]);
        return result;
      }, {});
  }
  return value;
}

export function verifyNowpaymentsIpn(payload: unknown, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const sorted = JSON.stringify(sortObject(payload));
  const expected = crypto.createHmac("sha512", secret.trim()).update(sorted).digest("hex");
  return timingSafeEqualHex(expected, signature);
}
