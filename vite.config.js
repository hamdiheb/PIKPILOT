import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // index.html sits at the repo root, so Vite's default public directory is
  // <root>/public — which does not exist here. Without this the files in
  // front/public are never copied into the build and /favicon.svg 404s.
  publicDir: 'front/public',
})
