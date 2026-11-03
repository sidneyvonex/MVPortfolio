import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Local API by default; API_PROXY=https://mvportfolio-api.sidneygithu.workers.dev uses live data.
      '/api': {
        target: process.env.API_PROXY || 'http://localhost:8787',
        changeOrigin: true,
      },
      // Same as worker/index.ts in production.
      '/resume.pdf': {
        target: process.env.API_PROXY || 'http://localhost:8787',
        changeOrigin: true,
        rewrite: () => '/api/settings/resume/download',
      },
    },
  },
})
