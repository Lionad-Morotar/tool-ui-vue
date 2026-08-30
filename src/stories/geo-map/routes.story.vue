<script setup lang="ts">
import { GeoMap } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const multipleMarkersTitle = useStoryLocale('content.multipleMarkersTitle', messages)
const multipleMarkersDesc = useStoryLocale('content.multipleMarkersDesc', messages)
const sfLabel = useStoryLocale('content.sfLabel', messages)
const laLabel = useStoryLocale('content.laLabel', messages)
const sdLabel = useStoryLocale('content.sdLabel', messages)
const withRoutesTitle = useStoryLocale('content.withRoutesTitle', messages)
const withRoutesDesc = useStoryLocale('content.withRoutesDesc', messages)
const startLabel = useStoryLocale('content.startLabel', messages)
const stop1Label = useStoryLocale('content.stop1Label', messages)
const stop2Label = useStoryLocale('content.stop2Label', messages)
const endLabel = useStoryLocale('content.endLabel', messages)
const mainRouteLabel = useStoryLocale('content.mainRouteLabel', messages)
const denseClusteringTitle = useStoryLocale('content.denseClusteringTitle', messages)
const denseClusteringDesc = useStoryLocale('content.denseClusteringDesc', messages)
const densePointPrefix = useStoryLocale('content.densePointPrefix', messages)
const complexRouteTitle = useStoryLocale('content.complexRouteTitle', messages)
const complexRouteDesc = useStoryLocale('content.complexRouteDesc', messages)
const depotLabel = useStoryLocale('content.depotLabel', messages)
const deliveryRouteLabel = useStoryLocale('content.deliveryRouteLabel', messages)
const deliveryRouteDesc = useStoryLocale('content.deliveryRouteDesc', messages)
const multipleMarkers = useStoryLocale('content.multipleMarkers', messages)
const withRoutes = useStoryLocale('content.withRoutes', messages)
const denseClusteringDemo = useStoryLocale('content.denseClusteringDemo', messages)
const complexRouteWithStyling = useStoryLocale('content.complexRouteWithStyling', messages)
</script>

<template>
  <Story title="GeoMap/Routes">
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
  </Story>
</template>
