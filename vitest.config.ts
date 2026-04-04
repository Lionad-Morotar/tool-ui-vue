import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    root: '.',
    include: [
      'src/**/*.{test,spec}.{js,ts,tsx}',
      'playground/**/*.{test,spec}.{js,ts,tsx}',
      'packages/*/src/**/*.{test,spec}.{js,ts,tsx}',
    ],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist', '**/*.test.ts', '**/test/**'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
