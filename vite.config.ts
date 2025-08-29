import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // 1. La ruta base para que GitHub Pages encuentre tus archivos
  base: '/ScentMart/', 
  
  // 2. El plugin necesario para que Vite entienda React (JSX)
  plugins: [react()],
});