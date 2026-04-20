<script setup lang="ts">
import { cn } from '../../core';
import {
  LMap,
  LTileLayer,
  LPolyline,
  LControlZoom,
} from '@vue-leaflet/vue-leaflet';
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  shallowRef,
} from 'vue';
import 'leaflet/dist/leaflet.css';
import GeoMapMarkerPopup from './geo-map-marker-popup.vue';
import GeoMapMarkerLayer from './geo-map-marker-layer.vue';
import GeoMapClusterLayer from './geo-map-cluster-layer.vue';
import { useGeoMapCluster } from './use-geo-map-cluster';
import { useGeoMapViewport } from './use-geo-map-viewport';
import {
  normalizeViewportState,
  areViewportStatesEqual,
  readViewportState,
  toSafeExpansionZoom,
  resolveInitialView,
  DEFAULT_VIEW_ZOOM,
} from '../utils';
import type {
  GeoMapClustering,
  GeoMapMarker,
  GeoMapRoute,
  GeoMapViewport,
} from '../schema';
import type { Map as LeafletMap } from 'leaflet';
import type * as LeafletNS from 'leaflet';

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const ROUTE_DEFAULT_COLOR = 'var(--color-primary)';
const ROUTE_DEFAULT_WEIGHT = 3;
const ROUTE_DEFAULT_OPACITY = 0.85;

const props = withDefaults(defineProps<{
  id: string;
  markers: GeoMapMarker[];
  routes?: GeoMapRoute[];
  clustering?: GeoMapClustering;
  viewport?: GeoMapViewport;
  showZoomControl: boolean;
  tileUrl: string;
  tileSubdomains?: string | string[];
  mapAriaLabel: string;
  tooltipClassName?: string;
  popupClassName?: string;
  css?: { root?: string };
}>(), {
  css: () => ({}),
});

const emit = defineEmits<{
  'marker-click': [marker: GeoMapMarker];
  'route-click': [route: GeoMapRoute];
  ready: [isReady: boolean];
}>();

// Reactive state
const leafletReady = ref(false);
const mapInstance = shallowRef<LeafletMap | null>(null);
const viewportState = ref<ReturnType<typeof readViewportState> | null>(null);
type LeafletModule = typeof LeafletNS;
const leafletModule = ref<LeafletModule | null>(null);

const leafletRuntime = computed(() => {
  if (!leafletModule.value) return null;
  return {
    divIcon: leafletModule.value.divIcon,
    latLngBounds: leafletModule.value.latLngBounds,
  };
});

const isDestroyed = ref(false);

onMounted(async () => {
  const L = await import('leaflet');
  if (isDestroyed.value) return;
  leafletModule.value = L;
  leafletReady.value = true;
  emit('ready', true);
});

onBeforeUnmount(() => {
  isDestroyed.value = true;
  resizeObserver?.disconnect();
  resizeObserver = null;
  emit('ready', false);
});

watch(() => mapInstance.value, (map) => {
  if (map) {
    const container = map.getContainer();
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', props.mapAriaLabel);
  }
});

onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && mapInstance.value) mapInstance.value.closePopup();
  };
  document.addEventListener('keydown', handleEscape);
  onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape));
});

const resolvedRoutes = computed(() => (props.routes ?? []).filter((route) => route.points.length >= 2));

const initialView = resolveInitialView(props.markers, resolvedRoutes.value, props.viewport);
const mapCenter = ref<[number, number]>(initialView.center);
const mapZoom = ref<number>(initialView.zoom);

const markerById = computed(() => {
  const map = new Map<string, GeoMapMarker>();
  props.markers.forEach((marker, index) => {
    map.set(marker.id ?? `marker-${index}`, marker);
  });
  return map;
});

const { clusterConfig, clusterIndex, clusteredFeatures } = useGeoMapCluster(
  () => props.markers, () => props.clustering, () => viewportState.value
);

const { applyViewportToMap, invalidateViewport } = useGeoMapViewport(
  () => leafletModule.value,
  () => mapCenter.value, (c) => { mapCenter.value = c; },
  () => mapZoom.value, (z) => { mapZoom.value = z; }
);

let resizeObserver: ResizeObserver | null = null;

function attachResizeObserver(container: HTMLElement) {
  resizeObserver = new ResizeObserver(() => {
    const map = mapInstance.value;
    if (!map) return;
    map.invalidateSize();
    invalidateViewport();
    if (leafletModule.value) applyViewportToMap(map, props.viewport, props.markers, resolvedRoutes.value);
  });
  resizeObserver.observe(container);
}

