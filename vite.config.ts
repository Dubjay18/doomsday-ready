import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), nitro({ traceDeps: ['@electric-sql/pglite*'] }), tailwindcss(), tanstackStart(), viteReact()],
  // Pre-bundle client deps up front so dev doesn't full-reload the first time a route needs one.
  optimizeDeps: {
    include: ['motion/react', 'zod', 'canvas-confetti', 'better-auth/react', 'better-auth/client/plugins', '@tanstack/react-query', '@tanstack/react-router-ssr-query'],
  },
  // The embedded dev DB writes to ./.data. Don't treat DB writes as code changes.
  server: { watch: { ignored: ['**/.data/**'] } },
  // PGlite ships WASM + data files; keep it external on the server.
  ssr: { external: ['@electric-sql/pglite'] },
})
