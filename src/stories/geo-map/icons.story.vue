<script setup lang="ts">
import { GeoMap } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const withImageIconsTitle = useStoryLocale('content.withImageIconsTitle', messages)
const timesSquareLabel = useStoryLocale('content.timesSquareLabel', messages)
// i18n 无对应 key（原实现会回退渲染路径字符串），按约定硬编码英文
const centralParkLabel = 'Central Park'
const withCustomDotIconsTitle = useStoryLocale('content.withCustomDotIconsTitle', messages)
const highPriorityLabel = useStoryLocale('content.highPriorityLabel', messages)
const mediumPriorityLabel = useStoryLocale('content.mediumPriorityLabel', messages)
const lowPriorityLabel = useStoryLocale('content.lowPriorityLabel', messages)
const withImageIcons = useStoryLocale('content.withImageIcons', messages)
const withCustomDotIcons = useStoryLocale('content.withCustomDotIcons', messages)
</script>

<template>
  <Story title="GeoMap/Icons">
    <Variant :title="withImageIcons">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-image-icons"
          :title="withImageIconsTitle"
          :markers="[
            { id: '1', lat: 40.7589, lng: -73.9851, label: timesSquareLabel, icon: { type: 'image', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/300px-PNG_transparency_demonstration_1.png', width: 32, height: 32 } },
            { id: '2', lat: 40.7489, lng: -73.968, label: centralParkLabel, icon: { type: 'emoji', value: '🌳' } },
          ]"
          :viewport="{ mode: 'center', center: { lat: 40.75, lng: -73.98 }, zoom: 12 }"
        />
      </div>
    </Variant>

    <Variant :title="withCustomDotIcons">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-dot-icons"
          :title="withCustomDotIconsTitle"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: highPriorityLabel, icon: { type: 'dot', color: '#ef4444', radius: 10 } },
            { id: '2', lat: 37.7849, lng: -122.4094, label: mediumPriorityLabel, icon: { type: 'dot', color: '#f59e0b', radius: 8 } },
            { id: '3', lat: 37.7649, lng: -122.4294, label: lowPriorityLabel, icon: { type: 'dot', color: '#10b981', radius: 6 } },
          ]"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>
  </Story>
</template>
