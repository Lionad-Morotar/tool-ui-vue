import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
].filter((dep) => dep !== '@lionad/vtu-core' && dep !== '@lionad/vtu-theme');

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
      include: ['src/**/*'],
      exclude: ['**/pierre-*.js'],
      compilerOptions: {
        skipLibCheck: true,
        noUnusedLocals: false,
      },
      strictOutput: false,
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
      external,
      output: {
        globals: {
          vue: 'Vue',
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
    extensions: ['.js', '.ts', '.vue'],
  },
});
