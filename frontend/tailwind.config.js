/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '468px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
    },
    fontFamily: {
      lato: ['Lato', 'sans-serif'],
    },
    extend: {
      colors: {
        primaire: '#fd2d01',
        lightPrimary: '#fa5332',
        secondaire: '#ffd7d7',
        tertiaire: '#4e5166',
        darkGray: '#363847',
        lightGray: '#5d617a',
        lightRed: '#fffafa'
      },
    },
  },
  plugins: [],
}
