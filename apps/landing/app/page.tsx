import Link from "next/link";
import { PricingCta, type PricingPlanId } from "./pricing-cta";

/* [ONEWEEKBRIEF_REDESIGN_R2] 2026-05-08
 * Reference: design-references/anthropic.md ("Research journal printed on warm stone").
 * Hard override per user: NO BEIGE. Canvas is milky white (#FAFAF8).
 * Lifted from reference:
 *   - type scale (caption 12 / body-sm 15 / subheading 18 / heading-sm 20 / heading 24 / heading-lg 61 / display 91)
 *   - tracking -1.22px on display, -0.6px at heading-lg
 *   - leading 1.1 at display, 1.4 at body
 *   - underline-as-emphasis on selected headline keywords (the brand signature)
 *   - 0px border-radius on buttons, 8px on cards, 24px on feature cards
 *   - asymmetric primary CTA radius (flat top, rounded bottom)
 *   - dark editorial feature card on #141413, contained (not full-bleed)
 *   - release-card grid with mono metadata labels (DATE, CATEGORY)
 * Kept from OneWeekBrief brand:
 *   - "OneWeekBrief" wordmark with scarlet underbar
 *   - Scarlet accent for footnote numerals + section under-rules
 *   - Pulse-dot ochre kicker
 *   - Editorial voice (Vol. 01 — A Prin7r Edition — 2026)
 */

export default function HomePage() {
  return (
    <main className="min-h-screen text-ink">
      <Masthead />
      <Hero />
      <SampleExcerpt />
      <HowItWorks />
      <FourOhFour />
      <Pricing />
      <WhatWeWontDo />
      <Cta />
      <Footer />
    </main>
  );
}

/* ---------------- Masthead ---------------- */

function Masthead() {
  return (
    <header className="hairline-b sticky top-0 z-40 backdrop-blur-[8px] bg-[rgba(250,250,248,0.86)]">
      <div className="mx-auto max-w-prose px-6 md:px-10 h-[68px] flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Logo />
          <span className="hidden lg:inline label">Vol. 01 — A Prin7r Edition — 2026</span>
        </div>
        <nav className="flex items-center gap-2 md:gap-4 text-[15px]">
          <Link href="#how" className="hidden md:inline px-3 py-2">How it works</Link>
          <Link href="#sample" className="hidden md:inline px-3 py-2">Sample</Link>
          <Link href="#pricing" className="hidden md:inline px-3 py-2">Pricing</Link>
          <Link href="#brief" className="btn btn-primary">Submit a brief</Link>
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <span className="inline-flex flex-col items-start" aria-label="OneWeekBrief">
      <span className="font-display font-black text-[34px] leading-none tracking-tight">O</span>
      <span className="block w-[58px] h-[2px] bg-scarlet mt-[2px]" />
      <span className="font-mono text-[8.5px] tracking-[3px] text-graphite uppercase mt-[2px]">oneweekbrief.</span>
    </span>
  );
}

/* ---------------- Hero ----------------
 * Lifted directly from Anthropic ref §"Hero Section":
 *   - 61px-class headline, weight 700, letter-spacing -1.22px (we use clamp for fluid)
 *   - body deck at 18px, max-width 320-480px
 *   - 80px top padding (we use 96px to breathe)
 *   - underline emphasis on selected keywords (the brand signature)
 */

