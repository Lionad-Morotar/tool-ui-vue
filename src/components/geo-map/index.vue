<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { cn } from '../../utils';
import styles from './geo-map-theme.module.css';
import GeoMapEngine from './cmpts/geo-map-engine.vue';
import type { GeoMapMarker, GeoMapProps, GeoMapRoute, GeoMapStyle } from './schema';

const LIGHT_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const DARK_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

defineOptions({ name: 'cmpt-geo-map', inheritAttrs: false })

const props = withDefaults(defineProps<GeoMapProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  'marker-click': [marker: GeoMapMarker];
  'route-click': [route: GeoMapRoute];
}>();

// Theme detection
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getDocumentTheme(): 'light' | 'dark' | null {
  if (typeof document === 'undefined') return null;

  const root = document.documentElement;
  const dataTheme = root.getAttribute('data-theme')?.toLowerCase();
  if (dataTheme === 'dark') return 'dark';
  if (dataTheme === 'light') return 'light';
  if (root.classList.contains('dark')) return 'dark';
  if (root.classList.contains('light')) return 'light';

  return null;
}

const inheritedTheme = ref<'light' | 'dark'>(
  getDocumentTheme() ?? getSystemTheme()
);

let mql: MediaQueryList | null = null;
let observer: MutationObserver | null = null;

onMounted(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const update = () => {
    inheritedTheme.value = getDocumentTheme() ?? getSystemTheme();
  };

  mql = window.matchMedia?.('(prefers-color-scheme: dark)');
  mql?.addEventListener('change', update);

  observer = new MutationObserver(update);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  });
});

onUnmounted(() => {
  if (mql) {
    mql.removeEventListener('change', () => {});
  }
  observer?.disconnect();
});

// Computed values
const resolvedTheme = computed(() => props.theme ?? inheritedTheme.value);
const isMapReady = ref(false);
const tileUrl = computed(() =>
  resolvedTheme.value === 'dark' ? DARK_TILE_URL : LIGHT_TILE_URL
);

const mapAriaLabel = computed(() => {
  if (props.title && props.description) {
    return `${props.title}. ${props.description}`;
  }
  return props.title ?? props.description ?? 'Geographic map';
});

const resolvedRootStyle = computed<GeoMapStyle>(() => ({
  '--geo-map-canvas-bg':
    resolvedTheme.value === 'dark' ? 'var(--background)' : 'var(--muted)',
  ...props.style,
}));

// Event handlers
function handleMarkerClick(marker: GeoMapMarker) {
  emit('marker-click', marker);
  props.onMarkerClick?.(marker);
}

function handleRouteClick(route: GeoMapRoute) {
  emit('route-click', route);
  props.onRouteClick?.(route);
}

function handleReadyChange(isReady: boolean) {
  isMapReady.value = isReady;
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('w-full min-w-80', styles.root, css?.root)"
    :style="resolvedRootStyle"
    data-slot="geo-map"
    :data-tool-ui-id="id"
  >
    <div
      class="relative h-[320px] w-full overflow-hidden rounded-lg border border-border bg-muted/20"
      role="region"
      :aria-label="mapAriaLabel"
    >
      <geo-map-engine
        :id="id"
        :markers="markers"
        :routes="routes"
        :clustering="clustering"
        :viewport="viewport"
        :show-zoom-control="showZoomControl ?? true"
        :tile-url="tileUrl"
        :map-aria-label="mapAriaLabel"
        :tooltip-class-name="tooltipClassName"
        :popup-class-name="popupClassName"
        @marker-click="handleMarkerClick"
        @route-click="handleRouteClick"
        @ready="handleReadyChange"
      />

      <!-- Title/Description Overlay -->
      <div
        v-if="title || description"
        :class="
          cn(
            'pointer-events-none absolute top-3 left-3 z-[900]',
            'max-w-[min(75%,22rem)] rounded-lg border border-border/70 bg-background/70 px-3 py-2',
            'shadow-sm backdrop-blur-md'
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
        v-if="!isMapReady"
        data-slot="geo-map-loading"
        class="pointer-events-none absolute inset-0 flex items-center justify-center bg-muted/30 text-muted-foreground"
      >
        <span data-slot="geo-map-loading-label">Loading map...</span>
      </div>
    </div>
  </div>
</template>
