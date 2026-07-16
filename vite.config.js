import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// On GitHub Pages the app is served from https://<user>.github.io/AimLite/,
// so production builds need base '/AimLite/'. Local dev stays at '/'.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/AimLite/' : '/',
  server: {
    open: true,
  },
}))
