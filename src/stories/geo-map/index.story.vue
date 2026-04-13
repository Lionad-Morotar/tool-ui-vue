
<script setup lang="ts">
import { reactive } from 'vue';
import { GeoMap } from '@lionad/vtu-components';
import type { GeoMapMarker, GeoMapRoute } from '@lionad/vtu-components/geo-map/schema';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n';

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const GeoMapPropsTitle = useStoryLocale('content.geoMapProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = GeoMapPropsTitle

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
const denseClusteringTitle = useStoryLocale('content.denseClusteringTitle', messages)
const denseClusteringDesc = useStoryLocale('content.denseClusteringDesc', messages)
const densePointPrefix = useStoryLocale('content.densePointPrefix', messages)
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
const singleMarker = useStoryLocale('content.singleMarker', messages)
const multipleMarkers = useStoryLocale('content.multipleMarkers', messages)
const withRoutes = useStoryLocale('content.withRoutes', messages)
const interactiveClickMarkers = useStoryLocale('content.interactiveClickMarkers', messages)
const interactiveClickRoutes = useStoryLocale('content.interactiveClickRoutes', messages)
const withImageIcons = useStoryLocale('content.withImageIcons', messages)
const withCustomDotIcons = useStoryLocale('content.withCustomDotIcons', messages)
const denseClusteringDemo = useStoryLocale('content.denseClusteringDemo', messages)
const complexRouteWithStyling = useStoryLocale('content.complexRouteWithStyling', messages)

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

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件的唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'role', type: "'information' | 'decision' | 'control' | 'state' | 'composite'", description: { zh: '组件的 ARIA 角色', en: 'ARIA role of the component' } },
  { name: 'receipt', type: 'ToolUIReceipt', description: { zh: '工具调用回执状态', en: 'Tool call receipt state' } },
  { name: 'title', type: 'string', description: { zh: '地图标题', en: 'Map title' } },
  { name: 'description', type: 'string', description: { zh: '地图描述', en: 'Map description' } },
  { name: 'markers', type: 'GeoMapMarker[]', required: true, description: { zh: '标记点数组', en: 'Array of map markers' } },
  { name: 'routes', type: 'GeoMapRoute[]', description: { zh: '路线数组', en: 'Array of map routes' } },
  { name: 'clustering', type: 'GeoMapClustering', description: { zh: '聚类配置', en: 'Marker clustering configuration' } },
  { name: 'viewport', type: 'GeoMapViewport', description: { zh: '视口配置（适配或居中）', en: 'Viewport configuration (fit or center)' } },
  { name: 'showZoomControl', type: 'boolean', default: 'true', description: { zh: '是否显示缩放控件', en: 'Whether to show zoom controls' } },
  { name: 'theme', type: "'light' | 'dark'", description: { zh: '地图主题', en: 'Map theme' } },
  { name: 'css', type: '{ root?: string; title?: string; canvas?: string; overlay?: string; controls?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]
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

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ componentPropsTitle }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ (prop as any).default ?? '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
