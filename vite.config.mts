import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  plugins: [
    react({
      babel: {
        babelrc: true,
        configFile: true,
      },
    }),
  ],

  server: {
    proxy: {
      '/api/v1': {
        target: 'http://127.0.0.1:4001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
