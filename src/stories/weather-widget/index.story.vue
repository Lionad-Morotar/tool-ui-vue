<script setup lang="ts">
import { WeatherWidget } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const WeatherWidgetProps = useStoryLocale('content.weatherWidgetProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = WeatherWidgetProps

const locLA = useStoryLocale('content.locLA', messages)
const dayTue = useStoryLocale('content.dayTue', messages)
const dayWed = useStoryLocale('content.dayWed', messages)
const dayThu = useStoryLocale('content.dayThu', messages)
const dayFri = useStoryLocale('content.dayFri', messages)
const daySat = useStoryLocale('content.daySat', messages)
const sunny = useStoryLocale('content.sunny', messages)

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件的唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'location', type: 'WeatherWidgetLocation', required: true, description: { zh: '位置信息（名称、坐标等）', en: 'Location information (name, coordinates, etc.)' } },
  { name: 'units', type: '{ temperature: TemperatureUnit }', required: true, description: { zh: '温度单位（celsius 或 fahrenheit）', en: 'Temperature unit (celsius or fahrenheit)' } },
  { name: 'current', type: 'WeatherWidgetCurrent', required: true, description: { zh: '当前天气数据', en: 'Current weather data' } },
  { name: 'forecast', type: 'ForecastDay[]', required: true, description: { zh: '未来几天预报数据', en: 'Daily forecast data' } },
  { name: 'time', type: 'WeatherWidgetTime', description: { zh: '时间配置（可选）', en: 'Time configuration (optional)' } },
  { name: 'updatedAt', type: 'string', description: { zh: '最后更新时间（ISO 8601）', en: 'Last updated time (ISO 8601)' } },
  { name: 'css', type: '{ root?: string; header?: string; current?: string; forecast?: string; canvas?: string; overlay?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
  { name: 'effects', type: 'EffectSettings', description: { zh: '特效设置（启用、质量、减少动画）', en: 'Effect settings (enabled, quality, reduced motion)' } },
]
</script>

<template>
  <Story title="WeatherWidget/All Variants">
    <Variant :title="sunny">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-sunny"
          :location="{ name: locLA }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{
            conditionCode: 'clear',
            temperature: 78,
            tempMin: 65,
            tempMax: 82,
          }"
          :forecast="[
            { label: dayTue, conditionCode: 'clear', tempMin: 64, tempMax: 80 },
            { label: dayWed, conditionCode: 'partly-cloudy', tempMin: 62, tempMax: 78 },
            { label: dayThu, conditionCode: 'clear', tempMin: 65, tempMax: 83 },
            { label: dayFri, conditionCode: 'clear', tempMin: 66, tempMax: 85 },
            { label: daySat, conditionCode: 'partly-cloudy', tempMin: 63, tempMax: 79 },
          ]"
          :updated-at="new Date().toISOString()"
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
