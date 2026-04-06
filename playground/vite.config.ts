import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
  plugins: [
    vue(),
    // 自动引入 Vue API 和 VueUse
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dirs: ['../src/utils'], // 只从 utils 引入 cn，避免 shared 的重复导出
      dts: './auto-imports.d.ts',
      vueTemplate: true,
      // 排除特定文件避免重复导出
      exclude: [
        '**/pierre-*.js',
        '**/pierre-*.ts',
        '**/index.ts', // 排除 barrel export 文件
      ],
    }),
    // 自动引入组件
    Components({
      dirs: ['../packages/components/src'],
      dts: './components.d.ts',
      // 排除测试文件、示例文件和子组件目录
      exclude: [
        /__tests__/,
        /\.test\./,
        /\.story\./,
        /\.example\./,
        /[\\/]cmpts[\\/]/, // 排除所有 cmpts 子目录
      ],
    }),
  ],
  root: __dirname,
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@lionad/vtu-components': resolve(__dirname, '../packages/components/src'),
      '@lionad/vtu-core': resolve(__dirname, '../packages/core/src'),
    },
  },
});