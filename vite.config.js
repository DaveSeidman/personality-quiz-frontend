import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/fahlgren-personality-quiz-frontend/',
  server: {
    port: 8080,
    host: true,
  },
});
