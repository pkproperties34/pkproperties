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
          DEFAULT: '#0a0f16', // Deeper, more luxurious dark blue/black
          light: '#141d2b',
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
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Outfit"', 'sans-serif'], // Changing to Outfit for a more modern, rounded geometric look
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pop': 'pop 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
}
