<script setup lang="ts">
import { reactive } from 'vue';
import { GeoMap } from '@lionad/vtu-components';
import type { GeoMapMarker, GeoMapRoute } from '@lionad/vtu-components/geo-map/schema';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n';

const singleMarkerTitle = useStoryLocale('content.singleMarkerTitle', messages)
const singleMarkerDesc = useStoryLocale('content.singleMarkerDesc', messages)
const sfLabel = useStoryLocale('content.sfLabel', messages)
const multipleMarkersTitle = useStoryLocale('content.multipleMarkersTitle', messages)
const multipleMarkersDesc = useStoryLocale('content.multipleMarkersDesc', messages)
const laLabel = useStoryLocale('content.laLabel', messages)
const sdLabel = useStoryLocale('content.sdLabel', messages)
const withRoutesTitle = useStoryLocale('content.withRoutesTitle', messages)
const withRoutesDesc = useStoryLocale('content.withRoutesDesc', messages)
const startLabel = useStoryLocale('content.startLabel', messages)
const stop1Label = useStoryLocale('content.stop1Label', messages)
const stop2Label = useStoryLocale('content.stop2Label', messages)
const endLabel = useStoryLocale('content.endLabel', messages)
const mainRouteLabel = useStoryLocale('content.mainRouteLabel', messages)
const withCustomIconsTitle = useStoryLocale('content.withCustomIconsTitle', messages)
const restaurantLabel = useStoryLocale('content.restaurantLabel', messages)
const hotelLabel = useStoryLocale('content.hotelLabel', messages)
const parkLabel = useStoryLocale('content.parkLabel', messages)
const darkThemeTitle = useStoryLocale('content.darkThemeTitle', messages)
const nyLabel = useStoryLocale('content.nyLabel', messages)
const timesSquareLabel = useStoryLocale('content.timesSquareLabel', messages)
const interactiveClickMarkersTitle = useStoryLocale('content.interactiveClickMarkersTitle', messages)
const interactiveClickMarkersDesc = useStoryLocale('content.interactiveClickMarkersDesc', messages)
const selectedMarkerText = useStoryLocale('content.selectedMarkerText', messages)
const clearButtonText = useStoryLocale('content.clearButtonText', messages)
const interactiveClickRoutesTitle = useStoryLocale('content.interactiveClickRoutesTitle', messages)
const interactiveClickRoutesDesc = useStoryLocale('content.interactiveClickRoutesDesc', messages)
const selectedRouteText = useStoryLocale('content.selectedRouteText', messages)
const hubALabel = useStoryLocale('content.hubALabel', messages)
const hubBLabel = useStoryLocale('content.hubBLabel', messages)
const routeALabel = useStoryLocale('content.routeALabel', messages)
const routeBLabel = useStoryLocale('content.routeBLabel', messages)
const withClusteringTitle = useStoryLocale('content.withClusteringTitle', messages)
const withClusteringDesc = useStoryLocale('content.withClusteringDesc', messages)
const denseLocationPrefix = useStoryLocale('content.denseLocationPrefix', messages)
const denseClusteringTitle = useStoryLocale('content.denseClusteringTitle', messages)
const denseClusteringDesc = useStoryLocale('content.denseClusteringDesc', messages)
const densePointPrefix = useStoryLocale('content.densePointPrefix', messages)
const londonLabel = useStoryLocale('content.londonLabel', messages)
const parisLabel = useStoryLocale('content.parisLabel', messages)
const berlinLabel = useStoryLocale('content.berlinLabel', messages)
const withImageIconsTitle = useStoryLocale('content.withImageIconsTitle', messages)
const centralParkLabel = useStoryLocale('content.centralParkLabel', messages)
const withCustomDotIconsTitle = useStoryLocale('content.withCustomDotIconsTitle', messages)
const highPriorityLabel = useStoryLocale('content.highPriorityLabel', messages)
const mediumPriorityLabel = useStoryLocale('content.mediumPriorityLabel', messages)
const lowPriorityLabel = useStoryLocale('content.lowPriorityLabel', messages)
const complexRouteTitle = useStoryLocale('content.complexRouteTitle', messages)
const complexRouteDesc = useStoryLocale('content.complexRouteDesc', messages)
const depotLabel = useStoryLocale('content.depotLabel', messages)
const deliveryRouteLabel = useStoryLocale('content.deliveryRouteLabel', messages)
const deliveryRouteDesc = useStoryLocale('content.deliveryRouteDesc', messages)
const centerViewportTitle = useStoryLocale('content.centerViewportTitle', messages)
const centerViewportDesc = useStoryLocale('content.centerViewportDesc', messages)
const tokyoLabel = useStoryLocale('content.tokyoLabel', messages)
const withoutZoomTitle = useStoryLocale('content.withoutZoomTitle', messages)
const withoutZoomDesc = useStoryLocale('content.withoutZoomDesc', messages)

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

