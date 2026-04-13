<script setup lang="ts">
import { reactive } from 'vue';
import { GeoMap } from '@lionad/vtu-components';
import type { GeoMapMarker, GeoMapRoute } from '@lionad/vtu-components/geo-map/schema';
import { useStoryLocale } from './_shared/use-story-locale';

const singleMarkerTitle = useStoryLocale({ zh: '位置', en: 'Location' })
const singleMarkerDesc = useStoryLocale({ zh: '办公室总部', en: 'Office headquarters' })
const sfLabel = useStoryLocale({ zh: '旧金山', en: 'San Francisco' })
const multipleMarkersTitle = useStoryLocale({ zh: '办公室位置', en: 'Office Locations' })
const multipleMarkersDesc = useStoryLocale({ zh: '我们在加州的办公室', en: 'Our offices across California' })
const laLabel = useStoryLocale({ zh: '洛杉矶', en: 'Los Angeles' })
const sdLabel = useStoryLocale({ zh: '圣地亚哥', en: 'San Diego' })
const withRoutesTitle = useStoryLocale({ zh: '配送路线', en: 'Delivery Route' })
const withRoutesDesc = useStoryLocale({ zh: '优化的配送路径', en: 'Optimized delivery path' })
const startLabel = useStoryLocale({ zh: '起点', en: 'Start' })
const stop1Label = useStoryLocale({ zh: '站点 1', en: 'Stop 1' })
const stop2Label = useStoryLocale({ zh: '站点 2', en: 'Stop 2' })
const endLabel = useStoryLocale({ zh: '终点', en: 'End' })
const mainRouteLabel = useStoryLocale({ zh: '主路线', en: 'Main Route' })
const withCustomIconsTitle = useStoryLocale({ zh: '兴趣点', en: 'Points of Interest' })
const restaurantLabel = useStoryLocale({ zh: '餐厅', en: 'Restaurant' })
const hotelLabel = useStoryLocale({ zh: '酒店', en: 'Hotel' })
const parkLabel = useStoryLocale({ zh: '公园', en: 'Park' })
const darkThemeTitle = useStoryLocale({ zh: '夜间模式', en: 'Night Mode' })
const nyLabel = useStoryLocale({ zh: '纽约', en: 'New York' })
const timesSquareLabel = useStoryLocale({ zh: '时代广场', en: 'Times Square' })
const interactiveClickMarkersTitle = useStoryLocale({ zh: '可点击标记', en: 'Clickable Markers' })
const interactiveClickMarkersDesc = useStoryLocale({ zh: '点击任意标记以选中', en: 'Click on any marker to select it' })
const selectedMarkerText = useStoryLocale({ zh: '已选标记:', en: 'Selected marker:' })
const clearButtonText = useStoryLocale({ zh: '清除', en: 'Clear' })
const interactiveClickRoutesTitle = useStoryLocale({ zh: '可点击路径', en: 'Clickable Routes' })
const interactiveClickRoutesDesc = useStoryLocale({ zh: '点击任意路径以选中', en: 'Click on any route to select it' })
const selectedRouteText = useStoryLocale({ zh: '已选路径:', en: 'Selected route:' })
const hubALabel = useStoryLocale({ zh: '枢纽 A', en: 'Hub A' })
const hubBLabel = useStoryLocale({ zh: '枢纽 B', en: 'Hub B' })
const routeALabel = useStoryLocale({ zh: '路线 A', en: 'Route A' })
const routeBLabel = useStoryLocale({ zh: '路线 B', en: 'Route B' })
const withClusteringTitle = useStoryLocale({ zh: '高密度标记', en: 'High Density Markers' })
const withClusteringDesc = useStoryLocale({ zh: '小区域内的大量标记', en: 'Many markers in a small area' })
const denseLocationPrefix = useStoryLocale({ zh: '位置', en: 'Location' })
const denseClusteringTitle = useStoryLocale({ zh: '高密度点', en: 'High Density Points' })
const denseClusteringDesc = useStoryLocale({ zh: '小区域内的大量标记点，已启用聚合', en: 'Many markers in a small area with clustering enabled' })
const densePointPrefix = useStoryLocale({ zh: '点', en: 'Point' })
const londonLabel = useStoryLocale({ zh: '伦敦', en: 'London' })
const parisLabel = useStoryLocale({ zh: '巴黎', en: 'Paris' })
const berlinLabel = useStoryLocale({ zh: '柏林', en: 'Berlin' })
const withImageIconsTitle = useStoryLocale({ zh: '热门目的地', en: 'Popular Destinations' })
const centralParkLabel = useStoryLocale({ zh: '中央公园', en: 'Central Park' })
const withCustomDotIconsTitle = useStoryLocale({ zh: '优先级位置', en: 'Priority Locations' })
const highPriorityLabel = useStoryLocale({ zh: '高优先级', en: 'High Priority' })
const mediumPriorityLabel = useStoryLocale({ zh: '中优先级', en: 'Medium Priority' })
const lowPriorityLabel = useStoryLocale({ zh: '低优先级', en: 'Low Priority' })
const complexRouteTitle = useStoryLocale({ zh: '多站配送', en: 'Multi-Stop Delivery' })
const complexRouteDesc = useStoryLocale({ zh: '多路经点优化路线', en: 'Optimized route with multiple waypoints' })
const depotLabel = useStoryLocale({ zh: '仓库', en: 'Depot' })
const deliveryRouteLabel = useStoryLocale({ zh: '配送路线', en: 'Delivery Route' })
const deliveryRouteDesc = useStoryLocale({ zh: '今日主要配送路线', en: 'Main delivery path for today' })
const centerViewportTitle = useStoryLocale({ zh: '固定中心', en: 'Fixed Center' })
const centerViewportDesc = useStoryLocale({ zh: '使用中心模式和指定坐标', en: 'Using center mode with specific coordinates' })
const tokyoLabel = useStoryLocale({ zh: '东京', en: 'Tokyo' })
const withoutZoomTitle = useStoryLocale({ zh: '无缩放控件', en: 'No Zoom Controls' })
const withoutZoomDesc = useStoryLocale({ zh: '没有缩放控件按钮的地图', en: 'Map without zoom control buttons' })

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
