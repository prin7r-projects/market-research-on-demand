# 11 · User stories and scenarios

> Cited is research-as-a-service. The customer-facing surface (this repo) drives intake, billing,
> delivery, and monitoring; the engine itself runs in `company-mktresearch` on server 144.

## 1. Personas summary

- **Renee, 35–45, Series A/B founder.** Wants a defensible market dossier within 14 days for a
  board meeting. Will not pay $80k to McKinsey. Pays in USDC. — see `05-audience-profile.md` §Renee.
- **Marcus, 28–35, growth-stage VC associate.** Needs cited landscape pulls fast; pays for monthly
  monitoring on three portfolio sectors. — see `05-audience-profile.md` §Marcus.
- **Cited senior editor (operator).** Reviews every dossier before delivery. Owns the editorial
  guarantee that every claim is sourced.

## 2. Primary user stories (12)

1. **As Renee**, I want to submit a one-paragraph brief on a landing page, so that I don't fill in
   a 14-field form before knowing if Cited is right.
2. **As Renee**, I want a fixed 24/48/72-hour delivery clock visible on each tier, so that I know
   what I'm buying.
3. **As Renee**, I want to pay in USDC without committing to a multi-month subscription, so that
   the first project is friction-free.
4. **As Renee**, I want every claim in the dossier to footnote a named source, so that I can hand
   the deck to my board with confidence.
5. **As Renee**, I want a markdown + PDF deliverable with an inline footnote sidecar, so that I
   can scan claims without losing my place.
6. **As Marcus**, I want to subscribe to monitoring on three sectors at $2,490/mo, so that I get
   refreshed delta-only briefs every two weeks.
7. **As Marcus**, I want a magic-link login (no password), so that I can open the dossier from
   any device without copying credentials.
8. **As Renee**, I want a refund window (within the SLA, before delivery), so that committing
   $499–$1,490 is reversible if I change scope.
9. **As Cited senior editor**, I want a queue of briefs sorted by SLA-deadline-remaining, so that
   I can intervene on tightest first.
10. **As Cited senior editor**, I want every cite to be link-checked + entity-checked
    automatically before I review, so that my pass is editorial, not janitorial.
11. **As Cited senior editor**, I want a "request rewrite" tool that re-runs a section with
    operator-supplied additional context (a doc, a quote), so that I'm not the bottleneck.
12. **As Marcus**, I want a /research-monitor cron that re-runs my saved briefs and emails me a
    delta-only summary, so that I learn what changed without re-reading the full dossier.

## 3. Main scenarios (happy paths)

### Scenario A — Renee submits a brief, dossier delivered in 71h

1. **Trigger.** Renee reads a Lenny's newsletter mention of Cited.
2. **Steps.**
   1. Lands on `/`. Reads the three tiers (one-off $499 / pro $1,490 / monitor $2,490/mo).
   2. Picks Pro ($1,490). Submits brief: "B2B fitness-tech category map, US + EU, 2022–2025, focused
      on consolidation winners + losers."
   3. Pays 1,490 USDC.
   4. Receives confirmation: "your dossier ETA Friday 17:00 UTC."
   5. 71h later, receives email with magic-link to `/deliveries/abc123`.
   6. Opens dossier: 18 pages, 47 footnotes, 22 named sources, 3 charts, an editor's note from
      "Hannah K., Senior Editor."
3. **Success criteria.** Dossier delivered before SLA. Renee scans within 5 min, satisfied.
4. **Frontend.** Landing, brief form, magic-link login, delivery viewer, footnote sidecar.
5. **Backend.** `POST /api/briefs` → Stripe/NOWPayments → engine on server 144 → S3 artifact →
   Postmark.

### Scenario B — Marcus subscribes to monitoring, 14-day delta arrives

1. **Trigger.** Marcus has 3 portfolio sectors he wants tracked weekly.
2. **Steps.**
   1. Picks Monitor tier ($2,490/mo).
   2. Submits 3 briefs (vertical SaaS in healthcare, climate hardware, fintech infra).
   3. Pays first month USDC.
   4. Two weeks later, receives 3 delta briefs ("what changed since last brief").
3. **Success criteria.** Each delta is 600–900 words; cites only new sources; calls out 1–3 deals
   per sector that closed in the interval.

### Scenario C — Editor re-runs a section

1. **Trigger.** Editor reviews a draft and finds a weak section on regulator moves.
2. **Steps.** Editor uploads a recent regulator filing. Hits "Rewrite §4 with this context." Engine
   regenerates the section. Editor reviews; approves.
3. **Success criteria.** §4 reflects the filing; cite list grows; editor sign-off goes into audit log.

### Scenario D — Refund within SLA

1. **Trigger.** Renee realizes scope mismatch 12h after submission.
2. **Steps.** Customer hits "Cancel & refund." Engine job killed; NOWPayments mass-payout refund.
3. **Success criteria.** Refund within 5 BD; no dossier delivered; partial work archived for
   internal record.

### Scenario E — Concurrent briefs

1. **Trigger.** Two PE firms each commission an overlapping landscape map.
2. **Steps.** Engine runs both in parallel. No cross-customer leakage; each dossier is signed and
   watermarked.
3. **Success criteria.** Both delivered on SLA.

### Scenario F — Editor pass blocks delivery

1. **Trigger.** Engine produces a draft; editor finds 2 cites that 404.
2. **Steps.** Cite verifier re-runs replacements; editor approves.
3. **Success criteria.** No dossier ever ships with a dead-link cite.

## 4. Edge case scenarios

### Edge A — Brief is too vague

Engine returns "needs clarification"; sends Renee 3 yes/no questions. SLA clock pauses until she
replies. Email reminder if no reply within 24h.

### Edge B — Brief touches a regulated topic

Disallowed topics (e.g., specific clinical-trial PII, weapons design, child eval) auto-route to
operator queue; declined with a refund within 24h.

### Edge C — Cite link rots between draft and delivery

Engine re-verifies cites at delivery time; if a cite 404s, the cite is replaced with archive.org
and the editor is notified for sign-off.

### Edge D — Customer requests source export

Customer can export `sources.json` (machine-readable cite list); we honor.

### Edge E — Customer asks to share dossier with a colleague

Magic-link is single-subscriber; sharing inherits a watermark with the original purchaser's email.
Anti-leak clause documented.

### Edge F — Engine outage on server 144

Briefs queue persists in Redis Stream; on engine restore, ingest resumes from the queue. SLA
extended pro-rata; customers notified at 4-hour outage threshold.

## 5. Anti-scenarios

1. **No "AI-only" tier.** Every dossier has a senior editor's name on it.
2. **No primary research / GLG-style calls.** We are desk research with cited public + paid sources.
3. **No bespoke consulting engagements.** We sell the artifact, not the analyst's calendar.
4. **No hedge / opinion mode.** We do not sell predictions; we sell evidence + framing.
5. **No daily / hourly briefs.** Cadence is one-off or 14-day delta. Daily is out of scope.
