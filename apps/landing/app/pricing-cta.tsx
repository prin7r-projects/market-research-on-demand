"use client";
/**
 * [ONEWEEKBRIEF_PRICING_CTA] Client component that turns the three self-serve
 * pricing tiers into a NOWPayments hosted-invoice CTA.
 *
 * On click → `POST /api/checkout/nowpayments` → redirect to the returned
 * `invoice_url`. If the route returns 503 (env not yet wired) or any other
 * error, we surface a small editorial line under the button and fall back
 * to the desk@ mailto so the customer never hits a dead end.
 */

import { useState } from "react";
import Link from "next/link";

export type PricingPlanId = "standard" | "pro" | "monitor";

type Props = {
  plan: PricingPlanId;
  label: string;
  className?: string;
};

const FALLBACK_MAILTO =
  "mailto:desk@prin7r.com?subject=New%20brief%20for%20OneWeekBrief&body=One-paragraph%20brief%3A%0A%0A%0AContext%20%2F%20deadline%3A%0A%0ABudget%20tier%3A%0A";

export function PricingCta({ plan, label, className }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/checkout/nowpayments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const data = (await response.json().catch(() => null)) as
        | { invoice_url?: string; message?: string; error?: string }
        | null;

      if (response.ok && data?.invoice_url) {
        window.location.href = data.invoice_url;
        return;
      }

      const message =
        data?.message ?? `Checkout unavailable (HTTP ${response.status}). Email the desk to start your brief.`;
      setError(message);
    } catch {
      setError("Checkout unavailable. Email the desk to start your brief.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-7 flex flex-col">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-busy={busy}
        className={
          (className ?? "btn justify-center") +
          (busy ? " opacity-60 cursor-not-allowed" : "")
        }
      >
        {busy ? "Opening invoice…" : label}
        <span aria-hidden className="font-mono text-[14px]">→</span>
      </button>
      {error && (
        <p className="mt-3 text-[12px] text-graphite italic">
          {error}{" "}
          <Link href={FALLBACK_MAILTO} className="scarlet underline">
            Email the desk
          </Link>
          .
        </p>
      )}
    </div>
  );
}
