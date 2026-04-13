<script setup lang="ts">
import { reactive } from 'vue';
import { GeoMap } from '@lionad/vtu-components';
import type { GeoMapMarker, GeoMapRoute } from '@lionad/vtu-components/geo-map/schema';
import { useStoryLocale, type StoryLocaleLabels } from './_shared/use-story-locale';

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
const singleMarker = useStoryLocale({ zh: '单个标记', en: 'Single Marker' })
const multipleMarkers = useStoryLocale({ zh: '多个标记', en: 'Multiple Markers' })
const withRoutes = useStoryLocale({ zh: '含路径', en: 'With Routes' })
const withCustomIcons = useStoryLocale({ zh: '自定义图标', en: 'With Custom Icons' })
const darkTheme = useStoryLocale({ zh: '暗色主题', en: 'Dark Theme' })
const interactiveClickMarkers = useStoryLocale({ zh: '交互 - 点击标记', en: 'Interactive - Click Markers' })
const interactiveClickRoutes = useStoryLocale({ zh: '交互 - 点击路径', en: 'Interactive - Click Routes' })
const withClustering = useStoryLocale({ zh: '聚合显示', en: 'With Clustering' })
const withoutTitle = useStoryLocale({ zh: '无标题', en: 'Without Title' })
const withImageIcons = useStoryLocale({ zh: '图片图标', en: 'With Image Icons' })
const withCustomDotIcons = useStoryLocale({ zh: '自定义点图标', en: 'With Custom Dot Icons' })
const denseClusteringDemo = useStoryLocale({ zh: '密集聚合演示', en: 'Dense Clustering Demo' })
const complexRouteWithStyling = useStoryLocale({ zh: '复杂路径（带样式）', en: 'Complex Route with Styling' })
const centerViewportMode = useStoryLocale({ zh: '居中视口模式', en: 'Center Viewport Mode' })
const withoutZoomControl = useStoryLocale({ zh: '无缩放控件', en: 'Without Zoom Control' })
</script>