function Hero() {
  return (
    <section className="hairline-b">
      <div className="mx-auto max-w-prose px-6 md:px-10 pt-24 md:pt-[96px] pb-24 md:pb-[120px]">
        <div className="flex items-center gap-3 reveal">
          <span className="inline-block w-[7px] h-[7px] rounded-full bg-ochre pulse-dot" />
          <span className="label">Filed under — research as a service</span>
        </div>

        {/* Hero headline: t-heading-lg (~61px clamp) Source Serif 4 weight 700.
            Underline-as-emphasis on three keywords — never color, never bold-shift.
            This is the BRAND SIGNATURE lifted from Anthropic. */}
        <h1 className="reveal mt-12 font-display font-bold t-heading-lg text-balance max-w-[15ch]">
          Decision-grade <span className="emph">market research</span>.
          <br />
          <span className="emph">Fully cited</span>.
          <br />
          In <span className="emph-scarlet">24&ndash;72 hours</span>.
        </h1>

        <div className="reveal-2 mt-12 grid md:grid-cols-12 gap-8 items-start">
          <p className="md:col-span-7 t-subheading text-ink leading-[1.55] max-w-[640px]">
            Submit a one-paragraph brief. A senior editor and an AI research engine
            turn it into a footnoted dossier you can defend in a board meeting.
            <br />
            <span className="text-ink-light">No consulting cycle. No paywalled report. No fabricated sources.</span>
          </p>
          <div className="md:col-span-5 md:pl-6 md:border-l md:border-[var(--hairline)]">
            <div className="label">From the editor's note, Vol. 01</div>
            <p className="font-display italic mt-3 t-subheading leading-[1.5] text-ink/85">
              "Footnotes that don't 404. The number you cite is only as good as the URL behind it."
            </p>
          </div>
        </div>

        <div className="reveal-3 mt-12 flex flex-wrap gap-3">
          <Link href="#brief" className="btn btn-primary">
            Submit a brief
            <Arrow />
          </Link>
          <Link href="#sample" className="btn btn-ghost">
            Read a real dossier
            <Arrow />
          </Link>
        </div>

        <div className="mt-[76px] grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-12 max-w-4xl border-t border-[var(--hairline-strong)] pt-10">
          <Stat n="24h" t="Pro tier SLA" />
          <Stat n="11.4%" t="LLM cites that 404" sub="we round-trip every one" />
          <Stat n="$499" t="Single brief, all-in" />
          <Stat n="100%" t="Footnoted claims" />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, t, sub }: { n: string; t: string; sub?: string }) {
  return (
    <div>
      <div className="font-display font-bold text-[44px] md:text-[52px] leading-none tracking-[-0.02em]">{n}</div>
      <div className="label mt-3">{t}</div>
      {sub && <div className="text-graphite text-[12px] mt-1.5 italic">{sub}</div>}
    </div>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="font-mono text-[15px]">→</span>
  );
}

/* ---------------- Sample dossier excerpt ----------------
 * Section bg: surface-elevated (#F4F4F0 — milky-white "elevated" band, not beige).
 * Inner dossier shelf: pure paper white #FFFFFF + double hairline (Anthropic-style).
 */

