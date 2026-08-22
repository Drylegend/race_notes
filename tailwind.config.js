/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0058bc",
        "primary-container": "#0070eb",
        "primary-fixed": "#d8e2ff",
        "primary-fixed-dim": "#adc6ff",
        "on-primary": "#ffffff",
        "on-primary-fixed": "#001a41",
        "on-primary-container": "#fefcff",
        "secondary": "#566068",
        "secondary-container": "#dae4ee",
        "on-secondary-container": "#5c666e",
        "tertiary": "#595c5e",
        "tertiary-container": "#727577",
        "tertiary-fixed": "#e0e3e5",
        "on-tertiary-fixed": "#191c1e",
        "on-tertiary-fixed-variant": "#444749",
        "background": "#f9f9ff",
        "surface": "#f9f9ff",
        "surface-bright": "#f9f9ff",
        "surface-dim": "#cfdaf2",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f3ff",
        "surface-container": "#e7eeff",
        "surface-container-high": "#dee8ff",
        "surface-container-highest": "#d8e3fb",
        "surface-variant": "#d8e3fb",
        "on-surface": "#111c2d",
        "on-surface-variant": "#414755",
        "outline": "#717786",
        "outline-variant": "#c1c6d7",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "base": "8px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "container-max": "1280px",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
      },
      boxShadow: {
        "card": "0 4px 20px rgba(0, 88, 188, 0.04)",
        "card-hover": "0 8px 30px rgba(0, 88, 188, 0.08)",
      }
    },
  },
  plugins: [],
}
