const flowbite = require('flowbite-react/plugin');
/** @type {import('tailwindcss').Config} */
export default {
 
    content: [
      
    "./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugins()],
};