function SampleExcerpt() {
  return (
    <section id="sample" className="hairline-b surface-elevated">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-[76px] md:py-[96px]">
        <SectionHeader
          kicker="Section 02"
          eyebrow="From a recent dossier"
          title="An actual page"
          emphHead="from the desk"
        />
        <p className="mt-8 max-w-2xl t-subheading text-ink-light leading-[1.55]">
          Below is a verbatim excerpt from a Pro-tier dossier we shipped. Every
          superscript number resolves to a fetched source URL, an excerpt, and an
          accessed-date. This is exactly the artifact you receive.
        </p>

        <article className="dossier-frame mt-10 px-7 md:px-12 py-10 md:py-14 max-w-[920px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="label">Dossier ref</div>
              <div className="label-mono mt-1">D-2026-0418-FNS</div>
            </div>
            <div className="text-right">
              <div className="label">Tier · turnaround</div>
              <div className="label-mono mt-1">Pro · 31h</div>
            </div>
          </div>
          <h3 className="mt-7 font-display font-semibold text-[28px] md:text-[34px] leading-[1.15]">
            B2B fitness-tech consolidation: the post-Peloton operator window.
          </h3>
          <p className="font-mono text-[11px] tracking-[0.12em] text-graphite mt-3 uppercase">
            DRAFTED 2026-04-18 · EDITED A. PAVLOV · 14 SOURCES · 1,412 WORDS
          </p>
          <span className="block w-[58px] h-[2px] bg-scarlet mt-5" />

          <div className="mt-8 font-display text-[18px] leading-[1.7] text-ink space-y-5">
            <p>
              The B2B fitness-tech category compressed from 41 disclosed-funded
              entrants in 2022 to <strong>18 by Q4 2025</strong>; three platforms
              now hold an estimated <strong>71% of disclosed ARR</strong>
              <a className="footnote-num" href="#fn1">1</a>. The compression is
              not the result of a single acquirer running the table — it is the
              result of corporate-wellness procurement teams consolidating onto
              platforms that already integrate with their HRIS
              <a className="footnote-num" href="#fn2">2</a>.
            </p>
            <p>
              For an operator entering the category in 2026, the strategic
              question is no longer <em>can we win share</em>. It is{" "}
              <em>which 2 of the 18 survivors will absorb the remaining 71% of
              future enterprise wallet</em>, and whether a focused vertical wedge
              (clinical-grade, union-negotiated, or category-specific) can avoid
              the consolidation gravity altogether
              <a className="footnote-num" href="#fn3">3</a>.
            </p>
          </div>

          <ol className="thin-rule mt-10 pt-6 space-y-3 text-[13px] text-ink-light">
            <li id="fn1" className="grid grid-cols-[28px,1fr] gap-3">
              <span className="font-mono text-scarlet">1</span>
              <span>
                Crunchbase &amp; PitchBook funded-entity counts cross-referenced
                with disclosed ARR ranges in S-1 / 10-K filings from listed
                comparables. Accessed 2026-04-17. Method note in §A.
              </span>
            </li>
            <li id="fn2" className="grid grid-cols-[28px,1fr] gap-3">
              <span className="font-mono text-scarlet">2</span>
              <span>
                CHRO procurement survey, Mercer Wellbeing &amp; Benefits Outlook
                2025-Q4, p.42. Direct PDF available; accessed-date 2026-04-17.
              </span>
            </li>
            <li id="fn3" className="grid grid-cols-[28px,1fr] gap-3">
              <span className="font-mono text-scarlet">3</span>
              <span>
                See vertical-wedge case studies in clinical (Hinge Health
                10-K-A, FY24 §1B) and labour-negotiated (Kaiser-IUOE bargaining
                terms, public summary, accessed 2026-04-17).
              </span>
            </li>
          </ol>

          <div className="thin-rule mt-8 pt-5 text-[12px] text-ink-light italic">
            Editor's note — A. Pavlov: dropped two LLM-proposed citations
            (one 404, one wrong-page); flagged the Mercer figure as the load-bearing
            number for the consolidation thesis.
          </div>
        </article>

        <p className="mt-8 max-w-2xl text-graphite italic text-[14px]">
          Anonymized for publication; the customer's identifying detail and
          conclusion section are redacted from this preview. Source URLs in the
          delivered dossier are live, fetched, and round-tripped.
        </p>
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Brief",
      d: "You write a paragraph describing the question. We accept the brief or push back on scope inside an hour — the same way an editor does.",
    },
    {
      n: "02",
      t: "Engine",
      d: "A Pipelex graph runs planning → search → extract → cite-check across Claude, GPT and Gemini. Every candidate citation is fetched and parsed for the supporting excerpt.",
    },
    {
      n: "03",
      t: "Editor",
      d: "A senior editor round-trips every cite, drops anything that 404s or doesn't support the claim, and signs the dossier with their initials and a note.",
    },
    {
      n: "04",
      t: "Delivery",
      d: "MDX + PDF + sources.json arrive in 24-72 hours via magic link. Footnote sidecar shows every source URL, excerpt, and accessed-date inline.",
    },
  ];

  return (
    <section id="how" className="hairline-b">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-[76px] md:py-[96px]">
        <SectionHeader
          kicker="Section 03"
          eyebrow="The desk"
          title="Brief in. OneWeekBrief dossier out."
          emphHead="On a clock"
        />
        <div className="mt-[60px] grid md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="font-mono text-[12px] tracking-[0.18em] text-graphite uppercase">
                Step {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-4 font-display text-[64px] md:text-[72px] font-bold text-ink leading-[0.85] tracking-[-0.03em]">
                {s.n}
              </div>
              <span className="block w-7 h-[2px] bg-scarlet mt-5" />
              <h3 className="font-display font-semibold text-[24px] mt-4 leading-[1.2]">{s.t}</h3>
              <p className="text-ink-light mt-3 t-body-sm leading-[1.6]">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- The 404 frame ----------------
 * Anthropic ref §"Dark Editorial Feature Card": #141413 bg, 24px radius,
 * Source Serif at display scale, ivory CTAs (.btn-on-dark).
 * Contained — not full-bleed — so milky canvas peeks around all four corners. */

function FourOhFour() {
  return (
    <section className="hairline-b">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-[60px] md:py-[76px]">
        <div className="surface-feature-dark px-8 md:px-14 py-14 md:py-[76px]">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-6">
              <div className="label" style={{ color: "var(--ochre)" }}>Section 04 — The 404 problem</div>
              {/* Heading uses Anthropic Serif at display scale on dark surface — the broadsheet masthead inversion. */}
              <h2 className="mt-6 font-display font-semibold text-[44px] md:text-[64px] leading-[1.04] tracking-[-0.02em] text-balance">
                LLMs make footnotes that <span className="italic">look</span> real.
                <br />
                We make footnotes that <span className="emph-scarlet">resolve</span>.
              </h2>
              <span className="block w-[58px] h-[2px] bg-scarlet mt-7" />
              <p className="mt-8 max-w-md text-canvas/75 t-subheading leading-[1.55]">
                Generative tools cite. The desk verifies. Two stats from our
                own cite-check audit.
              </p>
            </div>
            <div className="md:col-span-6 grid grid-cols-2 gap-x-10 gap-y-12">
              <div>
                <div className="font-display text-[64px] md:text-[80px] font-bold leading-[0.9] text-ochre tracking-[-0.025em]">11.4%</div>
                <p className="text-canvas/75 mt-4 t-body-sm leading-[1.6]">
                  Of LLM-proposed citations, on a 1,200-claim audit run by our
                  engine, didn't resolve to the claim they were meant to support.
                </p>
              </div>
              <div>
                <div className="font-display text-[64px] md:text-[80px] font-bold leading-[0.9] text-ochre tracking-[-0.025em]">6/10</div>
                <p className="text-canvas/75 mt-4 t-body-sm leading-[1.6]">
                  Audited Q4-2025 venture decks contained at least one cited URL
                  that 404'd or pointed to the wrong page.
                </p>
              </div>
              <div className="col-span-2 pt-8 border-t border-canvas/15">
                <p className="font-display text-[20px] md:text-[22px] leading-[1.5] text-canvas/90 italic max-w-2xl">
                  "The number you cite in a board meeting is only as good as the
                  URL behind it. Our engineering bet is that the next decade of
                  research is editorial, not generative."
                </p>
                <p className="font-mono text-[11px] tracking-[0.18em] text-canvas/55 mt-5 uppercase">
                  — Editor's note, Vol. 01
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing ----------------
 * Anthropic ref §"Release Card Grid": cards on canvas-2 (#F4F4F0)
 * with 8px radius; uniform border-radius; mono labels for SLA.  */

type PricingTier = {
  name: string;
  price: string;
  cadence: string;
  sla: string;
  bullets: string[];
  cta: string;
  highlight: boolean;
  planId?: PricingPlanId;
};

function Pricing() {
  const tiers: PricingTier[] = [
    {
      name: "Standard",
      price: "$499",
      cadence: "per brief",
      sla: "72-hour SLA",
      bullets: [
        "8-15 round-tripped sources",
        "Junior editor pass",
        "MDX + PDF delivery",
        "1 round of revisions",
      ],
      cta: "Pay $499 in stablecoin",
      highlight: false,
      planId: "standard",
    },
    {
      name: "Pro",
      price: "$1,490",
      cadence: "per brief",
      sla: "24-hour SLA",
      bullets: [
        "15-25 round-tripped sources",
        "Senior editor signature",
        "MDX + PDF + sources.json",
        "2 rounds of revisions",
      ],
      cta: "Pay $1,490 in stablecoin",
      highlight: true,
      planId: "pro",
    },
    {
      name: "Monitor",
      price: "$2,490",
      cadence: "per month",
      sla: "4 dossiers + monthly delta",
      bullets: [
        "All Pro inclusions, 4× per month",
        "Monthly delta-rerun on each brief",
        "Library search + Slack delivery",
        "3 seats included",
      ],
      cta: "Subscribe in stablecoin",
      highlight: false,
      planId: "monitor",
    },
    {
      name: "Team",
      price: "$24,990",
      cadence: "per year",
      sla: "Custom SLA",
      bullets: [
        "Multi-seat dashboard",
        "API + Notion / Slack sync",
        "Lead-editor on call",
        "Annual brand voice training",
      ],
      cta: "Talk to the desk",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="hairline-b">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-[76px] md:py-[96px]">
        <SectionHeader
          kicker="Section 05"
          eyebrow="What it costs"
          title="Four tiers. Productized prices."
          emphHead="No proposal phase"
        />
        <p className="mt-8 max-w-2xl t-subheading text-ink-light leading-[1.55]">
          The first dossier is bought online without a sales call. Subscriptions
          and team contracts get a 30-minute editorial intake. Self-serve tiers
          settle in stablecoin (USDT / USDC) via NOWPayments — fiat on-ramp on
          the same hosted page where supported.
        </p>

        <div className="mt-[60px] grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                "rounded-card p-8 md:p-9 flex flex-col bg-canvas-2 border border-[var(--hairline-soft)] " +
                (t.highlight
                  ? "lg:-translate-y-3 z-10 ring-1 ring-ink ring-inset bg-paper-white"
                  : "")
              }
            >
              <div className="flex items-center justify-between">
                <div className="label">{t.name}</div>
                {t.highlight && (
                  <span className="label" style={{ color: "var(--scarlet)" }}>
                    Most picked
                  </span>
                )}
              </div>
              <div className="mt-5 font-display text-[44px] md:text-[48px] font-bold leading-[0.95] tracking-[-0.02em]">
                {t.price}
              </div>
              <div className="text-graphite text-[13px] mt-2">{t.cadence}</div>
              <span className="block w-7 h-[2px] bg-scarlet mt-6" />
              <div className="font-mono text-[11px] tracking-[0.18em] text-graphite uppercase mt-5">
                {t.sla}
              </div>
              <ul className="mt-6 space-y-2.5 text-[14px] text-ink leading-[1.55]">
                {t.bullets.map((b) => (
                  <li key={b} className="grid grid-cols-[14px,1fr] gap-3">
                    <span className="font-mono text-scarlet text-[14px] leading-none mt-[6px]">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                {t.planId ? (
                  <PricingCta
                    plan={t.planId}
                    label={t.cta}
                    className={
                      "btn justify-center w-full " +
                      (t.highlight ? "btn-primary" : "btn-ghost")
                    }
                  />
                ) : (
                  <Link
                    href="#brief"
                    className="btn btn-ghost justify-center w-full"
                  >
                    {t.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-graphite italic max-w-2xl text-[14px] leading-[1.7]">
          Anti-feature notice — we do not write SEC, FDA, or other regulatory-grade
          claims. We do not revise toward a pre-specified conclusion. We will
          push back on scope before accepting your brief. Card customers and
          wire/ACH go through the desk — email <a className="emph-scarlet" href="mailto:desk@prin7r.com">desk@prin7r.com</a>.
        </p>
      </div>
    </section>
  );
}

/* ---------------- What we won't do ---------------- */

function WhatWeWontDo() {
  const items = [
    "Write a dossier whose conclusion you've already chosen.",
    "Include a footnote that didn't survive the round-trip.",
    "Make legal, regulatory, or medical claims.",
    "Sell your brief or your library to anyone, ever.",
  ];
  return (
    <section className="hairline-b surface-elevated">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-[76px] md:py-[96px]">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <SectionHeader
              kicker="Section 06"
              eyebrow="Operator's covenant"
              title="What we"
              emphHead="won't do"
            />
          </div>
          <ul className="md:col-span-7 text-[20px] md:text-[22px] font-display leading-[1.5]">
            {items.map((i, idx) => (
              <li
                key={i}
                className={
                  "grid grid-cols-[40px,1fr] gap-4 py-7 " +
                  (idx === 0 ? "border-t border-[var(--hairline-strong)] " : "") +
                  "border-b border-[var(--hairline-strong)]"
                }
              >
                <span className="font-mono text-scarlet text-[14px] mt-2.5 tracking-[0.05em]">{String(idx + 1).padStart(2, "0")}</span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */

function Cta() {
  return (
    <section id="brief" className="hairline-b">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-[96px] md:py-[120px]">
        <div className="max-w-3xl">
          <div className="label">Section 07 — The ask</div>
          <h2 className="mt-6 font-display font-bold t-heading-lg leading-[1.04] text-balance">
            Read a real dossier.
            <br />
            Submit a brief.
            <br />
            We&apos;ll have it back to you <span className="emph-scarlet italic font-normal">by Friday</span>.
          </h2>
          <span className="block w-[58px] h-[2px] bg-scarlet mt-9" />
          <p className="mt-10 max-w-xl text-ink-light t-subheading leading-[1.6]">
            The brief intake form opens once you&apos;ve read at least one sample.
            That is intentional — your first brief converts at a higher rate
            when you&apos;ve seen the artifact.
          </p>
          <div className="mt-12 flex flex-wrap gap-3">
            <a
              href="mailto:desk@prin7r.com?subject=New%20brief%20for%20OneWeekBrief&body=One-paragraph%20brief%3A%0A%0A%0AContext%20%2F%20deadline%3A%0A%0ABudget%20tier%20(Standard%20%24499%20%2F%20Pro%20%241%2C490%20%2F%20Monitor%20%242%2C490%20mo)%3A%0A"
              className="btn btn-primary"
            >
              Email a brief to the desk <Arrow />
            </a>
            <Link href="#sample" className="btn btn-ghost">
              Read the sample <Arrow />
            </Link>
          </div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-graphite uppercase mt-12">
            desk@prin7r.com — 24-72 hour SLA — paid on delivery for first-time buyers
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="surface-elevated">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-16 grid gap-12 md:grid-cols-3 items-start">
        <div>
          <Logo />
          <p className="mt-7 text-ink-light text-[13px] leading-[1.65] max-w-xs">
            OneWeekBrief is operated by Prin7r. Editorial team across NYC, Berlin, and
            Tbilisi. Built on the company-mktresearch engine.
          </p>
        </div>
        <div className="md:text-center">
          <div className="label">Vol. 01 — 2026</div>
          <p className="mt-4 font-display italic text-[17px] text-ink/85">
            "Footnotes that don&apos;t 404."
          </p>
        </div>
        <div className="md:text-right">
          <ul className="space-y-2.5 text-[13px]">
            <li><Link href="#how">How it works</Link></li>
            <li><Link href="#sample">Sample</Link></li>
            <li><Link href="#pricing">Pricing</Link></li>
            <li>
              <a
                href="https://github.com/prin7r-projects/market-research-on-demand"
                target="_blank"
                rel="noreferrer"
              >
                Repository
              </a>
            </li>
          </ul>
          <p className="font-mono text-[10px] tracking-[0.2em] text-graphite uppercase mt-8">
            © 2026 Prin7r — oneweekbrief@prin7r.com
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Helpers ----------------
 * SectionHeader signature now takes an `emphHead` slug — that word/phrase is
 * appended to the title with a thick underline (the brand signature). */

function SectionHeader({
  kicker,
  eyebrow,
  title,
  emphHead,
}: {
  kicker: string;
  eyebrow: string;
  title: string;
  emphHead?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="label">{kicker}</span>
        <span className="block w-8 h-[1px] bg-graphite/60" />
        <span className="label">{eyebrow}</span>
      </div>
      <h2 className="mt-6 font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.02em] text-balance max-w-3xl">
        {title}
        {emphHead && (
          <>
            {" "}
            <span className="emph">{emphHead}</span>.
          </>
        )}
      </h2>
      <span className="block w-[58px] h-[2px] bg-scarlet mt-7" />
    </div>
  );
}
