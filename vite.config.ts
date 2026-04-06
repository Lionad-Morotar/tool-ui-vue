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
      skipDiagnostics: true,  // 跳过类型诊断
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ToolUiVue',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'vue',
        'zod',
        'clsx',
        'tailwind-merge',
        '@lionad/vtu-components',
        '@lionad/vtu-core',
        '@lionad/vtu-theme',
      ],
      output: {
        globals: {
          vue: 'Vue',
          zod: 'zod',
          clsx: 'clsx',
          'tailwind-merge': 'tailwindMerge',
          '@lionad/vtu-components': 'ToolUiVueComponents',
          '@lionad/vtu-core': 'ToolUiVueCore',
          '@lionad/vtu-theme': 'ToolUiVueTheme',
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
