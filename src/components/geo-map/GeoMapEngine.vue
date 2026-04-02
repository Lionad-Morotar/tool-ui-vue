<script setup lang="ts">
import {
  LMap,
  LTileLayer,
  LMarker,
  LCircleMarker,
  LPolyline,
  LControlZoom,
} from '@vue-leaflet/vue-leaflet';
import Supercluster from 'supercluster';
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue';
import 'leaflet/dist/leaflet.css';
import { createClusterIcon, resolveMarkerIcon } from './geo-map-icons';
import GeoMapOverlays from './GeoMapOverlays.vue';
import type {
  GeoMapClustering,
  GeoMapMarker,
  GeoMapRoute,
  GeoMapViewport,
} from './schema';
import type { Map as LeafletMap, Icon as LeafletIcon } from 'leaflet';
import type * as LeafletNS from 'leaflet';

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const ROUTE_DEFAULT_COLOR = 'var(--primary)';
const ROUTE_DEFAULT_WEIGHT = 3;
const ROUTE_DEFAULT_OPACITY = 0.85;

const CLUSTER_RADIUS_DEFAULT = 60;
const CLUSTER_MAX_ZOOM_DEFAULT = 16;
const CLUSTER_MIN_POINTS_DEFAULT = 2;

const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_VIEW_ZOOM = 2;
const SINGLE_LOCATION_ZOOM = 13;
const DEFAULT_VIEWPORT_PADDING = 32;

type GeoMapBbox = [west: number, south: number, east: number, north: number];
type GeoMapLatLng = [lat: number, lng: number];

type MarkerClusterPointProperties = {
  cluster?: boolean;
  cluster_id?: number;
  point_count?: number;
  markerId?: string;
  marker?: GeoMapMarker;
};

type MapViewportState = {
  bbox: GeoMapBbox;
  zoom: number;
};

const props = defineProps<{
  id: string;
  markers: GeoMapMarker[];
  routes?: GeoMapRoute[];
  clustering?: GeoMapClustering;
  viewport?: GeoMapViewport;
  showZoomControl: boolean;
  tileUrl: string;
  mapAriaLabel: string;
  tooltipClassName?: string;
  popupClassName?: string;
}>();

const emit = defineEmits<{
  'marker-click': [marker: GeoMapMarker];
  'route-click': [route: GeoMapRoute];
  ready: [isReady: boolean];
}>();

// Reactive state
const leafletReady = ref(false);
const mapInstance = ref<LeafletMap | null>(null);
const viewportState = ref<MapViewportState | null>(null);
type LeafletModule = typeof LeafletNS;
const leafletModule = ref<LeafletModule | null>(null);

// Leaflet runtime computed from module
const leafletRuntime = computed(() => {
  if (!leafletModule.value) return null;
  return {
    divIcon: leafletModule.value.divIcon,
    latLngBounds: leafletModule.value.latLngBounds,
  };
});

// Load Leaflet dynamically
onMounted(async () => {
  const L = await import('leaflet');
  leafletModule.value = L;
  leafletReady.value = true;
  emit('ready', true);
});

onUnmounted(() => {
  emit('ready', false);
});

// Watch for map instance changes to set aria-label
watch(
  () => mapInstance.value,
  (map) => {
    if (map) {
      const container = map.getContainer();
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', props.mapAriaLabel);
    }
  }
);

// Escape key handler
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && mapInstance.value) {
      mapInstance.value.closePopup();
    }
  };
  document.addEventListener('keydown', handleEscape);
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape);
  });
});

