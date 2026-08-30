<script setup lang="ts">
import { reactive } from 'vue';
import { GeoMap } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'
import type { GeoMapMarker, GeoMapRoute } from '@lionad/vtu-components/geo-map/schema';

const interactiveClickMarkersTitle = useStoryLocale('content.interactiveClickMarkersTitle', messages)
const interactiveClickMarkersDesc = useStoryLocale('content.interactiveClickMarkersDesc', messages)
const selectedMarkerText = useStoryLocale('content.selectedMarkerText', messages)
const clearButtonText = useStoryLocale('content.clearButtonText', messages)
const sfLabel = useStoryLocale('content.sfLabel', messages)
const laLabel = useStoryLocale('content.laLabel', messages)
const sdLabel = useStoryLocale('content.sdLabel', messages)
const interactiveClickRoutesTitle = useStoryLocale('content.interactiveClickRoutesTitle', messages)
const interactiveClickRoutesDesc = useStoryLocale('content.interactiveClickRoutesDesc', messages)
const selectedRouteText = useStoryLocale('content.selectedRouteText', messages)
const hubALabel = useStoryLocale('content.hubALabel', messages)
const hubBLabel = useStoryLocale('content.hubBLabel', messages)
const routeALabel = useStoryLocale('content.routeALabel', messages)
const routeBLabel = useStoryLocale('content.routeBLabel', messages)
const stop1Label = useStoryLocale('content.stop1Label', messages)
const stop2Label = useStoryLocale('content.stop2Label', messages)
const interactiveClickMarkers = useStoryLocale('content.interactiveClickMarkers', messages)
const interactiveClickRoutes = useStoryLocale('content.interactiveClickRoutes', messages)

const mapState = reactive({
  selectedMarker: null as string | null,
  selectedRoute: null as string | null,
});

function handleMarkerClick(marker: GeoMapMarker) {
  mapState.selectedMarker = marker.id || marker.label || 'Unknown';
}

function handleRouteClick(route: GeoMapRoute) {
  mapState.selectedRoute = route.id || route.label || 'Unknown';
}
</script>

<template>
  <Story title="GeoMap/Interactions">
    <Variant :title="interactiveClickMarkers">
      <div class="w-full max-w-2xl">
        <div v-if="mapState.selectedMarker" class="mb-4 rounded-lg bg-primary/10 p-3 text-sm">
          {{ selectedMarkerText }} <strong>{{ mapState.selectedMarker }}</strong>
          <button
            class="ml-2 text-xs underline"
            @click="mapState.selectedMarker = null"
          >
            {{ clearButtonText }}
          </button>
        </div>
        <geo-map
          id="geo-map-interactive"
          :title="interactiveClickMarkersTitle"
          :description="interactiveClickMarkersDesc"
          :markers="[
            { id: 'sf', lat: 37.7749, lng: -122.4194, label: sfLabel },
            { id: 'la', lat: 34.0522, lng: -118.2437, label: laLabel },
            { id: 'sd', lat: 32.7157, lng: -117.1611, label: sdLabel },
          ]"
          :viewport="{ mode: 'fit', padding: 50 }"
          @marker-click="handleMarkerClick"
        />
      </div>
    </Variant>

    <Variant :title="interactiveClickRoutes">
      <div class="w-full max-w-2xl">
        <div v-if="mapState.selectedRoute" class="mb-4 rounded-lg bg-primary/10 p-3 text-sm">
          {{ selectedRouteText }} <strong>{{ mapState.selectedRoute }}</strong>
          <button
            class="ml-2 text-xs underline"
            @click="mapState.selectedRoute = null"
          >
            {{ clearButtonText }}
          </button>
        </div>
        <geo-map
          id="geo-map-routes-interactive"
          :title="interactiveClickRoutesTitle"
          :description="interactiveClickRoutesDesc"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: hubALabel },
            { id: '2', lat: 37.7849, lng: -122.4094, label: stop1Label },
            { id: '3', lat: 37.7949, lng: -122.3994, label: stop2Label },
            { id: '4', lat: 37.7649, lng: -122.4294, label: hubBLabel },
          ]"
          :routes="[
            {
              id: 'route-a',
              points: [
                { lat: 37.7749, lng: -122.4194 },
                { lat: 37.7849, lng: -122.4094 },
                { lat: 37.7949, lng: -122.3994 },
              ],
              color: '#3b82f6',
              label: routeALabel,
            },
            {
              id: 'route-b',
              points: [
                { lat: 37.7749, lng: -122.4194 },
                { lat: 37.7649, lng: -122.4294 },
              ],
              color: '#ef4444',
              label: routeBLabel,
            },
          ]"
          :viewport="{ mode: 'fit', padding: 50 }"
          @route-click="handleRouteClick"
        />
      </div>
    </Variant>
  </Story>
</template>
