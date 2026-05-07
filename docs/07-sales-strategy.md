# 07 — Sales Strategy

## Motion: PLG with a curated sales overlay

Cited is **product-led at the bottom of the pricing**, **sales-led at the top**. The first dossier is bought online without a human. Subscriptions and team contracts above $25k ARR have a 30-min "editorial intake" call.

| Tier | Buying motion | Sales touch | Cycle |
|------|---------------|-------------|-------|
| Standard ($499 single brief) | Self-serve checkout | None | Minutes |
| Pro ($1,490 single brief, 24h SLA) | Self-serve checkout + named editor | Email confirmation only | Hours |
| Monitor ($2,490/mo, 4 dossiers + delta) | Self-serve checkout, but cancellation requires a 5-min retention call | Editorial intake call within 48h of signup | Days |
| Team ($24,990/yr, multi-seat + Slack + API) | Sales-led | Founder-led demo + custom editorial intake | 1-3 weeks |

## Pricing tiers

```
                           Standard          Pro              Monitor              Team
Price                      $499 / brief      $1,490 / brief   $2,490 / month       $24,990 / year
Turnaround SLA             72 hours          24 hours         4 dossiers/mo + delta  Custom
Footnote count             8-15 sources      15-25 sources    15-25 / dossier      30+ / dossier
Editor pass                Junior editor     Senior editor    Senior editor + lead  Lead editor
Format                     MDX + PDF         MDX + PDF + raw  + monthly delta MDX   + API + Slack + Notion sync
Revisions                  1 round           2 rounds         Continuous           Continuous
Seats                      1                 1                3                    Unlimited
Anti-feature               No legal claims   Same             Same                 Same
```

### Why these prices

- **$499** is the floor at which a senior buyer takes us seriously and at which our unit economics work. Cheaper would adverse-select.
- **$1,490** is the price at which a 24h SLA pulls forward a deliverable for a CEO with a Monday board meeting. A consulting firm cannot charge less than $50k for this.
- **$2,490/mo** translates the Monitor moat into a recurring subscription. A team that does 4 quarterly category reviews ($499 × 4 = $1,996) gets the delta-rerun for the marginal $494/mo — easy upsell.
- **$24,990/yr** is the floor for a team contract; below this, multi-seat support overhead kills margin.

## Objection handling

| Objection | Response |
|-----------|----------|
| "Why not just hire a freelance analyst on Upwork for $80?" | "Show me their last 3 dossiers and the editor who QA'd them. Our editor pass is the product. Freelance is the input, not the output." |
| "How is this different from Perplexity Pro / GPT?" | "We round-trip every cited URL. Last month our engine flagged 11.4% of LLM-proposed citations as 404 or wrong-page. You get the 88.6% that survived." |
| "Why not Forrester / Gartner?" | "They sell *their* report. We write *yours*. If you want the median report on a category, buy them. If you want a brief on your specific question, buy us." |
| "What if I disagree with the conclusion?" | "Every dossier shows its working. You can read the source excerpts in the footnote pane. We will revise if you find a flaw — but we will not revise to a pre-specified conclusion." |
| "Can I see a sample first?" | Yes — `/sample` is a complete real dossier (anonymized), not a teaser. |
| "How do I know you'll be around in 12 months?" | "Cited is built on a productized engine that has run for [N] months. Our worst case is we slow turnaround, not that you lose access to your library — you get an MDX + sources export every delivery." |
| "Is this a software product or a service?" | "Service. The software is how we hit the SLA. You're paying for the dossier, not the software." |

## Win/loss tracking

Every brief and every churn carries a one-line tag:
- Win-tags: `tag:speed`, `tag:cite-rigor`, `tag:peer-rec`, `tag:price`, `tag:no-meeting-prep-time`.
- Loss-tags: `lost:budget`, `lost:in-house`, `lost:format`, `lost:trust`, `lost:scope`.

Goal: 60% of wins tag `cite-rigor` or `peer-rec` by month 6 — those are the durable wins.
