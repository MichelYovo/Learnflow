/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4F46E5",
          dark: "#4338CA",
          soft: "#EEF2FF",
        },
        lf: {
          surface: "#FAFAF9",
          "surface-dark": "#0F172A",
          card: "#FFFFFF",
          "card-dark": "#1E293B",
          muted: "#64748B",
          ink: "#0F172A",
          "ink-soft": "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["System"],
        medium: ["System"],
        semibold: ["System"],
        bold: ["System"],
        extrabold: ["System"],
        black: ["System"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};
