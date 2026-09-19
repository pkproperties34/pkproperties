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
          DEFAULT: '#1A1A1A', // Deep charcoal / black
          light: '#2D2D2D',
        },
        accent: {
          DEFAULT: '#D4AF37', // Warm gold
          light: '#F3E5AB',
        },
        background: {
          DEFAULT: '#F8F9FA', // Off-white
          surface: '#FFFFFF',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
