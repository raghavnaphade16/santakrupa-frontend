import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api calls to the Spring backend so the browser doesn't hit CORS.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
