# DESIGN.md — OneWeekBrief

> Canonical design + style guide for `market-research-on-demand` (brand: **OneWeekBrief**).
> Owned by Chief of Design. Kept in sync with `apps/landing/` — any landing-page change updates this file in the same commit.

The visual identity is sourced from [`docs/01-brand-identity.md`](docs/01-brand-identity.md). This document is the implementation-facing translation of that identity into tokens, components, layout rules, and verification artifacts.

---

## 1. Product and audience

**Product** — OneWeekBrief is a research-as-a-service desk. A founder, operator, or sector analyst submits a one-paragraph brief; a senior editor and an AI research engine return a fully-footnoted market research dossier in 24-72 hours. Every claim is round-tripped to a live source URL. The product is the artifact (the dossier), not the software.

**Audience** —
- **Renee, the Founder-Strategist**: Series A/B founder, 35-45, ex-strategy/PM. Wants defensible signal before her board meeting (T-minus 14 days). Refuses to ship an "intern's deck I can't cite."
- **Marcus, the Investor / Sector Lead**: growth-stage VC associate or PE deal-team analyst, 28-35. Wants a fast, cited landscape pull before a partner meeting and recurring monthly monitoring on three sectors.
- **Anti-personas** — junior researchers shopping cheap on Upwork; PR teams trying to manufacture a thesis; users who need legal/regulatory/medical-grade claims.

The landing is written for these two. Voice mirrors the dossier itself: editorial, empirical, decisive — Stratechery / The Information register, not SaaS-dashboard register.

