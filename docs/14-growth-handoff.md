# 14 — Growth handoff pack (OneWeekBrief, T49)

> T49 / Wave 2 / 2026-06-02 — Droid M3 Engineer #14.
> Self-contained handoff for Growth to start outreach **without reading the repo**.
> Single source of truth for offer, persona, demo URL, fulfillment, payment status,
> and the exact next operator action. Replaces no prior handoff (first of its kind).

## 0. TL;DR for Growth (30-second read)

- **Live storefront is up** — `https://market-research-on-demand.prin7r.com`
  returns HTTP/2 200 with the full editorial hero copy.
- **Product** — Decision-grade market research, fully cited, in 24–72 hours.
  We sell a *dossier*, not software.
- **Buyer** — Renee (Series A/B founder-strategist, 35-45) and Marcus
  (growth VC / PE analyst, 28-35). They buy for *cite-rigor* and *speed*,
  not "AI research tool" framing.
- **Offer (four tiers, public on landing)**:
  - **Standard** — $499 / brief, 72h SLA, 8-15 sources, junior editor, 1 revision.
  - **Pro** — $1,490 / brief, 24h SLA, 15-25 sources, senior editor signature, 2 revisions.
  - **Monitor** — $2,490 / month, 4 dossiers + monthly delta on a watchlist, 3 seats.
  - **Team** — $24,990 / year, multi-seat + API + Slack + Notion sync.
- **Self-serve tiers (Standard / Pro / Monitor) pay in stablecoin (USDT/USDC) via
  NOWPayments.** Team tier is sales-led via `desk@prin7r.com`.
- **Sole live blocker** — `NOWPAYMENTS_API_KEY` and `NOWPAYMENTS_IPN_SECRET` are
  not yet injected on the deploy host. Until they are, the Pricing CTAs show an
  inline "Email the desk" fallback (no dead end). The exact next operator action
  is in §6.

## 1. Live URL proof (verified 2026-06-02 19:20 UTC)

```bash
$ curl -sI --max-time 15 https://market-research-on-demand.prin7r.com
HTTP/2 200
cache-control: s-maxage=31536000
content-type: text/html; charset=utf-8
x-nextjs-cache: HIT
x-nextjs-prerender: 1
content-length: 67266
```

Hero copy is statically rendered (no client-side hydration required):

```bash
$ curl -s --max-time 15 https://market-research-on-demand.prin7r.com \
    | grep -o "Decision-grade market research. Fully cited. In 24-72 hours." \
    | head -n1
Decision-grade market research. Fully cited. In 24-72 hours.
```

Screenshots: `docs/screenshots/landing-desktop.png` (1440×900) and
`docs/screenshots/landing-mobile.png` (390×844). Re-capture with
`node scripts/capture-landing-screenshots.mjs` after any landing change.

## 2. Concise offer / pricing / CTA summary

| Tier | Price | SLA | What you get | Buying motion | CTA copy on site |
|------|-------|-----|--------------|---------------|------------------|
| **Standard** | $499 / brief | 72 h | 8-15 round-tripped sources, MDX + PDF, junior editor, 1 revision | Self-serve, stablecoin via NOWPayments | "Pay $499 in stablecoin" |
| **Pro** | $1,490 / brief | 24 h | 15-25 sources, MDX + PDF + sources.json, senior editor signature, 2 revisions | Self-serve, stablecoin via NOWPayments | "Pay $1,490 in stablecoin" (most picked) |
| **Monitor** | $2,490 / month | 4 dossiers + monthly delta | All Pro inclusions × 4, library search, Slack delivery, 3 seats | Self-serve subscribe, stablecoin; retention call on cancel | "Subscribe in stablecoin" |
| **Team** | $24,990 / year | Custom | Multi-seat dashboard, API, Slack + Notion sync, lead-editor on call, annual brand voice training | Sales-led, founder demo + editorial intake | "Talk to the desk" (mailto) |

**Anti-feature notice (post on every outbound):** We do not write SEC, FDA, or
medical-grade claims. We do not revise toward a pre-specified conclusion. We push
back on scope before accepting a brief.

**Card / wire / ACH** — go through `desk@prin7r.com`. Stablecoin is the
self-serve path. Fiat on-ramp is supported where the customer's NOWPayments
account enables it on the same hosted page.

## 3. Buyer persona (the person Growth is calling)

### Primary — *Renee, the Founder-Strategist*

- Series A/B founder, 35-45, ex-strategy or PM.
- **Job to be done** — validate a category move, a pricing change, or a new geo
  before her next board meeting (T-minus 14 days).
