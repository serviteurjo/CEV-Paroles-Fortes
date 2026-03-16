import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/CEV-Paroles-Fortes/',
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'remotion': ['remotion', '@remotion/player'],
          'html-to-image': ['html-to-image'],
          'vendor': ['react', 'react-dom'],
        },
        // Improve chunk caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'html-to-image', 'remotion', '@remotion/player']
  }
});
