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
        sans: ["Poppins_400Regular"],
        medium: ["Poppins_500Medium"],
        semibold: ["Poppins_600SemiBold"],
        bold: ["Poppins_700Bold"],
        extrabold: ["Poppins_800ExtraBold"],
        black: ["Poppins_900Black"],
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
