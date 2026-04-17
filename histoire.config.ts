import { HstVue } from '@histoire/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'histoire';
import { resolve } from 'path';

const storyGroups = [
  { title: 'Data Display', stories: ['chart', 'data-table', 'stats-display', 'weather-widget'] },
  { title: 'Code & Terminal', stories: ['code-block', 'code-diff', 'terminal'] },
  { title: 'Media', stories: ['audio', 'image', 'image-gallery', 'item-carousel', 'video'] },
  { title: 'Social', stories: ['approval-card', 'citation', 'instagram-post', 'linkedin-post', 'link-preview', 'message-draft', 'x-post'] },
  { title: 'Forms & Input', stories: ['option-list', 'parameter-slider', 'preferences-panel'] },
  { title: 'Workflow', stories: ['geo-map', 'plan', 'progress-tracker', 'question-flow', 'order-summary'] },
];

export default defineConfig({
  plugins: [HstVue()],
  storyMatch: ['src/**/*.story.vue'],
  storyIgnored: ['**/.git/**', '**/node_modules/**', '**/dist*/**', '**/tailwind-test.story.vue', '**/tailwind-test/**'],
  outDir: 'dist-histoire',
  setupFile: 'src/stories/_shared/histoire-setup.ts',
  routerMode: 'hash',
  theme: {
    title: 'tool-ui-vue',
    logoHref: 'https://tool-ui-vue.vercel.app',
  },
  defaultStoryProps: {
    layout: {
      type: 'grid',
      width: '100%',
    },
  },
  tree: {
    groups: storyGroups.map(g => ({
      title: g.title,
      include: (file: { path: string }) =>
        g.stories.some(
          story =>
            file.path.includes(`/${story}/index.story.vue`) ||
            file.path.includes(`${story}.story.vue`)
        ),
    })),
  },
  vite: {
    base: '/tool-ui-vue/docs/',
    build: {
      sourcemap: false,
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
        '@lionad/vtu-components': resolve(__dirname, 'packages/components/src'),
        '@lionad/vtu-core': resolve(__dirname, 'packages/core/src'),
        '@lionad/vtu-theme': resolve(__dirname, 'packages/theme/src'),
      },
    },
    server: {
      watch: {
        ignored: ['**/.git/**', '**/node_modules/**', '**/dist*/**'],
      },
    },
  },
});
