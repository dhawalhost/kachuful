/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          start: '#1E3A8A',
          end: '#7C3AED',
        },
        accent: '#F59E0B',
        success: '#10B981',
        error: '#EF4444',
        suit: {
          red: '#DC2626',
          black: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
