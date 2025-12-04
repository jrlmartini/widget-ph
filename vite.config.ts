import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Basic Vite config tailored for Grafana panel prototyping
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
