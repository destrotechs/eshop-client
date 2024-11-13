/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line
  ],
  theme: {
    extend: {
      colors: {
        'brown': {
          500: '#A52A2A',
          700: '#8B4513',
        },
        'primary': '#4A90E2',
        'secondary': '#50E3C2',
      },
    },
  },
  plugins: [],
}