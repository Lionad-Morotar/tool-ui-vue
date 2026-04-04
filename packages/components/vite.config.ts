import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
      include: ['src/**/*'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ToolUiVueComponents',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'vue',
        '@tool-ui-vue/core',
        '@tool-ui-vue/theme',
        'zod',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@tool-ui-vue/core': 'ToolUiVueCore',
          '@tool-ui-vue/theme': 'ToolUiVueTheme',
          zod: 'zod',
          clsx: 'clsx',
          'tailwind-merge': 'tailwindMerge',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
