<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Video } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const basic = useStoryLocale('content.basic', messages)
const withPoster = useStoryLocale('content.withPoster', messages)
const withDescription = useStoryLocale('content.withDescription', messages)
const withNavigation = useStoryLocale('content.withNavigation', messages)
const squareFormat = useStoryLocale('content.squareFormat', messages)
const verticalFormat = useStoryLocale('content.verticalFormat', messages)
const withEventLogging = useStoryLocale('content.withEventLogging', messages)
const interactive = useStoryLocale('content.interactive', messages)
const elephantsDreamTitle = useStoryLocale('content.elephantsDreamTitle', messages)
const biggerBlazesTitle = useStoryLocale('content.biggerBlazesTitle', messages)
const biggerBlazesDesc = useStoryLocale('content.biggerBlazesDesc', messages)
const clickToOpenTitle = useStoryLocale('content.clickToOpenTitle', messages)
const clickToOpenDesc = useStoryLocale('content.clickToOpenDesc', messages)
const squareVideoTitle = useStoryLocale('content.squareVideoTitle', messages)
const verticalVideoTitle = useStoryLocale('content.verticalVideoTitle', messages)
const eventVideoTitle = useStoryLocale('content.eventVideoTitle', messages)
const eventVideoDesc = useStoryLocale('content.eventVideoDesc', messages)
const eventLogHeading = useStoryLocale('content.eventLogHeading', messages)
const clearButton = useStoryLocale('content.clearButton', messages)
const noEventsYet = useStoryLocale('content.noEventsYet', messages)
const controlsHeading = useStoryLocale('content.controlsHeading', messages)
const formTitle = useStoryLocale('content.formTitle', messages)
const formDesc = useStoryLocale('content.formDesc', messages)
const formRatio = useStoryLocale('content.formRatio', messages)
const formAutoPlay = useStoryLocale('content.formAutoPlay', messages)
const navLogHeading = useStoryLocale('content.navLogHeading', messages)

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const VideoProps = useStoryLocale('content.videoProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = VideoProps

const props = [
  { name: 'id', type: 'string', default: '-', description: { zh: '视频组件的唯一标识符', en: 'Unique identifier for the video component' } },
  { name: 'role', type: 'string', default: '-', description: { zh: '组件角色（information | decision | control | state | composite）', en: 'Component role' } },
  { name: 'receipt', type: 'object', default: '-', description: { zh: '操作回执信息', en: 'Operation receipt information' } },
  { name: 'assetId', type: 'string', default: '-', description: { zh: '视频资源 ID', en: 'Video asset ID' } },
  { name: 'src', type: 'string', default: '-', description: { zh: '视频文件 URL', en: 'Video file URL' } },
  { name: 'poster', type: 'string', default: '-', description: { zh: '封面图片 URL', en: 'Poster image URL' } },
  { name: 'title', type: 'string', default: '-', description: { zh: '视频标题', en: 'Video title' } },
  { name: 'description', type: 'string', default: '-', description: { zh: '视频描述', en: 'Video description' } },
  { name: 'href', type: 'string', default: '-', description: { zh: '外部链接 URL', en: 'External link URL' } },
  { name: 'domain', type: 'string', default: '-', description: { zh: '显示的来源域名', en: 'Displayed source domain' } },
  { name: 'durationMs', type: 'number', default: '-', description: { zh: '视频时长（毫秒）', en: 'Video duration in milliseconds' } },
  { name: 'ratio', type: "'auto' | '1:1' | '4:3' | '16:9' | '9:16'", default: 'auto', description: { zh: '宽高比', en: 'Aspect ratio' } },
  { name: 'fit', type: "'cover' | 'contain'", default: 'cover', description: { zh: '视频填充模式', en: 'Video fit mode' } },
  { name: 'createdAt', type: 'string', default: '-', description: { zh: '创建时间（ISO 日期时间）', en: 'Creation time (ISO datetime)' } },
  { name: 'locale', type: 'string', default: '-', description: { zh: '区域设置', en: 'Locale' } },
  { name: 'source', type: 'Source', default: '-', description: { zh: '视频来源信息', en: 'Video source information' } },
  { name: 'css', type: 'object', default: '-', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
  { name: 'autoPlay', type: 'boolean', default: 'false', description: { zh: '是否自动播放', en: 'Whether to autoplay' } },
]

const interactiveStateZh = {
  src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  assetId: 'demo-video-interactive',
  title: '交互式视频',
  description: '调整下方属性查看不同状态',
  ratio: '16:9' as const,
  fit: 'cover' as const,
  autoPlay: false,
};

const interactiveStateEn = {
  src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  assetId: 'demo-video-interactive',
  title: 'Interactive Video',
  description: 'Adjust the properties to see different states',
  ratio: '16:9' as const,
  fit: 'cover' as const,
  autoPlay: false,
};

const interactiveState = reactive({ ...interactiveStateZh });

watch(currentLocale, () => { Object.assign(interactiveState, currentLocale.value === 'zh-CN' ? interactiveStateZh : interactiveStateEn); });

const eventLog = ref<string[]>([]);
const navigateLog = ref<string[]>([]);

function handleMediaEvent(type: string) {
  const timestamp = new Date().toLocaleTimeString();
  eventLog.value.unshift(`[${timestamp}] ${type}`);
  if (eventLog.value.length > 10) {
    eventLog.value.pop();
  }
}

function handleNavigate(href: string) {
  const timestamp = new Date().toLocaleTimeString();
  navigateLog.value.unshift(`[${timestamp}] Navigated to: ${href}`);
  if (navigateLog.value.length > 5) {
    navigateLog.value.pop();
  }
}

function clearEvents() {
  eventLog.value = [];
}

function clearNavigateLog() {
  navigateLog.value = [];
}

</script>

<template>
  <Story title="Video/All Variants">
    <Variant :title="basic">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-lg">
        <video
          id="video-basic"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          asset-id="demo-video-1"
        />
      </div>
    </Variant>

    <Variant :title="withPoster">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-lg">
        <video
          id="video-poster"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          asset-id="demo-video-2"
          poster="https://picsum.photos/640/360?random=60"
          :title="elephantsDreamTitle"
        />
      </div>
    </Variant>

    <Variant :title="withDescription">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-lg">
        <video
          id="video-description"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          asset-id="demo-video-3"
          :title="biggerBlazesTitle"
          :description="biggerBlazesDesc"
          poster="https://picsum.photos/640/360?random=61"
          :duration-ms="15000"
        />
      </div>
    </Variant>

    <Variant :title="withNavigation">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-lg">
        <video
          id="video-nav"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
          asset-id="demo-video-nav"
          :title="clickToOpenTitle"
          :description="clickToOpenDesc"
          href="https://example.com/video"
          domain="example.com"
          :duration-ms="30000"
          @navigate="handleNavigate"
        />
      </div>
    </Variant>

    <Variant :title="squareFormat">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <video
          id="video-square"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
          asset-id="demo-video-4"
          :title="squareVideoTitle"
          ratio="1:1"
        />
      </div>
    </Variant>

    <Variant :title="verticalFormat">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-xs">
        <video
          id="video-vertical"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
          asset-id="demo-video-5"
          :title="verticalVideoTitle"
          ratio="9:16"
        />
      </div>
    </Variant>

    <Variant :title="withEventLogging" auto-props-disabled>
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="flex flex-col gap-4">
        <div class="w-full max-w-lg">
          <video
            id="video-events"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            asset-id="demo-video-events"
            :title="eventVideoTitle"
            :description="eventVideoDesc"
            poster="https://picsum.photos/640/360?random=70"
            :duration-ms="596000"
            @media-event="handleMediaEvent"
          />
        </div>

        <div class="w-full max-w-lg rounded-lg border border-border bg-card p-4">
          <div class="mb-2 flex items-center justify-between">
            <h4 class="text-sm font-semibold">{{ eventLogHeading }}</h4>
            <button
              type="button"
              class="text-xs text-muted-foreground hover:text-foreground"
              @click="clearEvents"
            >
              {{ clearButton }}
            </button>
          </div>
          <div class="h-24 overflow-y-auto rounded bg-muted/50 p-2 font-mono text-xs">
            <div v-if="eventLog.length === 0" class="text-muted-foreground italic">
              {{ noEventsYet }}
            </div>
            <div v-for="(event, index) in eventLog" :key="index" class="py-0.5">
              {{ event }}
            </div>
          </div>
        </div>
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="flex flex-col gap-4">
        <div class="w-full max-w-lg">
          <video
            id="video-interactive"
            v-bind="interactiveState"
            @media-event="handleMediaEvent"
            @navigate="handleNavigate"
          />
        </div>

        <div class="w-full max-w-lg space-y-3 rounded-lg border border-border bg-card p-4">
          <h4 class="text-sm font-semibold">{{ controlsHeading }}</h4>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm">
              <span class="w-20">{{ formTitle }}</span>
              <input
                v-model="interactiveState.title"
                type="text"
                class="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <span class="w-20">{{ formDesc }}</span>
              <input
                v-model="interactiveState.description"
                type="text"
                class="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <span class="w-20">{{ formRatio }}</span>
              <select
                v-model="interactiveState.ratio"
                class="rounded border border-border bg-background px-2 py-1 text-sm"
              >
                <option value="16:9">16:9</option>
                <option value="4:3">4:3</option>
                <option value="1:1">1:1</option>
                <option value="9:16">9:16</option>
              </select>
            </label>
            <label class="flex items-center gap-2 text-sm">
              <span class="w-20">{{ formAutoPlay }}</span>
              <input
                v-model="interactiveState.autoPlay"
                type="checkbox"
              />
            </label>
          </div>
        </div>

        <div v-if="navigateLog.length > 0" class="w-full max-w-lg rounded-lg border border-border bg-card p-4">
          <div class="mb-2 flex items-center justify-between">
            <h4 class="text-sm font-semibold">{{ navLogHeading }}</h4>
            <button
              type="button"
              class="text-xs text-muted-foreground hover:text-foreground"
              @click="clearNavigateLog"
            >
              {{ clearButton }}
            </button>
          </div>
          <div class="h-20 overflow-y-auto rounded bg-muted/50 p-2 font-mono text-xs">
            <div v-for="(log, index) in navigateLog" :key="index" class="py-0.5">
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </Variant>

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ componentPropsTitle }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ prop.default || '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
