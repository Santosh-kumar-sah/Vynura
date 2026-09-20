/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: "#090A0F",
          1: "#11131A",
          2: "#181B24",
          3: "#202430",
          border: "rgba(255, 255, 255, 0.08)",
          highlight: "rgba(255, 255, 255, 0.14)",
        },
        brand: {
          primary: "#F59E0B",
          secondary: "#38BDF8",
          neutral: "#94A3B8",
        },
        sky: {
          deep: "#090A0F",
          mid: "#11131A",
        },
        accent: {
          glow: "#F59E0B",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
        mood: {
          happy: "#F59E0B",
          calm: "#38BDF8",
          sad: "#64748B",
          energetic: "#A855F7",
          neutral: "#94A3B8",
        }
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        heading: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        body: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        'surface-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'surface-md': '0 8px 24px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.07)',
        'surface-lg': '0 20px 48px -8px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.09)',
        'surface-elevated': '0 12px 36px -6px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glow-sm': '0 0 15px -3px rgba(245, 158, 11, 0.25)',
        'glow-md': '0 0 25px -4px rgba(245, 158, 11, 0.35)',
        'glow-lg': '0 0 40px -5px rgba(245, 158, 11, 0.45)',
      },
    },
  },
  plugins: [],
}