<template>
  <Story title="GeoMap/All Variants">
    <Variant :title="singleMarker">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <geo-map
          id="geo-map-single"
          title="Location"
          description="Office headquarters"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: 'San Francisco' },
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
          title="Office Locations"
          description="Our offices across California"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: 'San Francisco' },
            { id: '2', lat: 34.0522, lng: -118.2437, label: 'Los Angeles' },
            { id: '3', lat: 32.7157, lng: -117.1611, label: 'San Diego' },
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
          title="Delivery Route"
          description="Optimized delivery path"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: 'Start' },
            { id: '2', lat: 37.7849, lng: -122.4094, label: 'Stop 1' },
            { id: '3', lat: 37.7649, lng: -122.4294, label: 'Stop 2' },
            { id: '4', lat: 37.7549, lng: -122.4394, label: 'End' },
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
              label: 'Main Route',
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
          title="Points of Interest"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: 'Restaurant', icon: { type: 'emoji', value: '🍽️' } },
            { id: '2', lat: 37.7849, lng: -122.4094, label: 'Hotel', icon: { type: 'emoji', value: '🏨' } },
            { id: '3', lat: 37.7649, lng: -122.4294, label: 'Park', icon: { type: 'emoji', value: '🌳' } },
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
          title="Night Mode"
          :markers="[
            { id: '1', lat: 40.7128, lng: -74.006, label: 'New York' },
            { id: '2', lat: 40.7589, lng: -73.9851, label: 'Times Square' },
          ]"
          theme="dark"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>

    <Variant :title="interactiveClickMarkers">
      <div class="w-full max-w-2xl">
        <div v-if="mapState.selectedMarker" class="mb-4 rounded-lg bg-primary/10 p-3 text-sm">
          Selected marker: <strong>{{ mapState.selectedMarker }}</strong>
          <button
            class="ml-2 text-xs underline"
            @click="mapState.selectedMarker = null"
          >
            Clear
          </button>
        </div>
        <geo-map
          id="geo-map-interactive"
          title="Clickable Markers"
          description="Click on any marker to select it"
          :markers="[
            { id: 'sf', lat: 37.7749, lng: -122.4194, label: 'San Francisco' },
            { id: 'la', lat: 34.0522, lng: -118.2437, label: 'Los Angeles' },
            { id: 'sd', lat: 32.7157, lng: -117.1611, label: 'San Diego' },
          ]"
          :viewport="{ mode: 'fit', padding: 50 }"
          @marker-click="handleMarkerClick"
        />
      </div>
    </Variant>

    <Variant :title="interactiveClickRoutes">
      <div class="w-full max-w-2xl">
        <div v-if="mapState.selectedRoute" class="mb-4 rounded-lg bg-primary/10 p-3 text-sm">
          Selected route: <strong>{{ mapState.selectedRoute }}</strong>
          <button
            class="ml-2 text-xs underline"
            @click="mapState.selectedRoute = null"
          >
            Clear
          </button>
        </div>
        <geo-map
          id="geo-map-routes-interactive"
          title="Clickable Routes"
          description="Click on any route to select it"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: 'Hub A' },
            { id: '2', lat: 37.7849, lng: -122.4094, label: 'Stop 1' },
            { id: '3', lat: 37.7949, lng: -122.3994, label: 'Stop 2' },
            { id: '4', lat: 37.7649, lng: -122.4294, label: 'Hub B' },
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
              label: 'Route A',
            },
            {
              id: 'route-b',
              points: [
                { lat: 37.7749, lng: -122.4194 },
                { lat: 37.7649, lng: -122.4294 },
              ],
              color: '#ef4444',
              label: 'Route B',
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
          title="High Density Markers"
          description="Many markers in a small area"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: 'Location 1' },
            { id: '2', lat: 37.775, lng: -122.4195, label: 'Location 2' },
            { id: '3', lat: 37.7748, lng: -122.4193, label: 'Location 3' },
            { id: '4', lat: 37.7751, lng: -122.4196, label: 'Location 4' },
            { id: '5', lat: 37.7747, lng: -122.4192, label: 'Location 5' },
            { id: '6', lat: 37.7752, lng: -122.4197, label: 'Location 6' },
            { id: '7', lat: 37.7746, lng: -122.4191, label: 'Location 7' },
            { id: '8', lat: 37.7753, lng: -122.4198, label: 'Location 8' },
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
            { id: '1', lat: 51.5074, lng: -0.1278, label: 'London' },
            { id: '2', lat: 48.8566, lng: 2.3522, label: 'Paris' },
            { id: '3', lat: 52.5200, lng: 13.4050, label: 'Berlin' },
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
          title="Popular Destinations"
          :markers="[
            { id: '1', lat: 40.7589, lng: -73.9851, label: 'Times Square', icon: { type: 'image', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/300px-PNG_transparency_demonstration_1.png', width: 32, height: 32 } },
            { id: '2', lat: 40.7489, lng: -73.968, label: 'Central Park', icon: { type: 'emoji', value: '🌳' } },
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
          title="Priority Locations"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: 'High Priority', icon: { type: 'dot', color: '#ef4444', radius: 10 } },
            { id: '2', lat: 37.7849, lng: -122.4094, label: 'Medium Priority', icon: { type: 'dot', color: '#f59e0b', radius: 8 } },
            { id: '3', lat: 37.7649, lng: -122.4294, label: 'Low Priority', icon: { type: 'dot', color: '#10b981', radius: 6 } },
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
          title="High Density Points"
          description="Many markers in a small area with clustering enabled"
          :markers="[
            { id: '1', lat: 37.7749, lng: -122.4194, label: 'Point 1' },
            { id: '2', lat: 37.775, lng: -122.4195, label: 'Point 2' },
            { id: '3', lat: 37.7748, lng: -122.4193, label: 'Point 3' },
            { id: '4', lat: 37.7751, lng: -122.4196, label: 'Point 4' },
            { id: '5', lat: 37.7747, lng: -122.4192, label: 'Point 5' },
            { id: '6', lat: 37.7752, lng: -122.4197, label: 'Point 6' },
            { id: '7', lat: 37.7746, lng: -122.4191, label: 'Point 7' },
            { id: '8', lat: 37.7753, lng: -122.4198, label: 'Point 8' },
            { id: '9', lat: 37.7745, lng: -122.419, label: 'Point 9' },
            { id: '10', lat: 37.7754, lng: -122.4199, label: 'Point 10' },
            { id: '11', lat: 37.7744, lng: -122.4189, label: 'Point 11' },
            { id: '12', lat: 37.7755, lng: -122.42, label: 'Point 12' },
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
          title="Multi-Stop Delivery"
          description="Optimized route with multiple waypoints"
          :markers="[
            { id: 'depot', lat: 37.7749, lng: -122.4194, label: 'Depot', icon: { type: 'emoji', value: '🏭' } },
            { id: 'stop1', lat: 37.7849, lng: -122.4094, label: 'Stop 1', icon: { type: 'emoji', value: '📦' } },
            { id: 'stop2', lat: 37.7949, lng: -122.3994, label: 'Stop 2', icon: { type: 'emoji', value: '📦' } },
            { id: 'stop3', lat: 37.7649, lng: -122.4294, label: 'Stop 3', icon: { type: 'emoji', value: '📦' } },
            { id: 'stop4', lat: 37.7549, lng: -122.4394, label: 'Stop 4', icon: { type: 'emoji', value: '📦' } },
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
              label: 'Delivery Route',
              description: 'Main delivery path for today',
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
          title="Fixed Center"
          description="Using center mode with specific coordinates"
          :markers="[
            { id: '1', lat: 35.6762, lng: 139.6503, label: 'Tokyo' },
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
          title="No Zoom Controls"
          description="Map without zoom control buttons"
          :markers="[
            { id: '1', lat: 51.5074, lng: -0.1278, label: 'London' },
            { id: '2', lat: 48.8566, lng: 2.3522, label: 'Paris' },
          ]"
          :show-zoom-control="false"
          :viewport="{ mode: 'fit', padding: 50 }"
        />
      </div>
    </Variant>
  </Story>
</template>
