# Cited — Market Research on Demand

> Decision-grade market research. Fully cited. In 24-72 hours.

A research-as-a-service desk for founders, operators, and strategy teams who
need defensible, citation-rigorous market signal in days rather than months.
A senior editor and an AI research engine turn a one-paragraph brief into a
fully-footnoted dossier — every claim cited, every URL round-tripped, every
delivery on a clock.

This is the **Wave 2 customer-facing surface** for the engine that already runs
inside Prin7r as `company-mktresearch` (Incus container on server 144). The
engine is the factory floor; this repo is the storefront.

## Links

- Live: https://market-research-on-demand.prin7r.com
- Design system: [`DESIGN.md`](DESIGN.md) — 15-section canonical style guide
- Notion opportunity: https://www.notion.so/3543ceec2619819ab746e11df54c0880
- Engine reference (private): `company-mktresearch` Incus container on server 144 (Pipelex graph + n8n + LLM ensemble)

## Landing — captured from production

![Cited landing — desktop, 1440×900](docs/screenshots/landing-desktop.png)

![Cited landing — mobile, 390×844](docs/screenshots/landing-mobile.png)

Re-capture after any landing change with `node scripts/capture-landing-screenshots.mjs` (requires `pnpm dlx playwright install chromium` once).

## Repo structure

```
.
├── apps/
│   ├── landing/        Next.js 15 + Tailwind landing site (this batch)
│   └── app/            wasp-lang/open-saas scaffold for the dashboard (deferred build)
├── docs/               10-doc product/strategy bundle (brand, architecture, GTM, pitch)
│   ├── 01-brand-identity.md
│   ├── 02-architecture.md
│   ├── 03-user-journeys.md
│   ├── 04-pain-points.md
│   ├── 05-audience-profile.md
│   ├── 06-sales-channels.md
│   ├── 07-sales-strategy.md
│   ├── 08-marketing-strategy.md
│   ├── 09-go-to-market.md
│   ├── 10-pitch-deck.md
│   └── pitch-deck.html         (open in any browser; no build step)
├── Dockerfile.landing  Multistage Next.js standalone image
├── docker-compose.yml  Single landing service with Traefik labels
└── .github/workflows/  CI for landing build verification
```

## Wave 2 batch 1 deliverable

This batch ships the landing site. The `apps/app/` Wasp scaffold exists as a
folder placeholder; full SaaS implementation (auth, brief intake, Stripe,
delivery viewer, Monitor cron) is deferred to a later wave.

## Local development

```bash
# Install
cd apps/landing
pnpm install

# Run dev server
pnpm dev
# → http://localhost:3000

# Production build
pnpm build && pnpm start
```

## Container build & deploy

```bash
# Build (from repo root)
docker compose build

# Run locally
docker compose up -d
# → http://localhost:3000  (or behind your local Traefik)

# Production deploy on storage-contabo
ssh storage-contabo
cd /opt/prin7r-deploys/market-research-on-demand
git pull
docker compose build
docker compose up -d
```

The Traefik labels point at `market-research-on-demand.prin7r.com`. Wildcard
DNS `*.prin7r.com → 161.97.99.120` already covers this subdomain.

## Brand at a glance

| | |
|---|---|
| Essence | Conviction |
| Voice | Editorial, empirical, decisive |
| Palette | Paper `#F4EFE6` · Ink `#1A1B1E` · Scarlet `#B22A2A` · Graphite `#6B6660` · Ochre `#C99A2D` |
| Type | Source Serif 4 (display) · Inter (body) · JetBrains Mono (numerals/metadata) |
| Logo signature | A trailing period — *citations end with a period* |

Full brand guidance in [`docs/01-brand-identity.md`](docs/01-brand-identity.md).

## License

MIT — see [`LICENSE`](LICENSE).
