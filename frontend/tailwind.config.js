/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3498db',        // Peter River
        'secondary': '#ecf0f1',      // Clouds (Often used as a light background)
        'accent': '#e74c3c',         // Alizarin
        'textDark': '#2c3e50',       // Wet Asphalt
        'textLight': '#58697a',      // Lighter text, derived from Wet Asphalt
        'borderLight': '#bdc3c7',    // Silver
        'cardBg': '#f8f9fa',         // Lightest background/cards
        'success': '#2ecc71',        // Emerald
        'warning': '#f39c12',        // Orange
        'error': '#e74c3c',          // Alizarin (Same as accent)
        'white': '#ffffff'
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        secondary: ['Lora', 'serif']
      }
    },
  },
  plugins: [],
};