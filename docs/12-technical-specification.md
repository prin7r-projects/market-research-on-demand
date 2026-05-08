# 12 · Technical specification

> OneWeekBrief = landing/intake/billing/delivery shell + research engine on server 144. This doc is the
> implementer's contract for the customer-facing surface; engine internals live in
> `prin7r/auto-business-claude` and are referenced, not duplicated.

## 1. Architecture overview

```mermaid
flowchart LR
  subgraph Edge[storage-contabo · Traefik]
    Tr[Traefik]
  end
  subgraph Landing[apps/landing · Next.js 15]
    L[Marketing + brief form]
    CK[/api/checkout/nowpayments]
    WH[/api/webhooks/nowpayments]
    DEL[/deliveries/:id]
  end
  subgraph App[apps/app · Wave 3 Wasp/Open-SaaS]
    AUTH[Magic link]
    OPQ[Editor queue]
    BD[Customer dashboard]
  end
  subgraph Engine[server 144 · company-mktresearch · Incus]
    PIPE[Pipelex graph]
    N8N[n8n flows]
    LLM[Claude 4.7 + GLM 5.1 + GPT-5-mini]
    CITE[Cite-check + entity-verify]
  end
  subgraph Data
    PG[(Postgres · briefs/users/deliveries)]
    R[(Redis Streams · brief.submitted)]
    S3[(B2 · cited.mdx + sources.json)]
  end
  subgraph Ext
    NP[NOWPayments]
    PM[Postmark]
  end
  Tr --> L
  L --> CK --> NP --> WH
  WH --> R
  R --> Engine
  Engine --> S3
  Engine --> PG
  L --> DEL
  DEL --> S3
  PG --> OPQ
  OPQ --> PIPE
```

**Topology.** Two hosts. storage-contabo runs landing + app + DB + Redis. server 144 runs the
research engine in an Incus container. Cross-host: app POSTs `brief.submitted` events to a Redis
on a Tailscale-protected port; engine consumes; engine writes back via authenticated PATCH to
`apps/app/api/internal/briefs/:id`.

## 2. Data model

```mermaid
erDiagram
  USERS ||--o{ BRIEFS : owns
  BRIEFS ||--o| DELIVERIES : produces
  BRIEFS ||--o{ EVENTS : audit
  BRIEFS ||--o| ORDERS : paid_by
  USERS ||--o{ MONITORS : tracks
  USERS {
    uuid id PK
    text email UK
    timestamptz created_at
  }
  BRIEFS {
    uuid id PK
    uuid user_id FK
    text scope_md
    text tier "one_off|pro|monitor"
    text status "submitted|clarifying|in_progress|editor_review|delivered|cancelled|refunded"
    int sla_hours
    timestamptz submitted_at
    timestamptz delivered_at
  }
  DELIVERIES {
    uuid id PK
    uuid brief_id FK UK
    text artifact_url "B2 signed URL"
    jsonb sources "[{cite_id, title, url, accessed_at}]"
    text editor_name
    text editor_signoff_note
    timestamptz delivered_at
  }
  ORDERS {
    uuid id PK
    uuid brief_id FK
    text invoice_id UK
    int amount_cents
    timestamptz paid_at
  }
  EVENTS {
    uuid id PK
    uuid brief_id FK
    text type "submitted|clarification_requested|engine_started|editor_review|delivered|refunded"
    jsonb payload
    timestamptz at
  }
  MONITORS {
    uuid id PK
    uuid user_id FK
    uuid base_brief_id FK
    int cadence_days "default 14"
    timestamptz next_run_at
  }
```

Indexes: `users.email` UNIQUE, `briefs.status`, `briefs.submitted_at`, `monitors.next_run_at`,
`(orders.invoice_id)` UNIQUE.

## 3. API contracts

