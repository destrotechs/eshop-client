/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          500: '#A52A2A',
          700: '#8B4513',
        },
      },
    },
  },
  plugins: [],
}