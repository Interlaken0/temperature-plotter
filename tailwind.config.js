/** @type {import('tailwindcss').Config} */
module.exports = {
  // THIS LINE IS REQUIRED FOR THE BUTTON TO WORK
  darkMode: 'class', 
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors if you want them later
      }
    },
  },
  plugins: [],
};