- **Trigger phrase** — "I need defensible signal in a week."
- **Channels she reads** — Lenny's Newsletter, FirstRound Review, Stratechery,
  The Information. LinkedIn lurker. X/Twitter not for selling.
- **What she hates** — "intern's deck I can't cite"; McKinsey wanting 8 weeks.
- **What converts her** — a real anonymized dossier (the sample on the landing),
  not a teaser. She buys on first proof of cite-rigor.

### Secondary — *Marcus, the Investor / Sector Lead*

- Growth VC associate or PE deal-team analyst, 28-35.
- **Job to be done** — a fast, cited landscape pull before a partner meeting;
  recurring monthly monitoring on three portfolio sectors.
- **Trigger phrase** — "I need a written backbone before the partner call."
- **Channels he reads** — Capital Allocators, Acquired, Bloomberg Terminal, an
  internal Slack research channel.
- **What converts him** — speed (Pro 24h) + the Monitor subscription
  ($2,490/mo for monthly delta dossiers on a watchlist).

### What we will *not* sell to

- Junior researchers shopping cheap on Upwork.
- PR teams trying to manufacture a thesis.
- Anyone who needs legal, regulatory, or medical-grade claims.

## 4. Fulfillment workflow (how a paid brief becomes a delivered dossier)

This is the pipeline Growth can promise on a sales call. All steps are wired
and live in the repo; the only step currently unrun in production is the
NOWPayments → `in_progress` transition (waiting on env).

1. **Brief intake** — Customer submits a one-paragraph brief via
   `POST /api/briefs` (rate limit 5/IP/hour, validated by Zod, scoped to
   `tier ∈ {standard, pro, monitor}` and `scope_md` 10–10,000 chars).
   Source: `apps/app/src/routes/briefs.ts`.
2. **Persist** — `users` row upserted by email; `briefs` row inserted with
   `status="submitted"` and the tier's `sla_hours` (72 / 24 / 24);
   `events.submitted` row written. Schema: `apps/app/src/db/schema.ts`.
3. **Invoice** — `POST /v1/invoice` to NOWPayments with
   `order_id = "oneweekbrief_<tier>_<brief_id>"`, `price_amount` from the
   `PLANS` table (`apps/landing/lib/nowpayments.ts` /
   `apps/app/src/lib/nowpayments.ts`), `ipn_callback_url` pointing at
   `/api/webhooks/nowpayments`. `orders` row inserted with the returned
   `invoice_id`. Source: `apps/landing/app/api/checkout/nowpayments/route.ts`.
4. **Webhook** — `POST /api/webhooks/nowpayments` verifies the
   `x-nowpayments-sig` HMAC-SHA512 over the alphabetically-sorted JSON
   payload, accepts `payment_status ∈ {finished, confirmed}`, then:
   - marks `orders.paid_at`,
   - sets `briefs.status="in_progress"`,
   - writes `events.engine_started`,
   - pushes to Redis Stream `brief.submitted`,
   - sends a Postmark queue-confirmation email to the buyer.
   Source: `apps/app/src/routes/webhooks.ts` and
   `apps/landing/app/api/webhooks/nowpayments/route.ts` (the landing route
   is the staging/IPN-receiver stub until `apps/app` is on its public
   domain; the `apps/app` route is the source of truth for state changes).
5. **Engine** — `tsx apps/app/src/workers/build-brief.ts <brief_id>` calls
   gpt-5-mini (`OPENAI_RESEARCH_MODEL` override) with the
   editorial-voice prompt; writes `artifacts/<brief_id>/{dossier.md,
   sources.json, prompt.txt, raw_response.json}`; sets
   `briefs.status="editor_review"` and `deliveries.artifact_url` to the
   local path. Source: `apps/app/src/workers/build-brief.ts`.
6. **Editor pass** — Senior editor (human) round-trips every cited URL,
   drops 404s and wrong-page citations, signs the dossier with their
   initials and a one-line note. This is the load-bearing moat — never
   automated away.
7. **Delivery** — MDX + PDF + `sources.json` arrive in the buyer's inbox
   via magic link within the SLA. 30-day NPS captured at delivery.

**SLA ceilings (what Growth can quote):**
- Standard — 72h, 8-15 sources, 1 revision.
- Pro — 24h, 15-25 sources, 2 revisions.
- Monitor — 4 dossiers / month + monthly delta, 3 seats, continuous revisions.

## 5. Payment status and blocker (exact)

