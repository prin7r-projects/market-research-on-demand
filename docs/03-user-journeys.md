# 03 — User Journeys

Three journeys mapped: discovery, first value, recurring use.

## Journey A — Discovery → first paid brief (Renee, founder-strategist)

| Step | Surface | Action | Friction we remove |
|------|---------|--------|--------------------|
| 1 | Lenny's Newsletter sponsor slot | Reads "Stop renting consultants. Start citing." copy. Clicks. | Sponsor copy is the actual headline of the landing — no bait-and-switch. |
| 2 | `/` landing | Lands on broadsheet hero. Sees a real footnoted excerpt of a past dossier inline. Scrolls. Reads the SLA: 24-72h. | Three seconds to a credible artifact. No carousel of logos. |
| 3 | `/sample` | Clicks "see a real dossier" → 1,400-word example deliverable with live footnotes. | Sample is the same format as the real product. |
| 4 | `/brief` | Pastes a one-paragraph brief. Picks tier ($499 / $1,490). Pays via Stripe. | One field. One paragraph. Not a 47-question form. |
| 5 | Email | Receives an "in-progress" email with an editor's name and an ETA timestamp. | Named human in the loop, not a bot autoresponder. |
| 6 | Email | T+22h: dossier ready, magic-link to viewer. | Beats the SLA. |
| 7 | `/d/[id]` | Reads the dossier. Hovers a claim → footnote sidecar shows source URL, accessed-date, excerpt. Downloads PDF. | Footnotes are the product. |

**Activation = first dossier delivered + downloaded.**

## Journey B — First-time → repeat buyer (Marcus, investor)

| Step | Surface | Action | Note |
|------|---------|--------|------|
| 1 | `/` | Arrives via partner-shared link. Reads positioning. | |
| 2 | `/sample` + `/pricing` | Compares one-off $499 vs Monitor $2,490/mo. Sees that Monitor includes 4 dossiers + monthly delta-rerun. | Pricing card is honest about what's *not* included. |
| 3 | `/brief` | Submits a brief on a vertical he covers. | |
| 4 | Dashboard | After delivery, "Convert this brief into Monitor" prompt — re-rerun monthly with delta callouts. | Conversion is one click. |
| 5 | Month 2 | Receives a delta dossier: only changes since last month, in red. Old dossier diffed inline. | This is the moat — the *delta* is what no consulting firm sells. |

**Activation = one delta dossier delivered.**

## Journey C — Recurring usage (team)

| Step | Surface | Action | Note |
|------|---------|--------|------|
| 1 | Dashboard | Team owner adds two analyst seats. | |
| 2 | Slack integration | New dossiers and deltas post into a private team channel with the headline + 3-bullet TL;DR. | |
| 3 | `/dossiers` | Search across the team's accumulated dossiers — every footnote is searchable. | The library is the team's institutional memory. |
| 4 | API | Power user pulls `cited.mdx` + `sources.json` into Notion via Cited's MCP server. | Power-user lock-in. |
| 5 | Renewal | At month 12, the team has 48 dossiers and 1,800+ unique cited sources. Switching cost is the library. | |

**Retention = library size > 24 dossiers.**
