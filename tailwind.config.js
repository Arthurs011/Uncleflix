/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B0F1A',
        secondary: '#121826',
        accent: '#3B82F6',
        glow: '#22D3EE',
      },
    },
  },
  plugins: [],
}