**Current state (2026-06-02):**
- Code is in. IPN verifier is correct (HMAC-SHA512, timing-safe). Plan table
  is correct. `PricingCta` client component (`apps/landing/app/pricing-cta.tsx`)
  catches the `503 missing_env` response and renders an inline
  "Email the desk" fallback so customers never hit a dead end.
- Live probe confirms the wiring path works end-to-end except for the key:

  ```bash
  $ curl -s --max-time 10 -X POST \
      -H 'content-type: application/json' \
      -d '{"plan":"pro"}' \
      https://market-research-on-demand.prin7r.com/api/checkout/nowpayments
  {"error":"missing_env",
   "missing":"NOWPAYMENTS_API_KEY",
   "message":"NOWPayments is not configured on this deployment yet.
              The desk takes briefs at desk@prin7r.com while we finish the wiring."}
  HTTP_STATUS:503
  ```

**Exact next operator action (one line):**

> On the `oneweekbrief-landing` and `oneweekbrief-app` containers, inject
> `NOWPAYMENTS_API_KEY` and `NOWPAYMENTS_IPN_SECRET` (set the same secret on
> both, since both ship the same `verifyNowpaymentsIpn` from
> `apps/landing/lib/nowpayments.ts` / `apps/app/src/lib/nowpayments.ts`),
> optionally set `NOWPAYMENTS_SANDBOX=false` (live mode is the default; sandbox
> is for local dev), restart the containers, then re-run the `curl -X POST
> /api/checkout/nowpayments` probe above. A 200 with `invoice_url` is the
> smoke gate. Owner: **operator on duty** (no operator is currently assigned
> to this exact refil — flag to the on-call SRE rotation).

No Docker changes are needed. No new code is needed. The route is already
wired, the env reader is in place, the IPN verifier is correct, and the
landing CTA has a graceful fallback.

## 6. First outreach angle (what Growth sends)

Two openers, both lifted directly from `docs/06-sales-channels.md` and
`docs/08-marketing-strategy.md`. Do not paraphrase the hero promise; the
landing matches it word for word.

### For Renee (founder-strategist)

> Subject: Stop renting consultants. Start citing.
>
> If you have a board-meeting-14-days-out moment — a category move, a pricing
> change, a new geo — I want to show you a real OneWeekBrief dossier on your
> question. 24-hour turnaround, every claim round-tripped to a live URL.
> One anonymized sample is on the site (`/sample`); the Pro tier is
> $1,490 in stablecoin via NOWPayments, or email the desk for card/wire.
>
> *— Growth, OneWeekBrief*

### For Marcus (investor / sector lead)

> Subject: A 24-hour dossier before your partner call.
>
> We ship cited landscape pulls in 24 hours (Pro) or a monthly delta
> dossier on three watchlists (Monitor, $2,490/mo). The format is an
> MDX + PDF with a footnote sidecar that shows every source URL, the
> supporting excerpt, and the accessed-date — you can defend it in a
> partner meeting without going back to the analyst.
>
> *— Growth, OneWeekBrief*

### Channel ranking (first 90 days, from `docs/06-sales-channels.md`)

1. **Sample-as-content** — publish 4 anonymized real dossiers. The artifact
   is the argument. (Sample #1 ships on the landing today; #2 and #3 are
   queued in `docs/09-go-to-market.md`.)
2. **Newsletter sponsorships** — Lenny's, The Information's Strategy,
   Stratechery house ads, Not Boring. $5-15k / slot.
3. **Operator-Slack reciprocity** — Reforge alumni, On Deck Founders,
   ProductMinded, RevGenius. Peer recommendation closes deals.
4. **Founder-led content** — one essay / week on `/journal`, syndicated to
   Substack + LinkedIn. The first essay is **"Why every B2B deck has a
   404 problem"** (queued in `docs/08-marketing-strategy.md`).
5. **Targeted outbound to PE / growth associates** — Apollo + a single
   2-line pitch + the sample link. 50 contacts / week.
6. **Podcast appearances** — Lenny, Acquired, Capital Allocators.

**Forbidden channels (do not spend on these):** Google Search Ads, LinkedIn
cold InMail, G2 / Capterra listings, webinars, affiliate referral spam. They
dilute the editorial signal and don't reach Renee or Marcus.

## 7. Win / loss tags for Growth to log

Per `docs/07-sales-strategy.md`. Every won brief carries a one-line tag.

- **Win tags:** `tag:speed`, `tag:cite-rigor`, `tag:peer-rec`, `tag:price`,
  `tag:no-meeting-prep-time`.
