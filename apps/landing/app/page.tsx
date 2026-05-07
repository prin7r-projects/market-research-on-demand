import Link from "next/link";

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
    <header className="border-b border-ink/15">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-5 flex items-end justify-between">
        <div className="flex items-baseline gap-3">
          <Logo />
          <span className="hidden sm:inline label">Vol. 01 · A Prin7r Edition · 2026</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="#how" className="hover:opacity-70">How it works</Link>
          <Link href="#sample" className="hover:opacity-70">Sample</Link>
          <Link href="#pricing" className="hover:opacity-70">Pricing</Link>
          <Link href="#brief" className="btn">Submit a brief</Link>
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <span className="inline-flex flex-col items-start" aria-label="Cited">
      <span className="font-display font-black text-[34px] leading-none tracking-tight">C</span>
      <span className="block w-[58px] h-[2px] bg-scarlet mt-[2px]" />
      <span className="font-mono text-[8.5px] tracking-[3px] text-graphite uppercase mt-[2px]">cited.</span>
    </span>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="border-b border-ink/15">
      <div className="mx-auto max-w-prose px-6 md:px-10 pt-16 pb-24">
        <div className="flex items-center gap-3 reveal">
          <span className="inline-block w-2 h-2 rounded-full bg-ochre pulse-dot" />
          <span className="label">Filed under: research as a service</span>
        </div>

        <h1 className="reveal mt-6 font-display font-black leading-[0.95] tracking-tight text-[56px] md:text-[88px] lg:text-[112px]">
          Decision-grade
          <br />
          market research.
          <br />
          <span className="text-scarlet">Fully cited.</span>
          <br />
          In 24<span className="font-mono text-[0.55em] align-middle px-2 text-graphite">to</span>72 hours.
        </h1>

        <p className="reveal-2 mt-12 max-w-[640px] font-display text-[22px] md:text-[26px] leading-[1.45] text-ink/85">
          Submit a one-paragraph brief. A senior editor and an AI research engine
          turn it into a footnoted dossier you can defend in a board meeting.
          No consulting cycle. No paywalled report. No fabricated sources.
        </p>

        <div className="reveal-3 mt-12 flex flex-wrap gap-4">
          <Link href="#sample" className="btn btn-ghost">
            Read a real dossier
            <Arrow />
          </Link>
          <Link href="#brief" className="btn">
            Submit a brief
            <Arrow />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 max-w-3xl">
          <Stat n="24h" t="Pro tier SLA" />
          <Stat n="11.4%" t="LLM cites that 404" sub="we round-trip every one" />
          <Stat n="$499" t="Single brief, all in" />
          <Stat n="100%" t="Footnoted claims" />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, t, sub }: { n: string; t: string; sub?: string }) {
  return (
    <div>
      <div className="font-display font-black text-[40px] md:text-[48px] leading-none">{n}</div>
      <div className="label mt-2">{t}</div>
      {sub && <div className="text-graphite text-[12px] mt-1 italic">{sub}</div>}
    </div>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="font-mono text-[14px]">→</span>
  );
}

/* ---------------- Sample dossier excerpt ---------------- */

