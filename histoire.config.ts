import { HstVue } from '@histoire/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'histoire';
import { resolve } from 'path';

const storyGroups = [
  { title: 'Data Display', stories: ['article', 'chart', 'chart/charts', 'chart/minimal', 'chart/interactive', 'data-table', 'data-table/selection', 'data-table/formatting', 'data-table/states', 'data-table/playground', 'stats-display', 'stats-display/indicators', 'stats-display/formats', 'weather-widget', 'weather-widget/conditions', 'weather-widget/simulation', 'weather-widget/accessibility'] },
  { title: 'Code & Terminal', stories: ['code-block', 'code-block/languages', 'code-block/options', 'code-diff', 'code-diff/modes', 'code-diff/themes', 'terminal', 'terminal/outputs', 'terminal/dark'] },
  { title: 'Media', stories: ['audio', 'image', 'image-gallery', 'image-gallery/layouts', 'image-gallery/captions', 'image-gallery/lightbox', 'item-carousel', 'item-carousel/states', 'item-carousel/interactions', 'item-carousel/actions', 'video'] },
  { title: 'Social', stories: ['approval-card', 'citation', 'citation/formats', 'citation/list', 'contact-card', 'contact-card/channels', 'contact-card/options', 'instagram-post', 'instagram-post/media', 'instagram-post/captions', 'linkedin-post', 'linkedin-post/media', 'linkedin-post/variants', 'link-preview', 'link-preview/variants', 'link-preview/ratios', 'message-draft', 'x-post', 'x-post/media', 'x-post/variants'] },
  { title: 'Forms & Input', stories: ['option-list', 'parameter-slider', 'preferences-panel', 'preferences-panel/sections', 'preferences-panel/receipt', 'preferences-panel/layout'] },
  { title: 'Workflow', stories: ['geo-map', 'geo-map/routes', 'geo-map/interactions', 'geo-map/icons', 'plan', 'progress-tracker', 'progress-tracker/states', 'progress-tracker/receipt', 'question-flow', 'question-flow/progressive', 'question-flow/upfront', 'question-flow/receipt', 'order-summary'] },
];

export default defineConfig({
  plugins: [HstVue()],
  storyMatch: ['src/**/*.story.vue'],
  // histoire 内部的 markdown/story watcher 用 micromatch 匹配此列表遍历整个仓库，
  // glob 的 ** 不匹配 dot 目录段，生成产物目录必须按字面量逐个列出，
  // 否则会深入 .output/.nitro 的嵌套 node_modules 耗尽系统监听资源（EMFILE）
  storyIgnored: [
    '**/.git/**',
    '**/node_modules/**',
    '**/dist*/**',
    '**/.output/**',
    '**/.nitro/**',
    '**/.nuxt/**',
    '**/.serve/**',
    '**/.histoire/**',
    '**/.claude/**',
    '**/tailwind-test.story.vue',
    '**/tailwind-test/**',
  ],
  outDir: 'dist-histoire',
  setupFile: 'src/stories/_shared/histoire-setup.ts',
  routerMode: 'hash',
  theme: {
    title: 'tool-ui-vue',
    logoHref: 'https://lionad-morotar.github.io/tool-ui-vue/',
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
        // glob 的 ** 不匹配 dot 目录段，生成产物目录必须按字面量逐个列出，
        // 否则会深入 .output/.nitro 的嵌套 node_modules 耗尽系统监听资源（EMFILE）
        ignored: [
          '**/.git/**',
          '**/node_modules/**',
          '**/dist*/**',
          '**/.output/**',
          '**/.nitro/**',
          '**/.nuxt/**',
          '**/.serve/**',
          '**/.histoire/**',
          '**/.claude/**',
        ],
      },
    },
  },
});
