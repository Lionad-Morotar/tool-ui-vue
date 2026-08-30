
<script setup lang="ts">
import { GeoMap } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

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
const singleMarker = useStoryLocale('content.singleMarker', messages)

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
