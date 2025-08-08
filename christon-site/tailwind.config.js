/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#e11d48',
          50: '#ffe0e5',
          100: '#ffb3c0',
          200: '#ff8099',
          300: '#ff4d73',
          400: '#ff1a4d',
          500: '#e11d48',
          600: '#b5173a',
          700: '#8a112d',
          800: '#5f0b1f',
          900: '#350511',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(225, 29, 72, 0.35)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};