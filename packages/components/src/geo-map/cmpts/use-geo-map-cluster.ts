import Supercluster from 'supercluster';
import { computed } from 'vue';
import { splitDatelineBbox } from '../utils';
import type { GeoMapMarker, GeoMapClustering } from '../schema';

type MarkerClusterPointProperties = {
  cluster?: boolean;
  cluster_id?: number;
  point_count?: number;
  markerId?: string;
  marker?: GeoMapMarker;
};

const CLUSTER_RADIUS_DEFAULT = 60;
const CLUSTER_MAX_ZOOM_DEFAULT = 16;
const CLUSTER_MIN_POINTS_DEFAULT = 2;

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
  bbox: [number, number, number, number],
  zoom: number,
  getClustersForBbox: (candidateBbox: [number, number, number, number], zoom: number) => GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>[]
): GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>[] {
  const queried = splitDatelineBbox(bbox).flatMap((candidateBbox) =>
    getClustersForBbox(candidateBbox, zoom)
  );
  return dedupeClusterFeatures(queried);
}

interface UseGeoMapClusterReturn {
  clusterConfig: import('vue').ComputedRef<{ enabled: boolean; radius: number; maxZoom: number; minPoints: number }>;
  clusterIndex: import('vue').ComputedRef<Supercluster<MarkerClusterPointProperties> | null>;
  clusteredFeatures: import('vue').ComputedRef<GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>[]>;
}

export function useGeoMapCluster(
  markers: () => GeoMapMarker[],
  clustering: () => GeoMapClustering | undefined,
  viewportState: () => { bbox: [number, number, number, number]; zoom: number } | null
): UseGeoMapClusterReturn {
  const clusterConfig = computed(() => ({
    enabled: clustering()?.enabled === true,
    radius: clustering()?.radius ?? CLUSTER_RADIUS_DEFAULT,
    maxZoom: clustering()?.maxZoom ?? CLUSTER_MAX_ZOOM_DEFAULT,
    minPoints: clustering()?.minPoints ?? CLUSTER_MIN_POINTS_DEFAULT,
  }));

  const clusterIndex = computed<Supercluster<MarkerClusterPointProperties> | null>(() => {
    if (!clusterConfig.value.enabled) return null;

    const index = new Supercluster<MarkerClusterPointProperties>({
      radius: clusterConfig.value.radius,
      maxZoom: clusterConfig.value.maxZoom,
      minPoints: clusterConfig.value.minPoints,
    });

    const currentMarkers = markers();
    const points = currentMarkers.map((marker, idx) => {
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

  const clusteredFeatures = computed(() => {
    const state = viewportState();
    if (!clusterConfig.value.enabled || !clusterIndex.value || !state) {
      return [] as GeoJSON.Feature<GeoJSON.Point, MarkerClusterPointProperties>[];
    }

    return getClustersForDatelineAwareBbox(
      state.bbox,
      state.zoom,
      (bbox, zoom) =>
        clusterIndex.value!.getClusters(bbox, zoom) as GeoJSON.Feature<
          GeoJSON.Point,
          MarkerClusterPointProperties
        >[]
    );
  });

  return {
    clusterConfig,
    clusterIndex,
    clusteredFeatures,
  };
}

export type { MarkerClusterPointProperties };
