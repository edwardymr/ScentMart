/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Es buena práctica añadir tus colores personalizados aquí
      // para que puedas usarlos con clases como 'bg-brand-blue'
      colors: {
        'brand-blue': '#224859',
        'brand-dark-blue': '#1c3a4a',
        'brand-gold': '#DAB162',
        'brand-orange': '#E86A33',
      },
    },
  },
  plugins: [],
}