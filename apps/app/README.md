# apps/app — Cited dashboard (deferred)

This folder is a placeholder for the customer-facing dashboard, which will be
forked from [`wasp-lang/open-saas`](https://github.com/wasp-lang/open-saas) in
a later wave.

## Scope (when built)

- Magic-link auth
- Stripe checkout for the four pricing tiers (Standard / Pro / Monitor / Team)
- Brief intake form (one-paragraph textarea + tier selection)
- Webhook bridge into the `company-mktresearch` engine on server 144
- Delivery viewer rendering MDX dossier with footnote sidecar
- Library search across the customer's accumulated dossiers
- Monthly delta-rerun cron for Monitor subscribers
- Slack delivery integration for Team plan
- Notion / API sync for power users

## Deferred deliberately

Wave 2 batch 1 ships only the landing surface so we can validate the messaging
hierarchy, sample-as-content channel, and pricing tiers with real first-paid
briefs **before** committing to the dashboard build. Once the messaging is
proven (target: 8-12 paid briefs in 30 days), this folder gets the open-saas
fork applied.

## Bootstrap (when ready)

```bash
# From repo root
cd apps
git clone --depth 1 https://github.com/wasp-lang/open-saas.git app-bootstrap
mv app-bootstrap/template/app/* app/
rm -rf app-bootstrap
cd app
# Follow open-saas README from here
```

For the engine handshake spec, see [`/docs/02-architecture.md`](../../docs/02-architecture.md).
