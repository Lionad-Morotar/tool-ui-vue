<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Audio } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from './_shared/use-story-locale';

const interactiveStateZh = {
  title: '自定义音频轨道',
  description: '调整下方属性查看不同状态',
  artwork: 'https://picsum.photos/200/200?random=55',
  durationMs: 245000,
  fileSizeBytes: 4.2 * 1024 * 1024,
  variant: 'full' as const,
};

const interactiveStateEn = {
  title: 'Custom Audio Track',
  description: 'Adjust the properties to see different states',
  artwork: 'https://picsum.photos/200/200?random=55',
  durationMs: 245000,
  fileSizeBytes: 4.2 * 1024 * 1024,
  variant: 'full' as const,
};

const interactiveState = reactive({ ...interactiveStateZh });

watch(currentLocale, () => {
  const source = currentLocale.value === 'zh-CN' ? interactiveStateZh : interactiveStateEn;
  Object.assign(interactiveState, source);
});

const eventLog = ref<string[]>([]);

function handleMediaEvent(type: string) {
  const timestamp = new Date().toLocaleTimeString();
  eventLog.value.unshift(`[${timestamp}] ${type}`);
  // Keep only last 10 events
  if (eventLog.value.length > 10) {
    eventLog.value.pop();
  }
}

function clearEvents() {
  eventLog.value = [];
}

const audioBasicTitle = useStoryLocale({ zh: '夏日微风', en: 'Summer Breeze' })
const audioBasicDescription = useStoryLocale({ zh: '一首放松的轻音乐', en: 'A relaxing instrumental track' })
const audioCompactTitle = useStoryLocale({ zh: '演示曲目', en: 'Demo Track' })
const audioCompactDescription = useStoryLocale({ zh: '紧凑播放器布局', en: 'Compact player layout' })
const audioOnlyTitle = useStoryLocale({ zh: '纯音频', en: 'Audio Only' })
const audioOnlyDescription = useStoryLocale({ zh: '无封面，紧凑布局', en: 'No artwork, compact layout' })
const audioEventsTitle = useStoryLocale({ zh: '事件日志演示', en: 'Event Logging Demo' })
const audioEventsDescription = useStoryLocale({ zh: '播放/暂停查看事件', en: 'Play/pause to see events' })
const audioEventLogHeading = useStoryLocale({ zh: '事件日志', en: 'Event Log' })
const audioClearButton = useStoryLocale({ zh: '清除', en: 'Clear' })
const audioEmptyState = useStoryLocale({ zh: '暂无事件，播放音频可查看事件', en: 'No events yet. Play the audio to see events.' })
const audioControlsHeading = useStoryLocale({ zh: '控制面板', en: 'Controls' })
const audioFormTitle = useStoryLocale({ zh: '标题:', en: 'Title:' })
const audioFormDescription = useStoryLocale({ zh: '描述:', en: 'Description:' })
const audioFormVariant = useStoryLocale({ zh: '变体:', en: 'Variant:' })
const audioVariantFull = useStoryLocale({ zh: '完整', en: 'Full' })
const audioVariantCompact = useStoryLocale({ zh: '紧凑', en: 'Compact' })
const basic = useStoryLocale({ zh: '基础', en: 'Basic' })
const withMetadata = useStoryLocale({ zh: '含元数据', en: 'With Metadata' })
const compactVariant = useStoryLocale({ zh: '紧凑变体', en: 'Compact Variant' })
const compactWithoutArtwork = useStoryLocale({ zh: '无封面紧凑', en: 'Compact Without Artwork' })
const withEventLogging = useStoryLocale({ zh: '含事件日志', en: 'With Event Logging' })
const interactive = useStoryLocale({ zh: '交互模式', en: 'Interactive' })
</script>

<template>
  <Story title="Audio/All Variants">
    <Variant :title="basic">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <Audio
          id="audio-basic"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          asset-id="demo-audio-1"
        />
      </div>
    </Variant>

    <Variant :title="withMetadata">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <Audio
          id="audio-metadata"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
          asset-id="demo-audio-2"
          :title="audioBasicTitle"
          :description="audioBasicDescription"
          artwork="https://picsum.photos/200/200?random=50"
          :duration-ms="372000"
        />
      </div>
    </Variant>

    <Variant :title="compactVariant">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <Audio
          id="audio-compact"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
          asset-id="demo-audio-3"
          :title="audioCompactTitle"
          :description="audioCompactDescription"
          artwork="https://picsum.photos/200/200?random=51"
          variant="compact"
        />
      </div>
    </Variant>

    <Variant :title="compactWithoutArtwork">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <Audio
          id="audio-compact-no-art"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          asset-id="demo-audio-4"
          :title="audioOnlyTitle"
          :description="audioOnlyDescription"
          variant="compact"
        />
      </div>
    </Variant>

    <Variant :title="withEventLogging" auto-props-disabled>
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="flex flex-col gap-4">
        <div class="w-full max-w-md">
          <Audio
            id="audio-events"
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            asset-id="demo-audio-events"
            :title="audioEventsTitle"
            :description="audioEventsDescription"
            artwork="https://picsum.photos/200/200?random=60"
            :duration-ms="245000"
            @media-event="handleMediaEvent"
          />
        </div>
        <div class="w-full max-w-md rounded-lg border border-border bg-card p-4">
          <div class="mb-2 flex items-center justify-between">
            <h4 class="text-sm font-semibold">{{ audioEventLogHeading }}</h4>
            <button
              type="button"
              class="text-xs text-muted-foreground hover:text-foreground"
              @click="clearEvents"
            >
              {{ audioClearButton }}
            </button>
          </div>
          <div class="h-24 overflow-y-auto rounded bg-muted/50 p-2 font-mono text-xs">
            <div v-if="eventLog.length === 0" class="text-muted-foreground italic">
              {{ audioEmptyState }}
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
        <div class="w-full max-w-md">
          <Audio
            id="audio-interactive"
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            asset-id="demo-audio-interactive"
            v-bind="interactiveState"
          />
        </div>
        <div class="w-full max-w-md space-y-3 rounded-lg border border-border bg-card p-4">
          <h4 class="text-sm font-semibold">{{ audioControlsHeading }}</h4>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm">
              <span class="w-20">{{ audioFormTitle }}</span>
              <input
                v-model="interactiveState.title"
                type="text"
                class="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <span class="w-20">{{ audioFormDescription }}</span>
              <input
                v-model="interactiveState.description"
                type="text"
                class="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <span class="w-20">{{ audioFormVariant }}</span>
              <select
                v-model="interactiveState.variant"
                class="rounded border border-border bg-background px-2 py-1 text-sm"
              >
                <option value="full">{{ audioVariantFull }}</option>
                <option value="compact">{{ audioVariantCompact }}</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
