import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dirs: ['./src/utils', './playground/composables'],
      dts: false,
      vueTemplate: true,
      exclude: ['**/index.ts'],
    }),
    Components({
      dirs: ['./packages/components/src', './playground/components'],
      dts: false,
      exclude: [
        /__tests__/,
        /\.test\./,
        /\.story\./,
        /\.example\./,
        /[\\/]cmpts[\\/]/,
      ],
    }),
  ],
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
      '@lionad/vtu-core': resolve(__dirname, 'packages/core/src'),
      '@lionad/vtu-core/i18n': resolve(__dirname, 'packages/core/src/i18n/index.ts'),
      '@lionad/vtu-components': resolve(__dirname, 'packages/components/src'),
      '@lionad/vtu-components/i18n': resolve(__dirname, 'packages/components/src/i18n/index.ts'),
    },
  },
});