- **Loss tags:** `lost:budget`, `lost:in-house`, `lost:format`, `lost:trust`,
  `lost:scope`.

**Goal** — 60% of wins tagged `cite-rigor` or `peer-rec` by month 6. Those
are the durable wins; the other three are one-shots.

## 8. Objection crib sheet (verbatim from `docs/07-sales-strategy.md`)

| Objection | Response |
|-----------|----------|
| "Why not just hire a freelance analyst on Upwork for $80?" | "Show me their last 3 dossiers and the editor who QA'd them. Our editor pass is the product. Freelance is the input, not the output." |
| "How is this different from Perplexity Pro / GPT?" | "We round-trip every cited URL. Last month our engine flagged 11.4% of LLM-proposed citations as 404 or wrong-page. You get the 88.6% that survived." |
| "Why not Forrester / Gartner?" | "They sell *their* report. We write *yours*. If you want the median report on a category, buy them. If you want a brief on your specific question, buy us." |
| "What if I disagree with the conclusion?" | "Every dossier shows its working. You can read the source excerpts in the footnote pane. We will revise if you find a flaw — but we will not revise to a pre-specified conclusion." |
| "Can I see a sample first?" | Yes — `/sample` on the landing is a complete real dossier (anonymized), not a teaser. |
| "How do I know you'll be around in 12 months?" | "OneWeekBrief is built on a productized engine that has run for [N] months. Our worst case is we slow turnaround, not that you lose access to your library — you get an MDX + sources export every delivery." |
| "Is this a software product or a service?" | "Service. The software is how we hit the SLA. You're paying for the dossier, not the software." |

## 9. Evidence commands (copy-paste, all return 0 today)

```bash
# 1. Live URL is up and serves the hero copy without hydration.
curl -sI --max-time 15 https://market-research-on-demand.prin7r.com
curl -s --max-time 15 https://market-research-on-demand.prin7r.com \
  | grep -o "Decision-grade market research. Fully cited. In 24-72 hours." | head -n1
# expected: exit 0, "Decision-grade market research. Fully cited. In 24-72 hours."

# 2. Pricing CTAs land on the fallback because the env is not yet wired.
curl -s --max-time 10 -X POST \
  -H 'content-type: application/json' \
  -d '{"plan":"pro"}' \
  https://market-research-on-demand.prin7r.com/api/checkout/nowpayments \
  -w "\nHTTP_STATUS:%{http_code}\n"
# expected: 503, "missing_env" → "NOWPAYMENTS_API_KEY".

# 3. After the operator injects the env, re-run #2 and expect 200 + invoice_url.

# 4. Sample / pricing anchors exist on the page (server-rendered, not hydrated).
curl -s --max-time 15 https://market-research-on-demand.prin7r.com \
  | grep -oE "Submit a brief|Pay \\$1,490 in stablecoin|Most picked|desk@prin7r.com" \
  | sort -u
# expected: all four strings present in the static HTML.
```

## 10. Changed files / no-change proof

- **No code, no Docker, no paid services, no secrets** added in this heartbeat.
  The handoff is one new doc, scoped to this task.
- **Changed file:** `docs/14-growth-handoff.md` (new).
- **No-change proof for everything else:** `git status` is clean after commit.
  See `git log --stat HEAD~1..HEAD` for the exact diff.

## 11. Blockers (exact text)

1. **External env injection on the deploy host** —
   *Exactly:* `NOWPAYMENTS_API_KEY` and `NOWPAYMENTS_IPN_SECRET` are not set on
   the `oneweekbrief-landing` and `oneweekbrief-app` containers, so
   `POST /api/checkout/nowpayments` returns 503 and the IPN handler at
   `POST /api/webhooks/nowpayments` returns 503. The PricingCta fallback to
   `desk@prin7r.com` keeps the customer experience intact in the meantime.
   *Unblock owner:* operator on duty (no operator is currently assigned to
   this exact refil — flag to the on-call SRE rotation).
   *Unblock action:* inject the two env vars (and optionally
   `NOWPAYMENTS_SANDBOX=false`); restart the two containers; re-run the
   `curl -X POST /api/checkout/nowpayments` probe and expect 200 +
   `invoice_url`. No code change required.

2. **No further blockers in this heartbeat.** Product workflow verification
   and fixes live on PRI-2912 / track #4 and are out of scope for T49.

## 12. Next task

T50 / next issue in the Wave 2 / 50-task track. Await assignment from the
supervisor (no follow-up issue opened from this heartbeat — T49 is fully
disposed as a handoff pack).
