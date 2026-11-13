import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Relative base path ensures GitHub Pages serves assets properly regardless of repo name
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
