import { defineConfig } from 'vitest/config'

// Separate from vite.config.ts so tests don't boot the Start/Nitro plugins.
export default defineConfig({
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
})
