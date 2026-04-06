// GeoMap component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { GeoMapProps, GeoMapMarker, GeoMapRoute, GeoMapStyle } from '../schema';
import type { Ref, ComputedRef } from 'vue';

export type GeoMapEmit = {
  (e: 'marker-click', marker: GeoMapMarker): void;
  (e: 'route-click', route: GeoMapRoute): void;
};

export interface GeoMapState {
  LIGHT_TILE_URL: string;
  DARK_TILE_URL: string;
  inheritedTheme: Ref<'light' | 'dark'>;
  resolvedTheme: ComputedRef<'light' | 'dark'>;
  isMapReady: Ref<boolean>;
  tileUrl: ComputedRef<string>;
  mapAriaLabel: ComputedRef<string>;
  resolvedRootStyle: ComputedRef<GeoMapStyle>;
  handleMarkerClick: (marker: GeoMapMarker) => void;
  handleRouteClick: (route: GeoMapRoute) => void;
  handleReadyChange: (isReady: boolean) => void;
}

const LIGHT_TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

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

export function useGeoMap(
  props: GeoMapProps,
  emit: GeoMapEmit,
): GeoMapState {
  const inheritedTheme = ref<'light' | 'dark'>(
    getDocumentTheme() ?? getSystemTheme()
  );

  let mql: MediaQueryList | null = null;
  let observer: MutationObserver | null = null;
  let themeUpdateHandler: (() => void) | null = null;

  onMounted(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    themeUpdateHandler = () => {
      inheritedTheme.value = getDocumentTheme() ?? getSystemTheme();
    };

    mql = window.matchMedia?.('(prefers-color-scheme: dark)');
    mql?.addEventListener('change', themeUpdateHandler);

    observer = new MutationObserver(themeUpdateHandler);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
  });

  onUnmounted(() => {
    if (mql && themeUpdateHandler) {
      mql.removeEventListener('change', themeUpdateHandler);
    }
    observer?.disconnect();
    mql = null;
    observer = null;
    themeUpdateHandler = null;
  });

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

  return {
    LIGHT_TILE_URL,
    DARK_TILE_URL,
    inheritedTheme,
    resolvedTheme,
    isMapReady,
    tileUrl,
    mapAriaLabel,
    resolvedRootStyle,
    handleMarkerClick,
    handleRouteClick,
    handleReadyChange,
  };
}
