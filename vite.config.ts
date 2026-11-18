import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  base: '/interactive-sneakers-landing-page/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
