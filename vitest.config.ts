import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vitest/config';

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
      'packages/site/app/**/*.{test,spec}.{js,ts,tsx}',
    ],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['src/test/setup.ts'],
    // reka-ui 必须走 Vite 管线内联加载:被 externalize 时它会经 Node 解析出另一份
    // vue 实例,与 vite-node 管线的 SFC 分属两套响应式系统,checked 态追踪静默失效
    server: {
      deps: {
        inline: ['reka-ui'],
      },
    },
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
