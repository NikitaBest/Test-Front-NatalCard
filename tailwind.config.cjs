const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        mono: ['Anonymous Pro', ...defaultTheme.fontFamily.mono],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
