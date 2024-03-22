import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // gameService uses /play
      '/play': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
