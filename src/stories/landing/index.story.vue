<script setup lang="ts">
import {
  BarChart3,
  ImageIcon,
  Layers,
  MousePointerClick,
  Share2,
  Terminal,
  Zap,
} from 'lucide-vue-next';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n';

const subtitle = useStoryLocale('content.subtitle', messages);

const categories = [
  {
    id: 'data-display',
    title: { zh: '数据展示', en: 'Data Display' },
    icon: BarChart3,
    components: ['Chart', 'DataTable', 'StatsDisplay', 'WeatherWidget'],
    href: '#/story/src-stories-chart-index-story-vue',
  },
  {
    id: 'code-terminal',
    title: { zh: '代码与终端', en: 'Code & Terminal' },
    icon: Terminal,
    components: ['CodeBlock', 'CodeDiff', 'Terminal'],
    href: '#/story/src-stories-code-block-index-story-vue',
  },
  {
    id: 'media',
    title: { zh: '媒体', en: 'Media' },
    icon: ImageIcon,
    components: ['Audio', 'Image', 'ImageGallery', 'ItemCarousel', 'Video'],
    href: '#/story/src-stories-audio-index-story-vue',
  },
  {
    id: 'social',
    title: { zh: '社交', en: 'Social' },
    icon: Share2,
    components: ['ApprovalCard', 'Citation', 'InstagramPost', 'LinkedInPost', 'LinkPreview', 'MessageDraft', 'XPost'],
    href: '#/story/src-stories-approval-card-index-story-vue',
  },
  {
    id: 'forms-input',
    title: { zh: '表单与输入', en: 'Forms & Input' },
    icon: MousePointerClick,
    components: ['OptionList', 'ParameterSlider', 'PreferencesPanel'],
    href: '#/story/src-stories-option-list-index-story-vue',
  },
  {
    id: 'workflow',
    title: { zh: '工作流', en: 'Workflow' },
    icon: Layers,
    components: ['GeoMap', 'Plan', 'ProgressTracker', 'QuestionFlow', 'OrderSummary'],
    href: '#/story/src-stories-geo-map-index-story-vue',
  },
];

const heroTagline = useStoryLocale('content.heroTagline', messages);
const heroCta = useStoryLocale('content.heroCta', messages);
const browseByCategory = useStoryLocale('data.browseByCategory', messages);
const footerText = useStoryLocale('content.footerText', messages);
const footerViewOn = useStoryLocale('content.footerViewOn', messages);
</script>

<template>
  <Story title="tool-ui-vue" :layout="{ type: 'single' }">
    <p class="mb-6 text-xs text-muted-foreground">{{ subtitle }}</p>
    <div class="min-h-screen w-full bg-background text-foreground">
      <!-- Hero -->
      <section class="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-4xl text-center">
          <div class="mb-6 inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
            <Zap class="mr-1.5 h-4 w-4" />
            <span>Vue 3 + TypeScript + Tailwind CSS v4</span>
          </div>
          <h1 class="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            tool-ui-vue
          </h1>
          <p class="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            {{ heroTagline }}
          </p>

          <!-- Install command -->
          <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <code class="inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-mono text-card-foreground shadow-sm">
              pnpm add @lionad/vtu-components
            </code>
            <a
              href="#/story/src-stories-code-block-index-story-vue"
              target="_parent"
              class="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              {{ heroCta }}
            </a>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="px-6 pb-24 lg:px-8">
        <div class="mx-auto max-w-6xl">
          <h2 class="mb-10 text-center text-2xl font-semibold tracking-tight text-foreground">
            {{ browseByCategory }}
          </h2>

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <a
              v-for="cat in categories"
              :key="cat.id"
              :href="cat.href"
              target="_parent"
              class="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ring hover:shadow-md"
            >
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <component :is="cat.icon" class="h-5 w-5" />
              </div>
              <h3 class="text-lg font-semibold text-card-foreground">
                {{ useStoryLocale(cat.title) }}
              </h3>
              <p class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="comp in cat.components"
                  :key="comp"
                  class="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {{ comp }}
                </span>
              </p>
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
        <p>
          {{ footerText }}
          <a class="font-medium text-foreground hover:underline" href="https://github.com/Lionad-Morotar" target="_blank" rel="noopener noreferrer">Lionad-Morotar</a>
          · {{ footerViewOn }}
          <a class="font-medium text-foreground hover:underline" href="https://github.com/Lionad-Morotar/tool-ui-vue" target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>
      </footer>
    </div>
  </Story>
</template>
