import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Add this 'base' property:
  base: "/album/", // <--- ADD THIS LINE with your repository name and trailing slash
  plugins: [react()],
});