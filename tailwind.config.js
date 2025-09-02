/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Escanea tu archivo HTML principal
    "./src/**/*.{js,ts,jsx,tsx}", // Escanea TODOS los archivos dentro de la carpeta 'src'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}