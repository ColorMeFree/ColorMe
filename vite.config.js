import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: set base for custom domain deployment
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
