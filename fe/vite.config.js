import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
/// <reference types="vitest" />
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // gameService uses /play
      '/api/play': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  test: {
    includeSource: ['src/**/*.js'],
    environment: 'jsdom'
  },
  define: {
    __MUTATION__: true
  }
});
