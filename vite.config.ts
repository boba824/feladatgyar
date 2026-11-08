import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base path so it works seamlessly on any GitHub Pages URL (e.g. username.github.io/matek/ or custom domain)
  base: './',
})
