import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F4EFE6",
        "paper-2": "#EAE3D5",
        ink: "#1A1B1E",
        scarlet: "#B22A2A",
        graphite: "#6B6660",
        ochre: "#C99A2D",
      },
      fontFamily: {
        display: ['"Source Serif 4"', "Georgia", "serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        masthead: "2px",
      },
      maxWidth: {
        prose: "1140px",
      },
    },
  },
  plugins: [],
};

export default config;