function handleMapReady(map: LeafletMap) {
  if (isDestroyed.value) return;
  const originalRemoveLayer = map.removeLayer.bind(map);
  (map as { removeLayer(layer: LeafletNS.Layer | null | undefined): LeafletMap }).removeLayer = function(layer) {
    if (layer == null) return map;
    return originalRemoveLayer(layer);
  };
  mapInstance.value = map;
  attachResizeObserver(map.getContainer());
  if (leafletModule.value) applyViewportToMap(map, props.viewport, props.markers, resolvedRoutes.value);
  viewportState.value = readViewportState(map);
}

function handleViewportChange() {
  if (isDestroyed.value || !mapInstance.value) return;
  const normalized = normalizeViewportState(readViewportState(mapInstance.value));
  if (!areViewportStatesEqual(viewportState.value, normalized)) viewportState.value = normalized;
}

watch(
  () => [props.viewport, props.markers, resolvedRoutes.value, mapInstance.value, leafletModule.value] as const,
  async ([viewport, markers, routes]) => {
    if (isDestroyed.value || !mapInstance.value || !leafletModule.value) return;
    await nextTick();
    const map = mapInstance.value;
    if (map) applyViewportToMap(map, viewport, markers, routes);
  },
  { immediate: true, deep: true }
);

function handleClusterClick(lat: number, lng: number, clusterId: number) {
  if (!mapInstance.value || !clusterIndex.value) return;

  const expansionZoom = toSafeExpansionZoom(
    clusterIndex.value.getClusterExpansionZoom(clusterId),
    {
      maxZoom: 22,
      fallback: (viewportState.value?.zoom ?? DEFAULT_VIEW_ZOOM) + 2,
    }
  );
  mapInstance.value.flyTo([lat, lng], expansionZoom);
}

function handleMarkerClick(marker: GeoMapMarker) {
  emit('marker-click', marker);
}

function handleRouteClick(route: GeoMapRoute) {
  emit('route-click', route);
}
</script>

<template>
  <div v-if="!leafletReady" :class="cn('h-full w-full', css?.root)" />
  <l-map
    v-else
    :center="mapCenter"
    :zoom="mapZoom"
    :options="{ zoomControl: false }"
    :class="cn('h-full w-full', css?.root)"
    :use-global-leaflet="false"
    @ready="handleMapReady"
    @moveend="handleViewportChange"
    @zoomend="handleViewportChange"
  >
    <l-tile-layer :attribution="TILE_ATTRIBUTION" :url="tileUrl" :subdomains="tileSubdomains" />
    <l-control-zoom v-if="showZoomControl" position="topright" />

    <!-- Routes -->
    <l-polyline
      v-for="(route, routeIndex) in resolvedRoutes"
      :key="route.id ?? `${id}-route-${routeIndex}`"
      :lat-lngs="route.points.map((p) => [p.lat, p.lng])"
      :path-options="{
        color: route.color ?? ROUTE_DEFAULT_COLOR,
        weight: route.weight ?? ROUTE_DEFAULT_WEIGHT,
        opacity: route.opacity ?? ROUTE_DEFAULT_OPACITY,
        dashArray: route.dashArray,
      }"
      @click="handleRouteClick(route)"
    >
      <geo-map-marker-popup
        :tooltip="route.tooltip ?? 'hover'"
        :label="route.label"
        :description="route.description"
        :tooltip-class-name="tooltipClassName"
        :popup-class-name="popupClassName"
      />
    </l-polyline>

    <!-- Clustered Markers -->
    <geo-map-cluster-layer
      v-if="clusterConfig.enabled && clusterIndex && viewportState"
      :features="clusteredFeatures"
      :marker-by-id="markerById"
      :leaflet-runtime="leafletRuntime"
      :tooltip-class-name="tooltipClassName"
      :popup-class-name="popupClassName"
      :id="id"
      @marker-click="handleMarkerClick"
      @cluster-click="handleClusterClick"
    />

    <!-- Non-clustered Markers -->
    <geo-map-marker-layer
      v-else
      :markers="markers"
      :marker-by-id="markerById"
      :leaflet-runtime="leafletRuntime"
      :tooltip-class-name="tooltipClassName"
      :popup-class-name="popupClassName"
      :id="id"
      @marker-click="handleMarkerClick"
    />
  </l-map>
</template>
