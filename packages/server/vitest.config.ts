import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    testTimeout: 300000,
    hookTimeout: 300000,
    globalSetup: ['./mcp/__test__/globalSetup.ts'],
    // Only run source .ts test files, not compiled .js in dist/
    include: ['mcp/__test__/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    // MCP tests call claude -p which hits external APIs — must run sequentially
    sequence: {
      concurrent: false,
    },
    maxConcurrency: 1,
    // Auto-retry flaky tests (network-dependent MCP calls)
    retry: 1,
  },
})
