# 01 — Brand Identity

## Brand Pyramid

- **Essence**: Conviction.
- **Personality**: Editorial. Empirical. Decisive.
- **Values**: Source-truth · Time-to-clarity · Operator-first.
- **Attributes**: OneWeekBrief. Concise. Original. Productized. Auditable.

## Positioning Statement

For founders, operators, and strategy teams who need defensible, decision-grade signal in days rather than months, **OneWeekBrief** is a research-as-a-service desk that delivers a fully-sourced market research dossier in 24-72 hours. Unlike consulting firms that slow-roll the same insight for six figures, or freelance analysts who lack a pipeline, OneWeekBrief combines a senior editorial layer with an AI research engine — every claim is footnoted, every source is named, and every brief is delivered on a clock.

## Audience Personas

### Primary — *Renee, the Founder-Strategist*
- Series A/B founder, 35-45, formerly a strategy consultant or PM.
- **Goal**: validate a category move, a pricing change, or a new geo before her next board meeting (T-minus 14 days).
- **Frustration**: McKinsey wants 8 weeks. The intern's deck is "okay but I can't cite it." She loses two weekends rebuilding a TAM.
- **Channels**: Lenny's Newsletter, FirstRound podcast, X/LinkedIn lurker, Stratechery subscriber.

### Secondary — *Marcus, the Investor / Sector Lead*
- Growth-stage VC associate or PE deal-team analyst, 28-35.
- **Goal**: a fast, cited landscape pull before a partner meeting; recurring monthly monitoring on three portfolio sectors.
- **Frustration**: Pitchbook gives him company tiles, not a thesis. Internal analysts are slammed. He pays GLG for primary calls but still needs a written backbone.
- **Channels**: Capital Allocators, Acquired podcast, Bloomberg Terminal, Slack-internal-research-channel.

## Voice and Tone

### Do
- Write in the present tense. ("The category is consolidating.")
- Footnote every quantitative claim with a named source.
- Treat one sentence as one idea.

### Don't
- Use "leverage", "synergize", "best-in-class", or any consulting cliché.
- Sell with hype. Sell with the artifact.
- Hedge with adverbs ("very", "really"); cut them.

### Sample sentence
> "The B2B fitness-tech category compressed from 41 funded entrants in 2022 to 18 by Q4 2025; three platforms now hold 71% of disclosed ARR. (sources footnoted)"

## Visual System

### Palette
| Role     | Token        | Hex       | Notes                                                  |
| -------- | ------------ | --------- | ------------------------------------------------------ |
| Surface  | `--paper`    | `#F4EFE6` | Warm broadsheet paper. Default page background.        |
| Ink      | `--ink`      | `#1A1B1E` | Near-black. All body type.                             |
| Accent   | `--scarlet`  | `#B22A2A` | Editorial red, used for marks, dividers, citations.    |
| Muted    | `--graphite` | `#6B6660` | Captions, metadata, secondary type.                    |
| Highlight| `--ochre`    | `#C99A2D` | Used sparingly for callouts and the timer pulse.       |

The palette comes from broadsheet print history (cream paper, lampblack, vermillion masthead, ochre stock photography stock). It is intentionally NOT a SaaS dashboard palette; no neon, no purple gradient, no "dark mode by default."

### Typography
- **Display**: *Source Serif 4* (Adobe / Google Fonts) — a transitional serif tuned for body and display, signals editorial trust. Used at 56-128px on hero, 32-44px on section headings.
- **Body**: *Inter* — neutral, high legibility, pairs cleanly with Source Serif. 15-17px.
- **Mono / numerics**: *JetBrains Mono* — used only for timestamps, source IDs, and footnote numerals.

Pairing rationale: serif display + neutral sans body is the standard editorial pairing (cf. The Atlantic, FT). It is deliberately *not* the all-sans tech aesthetic of Vercel/Linear/Anthropic.

### Logo concept
A single capital "C" in Source Serif Black with a 1.5px scarlet underbar that extends 1.4em past the letterform. The underbar reads simultaneously as a footnote rule, a citation underline, and a publication masthead break. Under the C, in JetBrains Mono 9px, the wordmark `cited.` (lowercase, with trailing period). The trailing period is the brand signature — citations end with a period.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 100" aria-label="OneWeekBrief">
  <text x="0" y="78" font-family="Source Serif 4, Georgia, serif" font-weight="900" font-size="96" fill="#1A1B1E">C</text>
  <line x1="0" y1="86" x2="170" y2="86" stroke="#B22A2A" stroke-width="2.5"/>
  <text x="0" y="100" font-family="JetBrains Mono, monospace" font-size="9" fill="#6B6660" letter-spacing="2">cited.</text>
</svg>
```

### Spacing & radius
- **Base unit**: 4px.
- **Spacing scale**: 4 / 8 / 12 / 20 / 32 / 56 / 96 (Fibonacci-ish; tighter than Tailwind defaults to feel print-like).
- **Radius scale**: 0 (cards), 2 (inputs), 999 (pill badges only). Most surfaces are square-edged like newsprint.
- **Grid**: 12-col, 1140px max width, 80px gutters at desktop.

### Motion
- **Principle**: A page should feel like a folded broadsheet opening — no springs, no bounce. Linear or `cubic-bezier(.2,.6,.2,1)` over 220-380ms.
- **Hover**: 1px ink underline appears on links, no color shift.
- **Hero**: a single typewriter-style render of the headline on first paint (no parallax, no marquee).

### Forbidden
- Gradients (except a single 2% paper grain overlay).
- Glassmorphism, neumorphism, drop shadows beyond `0 1px 0 0 rgba(0,0,0,.06)`.
- Stock photography of laptops or "diverse-team-pointing-at-screen."
- Emojis in product copy.
