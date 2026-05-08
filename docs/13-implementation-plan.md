# 13 · Implementation plan

> **Hand-off ready.** Read `01`, `02`, `11`, `12` first. Phase 0 (landing + crypto checkout) is
> COMPLETE. Phases 1–6 ship intake, delivery viewer, monitoring, and engine bridge.
>
> **Repo:** https://github.com/prin7r-projects/market-research-on-demand
> **Live:** https://market-research-on-demand.prin7r.com (landing live)
> **Engine:** Incus container `company-mktresearch` on server 144 (existing; not in this repo)
> **Deploy:** storage-contabo `/opt/prin7r-deploys/market-research-on-demand`
> **Secrets:** NOWPAYMENTS_API_KEY, NOWPAYMENTS_IPN_SECRET, POSTMARK_SERVER_TOKEN, ENGINE_SHARED_SECRET,
> REDIS_URL (private Tailscale), DATABASE_URL, B2_KEY_ID, B2_APP_KEY.
> **Tone:** editorial. Conviction. Source-truth. See `01-brand-identity.md` §Voice.

## Phase 0 — Wave 2 landing + checkout (DONE)

- ✅ Public landing (Cited brand), three tier cards, NOWPayments invoice flow, branded 503,
  redesign to anthropic-ref milky canvas landed, screenshots in `/docs/screenshots/`.

## Phase 1 — Brief intake form + Postgres schema

- **Goal.** Customer submits a brief on the landing; it persists; payment opens the workflow.
- **Tasks.**
  1. Drizzle schema for the data model in `12 §2`. Migration applied.
  2. `POST /api/briefs` validates, persists, returns `brief_id` + invoice URL.
  3. Brief submission triggers checkout; on `payment_status = finished`, write `EVENTS.engine_started`
     and push to Redis Stream `brief.submitted`.
  4. Postmark "your dossier is in the queue" email.
- **Deps.** Phase 0; Redis on storage-contabo + private Tailscale to server 144.
- **Effort.** 130 tool-uses, 6h.
- **DoD.**
  - Submit a test brief; pay 1 USDC; engine receives the event.
  - `briefs.status` advances `submitted → in_progress` on engine ack.

## Phase 2 — Engine bridge + delivery callback

- **Goal.** Engine can write artifacts back; delivery viewer renders the MDX dossier with footnote
  sidecar.
- **Tasks.**
  1. `POST /api/internal/briefs/:id` accepts engine's status updates. Authenticated by shared
     secret + Tailscale source IP.
  2. Engine writes `cited.mdx + sources.json` to B2 under `prin7r-cited/deliveries/<brief_id>/`.
  3. App emits `briefs.status = delivered`; sends magic-link email via Postmark.
  4. `/deliveries/:id` page: magic-link gate; renders MDX with a footnote sidecar (existing pattern
     from research dossier templates).
- **Deps.** Phase 1; engine team agrees on the callback contract.
- **Effort.** 150 tool-uses, 7h.
- **DoD.**
  - Scenario A end-to-end: brief → pay → engine produces dossier → email lands → viewer renders.
  - Footnote sidecar shows on hover/click; cite links 200.

## Phase 3 — Editor queue + section-rewrite tool

- **Goal.** Editor reviews drafts, can request a section rewrite with additional context, signs
  off before delivery.
- **Tasks.**
  1. Editor queue route `/operator/queue`; sortable by SLA-deadline-remaining.
  2. Brief-detail page shows sections, cite list, verify status.
  3. `POST /api/operator/briefs/:id/rewrite_section` triggers an engine subgraph re-run with the
     editor-supplied context.
  4. Sign-off button writes `editor_name + editor_signoff_note + delivered_at` and triggers
     delivery email.
- **Deps.** Phase 2.
- **Effort.** 140 tool-uses, 7h.
- **DoD.**
  - Scenario C end-to-end: editor uploads filing → §4 rewritten → editor approves → delivery email.
  - Cite verify gate blocks delivery if any cite 404.

## Phase 4 — Monitor tier + biweekly delta cron

- **Goal.** Marcus's $2,490/mo monitor tier delivers 14-day delta briefs.
- **Tasks.**
  1. `monitors` table; cron `0 12 * * 1` checks `next_run_at <= now()`.
  2. Engine has a "delta-brief" mode that diffs against the prior dossier; emits a delta MDX.
  3. Postmark delta-brief email.
- **Deps.** Phase 2.
- **Effort.** 110 tool-uses, 5h.
- **DoD.**
  - Scenario B end-to-end: 3-sector monitor → delta lands 14 days later.

## Phase 5 — Refund + cancel + clarification round-trip

- **Goal.** Self-serve cancel; clarification questions can pause the SLA clock; refunds clean.
- **Tasks.**
  1. `POST /api/briefs/:id/cancel` (only when `status in [submitted, clarifying, in_progress]`).
  2. `POST /api/briefs/:id/clarify` with answers; engine resumes.
  3. Operator-only refund tool: NOWPayments mass-payout.
- **Deps.** Phase 1–3.
- **Effort.** 80 tool-uses, 4h.
- **DoD.**
  - Scenario D end-to-end.
  - Edge A end-to-end: clarify reply within 24h pauses SLA, resumes on answer.

## Phase 6 — Production polish + ops

- **Goal.** Hit perf budgets; ops dashboard; backups.
- **Tasks.**
  1. Lighthouse pass on `/` and `/deliveries/:id`.
  2. Loki + Grafana; alerts on SLA-at-risk + editor queue depth.
  3. Postgres weekly dump → B2; restore drill.
- **Effort.** 110 tool-uses, 5h.
- **DoD.**
  - p95 budgets in `12 §9` met.
  - Restore drill passes.

## Cross-cutting concerns

- **Accessibility:** WCAG AA on landing + delivery viewer.
- **i18n:** EN-only Wave 2/3.
- **Mobile:** delivery viewer reads on phone (responsive footnote sidecar collapses to a
  bottom-sheet).
- **Telemetry:** Phase 1 logs; Phase 6 metrics + alerts.

## Risk register

| Risk | Owner | Mitigation |
|---|---|---|
| Engine outage on server 144 | Eng | Redis Stream queue persists; SLA pro-rata extension; ops alert at 4h. |
| Cite link rot between draft and delivery | Editor | Pre-delivery cite-verify gate; archive.org fallback. |
| Editor bottleneck on busy weeks | Editorial | Pool of 3 editors; queue depth alert; backup editor pattern. |
| LLM-cost spike on long dossiers | Eng | Per-brief budget cap; engine returns "scope too large" with refund prompt. |
| PII leak in dossier (e.g., a wrongly-cited individual) | Editor | Editor pass + named-only-with-source rule; correction-in-next-brief policy. |

## Resume instructions

1. `git clone https://github.com/prin7r-projects/market-research-on-demand && cd market-research-on-demand`
2. Read `01`, `02`, `11`, `12`.
3. Pick the next phase whose DoD is unmet.
