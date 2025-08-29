/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",        // Revisa si usas una carpeta 'src'
    "./components/**/*.{js,ts,jsx,tsx}", // O una carpeta 'components'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}