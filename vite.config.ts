import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 👇 IMPORTANTE: reemplaza "ScentMart" por el nombre EXACTO de tu repo
  base: '/ScentMart/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true, // útil para debuggear en Pages
  },
  server: {
    port: 3000,
    open: true, // abre automáticamente en local
  },
});