function SampleExcerpt() {
  return (
    <section id="sample" className="border-b border-ink/15 bg-paper-2/40">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <SectionHeader kicker="Section 02" eyebrow="From a recent dossier" title="An actual page from the desk." />
        <p className="mt-6 max-w-2xl text-ink/80 text-[17px]">
          Below is a verbatim excerpt from a Pro-tier dossier we shipped. Every
          superscript number resolves to a fetched source URL, an excerpt, and an
          accessed-date. This is exactly the artifact you receive.
        </p>

        <article className="dossier-frame mt-10 px-6 md:px-12 py-10 md:py-14 max-w-[860px]">
          <div className="flex flex-wrap items-center justify-between gap-3 label">
            <span>Dossier · D-2026-0418-FNS</span>
            <span>Pro tier · 31h turnaround</span>
          </div>
          <h3 className="mt-3 font-display text-[28px] md:text-[34px] leading-[1.15]">
            B2B fitness-tech consolidation: the post-Peloton operator window.
          </h3>
          <p className="font-mono text-[11px] tracking-wide text-graphite mt-3">
            DRAFTED 2026-04-18 · EDITED A. PAVLOV · 14 SOURCES · 1,412 WORDS
          </p>
          <span className="block w-[58px] h-[2px] bg-scarlet mt-4" />

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

          <ol className="thin-rule mt-10 pt-6 space-y-3 text-[13px] text-graphite">
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

          <div className="thin-rule mt-8 pt-5 text-[12px] text-graphite italic">
            Editor's note — A. Pavlov: dropped two LLM-proposed citations
            (one 404, one wrong-page); flagged the Mercer figure as the load-bearing
            number for the consolidation thesis.
          </div>
        </article>

        <p className="mt-8 max-w-2xl text-graphite italic">
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
    <section id="how" className="border-b border-ink/15">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <SectionHeader kicker="Section 03" eyebrow="The desk" title="Brief in. Cited dossier out. On a clock." />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="font-display text-[44px] font-black text-scarlet leading-none">{s.n}</div>
              <span className="block w-8 h-[1.5px] bg-ink mt-3" />
              <h3 className="font-display text-[24px] mt-3">{s.t}</h3>
              <p className="text-ink/80 mt-2 text-[15px] leading-[1.6]">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- The 404 frame ---------------- */

function FourOhFour() {
  return (
    <section className="border-b border-ink/15 bg-ink text-paper">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <div className="label" style={{ color: "#C99A2D" }}>The 404 problem</div>
            <h2 className="mt-4 font-display text-[40px] md:text-[56px] leading-[1.05] tracking-tight">
              LLMs make footnotes that <span className="italic">look</span> real.
              <br />
              We make footnotes that <span className="text-ochre">resolve.</span>
            </h2>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 gap-x-10 gap-y-10">
            <div>
              <div className="font-display text-[64px] font-black leading-none text-ochre">11.4%</div>
              <p className="text-paper/85 mt-3 text-[15px]">
                Of LLM-proposed citations, on a 1,200-claim audit run by our
                engine, didn't resolve to the claim they were meant to support.
              </p>
            </div>
            <div>
              <div className="font-display text-[64px] font-black leading-none text-ochre">6/10</div>
              <p className="text-paper/85 mt-3 text-[15px]">
                Audited Q4-2025 venture decks contained at least one cited URL
                that 404'd or pointed to the wrong page.
              </p>
            </div>
            <div className="col-span-2 thin-rule pt-6 border-paper/20">
              <p className="font-display text-[20px] leading-[1.55] text-paper/90 italic">
                "The number you cite in a board meeting is only as good as the
                URL behind it. Our engineering bet is that the next decade of
                research is editorial, not generative."
              </p>
              <p className="font-mono text-[11px] tracking-wide text-paper/55 mt-3 uppercase">
                — Editor's note, Vol. 01
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */

function Pricing() {
  const tiers = [
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
      cta: "Submit a brief",
      highlight: false,
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
      cta: "Submit a brief",
      highlight: true,
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
      cta: "Talk to the desk",
      highlight: false,
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
    <section id="pricing" className="border-b border-ink/15">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <SectionHeader kicker="Section 05" eyebrow="What it costs" title="Four tiers. Productized prices. No proposal phase." />
        <p className="mt-6 max-w-2xl text-ink/80 text-[17px]">
          The first dossier is bought online without a sales call. Subscriptions
          and team contracts get a 30-minute editorial intake.
        </p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                "border p-7 flex flex-col bg-paper " +
                (t.highlight
                  ? "border-scarlet ring-1 ring-scarlet"
                  : "border-ink/15")
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
              <div className="mt-3 font-display text-[44px] font-black leading-none">
                {t.price}
              </div>
              <div className="text-graphite text-[13px] mt-1">{t.cadence}</div>
              <span className="block w-8 h-[1.5px] bg-scarlet mt-5" />
              <div className="font-mono text-[11px] tracking-wide text-graphite uppercase mt-4">
                {t.sla}
              </div>
              <ul className="mt-5 space-y-2 text-[14px] text-ink/85">
                {t.bullets.map((b) => (
                  <li key={b} className="grid grid-cols-[16px,1fr] gap-2">
                    <span className="font-mono text-scarlet text-[12px] mt-1">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="#brief"
                className={
                  "btn mt-7 justify-center " + (t.highlight ? "" : "btn-ghost")
                }
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-graphite italic max-w-2xl text-[14px]">
          Anti-feature notice: we do not write SEC, FDA, or other regulatory-grade
          claims. We do not revise toward a pre-specified conclusion. We will
          push back on scope before accepting your brief.
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
    <section className="border-b border-ink/15">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <SectionHeader kicker="Section 06" eyebrow="Operator's covenant" title="What we won't do." />
          </div>
          <ul className="md:col-span-7 space-y-5 text-[19px] font-display leading-[1.5]">
            {items.map((i) => (
              <li key={i} className="grid grid-cols-[28px,1fr] gap-3 thin-rule pt-5">
                <span className="font-mono text-scarlet text-[14px] mt-2">×</span>
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
    <section id="brief" className="border-b border-ink/15">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-24">
        <div className="max-w-3xl">
          <div className="label">The ask</div>
          <h2 className="mt-4 font-display text-[44px] md:text-[64px] leading-[1.05] tracking-tight">
            Read a real dossier.
            <br />
            Submit a brief.
            <br />
            We'll have it back to you <span className="text-scarlet italic">by Friday.</span>
          </h2>
          <p className="mt-8 max-w-xl text-ink/85 text-[17px]">
            The brief intake form opens once you've read at least one sample.
            That is intentional — your first brief converts at a higher rate
            when you've seen the artifact.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="#sample" className="btn btn-ghost">
              Read the sample <Arrow />
            </Link>
            <a
              href="mailto:desk@prin7r.com?subject=New%20brief%20for%20Cited&body=One-paragraph%20brief%3A%0A%0A%0AContext%20%2F%20deadline%3A%0A%0ABudget%20tier%20(Standard%20%24499%20%2F%20Pro%20%241%2C490%20%2F%20Monitor%20%242%2C490%20mo)%3A%0A"
              className="btn"
            >
              Email a brief to the desk <Arrow />
            </a>
          </div>
          <p className="font-mono text-[11px] tracking-wide text-graphite uppercase mt-8">
            desk@prin7r.com · 24-72 hour SLA · paid on delivery for first-time buyers
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-prose px-6 md:px-10 py-12 grid gap-8 md:grid-cols-3 items-end">
        <div>
          <Logo />
          <p className="mt-6 text-graphite text-[13px] max-w-xs">
            Cited is operated by Prin7r. Editorial team across NYC, Berlin, and
            Tbilisi. Built on the company-mktresearch engine.
          </p>
        </div>
        <div className="md:text-center">
          <div className="label">Vol. 01 · 2026</div>
          <p className="mt-3 font-display italic text-[15px]">
            "Footnotes that don't 404."
          </p>
        </div>
        <div className="md:text-right">
          <ul className="space-y-2 text-[13px]">
            <li><Link href="#how" className="scarlet">How it works</Link></li>
            <li><Link href="#sample" className="scarlet">Sample</Link></li>
            <li><Link href="#pricing" className="scarlet">Pricing</Link></li>
            <li>
              <a
                className="scarlet"
                href="https://github.com/prin7r-projects/market-research-on-demand"
                target="_blank"
                rel="noreferrer"
              >
                Repository
              </a>
            </li>
          </ul>
          <p className="font-mono text-[10px] tracking-wide text-graphite uppercase mt-6">
            © 2026 Prin7r · cited@prin7r.com
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Helpers ---------------- */

function SectionHeader({
  kicker,
  eyebrow,
  title,
}: {
  kicker: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="label">{kicker}</span>
        <span className="block w-8 h-[1px] bg-graphite" />
        <span className="label">{eyebrow}</span>
      </div>
      <h2 className="mt-4 font-display text-[40px] md:text-[56px] leading-[1.05] tracking-tight">
        {title}
      </h2>
      <span className="block w-[58px] h-[2px] bg-scarlet mt-5" />
    </div>
  );
}
