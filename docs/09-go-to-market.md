# 09 — Go-to-Market (90-day plan)

T-0 is the day the landing ships. Goal: by T+90, 60-80 paid briefs delivered, 8-12 Monitor conversions, $80-130k cumulative GMV.

## Phase 1 — Foundation (Weeks 1-2)

| Week | Milestone | Owner | Definition of done |
|------|-----------|-------|--------------------|
| W1 | Landing live, sample dossier #1 published | Build agent (this batch) | `https://market-research-on-demand.prin7r.com` returns 200, sample reads as a real dossier |
| W1 | Stripe payment links wired up to `/brief` flow | Eng | Standard + Pro tiers can be purchased; webhook posts to engine queue |
| W1 | Engine ↔ landing handshake validated end-to-end on a live brief from the founder | Eng + Editor | Founder submits a real brief; receives the dossier within SLA |
| W2 | First paid customer (a friend-of-firm) shipped a real dossier | Founder | Brief logged, editor signed, customer paid $499, 30-day NPS captured at delivery |
| W2 | `/journal` content shell + first essay ("Why every B2B deck has a 404 problem") | Founder | Essay published, syndicated to Substack + LinkedIn |

## Phase 2 — Seed distribution (Weeks 3-6)

| Week | Milestone | Owner | DoD |
|------|-----------|-------|-----|
| W3 | Lenny's Newsletter sponsor slot runs | Founder | Slot live; landing tracks UTM; ≥30 brief-page sessions |
| W3 | Sample dossiers #2 and #3 published | Editor | 3 samples live across 3 categories: B2B SaaS, fintech, climate |
| W4 | First batch of "Field Notes" (3 short essays) published | Editor | Posts crossed 250 unique reads each on combined channels |
| W4 | Outbound to 50 PE/growth associates | Founder | 50 contacted, 6-10 sample reads expected, 1-3 paid briefs |
| W5 | Stratechery house-ad slot or Not Boring sponsor (pick one based on price/availability) | Founder | Slot live; ≥40 brief-page sessions |
| W5 | Founder essay #2 published — case study of a real cite round-trip | Founder | Includes annotated screenshots of a flagged 404 |
| W6 | First Monitor subscription closed | Founder | First customer converted from Standard/Pro to Monitor; documented as a case study |

## Phase 3 — Compound + iterate (Weeks 7-12)

| Week | Milestone | Owner | DoD |
|------|-----------|-------|-----|
| W7 | Operator-Slack reciprocity programme begins (Reforge, On Deck) | Founder | 3 customers post their dossier in their own community; we don't post |
| W8 | Sample dossier #4 + a video walkthrough of one brief lifecycle | Editor + Founder | YouTube + LinkedIn cross-post; ≥1k views |
| W8 | Pricing test on Pro tier (run $1,990 vs $1,490 in /brief A/B for 2 weeks) | Eng | Test concludes; pick winner with ≥95% conf or hold |
| W9 | Podcast pitch round: Lenny, Acquired, Capital Allocators | Founder | At least 1 booked |
| W10 | First press / industry mention | Founder | Tier-1 newsletter or analyst recommendation |
| W11 | Team tier first sale (or honest "not yet" learning) | Founder | Either a $24,990 contract closed, or a written postmortem on why not |
| W12 | 90-day cohort review + plan revision | Founder | Written retrospective; channel mix re-ranked; price test winner shipped |

## Risk register and mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Engine produces a footnote that doesn't round-trip and the customer notices | Medium | Editor pass is the gate; we'd rather miss SLA than ship a bad cite. Public methods doc owns this stance. |
| Lenny's slot underperforms (< 20 brief-page sessions) | Medium | Pre-test with founder essay; have a fallback Stratechery slot in week +1 |
| Customer churn before Monitor conversion | High at first | Focus W6-12 on retention loops: monthly delta + library search + Slack delivery |
| Engine queue saturation if 3+ Pro briefs land same day | Low at this volume | Pro is rate-limited to 2/day until W8; senior editor on-call rotation |
| Competitor productizes faster | Medium | Editorial brand is the moat; published essays compound. Don't try to out-feature; out-write. |

## What this 90-day plan is *not*

- **Not** a paid-marketing growth experiment. Paid is one channel among six.
- **Not** a hiring plan. The team is intentionally one editor + one founder + the engine through W12; we hire after we hit 80 briefs.
- **Not** a fundraise narrative. We are bootstrap-able through W12 and want to be bootstrap-able through W26.
