<script setup lang="ts">
import { ref } from 'vue';
import { useWeatherEffects } from './composables/useWeatherEffects';
import { resolveWeatherEffectsCanvasRuntimeProps } from './effects/weather-effects-props';
import type { WeatherEffectsCanvasProps } from './effects/weather-effects-types';

const props = defineProps<WeatherEffectsCanvasProps>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

useWeatherEffects(canvasRef, () =>
  resolveWeatherEffectsCanvasRuntimeProps({
    dpr: props.dpr,
    layers: props.layers,
    celestial: props.celestial,
    cloud: props.cloud,
    rain: props.rain,
    lightning: props.lightning,
    snow: props.snow,
    interactions: props.interactions,
    post: props.post,
  }),
);
</script>

<template>
  <canvas
    ref="canvasRef"
    :class="className"
    style="width: 100%; height: 100%"
  />
</template>
