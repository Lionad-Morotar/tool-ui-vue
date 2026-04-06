<script setup lang="ts">
import { reactive, ref } from 'vue';
// Audio is used in template as <Audio> (PascalCase) to resolve to the Vue component
import { Audio } from '@lionad/vtu-components';

const interactiveState = reactive({
  title: 'Custom Audio Track',
  description: 'Adjust the properties to see different states',
  artwork: 'https://picsum.photos/200/200?random=55',
  durationMs: 245000,
  fileSizeBytes: 4.2 * 1024 * 1024,
  variant: 'full' as const,
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
</script>

<template>
  <Story title="Audio/All Variants">
    <Variant title="Basic">
      <div class="w-full max-w-md">
        <Audio
          id="audio-basic"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          asset-id="demo-audio-1"
        />
      </div>
    </Variant>

    <Variant title="With Metadata">
      <div class="w-full max-w-md">
        <Audio
          id="audio-metadata"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
          asset-id="demo-audio-2"
          title="Summer Breeze"
          description="A relaxing instrumental track"
          artwork="https://picsum.photos/200/200?random=50"
          :duration-ms="372000"
        />
      </div>
    </Variant>

    <Variant title="Compact Variant">
      <div class="w-full max-w-md">
        <Audio
          id="audio-compact"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
          asset-id="demo-audio-3"
          title="Demo Track"
          description="Compact player layout"
          artwork="https://picsum.photos/200/200?random=51"
          variant="compact"
        />
      </div>
    </Variant>

    <Variant title="Compact Without Artwork">
      <div class="w-full max-w-md">
        <Audio
          id="audio-compact-no-art"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          asset-id="demo-audio-4"
          title="Audio Only"
          description="No artwork, compact layout"
          variant="compact"
        />
      </div>
    </Variant>

    <Variant title="With Event Logging" auto-props-disabled>
      <div class="flex flex-col gap-4">
        <div class="w-full max-w-md">
          <Audio
            id="audio-events"
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            asset-id="demo-audio-events"
            title="Event Logging Demo"
            description="Play/pause to see events"
            artwork="https://picsum.photos/200/200?random=60"
            :duration-ms="245000"
            @media-event="handleMediaEvent"
          />
        </div>
        <div class="w-full max-w-md rounded-lg border border-border bg-card p-4">
          <div class="mb-2 flex items-center justify-between">
            <h4 class="text-sm font-semibold">Event Log</h4>
            <button
              type="button"
              class="text-xs text-muted-foreground hover:text-foreground"
              @click="clearEvents"
            >
              Clear
            </button>
          </div>
          <div class="h-24 overflow-y-auto rounded bg-muted/50 p-2 font-mono text-xs">
            <div v-if="eventLog.length === 0" class="text-muted-foreground italic">
              No events yet. Play the audio to see events.
            </div>
            <div v-for="(event, index) in eventLog" :key="index" class="py-0.5">
              {{ event }}
            </div>
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Interactive" auto-props-disabled>
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
          <h4 class="text-sm font-semibold">Controls</h4>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm">
              <span class="w-20">Title:</span>
              <input
                v-model="interactiveState.title"
                type="text"
                class="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <span class="w-20">Description:</span>
              <input
                v-model="interactiveState.description"
                type="text"
                class="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <span class="w-20">Variant:</span>
              <select
                v-model="interactiveState.variant"
                class="rounded border border-border bg-background px-2 py-1 text-sm"
              >
                <option value="full">Full</option>
                <option value="compact">Compact</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
