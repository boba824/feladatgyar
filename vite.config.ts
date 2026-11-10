import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base path so it works seamlessly on any GitHub Pages URL (e.g. username.github.io/matek/ or custom domain)
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
})
