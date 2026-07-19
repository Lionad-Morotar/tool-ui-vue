<script setup lang="ts">
import { LMarker, LCircleMarker } from '@vue-leaflet/vue-leaflet';
import { computed } from 'vue';
import { createClusterIcon, resolveMarkerIcon } from '../geo-map-icons';
import GeoMapMarkerPopup from './geo-map-marker-popup.vue';
import {
  resolveMarkerAriaLabel,
  getDotRadius,
  getDotBorderColor,
  getDotFillColor,
} from '../utils';
import type { LeafletIconRuntime } from '../geo-map-icons';
import type { GeoMapMarker } from '../schema';

interface ResolvedFeature {
  key: string;
  lat: number;
  lng: number;
  isCluster: boolean;
  clusterId?: number;
  pointCount: number;
  marker?: GeoMapMarker;
  /** Cached icon to avoid repeated Map lookups in template; `any` avoids vue-leaflet DivIcon/Icon typing mismatch */
  resolvedIcon?: any;
  ariaLabel?: string;
}

defineOptions({ name: 'CmptGeoMapClusterLayer', inheritAttrs: false });

const props = defineProps<{
  features: GeoJSON.Feature<GeoJSON.Point, {
    cluster?: boolean;
    cluster_id?: number;
    point_count?: number;
    markerId?: string;
    marker?: GeoMapMarker;
  }>[];
  markerById: Map<string, GeoMapMarker>;
  leafletRuntime: LeafletIconRuntime | null;
  tooltipClassName?: string;
  popupClassName?: string;
  id: string;
}>();

const emit = defineEmits<{
  'marker-click': [marker: GeoMapMarker];
  'cluster-click': [lat: number, lng: number, clusterId: number];
}>();

function handleMarkerClick(marker: GeoMapMarker) {
  emit('marker-click', marker);
}

function handleClusterClick(lat: number, lng: number, clusterId: number) {
  emit('cluster-click', lat, lng, clusterId);
}

const resolvedFeatures = computed<ResolvedFeature[]>(() => {
  const runtime = props.leafletRuntime;
  if (!runtime) return [];

  return props.features.map((feature, index): ResolvedFeature => {
    const isCluster = feature.properties?.cluster === true;
    const lat = feature.geometry.coordinates[1];
    const lng = feature.geometry.coordinates[0];

    if (isCluster) {
      return {
        key: `cluster-${feature.properties?.cluster_id}`,
        lat,
        lng,
        isCluster: true,
        clusterId: feature.properties?.cluster_id,
        pointCount: feature.properties?.point_count ?? 0,
        ariaLabel: `Cluster containing ${feature.properties?.point_count ?? 0} locations`,
      };
    }

    const markerId = feature.properties?.markerId ?? '';
    const marker = props.markerById.get(markerId);
    const resolvedIcon = marker?.icon ? resolveMarkerIcon(marker.icon, runtime) : null;

    return {
      key: `marker-${markerId ?? index}`,
      lat,
      lng,
      isCluster: false,
      pointCount: 0,
      marker,
      resolvedIcon,
      ariaLabel: marker ? resolveMarkerAriaLabel(marker) : undefined,
    };
  });
});
</script>

<template>
  <template
    v-for="feature in resolvedFeatures"
    :key="feature.key"
  >
    <!-- Cluster -->
    <l-marker
      v-if="feature.isCluster"
      :lat-lng="[feature.lat, feature.lng]"
      :icon="
        leafletRuntime
          ? (createClusterIcon(feature.pointCount, leafletRuntime) as any)
          : undefined
      "
      :title="feature.ariaLabel"
      @click="handleClusterClick(feature.lat, feature.lng, feature.clusterId!)"
    />

    <!-- Individual Marker from Cluster -->
    <template v-else>
      <!-- Custom Icon Marker -->
      <l-marker
        v-if="feature.resolvedIcon"
        :lat-lng="[feature.lat, feature.lng]"
        :icon="feature.resolvedIcon"
        :title="feature.ariaLabel"
        @click="handleMarkerClick(feature.marker!)"
      >
        <geo-map-marker-popup
          :tooltip="feature.marker?.tooltip ?? 'hover'"
          :label="feature.marker?.label"
          :description="feature.marker?.description"
          :tooltip-class-name="tooltipClassName"
          :popup-class-name="popupClassName"
        />
      </l-marker>

      <!-- Circle Marker (default) -->
      <l-circle-marker
        v-else
        :lat-lng="[feature.lat, feature.lng]"
        :radius="getDotRadius(feature.marker?.icon)"
        :path-options="{
          color: getDotBorderColor(feature.marker?.icon),
          fillColor: getDotFillColor(feature.marker?.icon),
          fillOpacity: 0.95,
          weight: 2,
        }"
        @click="handleMarkerClick(feature.marker!)"
      >
        <geo-map-marker-popup
          :tooltip="feature.marker?.tooltip ?? 'hover'"
          :label="feature.marker?.label"
          :description="feature.marker?.description"
          :tooltip-class-name="tooltipClassName"
          :popup-class-name="popupClassName"
        />
      </l-circle-marker>
    </template>
  </template>
</template>