### Wave 2

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/api/briefs` | none | `{tier, scope_md, email}` | `{brief_id, invoice_url, invoice_id}` |
| POST | `/api/checkout/nowpayments` | none | `{brief_id}` | `{invoice_url}` |
| POST | `/api/webhooks/nowpayments` | HMAC-SHA512 | NOWPayments IPN | `{ok:true}` |
| GET | `/deliveries/:id` | session(magic_link) | — | renders MDX + footnote sidecar |

### Wave 3 (app + engine bridge)

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/api/briefs/:id/clarify` | session | `{answers}` |
| POST | `/api/briefs/:id/cancel` | session | `{}` |
| POST | `/api/internal/briefs/:id` (engine→app) | shared secret | `{status, artifact_url, sources, editor_name?, editor_signoff_note?}` |
| GET | `/api/operator/queue` | session(operator) | — |
| POST | `/api/operator/briefs/:id/rewrite_section` | session(operator) | `{section_idx, additional_context}` |

## 4. Integrations

| 3rd-party | Auth | Rate | Fallback |
|---|---|---|---|
| NOWPayments | x-api-key + IPN HMAC | 100 RPM | Manual invoice |
| Postmark | server token | 10k/day | Resend retry |
| Engine on server 144 | Tailscale + shared secret | n/a (private) | Queue persists; SLA extended pro-rata on outage |
| B2 | app key | 1000 ops/sec | Single source |
| Anthropic / Z.AI / OpenAI | API keys (engine-side) | varies | Cross-LLM fallback inside engine |

## 5. Storage

- Postgres 16: briefs/users/deliveries/orders/events/monitors.
- Redis 7: `brief.submitted`, `brief.completed` streams. Persisted to disk; consumer-group
  `engine` (durable).
- B2: `prin7r-cited/deliveries/<brief_id>/`. Lifecycle: 12mo hot, then archive.
- Retention: dossiers retained forever (audit). PII (email, scope text) 5 years; then anonymized.

## 6. Auth

- **Wave 2:** anonymous brief submission; pay first, claim later via magic-link in receipt email.
- **Wave 3:** Wasp magic-link. Operator role flag. Engine→app authenticated by shared secret in
  Tailscale.
- Magic-link tokens: HMAC + 7d expiry; single-use.

## 7. Security

- Secrets in `.env`.
- Rate limits: brief submit 5/IP/hr; checkout 30/IP/hr.
- IPN HMAC-SHA512; idempotent on `(payment_id, payment_status)`.
- Watermarking: per-customer email watermark in PDF + per-delivery UUID; visible-but-not-obstructive
  grid pattern.
- PII: email + scope text; redacted in logs; `scope_md` is private (never used in marketing or
  engine training).
- Audit log: every refund, every editor sign-off, every section rewrite.

## 8. Observability

- Pino JSON logs (landing + app). Engine emits its own JSON logs aggregated into Loki.
- Metrics: `cited.brief.submitted_to_delivered_h`, `cited.editor.queue_depth`,
  `cited.cite.verify_failures`, `cited.refund.count`.
- Alerts: SLA at risk (T-4h with no draft); editor queue >5 for 4h; cite verify failures >3 per
  brief.

## 9. Performance budgets

| Path | p50 | p95 |
|---|---|---|
| `/` LCP | 1.4s | 2.4s |
| Brief submit + stripe/NOW round-trip | 800ms | 1.8s |
| Delivery viewer first paint | 700ms | 1.5s |
| Cite-verify (50 cites) | 12s | 30s |
| Editor section-rewrite | 30s | 90s |
| Magic link issued | 200ms | 500ms |

Throughput: 5 concurrent briefs in-flight; 200 monitor briefs per cycle.

## 10. Non-goals

- No AI-only tier (every dossier signed by editor).
- No primary research (no calls, no surveys).
- No bespoke consulting.
- No daily / hourly cadence.
- No public archive / SEO of past dossiers.
- No customer-uploaded source documents (Wave 4 candidate).
- No native mobile app.
