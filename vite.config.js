import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/wedding-album/",
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: '/wedding-album/'
  },
  build: { // ONLY ONE build SECTION
    outDir: 'dist/wedding-album',
    emptyOutDir: true
  }
})