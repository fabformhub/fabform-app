import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  build: {
    sourcemap: true
  },

  plugins: [
    svelte(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      $lib: path.resolve('src/lib')
    }
  },

  server: {
    host: true,
    port: 5173,
    strictPort: true,

    hmr: {
      host: 'dev.fabform.io',
      protocol: 'wss',
      clientPort: 443
    }
  }
})

