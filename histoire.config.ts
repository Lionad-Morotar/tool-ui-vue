import { HstVue } from '@histoire/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'histoire';

export default defineConfig({
  plugins: [HstVue()],
  storyMatch: ['src/**/*.story.vue'],
  outDir: 'dist-histoire',
  setupFile: 'src/stories/_shared/histoire-setup.ts',
  theme: {
    title: 'tool-ui-vue',
  },
  defaultStoryProps: {
    layout: {
      type: 'grid',
      width: '100%',
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      watch: {
        ignored: ['**/.git/**', '**/node_modules/**', '**/dist*/**'],
      },
    },
  },
});
