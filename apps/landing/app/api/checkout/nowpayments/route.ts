/**
 * [CITED_NOWPAYMENTS_CHECKOUT] POST /api/checkout/nowpayments
 *
 * Body:    { plan: "standard" | "pro" | "monitor", brief?: string }
 * Returns: { invoice_url: string, invoice_id: string, plan: string, mode: "live" }
 *          on success.
 *
 * Errors  HTTP 400  for unknown plan ids
 *         HTTP 503  for missing env (so operators can see the gap without secrets leaking)
 *         HTTP 502  for upstream NOWPayments failures (provider error message bubbled).
 *
 * Never logs the API key. The NOWPayments hosted invoice is the redirect target;
 * the customer pays in stablecoin (USDT/USDC) or — when fiat is enabled on the
 * NOWPayments account — via the card on-ramp partner.
 */

import { NextResponse } from "next/server";
import { MissingEnvError } from "@/lib/env";
import { appUrlFromRequest } from "@/lib/env";
import { PLANS, createNowpaymentsInvoice, isPlanId } from "@/lib/nowpayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutBody = {
  plan?: string;
  brief?: string;
};

export async function POST(request: Request) {
  let body: CheckoutBody = {};
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    body = {};
  }

  const planId = body.plan;
  if (!isPlanId(planId)) {
    return NextResponse.json(
      {
        error: "unknown_plan",
        message: `Unknown plan: ${String(planId)}. Allowed: ${Object.keys(PLANS).join(", ")}.`
      },
      { status: 400 }
    );
  }
  const plan = PLANS[planId];

  const baseUrl = appUrlFromRequest(request);

  try {
    const invoice = await createNowpaymentsInvoice({ plan, baseUrl, brief: body.brief });
    return NextResponse.json({
      mode: "live",
      plan: plan.id,
      price_usd: plan.priceUsd,
      invoice_id: invoice.id,
      invoice_url: invoice.invoice_url
    });
  } catch (error) {
    if (error instanceof MissingEnvError) {
      return NextResponse.json(
        {
          error: "missing_env",
          missing: error.envName,
          message:
            "NOWPayments is not configured on this deployment yet. The desk takes briefs at desk@prin7r.com while we finish the wiring."
        },
        { status: 503 }
      );
    }
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json(
      {
        error: "upstream_error",
        message
      },
      { status: 502 }
    );
  }
}
