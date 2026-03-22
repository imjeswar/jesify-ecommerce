/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: ['"Cinzel"', 'serif'],
        heading: ['"Cormorant Garamond"', 'serif'],
        main: ['"Montserrat"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eaedf3',
          100: '#cacee0',
          200: '#a5adc9',
          400: '#52669b',
          500: '#082052', // Main Navy
          600: '#061a45',
          700: '#051333',
          800: '#030d24',
          900: '#010612',
        },
        secondary: {
          50: '#ffffff',
          100: '#fcfaf6',
          200: '#fbf9f2',
          300: '#f9f5ea',
          400: '#f9f3e8',
          500: '#F8F0E5', // Main Cream/Beige
          600: '#dec8ae',
          700: '#c4a076',
          800: '#aa783e',
          900: '#8f5006',
        }
      }
    },
  },
  plugins: [],
}
