<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Audio } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import messages from './i18n';

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

const audioBasicTitle = useStoryLocale('content.audioBasicTitle', messages)
const audioBasicDescription = useStoryLocale('content.audioBasicDescription', messages)
const audioCompactTitle = useStoryLocale('content.audioCompactTitle', messages)
const audioCompactDescription = useStoryLocale('content.audioCompactDescription', messages)
const audioOnlyTitle = useStoryLocale('content.audioOnlyTitle', messages)
const audioOnlyDescription = useStoryLocale('content.audioOnlyDescription', messages)
const audioEventsTitle = useStoryLocale('content.audioEventsTitle', messages)
const audioEventsDescription = useStoryLocale('content.audioEventsDescription', messages)
const audioEventLogHeading = useStoryLocale('content.audioEventLogHeading', messages)
const audioClearButton = useStoryLocale('content.audioClearButton', messages)
const audioEmptyState = useStoryLocale('content.audioEmptyState', messages)
const audioControlsHeading = useStoryLocale('content.audioControlsHeading', messages)
const audioFormTitle = useStoryLocale('content.audioFormTitle', messages)
const audioFormDescription = useStoryLocale('content.audioFormDescription', messages)
const audioFormVariant = useStoryLocale('content.audioFormVariant', messages)
const audioVariantFull = useStoryLocale('content.audioVariantFull', messages)
const audioVariantCompact = useStoryLocale('content.audioVariantCompact', messages)
const basic = useStoryLocale('content.basic', messages)
const withMetadata = useStoryLocale('data.withMeta', messages)
const compactVariant = useStoryLocale('content.compactVariant', messages)
const compactWithoutArtwork = useStoryLocale('content.compactWithoutArtwork', messages)
const withEventLogging = useStoryLocale('content.withEventLogging', messages)
const interactive = useStoryLocale('content.interactive', messages)
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
