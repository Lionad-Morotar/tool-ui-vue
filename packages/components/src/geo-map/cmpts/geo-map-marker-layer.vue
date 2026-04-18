<script setup lang="ts">
import { LMarker, LCircleMarker } from '@vue-leaflet/vue-leaflet';
import { resolveMarkerIcon } from '../geo-map-icons';
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

defineOptions({ name: 'CmptGeoMapMarkerLayer', inheritAttrs: false });

const props = defineProps<{
  markers: GeoMapMarker[];
  markerById: Map<string, GeoMapMarker>;
  leafletRuntime: LeafletIconRuntime | null;
  tooltipClassName?: string;
  popupClassName?: string;
  id: string;
}>();

const emit = defineEmits<{
  'marker-click': [marker: GeoMapMarker];
}>();

function handleMarkerClick(marker: GeoMapMarker) {
  emit('marker-click', marker);
}
</script>

<template>
  <template v-for="(marker, index) in markers" :key="marker.id ?? `${id}-marker-${index}`">
    <!-- Custom Icon Marker -->
    <l-marker
      v-if="leafletRuntime && marker.icon && resolveMarkerIcon(marker.icon, leafletRuntime)"
      :lat-lng="[marker.lat, marker.lng]"
      :icon="resolveMarkerIcon(marker.icon, leafletRuntime)! as LeafletIcon"
      :title="resolveMarkerAriaLabel(marker)"
      @click="handleMarkerClick(marker)"
    >
      <geo-map-marker-popup
        :tooltip="marker.tooltip ?? 'hover'"
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
      <geo-map-marker-popup
        :tooltip="marker.tooltip ?? 'hover'"
        :label="marker.label"
        :description="marker.description"
        :tooltip-class-name="tooltipClassName"
        :popup-class-name="popupClassName"
      />
    </l-circle-marker>
  </template>
</template>
