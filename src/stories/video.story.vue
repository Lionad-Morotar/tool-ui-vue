<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Video } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from './_shared/use-story-locale';

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

const basic = useStoryLocale({ zh: '基础', en: 'Basic' })
const withPoster = useStoryLocale({ zh: '含封面', en: 'With Poster' })
const withDescription = useStoryLocale({ zh: '含描述', en: 'With Description' })
const withNavigation = useStoryLocale({ zh: '含导航', en: 'With Navigation' })
const squareFormat = useStoryLocale({ zh: '方形格式', en: 'Square Format' })
const verticalFormat = useStoryLocale({ zh: '竖屏格式', en: 'Vertical Format' })
const withEventLogging = useStoryLocale({ zh: '含事件日志', en: 'With Event Logging' })
const interactive = useStoryLocale({ zh: '交互模式', en: 'Interactive' })

// Video texts
const elephantsDreamTitle = useStoryLocale({ zh: '大象之梦', en: 'Elephants Dream' })
const biggerBlazesTitle = useStoryLocale({ zh: '更大火焰', en: 'For Bigger Blazes' })
const biggerBlazesDesc = useStoryLocale({ zh: '展示高质量视频播放的示例视频', en: 'A sample video demonstrating high-quality video playback' })
const clickToOpenTitle = useStoryLocale({ zh: '点击打开', en: 'Click to Open' })
const clickToOpenDesc = useStoryLocale({ zh: '这个视频包含外部链接', en: 'This video has an external link' })
const squareVideoTitle = useStoryLocale({ zh: '方形视频', en: 'Square Video' })
const verticalVideoTitle = useStoryLocale({ zh: '竖屏视频', en: 'Vertical Video' })
const eventVideoTitle = useStoryLocale({ zh: '事件日志演示', en: 'Event Logging Demo' })
const eventVideoDesc = useStoryLocale({ zh: '播放/暂停/静音查看事件', en: 'Play/pause/mute to see events' })
const eventLogHeading = useStoryLocale({ zh: '事件日志', en: 'Event Log' })
const clearButton = useStoryLocale({ zh: '清除', en: 'Clear' })
const noEventsYet = useStoryLocale({ zh: '暂无事件，与视频交互可查看事件', en: 'No events yet. Interact with the video to see events.' })
const controlsHeading = useStoryLocale({ zh: '控制面板', en: 'Controls' })
const formTitle = useStoryLocale({ zh: '标题:', en: 'Title:' })
const formDesc = useStoryLocale({ zh: '描述:', en: 'Description:' })
const formRatio = useStoryLocale({ zh: '比例:', en: 'Ratio:' })
const formAutoPlay = useStoryLocale({ zh: '自动播放:', en: 'Auto Play:' })
const navLogHeading = useStoryLocale({ zh: '导航日志', en: 'Navigation Log' })
</script>

<template>
  <Story title="Video/All Variants">
    <Variant :title="basic">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-lg">
        <Video
          id="video-basic"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          asset-id="demo-video-1"
        />
      </div>
    </Variant>

    <Variant :title="withPoster">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-lg">
        <Video
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
        <Video
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
        <Video
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
        <Video
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
        <Video
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
          <Video
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
          <Video
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
  </Story>
</template>
