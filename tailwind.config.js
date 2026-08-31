/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          deep: "#1A1836",
          mid: "#2D2A5C",
        },
        accent: {
          glow: "#FFC978",
        },
        text: {
          primary: "#F5F2ED",
          secondary: "#B8B4D9",
        },
        mood: {
          happy: "#FF9E7D",
          calm: "#6FBFC4",
          sad: "#4A5B8C",
          energetic: "#C25AE0",
          neutral: "#8B87B0",
        }
      },
      fontFamily: {
        heading: ["'Klee One'", "cursive", "serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(255, 201, 120, 0.3)',
        'glow-md': '0 0 25px -4px rgba(255, 201, 120, 0.45)',
        'glow-lg': '0 0 40px -5px rgba(255, 201, 120, 0.6)',
        'edge-amber': '0 0 0 1px rgba(255, 201, 120, 0.3), 0 8px 24px -4px rgba(26, 24, 54, 0.7)',
        'edge-lavender': '0 0 0 1px rgba(184, 180, 217, 0.25), 0 8px 24px -4px rgba(26, 24, 54, 0.7)',
        'edge-teal': '0 0 0 1px rgba(111, 191, 196, 0.35), 0 8px 24px -4px rgba(26, 24, 54, 0.7)',
        'edge-coral': '0 0 0 1px rgba(255, 158, 125, 0.35), 0 8px 24px -4px rgba(26, 24, 54, 0.7)',
        'edge-violet': '0 0 0 1px rgba(194, 90, 224, 0.35), 0 8px 24px -4px rgba(26, 24, 54, 0.7)',
      },
    },
  },
  plugins: [],
}
