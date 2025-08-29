/** @type {import('tailwindcss').Config} */
export default {
  // Aquí le damos el mapa exacto de tu proyecto a Tailwind
  content: [
    "./index.html",                 // 1. Escanea el index.html en la raíz
    "./App.tsx",                    // 2. Escanea App.tsx en la raíz
    "./index.tsx",                  // 3. Escanea index.tsx en la raíz
    "./components/**/*.{js,ts,jsx,tsx}" // 4. Escanea TODOS los archivos .tsx dentro de la carpeta 'components'
  ],
  theme: {
    extend: {
      // Tus colores personalizados para fácil acceso
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