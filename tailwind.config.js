/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["'Outfit'", "sans-serif"],
        display: ["'Outfit'", "sans-serif"],
        serif:   ["'Playfair Display'", "serif"],
        mono:    ["'IBM Plex Mono'", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#06b6d4",
          light:   "#22d3ee",
          dim:     "#0891b2",
          glow:    "rgba(6,182,212,0.35)",
        },
        surface: {
          bg:  "#080c14",
          1:   "#0c1120",
          2:   "#101628",
          3:   "#161d33",
          4:   "#1c253e",
          5:   "#222d4a",
        },
      },
      backgroundImage: {
        "radial-brand":  "radial-gradient(ellipse at center, rgba(230,57,70,0.15) 0%, transparent 70%)",
        "radial-top":    "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(230,57,70,0.12) 0%, transparent 100%)",
        "hero-gradient": "linear-gradient(to right, rgba(7,7,13,0.97) 0%, rgba(7,7,13,0.7) 50%, rgba(7,7,13,0.1) 100%)",
      },
      boxShadow: {
        "card":        "0 2px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        "card-hover":  "0 24px 64px rgba(0,0,0,0.7), 0 4px 24px rgba(6,182,212,0.12), 0 0 0 1px rgba(6,182,212,0.15)",
        "glow":        "0 0 40px rgba(6,182,212,0.45), 0 0 80px rgba(6,182,212,0.18)",
        "glow-sm":     "0 0 20px rgba(6,182,212,0.35)",
        "glow-text":   "0 0 30px rgba(6,182,212,0.5)",
        "inner":       "inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass":       "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
      },
      animation: {
        "float":        "float 6s ease-in-out infinite",
        "pulse-brand":  "pulse-brand 2s ease-in-out infinite",
        "scan-line":    "scan-line 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-8px)" },
        },
        "pulse-brand": {
          "0%,100%": { boxShadow: "0 0 20px rgba(230,57,70,0.3)" },
          "50%":     { boxShadow: "0 0 40px rgba(230,57,70,0.6)" },
        },
        "scan-line": {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      blur: {
        "4xl": "80px",
        "5xl": "120px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