// Utility functions
function roundCoordinate(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function normalizeViewportState(state: MapViewportState): MapViewportState {
  return {
    bbox: [
      roundCoordinate(state.bbox[0]),
      roundCoordinate(state.bbox[1]),
      roundCoordinate(state.bbox[2]),
      roundCoordinate(state.bbox[3]),
    ],
    zoom: state.zoom,
  };
}

function areViewportStatesEqual(
  a: MapViewportState | null,
  b: MapViewportState
): boolean {
  if (!a) return false;
  return (
    a.zoom === b.zoom &&
    a.bbox[0] === b.bbox[0] &&
    a.bbox[1] === b.bbox[1] &&
    a.bbox[2] === b.bbox[2] &&
    a.bbox[3] === b.bbox[3]
  );
}

function serializeFitPoints(points: [number, number][]): string {
  return points
    .map(([lat, lng]) => `${roundCoordinate(lat)},${roundCoordinate(lng)}`)
    .join('|');
}

function readViewportState(map: LeafletMap): MapViewportState {
  const bounds = map.getBounds();
  return normalizeViewportState({
    bbox: [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ],
    zoom: Math.round(map.getZoom()),
  });
}

function isValidLatLng(lat: number | undefined, lng: number | undefined): lat is number {
  return typeof lat === 'number' && typeof lng === 'number' &&
    Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function collectFitPoints(
  markers: GeoMapMarker[],
  routes: GeoMapRoute[],
  target: 'markers' | 'routes' | 'all'
): GeoMapLatLng[] {
  const markerPoints =
    target === 'markers' || target === 'all'
      ? markers
          .filter((marker) => isValidLatLng(marker.lat, marker.lng))
          .map((marker) => [marker.lat, marker.lng] as GeoMapLatLng)
      : [];

  const routePoints =
    target === 'routes' || target === 'all'
      ? routes.flatMap((route) =>
          route.points
            .filter((point) => isValidLatLng(point.lat, point.lng))
            .map((point) => [point.lat, point.lng] as GeoMapLatLng)
        )
      : [];

  return [...markerPoints, ...routePoints];
}

function resolveFitPointsWithFallback(
  markers: GeoMapMarker[],
  routes: GeoMapRoute[],
  target: 'markers' | 'routes' | 'all'
): GeoMapLatLng[] {
  const selected = collectFitPoints(markers, routes, target);
  if (selected.length > 0) return selected;
  if (target !== 'markers') return collectFitPoints(markers, routes, 'markers');
  return [];
}

function splitDatelineBbox(bbox: GeoMapBbox): GeoMapBbox[] {
  const [west, south, east, north] = bbox;
  if (west <= east) return [bbox];
  return [
    [west, south, 180, north],
    [-180, south, east, north],
  ];
}

function toSafeExpansionZoom(
  zoom: number,
  options?: { minZoom?: number; maxZoom?: number; fallback?: number }
): number {
  const minZoom = options?.minZoom ?? 1;
  const maxZoom = options?.maxZoom ?? 22;
  const fallback = options?.fallback ?? 2;

  if (!Number.isFinite(zoom)) return fallback;
  return Math.min(maxZoom, Math.max(minZoom, Math.round(zoom)));
}

function resolveInitialView(
  markers: GeoMapMarker[],
  routes: GeoMapRoute[],
  viewport: GeoMapViewport | undefined
): { center: [number, number]; zoom: number } {
  if (viewport?.mode === 'center') {
    return {
      center: [viewport.center.lat, viewport.center.lng],
      zoom: viewport.zoom,
    };
  }

  const fitTarget = viewport?.target ?? 'all';
  const fitPoints = resolveFitPointsWithFallback(markers, routes, fitTarget);

  if (fitPoints.length === 1) {
    return {
      center: [fitPoints[0][0], fitPoints[0][1]],
      zoom: viewport?.maxZoom
        ? Math.min(SINGLE_LOCATION_ZOOM, viewport.maxZoom)
        : SINGLE_LOCATION_ZOOM,
    };
  }

  return { center: DEFAULT_CENTER, zoom: DEFAULT_VIEW_ZOOM };
}

function getClusterFeatureKey(
  feature: GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>
): string {
  const properties = feature.properties ?? {};

  if (properties.cluster && typeof properties.cluster_id === 'number') {
    return `cluster:${properties.cluster_id}`;
  }

  if (typeof properties.markerId === 'string' && properties.markerId.length > 0) {
    return `marker:${properties.markerId}`;
  }

  if (feature.id !== undefined && feature.id !== null) {
    return `id:${String(feature.id)}`;
  }

  const [lng, lat] = feature.geometry.coordinates;
  return `point:${lat}:${lng}`;
}

function dedupeClusterFeatures(
  features: GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>[]
): GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>[] {
  const seen = new Set<string>();
  const deduped: GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>[] = [];

  features.forEach((feature) => {
    const key = getClusterFeatureKey(feature);
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(feature);
  });

  return deduped;
}

function getClustersForDatelineAwareBbox(
  bbox: GeoMapBbox,
  zoom: number,
  getClustersForBbox: (candidateBbox: GeoMapBbox, zoom: number) => GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>[]
): GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>[] {
  const queried = splitDatelineBbox(bbox).flatMap((candidateBbox) =>
    getClustersForBbox(candidateBbox, zoom)
  );
  return dedupeClusterFeatures(queried);
}

function resolveMarkerAriaLabel(marker: GeoMapMarker): string {
  if (marker.label && marker.description) {
    return `${marker.label}. ${marker.description}`;
  }
  return (
    marker.label ??
    marker.description ??
    `Marker at ${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}`
  );
}

// Helper functions for dot icon properties
function getDotRadius(icon: GeoMapMarker['icon']): number {
  return icon?.type === 'dot' ? icon.radius ?? 7 : 7;
}

function getDotBorderColor(icon: GeoMapMarker['icon']): string {
  return icon?.type === 'dot' ? icon.borderColor ?? 'var(--border)' : 'var(--border)';
}

function getDotFillColor(icon: GeoMapMarker['icon']): string {
  return icon?.type === 'dot' ? icon.color ?? 'var(--primary)' : 'var(--primary)';
}

// Computed values
const resolvedRoutes = computed(() => (props.routes ?? []).filter((route) => route.points.length >= 2));

const initialView = computed(() =>
  resolveInitialView(props.markers, resolvedRoutes.value, props.viewport)
);

const markerById = computed(() => {
  const map = new Map<string, GeoMapMarker>();
  props.markers.forEach((marker, index) => {
    map.set(marker.id ?? `marker-${index}`, marker);
  });
  return map;
});

const clusterConfig = computed(() => ({
  enabled: props.clustering?.enabled === true,
  radius: props.clustering?.radius ?? CLUSTER_RADIUS_DEFAULT,
  maxZoom: props.clustering?.maxZoom ?? CLUSTER_MAX_ZOOM_DEFAULT,
  minPoints: props.clustering?.minPoints ?? CLUSTER_MIN_POINTS_DEFAULT,
}));

// Cluster index
const clusterIndex = computed<Supercluster<MarkerClusterPointProperties> | null>(() => {
  if (!clusterConfig.value.enabled) return null;

  const index = new Supercluster<MarkerClusterPointProperties>({
    radius: clusterConfig.value.radius,
    maxZoom: clusterConfig.value.maxZoom,
    minPoints: clusterConfig.value.minPoints,
  });

  const points = props.markers.map((marker, idx) => {
    const markerId = marker.id ?? `marker-${idx}`;
    return {
      type: 'Feature' as const,
      id: markerId,
      geometry: {
        type: 'Point' as const,
        coordinates: [marker.lng, marker.lat] as [number, number],
      },
      properties: {
        markerId,
        marker,
      },
    };
  });

  index.load(points);
  return index;
});

// Clustered features based on viewport
const clusteredFeatures = computed(() => {
  if (!clusterConfig.value.enabled || !clusterIndex.value || !viewportState.value) {
    return [] as GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>[];
  }

  return getClustersForDatelineAwareBbox(
    viewportState.value.bbox,
    viewportState.value.zoom,
    (bbox, zoom) =>
      clusterIndex.value!.getClusters(bbox, zoom) as GeoJSON.Feature<
        GeoJSON.Point,
        MarkerClusterPointProperties
      >[]
  );
});

// Map event handlers
function handleMapReady(map: LeafletMap) {
  mapInstance.value = map;
  viewportState.value = readViewportState(map);
}

function handleViewportChange() {
  if (!mapInstance.value) return;
  const nextState = readViewportState(mapInstance.value as LeafletMap);
  const normalized = normalizeViewportState(nextState);

  if (!areViewportStatesEqual(viewportState.value, normalized)) {
    viewportState.value = normalized;
  }
}

// Viewport controller - apply viewport changes
const lastAppliedViewportRef = ref<string | null>(null);

watch(
  () => [props.viewport, props.markers, resolvedRoutes.value, mapInstance.value, leafletModule.value] as const,
  async ([viewport, markers, routes]) => {
    if (!mapInstance.value || !leafletModule.value) return;

    await nextTick();

    if (viewport?.mode === 'center') {
      const viewportKey = `center:${roundCoordinate(viewport.center.lat)}:${roundCoordinate(viewport.center.lng)}:${viewport.zoom}`;
      if (lastAppliedViewportRef.value === viewportKey) return;

      lastAppliedViewportRef.value = viewportKey;
      mapInstance.value.setView(
        [viewport.center.lat, viewport.center.lng],
        viewport.zoom
      );
      return;
    }

    const fitTarget = viewport?.target ?? 'all';
    const fitPoints = resolveFitPointsWithFallback(markers, routes, fitTarget);
    if (fitPoints.length === 0) return;

    const maxZoom = viewport?.maxZoom;

    if (fitPoints.length === 1) {
      const [lat, lng] = fitPoints[0];
      const zoom = maxZoom
        ? Math.min(SINGLE_LOCATION_ZOOM, maxZoom)
        : SINGLE_LOCATION_ZOOM;
      const viewportKey = `fit-single:${roundCoordinate(lat)}:${roundCoordinate(lng)}:${zoom}`;
      if (lastAppliedViewportRef.value === viewportKey) return;

      lastAppliedViewportRef.value = viewportKey;
      mapInstance.value.setView([lat, lng], zoom);
      return;
    }

    const padding = viewport?.padding ?? DEFAULT_VIEWPORT_PADDING;
    const viewportKey = `fit:${fitTarget}:${padding}:${maxZoom ?? 'none'}:${serializeFitPoints(fitPoints)}`;
    if (lastAppliedViewportRef.value === viewportKey) return;

    lastAppliedViewportRef.value = viewportKey;
    const bounds = leafletModule.value.latLngBounds(fitPoints);
    if (!bounds.isValid()) return;
    mapInstance.value.fitBounds(bounds, {
      maxZoom,
      padding: [padding, padding],
    });
  },
  { immediate: true, deep: true }
);

// Handle cluster click - expand cluster
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

// Handle marker click
function handleMarkerClick(marker: GeoMapMarker) {
  emit('marker-click', marker);
}

// Handle route click
function handleRouteClick(route: GeoMapRoute) {
  emit('route-click', route);
}
</script>

<template>
  <div v-if="!leafletReady" class="h-full w-full" />
  <l-map
    v-else
    :center="initialView.center"
    :zoom="initialView.zoom"
    :zoom-control="false"
    class="h-full w-full"
    :use-global-leaflet="false"
    @ready="handleMapReady"
    @moveend="handleViewportChange"
    @zoomend="handleViewportChange"
  >
    <l-tile-layer :attribution="TILE_ATTRIBUTION" :url="tileUrl" />
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
      <geo-map-overlays
        :tooltip-mode="route.tooltip ?? 'hover'"
        :tooltip-content="route.label ?? route.description"
        :label="route.label"
        :description="route.description"
        :tooltip-class-name="tooltipClassName"
        :popup-class-name="popupClassName"
      />
    </l-polyline>

    <!-- Clustered Markers -->
    <template v-if="clusterConfig.enabled && clusterIndex && viewportState">
      <template
        v-for="(feature, index) in clusteredFeatures"
        :key="
          feature.properties?.cluster
            ? `cluster-${feature.properties.cluster_id}`
            : `marker-${feature.properties?.markerId ?? index}`
        "
      >
        <!-- Cluster -->
        <l-marker
          v-if="feature.properties?.cluster && typeof feature.properties.cluster_id === 'number'"
          :lat-lng="[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]"
          :icon="
            leafletRuntime
              ? (createClusterIcon(feature.properties.point_count ?? 0, leafletRuntime) as LeafletIcon)
              : undefined
          "
          :title="`Cluster containing ${feature.properties.point_count ?? 0} locations`"
          @click="
            handleClusterClick(
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
              feature.properties.cluster_id!
            )
          "
        />

        <!-- Individual Marker from Cluster -->
        <template v-else>
          <!-- Custom Icon Marker -->
          <l-marker
            v-if="
              leafletRuntime &&
                markerById.get(feature.properties?.markerId ?? '')?.icon &&
                resolveMarkerIcon(
                  markerById.get(feature.properties?.markerId ?? '')?.icon,
                  leafletRuntime
                )
            "
            :lat-lng="[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]"
            :icon="
              resolveMarkerIcon(
                markerById.get(feature.properties?.markerId ?? '')?.icon,
                leafletRuntime!
              )! as LeafletIcon "
            :title="
              resolveMarkerAriaLabel(
                markerById.get(feature.properties?.markerId ?? '')!
              )
            "
            @click="
              handleMarkerClick(
                markerById.get(feature.properties?.markerId ?? '')!
              )
            "
          >
            <geo-map-overlays
              :tooltip-mode="
                markerById.get(feature.properties?.markerId ?? '')?.tooltip ??
                  'hover'
              "
              :tooltip-content="
                markerById.get(feature.properties?.markerId ?? '')?.label ??
                  markerById.get(feature.properties?.markerId ?? '')?.description
              "
              :label="markerById.get(feature.properties?.markerId ?? '')?.label"
              :description="
                markerById.get(feature.properties?.markerId ?? '')?.description
              "
              :tooltip-class-name="tooltipClassName"
              :popup-class-name="popupClassName"
            />
          </l-marker>

          <!-- Circle Marker (default) -->
          <l-circle-marker
            v-else
            :lat-lng="[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]"
            :radius="getDotRadius(markerById.get(feature.properties?.markerId ?? '')?.icon)"
            :path-options="{
              color: getDotBorderColor(markerById.get(feature.properties?.markerId ?? '')?.icon),
              fillColor: getDotFillColor(markerById.get(feature.properties?.markerId ?? '')?.icon),
              fillOpacity: 0.95,
              weight: 2,
            }"
            @click="
              handleMarkerClick(
                markerById.get(feature.properties?.markerId ?? '')!
              )
            "
          >
            <geo-map-overlays
              :tooltip-mode="
                markerById.get(feature.properties?.markerId ?? '')?.tooltip ??
                  'hover'
              "
              :tooltip-content="
                markerById.get(feature.properties?.markerId ?? '')?.label ??
                  markerById.get(feature.properties?.markerId ?? '')?.description
              "
              :label="markerById.get(feature.properties?.markerId ?? '')?.label"
              :description="
                markerById.get(feature.properties?.markerId ?? '')?.description
              "
              :tooltip-class-name="tooltipClassName"
              :popup-class-name="popupClassName"
            />
          </l-circle-marker>
        </template>
      </template>
    </template>

    <!-- Non-clustered Markers -->
    <template v-else>
      <template v-for="(marker, index) in markers" :key="marker.id ?? `${id}-marker-${index}`">
        <!-- Custom Icon Marker -->
        <l-marker
          v-if="leafletRuntime && marker.icon && resolveMarkerIcon(marker.icon, leafletRuntime)"
          :lat-lng="[marker.lat, marker.lng]"
          :icon="resolveMarkerIcon(marker.icon, leafletRuntime)! as LeafletIcon"
          :title="resolveMarkerAriaLabel(marker)"
          @click="handleMarkerClick(marker)"
        >
          <geo-map-overlays
            :tooltip-mode="marker.tooltip ?? 'hover'"
            :tooltip-content="marker.label ?? marker.description"
            :label="marker.label"
            :description="marker.description"
            :tooltip-class-name="tooltipClassName"
            :popup-class-name="popupClassName"
          />
        </l-marker>

        <!-- Circle Marker (default) -->
        <l-circle-marker
          v-else
          :lat-lng="[marker.lat, marker.lng]"
          :radius="getDotRadius(marker.icon)"
          :path-options="{
            color: getDotBorderColor(marker.icon),
            fillColor: getDotFillColor(marker.icon),
            fillOpacity: 0.95,
            weight: 2,
          }"
          @click="handleMarkerClick(marker)"
        >
          <geo-map-overlays
            :tooltip-mode="marker.tooltip ?? 'hover'"
            :tooltip-content="marker.label ?? marker.description"
            :label="marker.label"
            :description="marker.description"
            :tooltip-class-name="tooltipClassName"
            :popup-class-name="popupClassName"
          />
        </l-circle-marker>
      </template>
    </template>
  </l-map>
</template>
