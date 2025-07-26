import path from "path"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 👇 Load env based on current mode or fallback to 'development'
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd());

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: env.VITE_PROXY_URL,
        changeOrigin: true,
        secure: false
      }
    },
    host: true, // or '0.0.0.0'
    port: 5173,
  }
})
