import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#16161e",
        elevated: "#1c1e2a",
        overlay: "#232535",
        edge: "#2a2d3e",
        ink: {
          100: "#e3e5ec",
          300: "#c8ccd8",
          500: "#8b90a8",
          700: "#5a5f78",
        },
        accent: {
          blue: "#7dabf8",
          green: "#9ece6a",
          amber: "#e0af68",
          red: "#f7768e",
          purple: "#bb9af7",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        fadeUp: "fadeUp 0.4s ease-out forwards",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(22,22,30,0) 0%, #16161e 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
