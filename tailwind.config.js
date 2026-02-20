/** @type {import('tailwindcss').Config} */
module.exports = {
  // THIS LINE IS REQUIRED FOR THE BUTTON TO WORK
  darkMode: 'class', 
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colours: {
        // Custom colours if you want them later
      }
    },
  },
  plugins: [],
};