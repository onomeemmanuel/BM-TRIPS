/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        sky: '#38B6E8',
        'sky-dark': '#0A7EB8',
        'sky-deep': '#0A5C84',
        'sky-tint': '#EBF7FD',
        'sky-mid': '#C5E9F7',
        ink: '#0D2136',
        slate: '#3A5369',
        muted: '#7A94A8',
        border: '#D6EDF7',
      },
    },
  },
  plugins: [],
}