import type { Config } from "tailwindcss";

/* [ONEWEEKBRIEF_REDESIGN_R2] 2026-05-08 — tokens lifted from
 * design-references/anthropic.md, transposed to a milky-white canvas
 * (no beige per user override). */

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // [ONEWEEKBRIEF_NEUTRAL_2026-06-02] Neutralized — milky white (no warm cast).
        canvas: "#FAFAF8",
        "canvas-2": "#F2F2F2",      // TRUE neutral cool gray (was #F4F4F0 warm-cream)
        "canvas-3": "#E8E8E8",      // TRUE neutral cool gray (was #ECECEA)
        "paper-white": "#FFFFFF",

        // Ink scale — Anthropic slate range, retained.
        ink: "#141413",
        "ink-medium": "#3D3D3A",
        "ink-light": "#5E5D59",
        graphite: "#87867F",
        cloud: "#B0AEA5",
        "cloud-light": "#D1CFC5",

        // [ONEWEEKBRIEF_NEUTRAL_2026-06-02] Accents demoted to documented micro-accent
        // (small type, footnote numerals, hairline, logo bar) — NOT primary CTA fill,
        // NOT section under-rule, NOT stat numbers. See DESIGN.md §4.
        scarlet: "#B22A2A",         // micro-accent (footnote nums, "—" bullets, logo underbar)
        ember: "#7A6A60",           // neutral warm-gray (held in reserve, not in use)
        ochre: "#5E5D59",           // neutralized: was #C99A2D (warm yellow) → ink-light gray
        olive: "#6E6E68",           // neutralized: was #788C5D (olive) → cool gray

        // Hairline tokens — color-mix-style derived alphas.
        "hairline-soft": "rgba(20,20,19,0.06)",
        hairline: "rgba(20,20,19,0.09)",
        "hairline-strong": "rgba(20,20,19,0.12)",
        "hairline-emphatic": "rgba(20,20,19,0.18)",
      },
      fontFamily: {
        // Editorial serif — Anthropic Serif substitute (Source Serif 4 / Tiempos / PP Editorial New).
        display: ['"Source Serif 4"', '"Tiempos Headline"', "Georgia", "serif"],
        // Body / UI grotesque — Anthropic Sans substitute. INTER IS BANNED.
        body: ['"Geist"', "ui-sans-serif", "-apple-system", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', '"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        // Direct lift of Anthropic ref type scale.
        caption: ["12px", { lineHeight: "1.3" }],
        "body-sm": ["15px", { lineHeight: "1.4", letterSpacing: "-0.03px" }],
        body: ["16px", { lineHeight: "1.4" }],
        subheading: ["18px", { lineHeight: "1.4" }],
        "heading-sm": ["20px", { lineHeight: "1.4" }],
        heading: ["24px", { lineHeight: "1.3", letterSpacing: "-0.12px" }],
        "heading-lg": ["61px", { lineHeight: "1.1", letterSpacing: "-1.22px" }],
        display: ["91px", { lineHeight: "1.1" }],
      },
      letterSpacing: {
        masthead: "2px",
        display: "-1.22px",
      },
      maxWidth: {
        prose: "1200px",     // Anthropic page max-width.
        column: "1140px",    // narrower content column.
      },
      borderRadius: {
        // Anthropic ref: 0 / 8 / 16 / 24 — square buttons, rounded cards/feature cards.
        none: "0px",
        card: "8px",
        panel: "16px",
        "feature-card": "24px",
      },
      spacing: {
        section: "76px",
        "section-lg": "84px",
        card: "31px",
      },
    },
  },
  plugins: [],
};

export default config;
