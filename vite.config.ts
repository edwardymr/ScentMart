import path from 'path';
import react from '@vitejs/plugin-react'; // Asegúrate de importar react
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Primero, carga las variables de entorno
  const env = loadEnv(mode, process.cwd(), '');

  // Luego, retorna UN SOLO objeto de configuración con todas las claves
  return {
    // 1. Configura la ruta base para GitHub Pages
    base: '/ScentMart/',

    // 2. Añade los plugins que necesitas
    plugins: [react()],

    // 3. Define las variables de entorno para tu código
   define: {
  'import.meta.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY)
},

    // 4. Configura los alias de ruta
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // Es mejor práctica apuntar a './src'
      }
    }
  };
});