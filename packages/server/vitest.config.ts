import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    testTimeout: 300000,
    hookTimeout: 300000,
  },
})
