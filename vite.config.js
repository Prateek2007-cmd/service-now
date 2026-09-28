import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Vite 5.4.12+ (CVE-2025-24010) rejects requests whose Host header is not
    // allowlisted, which breaks the Freebuff preview proxy. The preview
    // subdomain is regenerated on every restart, so match the domain shape
    // rather than pinning one literal hostname.
    allowedHosts: [
      'localhost',
      '.localhost',
      '.e2b.app',
      '.e2b.dev',
    ]
  }
});
