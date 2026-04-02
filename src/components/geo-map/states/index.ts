// GeoMap component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue';
import type { GeoMapProps, GeoMapMarker, GeoMapRoute, GeoMapStyle } from '../schema';

export interface UseGeoMapOptions extends GeoMapProps {
  emit: {
    (e: 'marker-click', marker: GeoMapMarker): void;
    (e: 'route-click', route: GeoMapRoute): void;
  };
}

export interface GeoMapState {
  LIGHT_TILE_URL: string;
  DARK_TILE_URL: string;
  inheritedTheme: 'light' | 'dark';
  resolvedTheme: 'light' | 'dark';
  isMapReady: Ref<boolean>;
  tileUrl: string;
  mapAriaLabel: string;
  resolvedRootStyle: GeoMapStyle;
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

export function useGeoMap(options: UseGeoMapOptions): GeoMapState {
  const { theme, title, description, style, onMarkerClick, onRouteClick } = options;

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

  const resolvedTheme = computed(() => theme ?? inheritedTheme.value);
  const isMapReady = ref(false);
  const tileUrl = computed(() =>
    resolvedTheme.value === 'dark' ? DARK_TILE_URL : LIGHT_TILE_URL
  );

  const mapAriaLabel = computed(() => {
    if (title && description) {
      return `${title}. ${description}`;
    }
    return title ?? description ?? 'Geographic map';
  });

  const resolvedRootStyle = computed<GeoMapStyle>(() => ({
    '--geo-map-canvas-bg':
      resolvedTheme.value === 'dark' ? 'var(--background)' : 'var(--muted)',
    ...style,
  }));

  function handleMarkerClick(marker: GeoMapMarker) {
    options.emit('marker-click', marker);
    onMarkerClick?.(marker);
  }

  function handleRouteClick(route: GeoMapRoute) {
    options.emit('route-click', route);
    onRouteClick?.(route);
  }

  function handleReadyChange(isReady: boolean) {
    isMapReady.value = isReady;
  }

  return {
    LIGHT_TILE_URL,
    DARK_TILE_URL,
    inheritedTheme: inheritedTheme.value,
    resolvedTheme: resolvedTheme.value,
    isMapReady,
    tileUrl: tileUrl.value,
    mapAriaLabel: mapAriaLabel.value,
    resolvedRootStyle: resolvedRootStyle.value,
    handleMarkerClick,
    handleRouteClick,
    handleReadyChange,
  };
}
