# 08 — Marketing Strategy

## Positioning hierarchy

```
Category          Cited is a research-as-a-service desk.
Frame             Not a tool. Not a consultancy. A productized editorial desk with an AI engine in the back room.
Wedge             Every claim cited. Every source named. Delivered on a clock.
One-liner         Decision-grade market research. Fully cited. In 24-72 hours.
Tagline           Stop renting consultants. Start citing.
Promise           Footnotes that don't 404.
```

## Messaging hierarchy (top → bottom of funnel)

### Top of funnel — "the rigor frame"
- *"Why every B2B deck has a 404 problem."*
- *"Three citations from Q4 VC decks that don't resolve to their claim."*
- *"What a real footnote looks like."*

### Middle of funnel — "the productized frame"
- *"From brief to cited dossier in 31 hours."*
- *"Inside the editor pass: how a senior editor signs off on every cite."*
- *"The case for a research subscription that isn't a paywall."*

### Bottom of funnel — "the buyer frame"
- *"Pro tier: 24h dossier for the Monday board."*
- *"Monitor tier: monthly delta dossiers on your three watchlists."*
- *"Team plan: your category library, multi-seat, with API + Notion sync."*

## Content pillars (4 + cadence)

| Pillar | Cadence | Format | Owner |
|--------|---------|--------|-------|
| **Cited Field Notes** — annotated excerpts from anonymized real dossiers | Weekly, 800-1,400 words | MDX essay published to `/journal` and Substack | Lead editor |
| **The 404 Series** — case studies of broken citations in public decks/reports, with replacements | Bi-weekly | MDX + scrollable annotated PDF embeds | Founder |
| **Inside a Brief** — 5-minute videos showing a brief's lifecycle, end to end | Monthly | YouTube + LinkedIn cross-post | Founder + editor |
| **Methods Disclosed** — opinionated stances on cite-rigor, source ladders, the role of LLMs in research | Quarterly | Long-form essays, occasionally syndicated to Stratechery / Lenny | Founder |

## Hero copy (ships in `apps/landing`)

These are the actual headlines/sub-heads on the marketing site. They come from this doc.

```
HERO HEADLINE
Decision-grade market research.
Fully cited. In 24-72 hours.

HERO SUB
Submit a one-paragraph brief. A senior editor and an AI research engine
turn it into a footnoted dossier you can defend in a board meeting.
No consulting cycle. No paywalled report. No fabricated sources.

HERO CTA
Read a real dossier   |   Submit a brief

SECTION — How it works
01. Brief         You write a paragraph. We accept or push back inside an hour.
02. Engine        Pipelex graph runs planning → search → extract → cite-check.
03. Editor        A senior editor round-trips every citation and signs the dossier.
04. Delivery      You get an MDX + PDF, footnoted, in 24 to 72 hours.

SECTION — Why citation discipline matters (the 404 frame)
Every dossier we ship has been round-tripped: each cited URL was fetched,
the excerpt found in the page, the date recorded, the editor signed off.
LLMs make footnotes that look real. We make footnotes that resolve.

SECTION — Sample
Read a 1,400-word sample dossier on the B2B fitness-tech consolidation.
It is exactly the format you receive — same footnote sidecar, same editor's note.

SECTION — Pricing
Standard       $499 / brief        72-hour SLA
Pro            $1,490 / brief      24-hour SLA, senior editor
Monitor        $2,490 / month      4 dossiers + monthly delta on your watchlist
Team           $24,990 / year      Multi-seat + API + Slack

SECTION — What we won't do
We won't write a dossier whose conclusion you've already chosen.
We won't include a footnote that didn't survive the round-trip.
We won't make legal or regulatory claims.
We won't sell your brief or your library to anyone, ever.

FOOTER
Cited is operated by Prin7r. Editorial team based across NYC, Berlin, Tbilisi.
```

## Launch sequence (T-0 = batch 1 deploy)

| Week | Activity | Outcome |
|------|----------|---------|
| -2 | Sample dossier #1 finalized; HERO copy locked | Asset-ready |
| -1 | Founder essay #1 ("404 problem") drafted; Lenny's slot reserved | Distribution-ready |
| 0  | Landing live at `market-research-on-demand.prin7r.com`; sample published | This batch |
| +1 | Lenny's sponsor slot runs; founder essay published | First paid briefs expected |
| +2 | Sample dossiers #2-3 published; first paid brief delivered → testimonial captured | Social proof |
| +4 | Stratechery / Not Boring sponsor slot; podcast pitch round | Top-of-funnel |
| +6 | Operator-Slack reciprocity programme begins | Peer-shared distribution |
| +12 | First Monitor cohort review; pricing test on Pro tier | Subscription motion validated |

## Success metrics (90-day)

- 60-80 paid briefs delivered.
- 30-day post-delivery NPS ≥ 50.
- 8-12 Monitor conversions (10-15% of paid buyers).
- 1 inbound podcast invite or feature in a Tier-1 newsletter.
