import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: set base for custom domain deployment
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/'
})
