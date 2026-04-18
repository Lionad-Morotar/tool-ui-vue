<script setup lang="ts">
import { LMarker, LCircleMarker } from '@vue-leaflet/vue-leaflet';
import { createClusterIcon, resolveMarkerIcon } from '../geo-map-icons';
import type { LeafletIconRuntime } from '../geo-map-icons';
import GeoMapMarkerPopup from './geo-map-marker-popup.vue';
import {
  resolveMarkerAriaLabel,
  getDotRadius,
  getDotBorderColor,
  getDotFillColor,
} from '../utils';
import type { GeoMapMarker } from '../schema';
import type { Icon as LeafletIcon } from 'leaflet';

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
</script>

<template>
  <template
    v-for="(feature, index) in features"
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
        <geo-map-marker-popup
          :tooltip="markerById.get(feature.properties?.markerId ?? '')?.tooltip ?? 'hover'"
          :label="markerById.get(feature.properties?.markerId ?? '')?.label"
          :description="markerById.get(feature.properties?.markerId ?? '')?.description"
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
        <geo-map-marker-popup
          :tooltip="markerById.get(feature.properties?.markerId ?? '')?.tooltip ?? 'hover'"
          :label="markerById.get(feature.properties?.markerId ?? '')?.label"
          :description="markerById.get(feature.properties?.markerId ?? '')?.description"
          :tooltip-class-name="tooltipClassName"
          :popup-class-name="popupClassName"
        />
      </l-circle-marker>
    </template>
  </template>
</template>
