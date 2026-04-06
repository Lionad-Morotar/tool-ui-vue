<script setup lang="ts">
import { reactive, ref } from 'vue';
// Video is used in template as <Video> (PascalCase) to resolve to the Vue component
import { Video } from '@lionad/vtu-components';

const interactiveState = reactive({
  src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  assetId: 'demo-video-interactive',
  title: 'Interactive Video',
  description: 'Adjust the properties to see different states',
  ratio: '16:9' as const,
  fit: 'cover' as const,
  autoPlay: false,
});

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
    <Variant title="Basic">
      <div class="w-full max-w-lg">
        <Video
          id="video-basic"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          asset-id="demo-video-1"
        />
      </div>
    </Variant>

    <Variant title="With Poster">
      <div class="w-full max-w-lg">
        <Video
          id="video-poster"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          asset-id="demo-video-2"
          poster="https://picsum.photos/640/360?random=60"
          title="Elephants Dream"
        />
      </div>
    </Variant>

    <Variant title="With Description">
      <div class="w-full max-w-lg">
        <Video
          id="video-description"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          asset-id="demo-video-3"
          title="For Bigger Blazes"
          description="A sample video demonstrating high-quality video playback"
          poster="https://picsum.photos/640/360?random=61"
          :duration-ms="15000"
        />
      </div>
    </Variant>

    <Variant title="With Navigation">
      <div class="w-full max-w-lg">
        <Video
          id="video-nav"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
          asset-id="demo-video-nav"
          title="Click to Open"
          description="This video has an external link"
          href="https://example.com/video"
          domain="example.com"
          :duration-ms="30000"
          @navigate="handleNavigate"
        />
      </div>
    </Variant>

    <Variant title="Square Format">
      <div class="w-full max-w-sm">
        <Video
          id="video-square"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
          asset-id="demo-video-4"
          title="Square Video"
          ratio="1:1"
        />
      </div>
    </Variant>

    <Variant title="Vertical Format">
      <div class="w-full max-w-xs">
        <Video
          id="video-vertical"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
          asset-id="demo-video-5"
          title="Vertical Video"
          ratio="9:16"
        />
      </div>
    </Variant>

    <Variant title="With Event Logging" auto-props-disabled>
      <div class="flex flex-col gap-4">
        <div class="w-full max-w-lg">
          <Video
            id="video-events"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            asset-id="demo-video-events"
            title="Event Logging Demo"
            description="Play/pause/mute to see events"
            poster="https://picsum.photos/640/360?random=70"
            :duration-ms="596000"
            @media-event="handleMediaEvent"
          />
        </div>

        <div class="w-full max-w-lg rounded-lg border border-border bg-card p-4">
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
              No events yet. Interact with the video to see events.
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
        <div class="w-full max-w-lg">
          <Video
            id="video-interactive"
            v-bind="interactiveState"
            @media-event="handleMediaEvent"
            @navigate="handleNavigate"
          />
        </div>

        <div class="w-full max-w-lg space-y-3 rounded-lg border border-border bg-card p-4">
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
              <span class="w-20">Ratio:</span>
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
              <span class="w-20">Auto Play:</span>
              <input
                v-model="interactiveState.autoPlay"
                type="checkbox"
              />
            </label>
          </div>
        </div>

        <div v-if="navigateLog.length > 0" class="w-full max-w-lg rounded-lg border border-border bg-card p-4">
          <div class="mb-2 flex items-center justify-between">
            <h4 class="text-sm font-semibold">Navigation Log</h4>
            <button
              type="button"
              class="text-xs text-muted-foreground hover:text-foreground"
              @click="clearNavigateLog"
            >
              Clear
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
