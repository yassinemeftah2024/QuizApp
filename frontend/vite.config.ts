import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'window',   // ← FIX sockjs-client
  },
  server: {
    port: 3000,
    host: '0.0.0.0',  // Pour Docker
    proxy: {
      // Proxy API requests to Spring Boot backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Proxy WebSocket (dev-b)
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
})
