<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { reactive } from 'vue';
import EffectCompositor from './cmpts/effect-compositor.vue';
import WeatherDataOverlay from './cmpts/weather-data-overlay.vue';
import { useWeatherWidget } from './states';
import type { WeatherWidgetProps } from './schema';

defineOptions({ name: 'CmptWeatherWidget', inheritAttrs: false })

const props = withDefaults(defineProps<WeatherWidgetProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

// All business logic delegated to states layer
const state = reactive(useWeatherWidget(props));
</script>

<template>
  <article
    v-bind="$attrs"
    data-slot="weather-widget"
    :data-tool-ui-id="id"
    :class="cn('isolate w-full max-w-md', css?.root)"
  >
    <div
      :class="
        cn(
          '@container/weather [container-type:size] relative aspect-[4/3] overflow-clip rounded-2xl border-0 p-0 shadow-none',
          state.backgroundClass
        )
      "
    >
      <!-- Effects Layer -->
      <effect-compositor
        v-if="state.effectsEnabled"
        class="absolute inset-0"
        :condition-code="current.conditionCode"
        :wind-speed="current.windSpeed"
        :precipitation-level="current.precipitationLevel"
        :visibility="current.visibility"
        :timestamp="updatedAt"
        :time-of-day="state.timeOfDay"
        :settings="{ enabled: state.effectsEnabled, reducedMotion: state.reducedMotion }"
      />

      <!-- Weather Data Overlay -->
      <weather-data-overlay
        :location="location.name"
        :condition-code="current.conditionCode"
        :temperature="current.temperature"
        :temp-high="current.tempMax"
        :temp-low="current.tempMin"
        :forecast="forecast"
        :unit="state.units.temperature"
        :theme="state.weatherTheme"
        :time-of-day="state.timeOfDay"
        :timestamp="updatedAt"
        :reduced-motion="state.reducedMotion"
        :glass-params="state.glassParams"
      />
    </div>
  </article>
</template>
