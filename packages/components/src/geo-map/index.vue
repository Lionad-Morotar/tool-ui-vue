<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { useI18n } from '@lionad/vtu-core/i18n';
import { reactive } from 'vue';
import GeoMapEngine from './cmpts/geo-map-engine.vue';
import styles from './geo-map-theme.module.css';
import { useGeoMap } from './states';
import type { GeoMapProps, GeoMapMarker, GeoMapRoute } from './schema';

defineOptions({ name: 'CmptGeoMap', inheritAttrs: false })

const props = withDefaults(defineProps<GeoMapProps>(), {
  css: () => ({}),
})

const emit = defineEmits<{
  'marker-click': [marker: GeoMapMarker];
  'route-click': [route: GeoMapRoute];
}>();

// All business logic delegated to states layer
const state = reactive(useGeoMap(props, emit));
const { t } = useI18n();
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('w-full min-w-80', styles.root, css?.root)"
    :style="state.resolvedRootStyle"
    data-slot="geo-map"
    :data-tool-ui-id="id"
  >
    <div
      class="relative h-[320px] w-full overflow-hidden rounded-lg border border-border bg-muted/20"
      role="region"
      :aria-label="state.mapAriaLabel"
    >
      <geo-map-engine
        :id="id"
        :markers="markers"
        :routes="routes"
        :clustering="clustering"
        :viewport="viewport"
        :show-zoom-control="showZoomControl ?? true"
        :tile-url="state.tileUrl"
        :map-aria-label="state.mapAriaLabel"
        :tooltip-class-name="tooltipClassName"
        :popup-class-name="popupClassName"
        :css="css?.canvas"
        @marker-click="state.handleMarkerClick"
        @route-click="state.handleRouteClick"
        @ready="state.handleReadyChange"
      />

      <!-- Title/Description Overlay -->
      <div
        v-if="title || description"
        :class="
          cn(
            'pointer-events-none absolute top-3 left-3 z-[900]',
            'max-w-[min(75%,22rem)] rounded-lg border border-border/70 bg-background/70 px-3 py-2',
            'shadow-sm backdrop-blur-md',
            css?.title
          )
        "
      >
        <p
          v-if="title"
          class="text-sm leading-tight font-semibold text-foreground"
        >
          {{ title }}
        </p>
        <p
          v-if="description"
          class="mt-1 text-xs leading-snug text-muted-foreground"
        >
          {{ description }}
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="!state.isMapReady"
        data-slot="geo-map-loading"
        :class="cn('pointer-events-none absolute inset-0 flex items-center justify-center bg-muted/30 text-muted-foreground', css?.loading)"
      >
        <span data-slot="geo-map-loading-label">{{ t('geoMap.loadingMap') }}</span>
      </div>
    </div>
  </div>
</template>
