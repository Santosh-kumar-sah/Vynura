/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0B0A10",
        panel: "#131219",
        brand: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
          subtle: "rgba(245, 158, 11, 0.12)",
        },
        surface: {
          base: "#0B0A10",
          1: "#131219",
          border: "rgba(255, 255, 255, 0.08)",
        },
        accent: {
          glow: "#F59E0B",
        },
        mood: {
          happy: "#F59E0B",
          calm: "#38BDF8",
          sad: "#818CF8",
          energetic: "#A855F7",
          neutral: "#94A3B8",
        }
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        heading: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        body: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        'panel': '0 24px 48px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
}
