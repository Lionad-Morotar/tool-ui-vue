import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
      include: ['src/**/*'],
      outDir: 'dist',
      entryRoot: 'src',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'i18n/index': resolve(__dirname, 'src/i18n/index.ts'),
      },
      name: 'ToolUiVueCore',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (entryName === 'index') {
          return `index.${format === 'es' ? 'js' : 'cjs'}`
        }
        return `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
      },
    },
    rollupOptions: {
      external: ['vue', 'zod', 'class-variance-authority', 'tailwind-merge', 'clsx'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
