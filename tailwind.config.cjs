/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {},
    fontFamily: {
      "big-shoulders": ['Big Shoulders Display', 'cursive'],
      lexend: ['Lexend Deca', 'sans-serif']
    }
  },
  plugins: [],
}
