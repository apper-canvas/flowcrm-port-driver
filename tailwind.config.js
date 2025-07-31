/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0369a1",
        secondary: "#0891b2",
        accent: "#0d9488",
        surface: "#f8fafc",
        background: "#ffffff",
        success: "#16a34a",
        warning: "#eab308",
        error: "#dc2626",
        info: "#3b82f6"
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}