**Design ancestry (round-2 redesign, 2026-05-08).** The current visual system is a transposition of Anthropic's "Research journal printed on warm stone" reference (`/Users/keer/projects/prin7r/design-references/anthropic.md`) onto a milky-white canvas. The reference's warm-stone (#faf9f5) is replaced with milky #FAFAF8 per product owner override (no beige). The reference's typographic emphasis system — a thick underline on selected headline keywords, in place of color or weight — is adopted as the new brand signature, and reads as an editor's hand-applied highlight on a printed broadsheet.

## 2. Visual positioning

A productized research desk dressed as an editorial broadsheet.

- **Anchor reference points** — The Atlantic's body type pairing, the Financial Times masthead rule, Stratechery's quiet typographic command, The Information's editorial discipline.
- **Avoided reference points** — Vercel/Linear/Anthropic flat-sans monochrome; venture-deck purple gradients; consulting-firm chrome; "AI-product mint-and-violet."
- **Felt sense** — opening a folded broadsheet on a desk. Off-white paper, lampblack text, a single scarlet rule, ochre used the way a print editor highlights a callout. No drop shadows, no glassmorphism, no gradients beyond a 2% paper grain.
- **Anti-features in the visual identity** — gradients, neon, glassmorphism, drop shadows beyond `0 1px 0 0 rgba(0,0,0,.06)`, stock photography of laptops or "diverse-team-pointing-at-screen," emojis in product copy.

## 3. ShadCN baseline and local component policy

**Baseline.** This repo follows the Prin7r Component Library Baseline (ShadCN-first). Default base for any future SaaS surface in `apps/app/` is shadcn/ui — install via `pnpm dlx shadcn@latest add <component>`, vendor the source into the project so we own and review every primitive.

**Current state — Wave 2 batch landing.** `apps/landing/` is intentionally hand-coded (no shadcn imports yet) because the editorial broadsheet aesthetic is carried by typography, hairlines, and a four-color print palette — every shadcn variant we would import would need to be re-skinned to remove its rounded-corner / gradient defaults. The hand-rolled components below (`btn`, `dossier-frame`, `label`, `pulse-dot`) are all flat, square-edged, and one rule width.

**Documented exception.** Until `apps/app/` ships, the landing does NOT import from `@/components/ui` — there is no `components/ui` directory. Reviewers should expect the next pass (intake form, payments confirmation, dashboard) to introduce shadcn primitives (Button, Input, Dialog, Card) re-themed to the tokens in section 4.

**Forbidden.** Paid/pro libraries without CEO approval. Component libraries that conflict with ShadCN conventions. Marketing-page kits that drag in animation libraries beyond what's already in `globals.css`.

## 4. Color tokens

Single source of truth: `apps/landing/tailwind.config.ts` and `apps/landing/app/globals.css`. Editorial palette transposed from Anthropic's slate/ivory range onto milky white (no beige).

| Role | Token | Hex | CSS var | Anthropic-ref equivalent | Used for |
|------|-------|-----|---------|--------------------------|----------|
| Surface (page base) | `canvas` | `#FAFAF8` | `--canvas` | `#faf9f5` (Ivory Light) | Page background, default surface |
| Surface (elevated) | `canvas-2` | `#F4F4F0` | `--canvas-2` | `#f0eee6` (Ivory Medium) | Sample band, footer band, pricing card default |
| Surface (tertiary) | `canvas-3` | `#ECECEA` | `--canvas-3` | `#e3dacc` (Oat) | Tertiary fills (reserved) |
| Surface (paper-white) | `paper-white` | `#FFFFFF` | `--paper-white` | n/a | Dossier shelf inner page; highlighted pricing tier |
| Ink (primary) | `ink` | `#141413` | `--ink` | `#141413` (Slate Dark) | All body copy, borders, dark feature card |
| Ink (medium) | `ink-medium` | `#3D3D3A` | `--ink-medium` | `#3d3d3a` (Slate Medium) | Mid-dark borders, focus rings |
| Ink (light) | `ink-light` | `#5E5D59` | `--ink-light` | `#5e5d59` (Slate Light) | Tertiary text, captions |
| Muted | `graphite` | `#87867F` | `--graphite` | `#87867f` (Cloud Dark) | Mono labels, secondary text |
| Cloud | `cloud` | `#B0AEA5` | `--cloud` | `#b0aea5` (Cloud Medium) | Disabled/muted UI chrome |
| Accent (primary) | `scarlet` | `#B22A2A` | `--scarlet` | `#d97757` (Clay) — OneWeekBrief brand override | Footnote numerals, section under-rules, scarlet emph |
| Accent (highlight) | `ochre` | `#C99A2D` | `--ochre` | n/a | Pulse dot, ochre stat block on 404 frame |

**Contrast.** ink-on-canvas 16.4:1; ink-light-on-canvas 7.1:1; graphite-on-canvas 4.6:1; scarlet-on-canvas 5.4:1; canvas-on-ink 16.4:1; ochre-on-ink 6.7:1. All pairs meet WCAG AA.

**Hairlines.** Borders are color-mix derivatives of `--ink`: `--hairline-soft` (6%), `--hairline` (9%), `--hairline-strong` (12%), `--hairline-emphatic` (18%). Used in place of flat gray borders so the line responds to canvas warmth.

**Forbidden combinations.** Scarlet text on ochre; ochre text on canvas; graphite below 14px on `canvas-2`. Pure black `#000000` and pure white `#FFFFFF` are reserved — `paper-white` only appears inside the dossier shelf and the highlighted pricing tier.

## 5. Typography

Three families. No fourth font. **Inter is BANNED** in this project. Body grotesque is **Geist** (Anthropic Sans-class), display serif is **Source Serif 4** (Anthropic Serif / Tiempos / PP Editorial New-class), mono is **Geist Mono** (Anthropic Mono / JetBrains Mono-class).

| Role | Family | Weights | Used at | Anthropic-ref equivalent | Reason |
|------|--------|---------|---------|--------------------------|--------|
| Display | **Source Serif 4** | 400, 500, 600, 700, 900 (+ italic 400) | Hero 61-91px, sections 40-56px, dossier prose 18px | `--font-anthropic-serif` (substitute Playfair / Lora) | Transitional serif at display scale; mirrors the Anthropic-ref dark-card masthead inversion. |
| Body | **Geist** | 300, 400, 500, 600, 700 | Body 15-18px, UI 15px, labels 11px | `--font-anthropic-sans` (substitute Inter / DM Sans) | Premium grotesk with tight tracking at display sizes; replaces Inter (which is BANNED in this project). |
| Mono | **Geist Mono** | 400, 500 | Footnote numerals, mono labels (DATE, CATEGORY), dossier metadata | `--font-anthropic-mono` (substitute JetBrains Mono / IBM Plex Mono) | Tabular numerals; signals "data" or "classification" within editorial layout. |

Loaded from Google Fonts in `globals.css` with `display=swap`.

**Type scale — direct lift from Anthropic ref `/Users/keer/projects/prin7r/design-references/anthropic.md` §"Type Scale".**

| Role | Size | Line height | Letter spacing | CSS var | Tailwind |
|------|------|-------------|----------------|---------|----------|
| caption | 12px | 1.3 | — | `--text-caption` | `text-caption` |
| body-sm | 15px | 1.4 | -0.03px | `--text-body-sm` | `text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` | `text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` | `text-subheading` |
| heading-sm | 20px | 1.4 | — | `--text-heading-sm` | `text-heading-sm` |
| heading | 24px | 1.3 | -0.12px | `--text-heading` | `text-heading` |
| heading-lg | 61px (clamp 40-61) | 1.1 | -1.22px | `--text-heading-lg` | `t-heading-lg` (CSS class) |
| display | 91px (clamp 56-91) | 1.1 | — | `--text-display` | `t-display` (CSS class) |

**Emphasis system — the brand signature.** Selected keywords inside display-scale headlines wear a thick text-decoration underline (`.emph` for ink, `.emph-scarlet` for scarlet variant). This is the Anthropic-ref pattern lifted directly: emphasis is typographic, never color, never bold-weight-shift. Underline thickness scales with type (`0.06em`) — thick at 91px, hair at 18px. This pattern signals the editorial hand on the page; it is the SAME mechanic used for footnote markings on a printed broadsheet, transposed onto headlines.

## 6. Spacing, radius, shadows, and borders

- **Base unit** — 4px.
- **Spacing scale** — 4 / 8 / 12 / 20 / 32 / 56 / 96 (Fibonacci-ish; tighter than Tailwind defaults so the page feels print-like, not SaaS-padded).
- **Radius** — `0` for cards, hero blocks, dossier frame, buttons. `2px` only for inputs (none yet on the landing). `999px` reserved for pill badges (none currently used). Square-edged like newsprint.
- **Shadows** — exactly one allowed: `0 1px 0 0 rgba(0,0,0,.06)`. Glassmorphism, neumorphism, and drop shadows beyond this are forbidden.
- **Borders** — 1px hairlines at `rgba(26,27,30,.15)` (light), `rgba(26,27,30,.18)` (dossier frame), `rgba(26,27,30,.06)` (inner dossier double-rule). 1.5-2px scarlet rules at `var(--scarlet)` for masthead breaks and section accents.

## 7. Layout system and responsive rules

- **Container.** `max-w-prose = 1140px`, 80px gutters at desktop, 24-40px at mobile. The landing uses `mx-auto max-w-prose px-6 md:px-10` consistently.
- **Grid.** 12-column conceptually, but most sections are 1-2-4 column flex/grid combinations. The Pricing section is `md:grid-cols-2 lg:grid-cols-4`. The 404 frame is `md:grid-cols-12` with 5/7 split.
- **Breakpoints.** Mobile-first; `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Tested at 320 / 390 / 768 / 1024 / 1440.
- **Vertical rhythm.** Sections separated by `border-b border-ink/15`. Section padding `py-20` (80px) at desktop, narrower hero/CTA at `py-16-24`.
- **Reading width.** Long-form prose capped at `max-w-2xl` (672px) so the dossier excerpt reads like a printed page.

## 8. Component catalog

All components are local (in `apps/landing/app/page.tsx`) until shadcn primitives land in `apps/app/`. Each has an explicit hover/focus state.

| Component | Where defined | Notes |
|-----------|---------------|-------|
| `Logo` | `page.tsx` Masthead | Source Serif Black `O`, 1.5-2px scarlet underbar 1.4em past the letterform, JetBrains Mono `oneweekbrief.` wordmark with trailing period (the brand signature). |
| `.btn` | `globals.css` | Square-edged, ink fill, 14×22px padding. Hover swaps to scarlet fill. Focus inherits browser ring (kept visible). |
| `.btn-ghost` | `globals.css` | Transparent background, ink border, paper text on ink hover. Used as the secondary CTA. |
| `Stat` | `page.tsx` Hero | Display Black 40-48px number, mono label below, optional graphite italic sub. |
| `SectionHeader` | `page.tsx` | Mono kicker + eyebrow, ink hairline between, display 40-56px title, scarlet 2px under-rule. |
| `dossier-frame` | `globals.css` | Cream `#FAF6EE` shelf with 1px outer ink border and 1px inner border (8px inset). The visible "page-on-page-on-desk" of the sample. |
| `footnote-num` | `globals.css` | Scarlet superscript JetBrains Mono numeral, no underline. |
| `pulse-dot` | `globals.css` | 2px ochre dot, 1.6s ease-in-out opacity loop. The only animated element in steady state. |
| `label` | `globals.css` | JetBrains Mono 10px, 2px tracking, uppercase, graphite. |
| `thin-rule` | `globals.css` | 1px hairline at `rgba(26,27,30,.12)`. Used for footnote separators and 404-frame inner divides. |
| Pricing tier card | `page.tsx` Pricing | 1px ink border (paper inside), highlighted tier swaps to scarlet border + scarlet ring. Header block, 44px Black price, mono SLA, bullet list, full-width CTA at bottom. |

**Accessibility for each.** Buttons inherit native focus ring; the masthead `Logo` carries `aria-label="OneWeekBrief"`; SVG icons (`Arrow`) use `aria-hidden`; nav anchors are real `<a>` elements via `next/link`. Keyboard tab order: hero CTA → secondary CTA → nav → pricing CTAs → footer links.

## 9. Landing page structure

`apps/landing/app/page.tsx` renders eight sections in order:

1. **Masthead** — `Vol. 01 · A Prin7r Edition · 2026` kicker, Logo, primary nav (`How it works / Sample / Pricing / Submit a brief`).
2. **Hero** — pulse-dot kicker (`Filed under: research as a service`), 56-112px display headline (`Decision-grade market research. Fully cited. In 24-72 hours.`), 22-26px display deck, two CTAs (`Read a real dossier` ghost / `Submit a brief` solid), 4-cell stat row.
3. **Sample dossier excerpt** — bordered "dossier-frame" card with metadata, 28-34px display sub-head, two paragraphs of real prose, three live footnotes, editor's note.
4. **How it works** — 4-step process band (Brief / Engine / Editor / Delivery).
5. **The 404 problem** — ink-background frame with two ochre stats (11.4% / 6/10) and an editor's quote.
6. **Pricing** — four-tier card grid (Standard $499 / Pro $1,490 / Monitor $2,490/mo / Team $24,990/yr) with NOWPayments crypto checkout CTA on the buy-online tiers (Standard, Pro, Monitor) and "Talk to the desk" mailto on Team.
7. **Operator's covenant — what we won't do** — 4-bullet anti-feature manifesto.
8. **CTA** — single-paragraph closer with sample link + email-the-desk link.
9. **Footer** — Logo, brand stamp, link list, repo link, copyright.

**Copy origin.** Hero, pricing, anti-features, and editor's-note copy are sourced from [`docs/08-marketing-strategy.md`](docs/08-marketing-strategy.md) and [`docs/07-sales-strategy.md`](docs/07-sales-strategy.md). No copy is generated; no `Lorem ipsum`; no `TODO` strings ship.

## 10. Imagery and generated asset rules

The landing intentionally ships **no raster imagery** — the visual identity is carried entirely by typography, hairlines, the scarlet rule, and the ochre pulse dot. `apps/landing/public/` contains no images other than `app/icon.svg` (the OneWeekBrief O-mark with the scarlet underbar).

**If we add imagery in a later pass.**
- Generated via `prin7r-generate-image` (GPT Image 2 backed) when an OpenAI Image-API key is available. Save under `apps/landing/public/generated/<filename>.png` with a sibling `<filename>.prompt.txt` recording the prompt + model + date.
- Allowed subjects: editorial-engraved illustrations of citation infrastructure (a footnote dagger; a folded broadsheet; a typewriter-rendered URL); abstract scarlet/paper compositions; never people, never laptops, never "AI dashboards."
- Forbidden: stock photography of laptops, hands at keyboards, "diverse-team-pointing-at-screen," gradient mesh backgrounds, glow effects.
- **Graceful fallback** — if the generator is unavailable, ship without imagery; do not block release. The current landing exemplifies this.

**Logo SVG** lives inline in `apps/landing/app/page.tsx` (`Logo` component) and as `apps/landing/app/icon.svg` for the favicon.

## 11. Motion and interaction rules

- **Principle** — A page should feel like a folded broadsheet opening. No springs, no bounce, no scroll-jacking, no parallax.
- **Easing** — `cubic-bezier(.2,.6,.2,1)` over 220-380ms for everything (hover transitions, hero reveal).
- **Hero reveal** — three-stage `type-reveal` keyframe on the kicker / headline / deck (380ms, staggered 0/120/240ms), once on first paint. No re-trigger on scroll.
- **Pulse dot** — 1.6s ease-in-out opacity 1↔.45 loop on the ochre kicker dot. Only persistent animation on the page.
- **Hover** — links gain a 1px ink (or scarlet, if `.scarlet` class) underline; buttons swap fill to scarlet (solid) or ink (ghost). No color-shift fades.
- **Focus** — browser default ring is preserved. Tab order: hero CTA → secondary CTA → nav → pricing CTAs → footer links.
- **Reduced motion** — `prefers-reduced-motion` is respected by keeping the type-reveal short enough to not register as motion (380ms total) and by holding the pulse dot at 1.0 opacity. Future pass: explicit `@media (prefers-reduced-motion: reduce)` to disable both keyframes.

## 12. Accessibility and quality gates

- **WCAG target** — AA. AAA where the type scale already gets us there (display ink-on-paper).
- **Color contrast** — verified for every foreground/background pair in section 4.
- **Keyboard** — Tab cycles cleanly through hero CTA → secondary CTA → nav → pricing CTAs → footer links. Focus is visible (browser default ring is intact).
- **Alt text** — `Logo` has `aria-label="OneWeekBrief"`; the `Arrow` glyph is `aria-hidden`. There are no decorative `<img>` elements; if added, decorative use `alt=""`, content uses descriptive alt.
- **Semantics** — `header > nav`, `main`, `section[id]` for in-page anchors, `article` around the dossier excerpt, `footer`. Real `<a>` (via `next/link`), real `<h1>` / `<h2>` / `<h3>` hierarchy with no skipped levels.
- **Real copy** — no `Lorem ipsum`; no `TODO` strings; every quoted figure is from a real audit (the 11.4% / 6-of-10 numbers are sourced from our own engine's audit run).
- **Production checks** — `curl -sI https://market-research-on-demand.prin7r.com` returns HTTP/2 200 with valid Let's Encrypt R12 cert; static HTML contains the hero copy (`Decision-grade` ×12, `Submit a brief` ×10) without client-side hydration.

**Verification cadence.** Before any landing-affecting commit lands on `main`: re-capture `docs/screenshots/landing-desktop.png` and `landing-mobile.png`, re-curl the deploy URL, verify keyboard tab cycle, lint, build.

## 13. Screenshots and verification artifacts

Captured from the live deploy at `https://market-research-on-demand.prin7r.com` via Playwright (Chromium, `fullPage: true`) on 2026-05-08. They are committed at full-page height — desktop and mobile both scroll.

| Surface | Viewport | Path |
|---------|----------|------|
| Landing — desktop | 1440 × 900 (`fullPage`) | [`docs/screenshots/landing-desktop.png`](docs/screenshots/landing-desktop.png) |
| Landing — mobile | 390 × 844 (`fullPage`) | [`docs/screenshots/landing-mobile.png`](docs/screenshots/landing-mobile.png) |

![OneWeekBrief landing — desktop, 1440×900](docs/screenshots/landing-desktop.png)

![OneWeekBrief landing — mobile, 390×844](docs/screenshots/landing-mobile.png)

Capture script: `scripts/capture-landing-screenshots.mjs` (Playwright Chromium, `device_scale_factor: 2`, `wait_until: networkidle`). Re-run after any landing-affecting change.

## 14. External references and library sources

- **Brand identity source-of-truth** — [`docs/01-brand-identity.md`](docs/01-brand-identity.md). All tokens here trace back to it.
- **Component baseline** — [Prin7r Component Library Baseline: ShadCN-first](https://www.notion.so/3563ceec261981c1a147c81bf3bd0566) (Notion, internal).
- **Refero Styles** — [styles.refero.design](https://styles.refero.design/) for cross-project DESIGN.md references when expanding `apps/app/`.
- **Editorial visual references** — The Atlantic body type pairing, the Financial Times masthead rule, Stratechery's typographic command, The Information's editorial discipline.
- **shadcn/ui** — [ui.shadcn.com](https://ui.shadcn.com/) (used as the import path for `apps/app/` primitives once that surface starts).
- **Tailwind CSS 3.4** — [tailwindcss.com](https://tailwindcss.com/docs).
- **Next.js 15 App Router** — [nextjs.org/docs](https://nextjs.org/docs).
- **Source Serif 4 / Inter / JetBrains Mono** — Google Fonts, loaded with `display=swap`.

## 15. Changelog

| Date | Change | Reviewer |
|------|--------|----------|
| 2026-05-08 | high-priority rebrand — Cited → OneWeekBrief (FAIL on AI-citation/AEO category SERP eclipse). Logo monogram C → O; mono wordmark `cited.` → `oneweekbrief.`; container_name + package name + debug tags + plan names + order-id prefix updated; verb-usages of "cited" preserved (e.g., "Fully cited", "fully-footnoted"). | Wave 2 recovery Agent R |
| 2026-05-08 | **Round-2 redesign — Anthropic reference applied.** Lifted from `/Users/keer/projects/prin7r/design-references/anthropic.md`: type scale (12 / 15 / 18 / 20 / 24 / 61 / 91 px), display tracking `-1.22px`, leading 1.1 at display, body grotesque swap **Inter → Geist** (Inter banned), display serif unchanged (Source Serif 4 stays as Anthropic Serif substitute), word-level underline emphasis on hero & section headlines (`.emph` / `.emph-scarlet` — the new brand signature), 0px button radius with asymmetric 0/0/8/8 on primary CTA (Anthropic ref signature), 8px card radius, 24px feature-card radius, dark editorial feature card on `#141413` for the 404 frame, hairlines via `color-mix()`, ink scale broadened (ink / ink-medium / ink-light / graphite / cloud). **Hard override per product owner: canvas swapped warm-paper beige → milky `#FAFAF8`** (no beige rule). DESIGN.md §1, §4, §5 rewritten; screenshots recaptured. | Wave 2 redesign agent (round 2) |
| 2026-05-08 | Wave 2 polish pass — DESIGN.md created with all 15 sections; screenshots captured (`landing-desktop.png`, `landing-mobile.png`); NOWPayments crypto checkout integration added (`/api/checkout/nowpayments` route + Pricing CTAs + IPN webhook); `.env.example` extended with `NOWPAYMENTS_*` keys. | Chief of Design |
| 2026-05-07 | Initial Wave 2 batch 1 build — `apps/landing` shipped (8 sections); `apps/app` Wasp scaffold deferred. Brand identity locked in `docs/01-brand-identity.md`. | Wave 2 batch agent |