const singleMarker = useStoryLocale('content.singleMarker', messages)
const multipleMarkers = useStoryLocale('content.multipleMarkers', messages)
const withRoutes = useStoryLocale('content.withRoutes', messages)
const withCustomIcons = useStoryLocale('content.withCustomIcons', messages)
const darkTheme = useStoryLocale('content.darkTheme', messages)
const interactiveClickMarkers = useStoryLocale('content.interactiveClickMarkers', messages)
const interactiveClickRoutes = useStoryLocale('content.interactiveClickRoutes', messages)
const withClustering = useStoryLocale('content.withClustering', messages)
const withoutTitle = useStoryLocale('content.withoutTitle', messages)
const withImageIcons = useStoryLocale('content.withImageIcons', messages)
const withCustomDotIcons = useStoryLocale('content.withCustomDotIcons', messages)
const denseClusteringDemo = useStoryLocale('content.denseClusteringDemo', messages)
const complexRouteWithStyling = useStoryLocale('content.complexRouteWithStyling', messages)
const centerViewportMode = useStoryLocale('variant.centerViewportMode', messages)
const withoutZoomControl = useStoryLocale('content.withoutZoomControl', messages)
</script>

<template>
  <Story title="GeoMap/All Variants">
    <Variant :title="singleMarker">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-single"
          :title="singleMarkerTitle"
          :description="singleMarkerDesc"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: sfLabel },
          ]"
          :viewport="{ mode: 'center', center: { lat: 37.7749, lng: -122.4194 }, zoom: 12 }"
        />
      </div>
    </Variant>

    <Variant :title="multipleMarkers">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-multiple"
          :title="multipleMarkersTitle"
          :description="multipleMarkersDesc"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: sfLabel },
            { id: '2', lat: 34.0522, lng: -118.2437, label: laLabel },
            { id: '3', lat: 32.7157, lng: -117.1611, label: sdLabel },
          ]"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>

    <Variant :title="withRoutes">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-routes"
          :title="withRoutesTitle"
          :description="withRoutesDesc"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: startLabel },
            { id: '2', lat: 37.7849, lng: -122.4094, label: stop1Label },
            { id: '3', lat: 37.7649, lng: -122.4294, label: stop2Label },
            { id: '4', lat: 37.7549, lng: -122.4394, label: endLabel },
          ]"
          :routes="[
            {
              id: 'route-1',
              points: [
                { lat: 37.7749, lng: -122.4194 },
                { lat: 37.7849, lng: -122.4094 },
                { lat: 37.7649, lng: -122.4294 },
                { lat: 37.7549, lng: -122.4394 },
              ],
              color: '#3b82f6',
              label: mainRouteLabel,
            },
          ]"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>

    <Variant :title="withCustomIcons">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-icons"
          :title="withCustomIconsTitle"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: restaurantLabel, icon: { type: 'emoji', value: '🍽️' } },
            { id: '2', lat: 37.7849, lng: -122.4094, label: hotelLabel, icon: { type: 'emoji', value: '🏨' } },
            { id: '3', lat: 37.7649, lng: -122.4294, label: parkLabel, icon: { type: 'emoji', value: '🌳' } },
          ]"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>

    <Variant :title="darkTheme">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-dark"
          :title="darkThemeTitle"
          :markers="[
            { id: '1', lat: 40.7128, lng: -74.006, label: nyLabel },
            { id: '2', lat: 40.7589, lng: -73.9851, label: timesSquareLabel },
          ]"
          theme="dark"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>

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

    <Variant :title="withClustering">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-clustering"
          :title="withClusteringTitle"
          :description="withClusteringDesc"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: `${denseLocationPrefix} 1` },
            { id: '2', lat: 37.775, lng: -122.4195, label: `${denseLocationPrefix} 2` },
            { id: '3', lat: 37.7748, lng: -122.4193, label: `${denseLocationPrefix} 3` },
            { id: '4', lat: 37.7751, lng: -122.4196, label: `${denseLocationPrefix} 4` },
            { id: '5', lat: 37.7747, lng: -122.4192, label: `${denseLocationPrefix} 5` },
            { id: '6', lat: 37.7752, lng: -122.4197, label: `${denseLocationPrefix} 6` },
            { id: '7', lat: 37.7746, lng: -122.4191, label: `${denseLocationPrefix} 7` },
            { id: '8', lat: 37.7753, lng: -122.4198, label: `${denseLocationPrefix} 8` },
          ]"
          :clustering="{ enabled: true, radius: 40 }"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>

    <Variant :title="withoutTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-no-title"
          :markers="[
            { id: '1', lat: 51.5074, lng: -0.1278, label: londonLabel },
            { id: '2', lat: 48.8566, lng: 2.3522, label: parisLabel },
            { id: '3', lat: 52.5200, lng: 13.4050, label: berlinLabel },
          ]"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>

    <Variant :title="withImageIcons">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-image-icons"
          :title="withImageIconsTitle"
          :markers="[
            { id: '1', lat: 40.7589, lng: -73.9851, label: timesSquareLabel, icon: { type: 'image', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/300px-PNG_transparency_demonstration_1.png', width: 32, height: 32 } },
            { id: '2', lat: 40.7489, lng: -73.968, label: centralParkLabel, icon: { type: 'emoji', value: '🌳' } },
          ]"
          :viewport="{ mode: 'center', center: { lat: 40.75, lng: -73.98 }, zoom: 12 }"
        />
      </div>
    </Variant>

    <Variant :title="withCustomDotIcons">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-dot-icons"
          :title="withCustomDotIconsTitle"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: highPriorityLabel, icon: { type: 'dot', color: '#ef4444', radius: 10 } },
            { id: '2', lat: 37.7849, lng: -122.4094, label: mediumPriorityLabel, icon: { type: 'dot', color: '#f59e0b', radius: 8 } },
            { id: '3', lat: 37.7649, lng: -122.4294, label: lowPriorityLabel, icon: { type: 'dot', color: '#10b981', radius: 6 } },
          ]"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>

    <Variant :title="denseClusteringDemo">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-dense-clustering"
          :title="denseClusteringTitle"
          :description="denseClusteringDesc"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: `${densePointPrefix} 1` },
            { id: '2', lat: 37.775, lng: -122.4195, label: `${densePointPrefix} 2` },
            { id: '3', lat: 37.7748, lng: -122.4193, label: `${densePointPrefix} 3` },
            { id: '4', lat: 37.7751, lng: -122.4196, label: `${densePointPrefix} 4` },
            { id: '5', lat: 37.7747, lng: -122.4192, label: `${densePointPrefix} 5` },
            { id: '6', lat: 37.7752, lng: -122.4197, label: `${densePointPrefix} 6` },
            { id: '7', lat: 37.7746, lng: -122.4191, label: `${densePointPrefix} 7` },
            { id: '8', lat: 37.7753, lng: -122.4198, label: `${densePointPrefix} 8` },
            { id: '9', lat: 37.7745, lng: -122.419, label: `${densePointPrefix} 9` },
            { id: '10', lat: 37.7754, lng: -122.42, label: `${densePointPrefix} 10` },
            { id: '11', lat: 37.7744, lng: -122.4189, label: `${densePointPrefix} 11` },
            { id: '12', lat: 37.7755, lng: -122.42, label: `${densePointPrefix} 12` },
          ]"
          :clustering="{ enabled: true, radius: 60, minPoints: 2 }"
          :viewport="{ mode: 'fit', padding: 80 }"
        />
      </div>
    </Variant>

    <Variant :title="complexRouteWithStyling">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-complex-route"
          :title="complexRouteTitle"
          :description="complexRouteDesc"
          :markers="[
            { id: 'depot', lat: 37.7749, lng: -122.4194, label: depotLabel, icon: { type: 'emoji', value: '🏭' } },
            { id: 'stop1', lat: 37.7849, lng: -122.4094, label: stop1Label, icon: { type: 'emoji', value: '📦' } },
            { id: 'stop2', lat: 37.7949, lng: -122.3994, label: stop2Label, icon: { type: 'emoji', value: '📦' } },
            { id: 'stop3', lat: 37.7649, lng: -122.4294, label: stop2Label, icon: { type: 'emoji', value: '📦' } },
            { id: 'stop4', lat: 37.7549, lng: -122.4394, label: stop2Label, icon: { type: 'emoji', value: '📦' } },
          ]"
          :routes="[
            {
              id: 'delivery-route',
              points: [
                { lat: 37.7749, lng: -122.4194 },
                { lat: 37.7849, lng: -122.4094 },
                { lat: 37.7949, lng: -122.3994 },
                { lat: 37.7649, lng: -122.4294 },
                { lat: 37.7549, lng: -122.4394 },
              ],
              color: '#3b82f6',
              weight: 4,
              opacity: 0.8,
              label: deliveryRouteLabel,
              description: deliveryRouteDesc,
            },
          ]"
          :viewport="{ mode: 'fit', padding: 60 }"
        />
      </div>
    </Variant>

    <Variant :title="centerViewportMode">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-center-mode"
          :title="centerViewportTitle"
          :description="centerViewportDesc"
          :markers="[
            { id: '1', lat: 35.6762, lng: 139.6503, label: tokyoLabel },
          ]"
          :viewport="{ mode: 'center', center: { lat: 35.6762, lng: 139.6503 }, zoom: 10 }"
        />
      </div>
    </Variant>

    <Variant :title="withoutZoomControl">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-no-zoom"
          :title="withoutZoomTitle"
          :description="withoutZoomDesc"
          :markers="[
            { id: '1', lat: 51.5074, lng: -0.1278, label: londonLabel },
            { id: '2', lat: 48.8566, lng: 2.3522, label: parisLabel },
          ]"
          :show-zoom-control="false"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>
  </Story>
</template>
