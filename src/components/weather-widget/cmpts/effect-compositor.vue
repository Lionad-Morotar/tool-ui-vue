<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

defineOptions({ name: 'CmptEffectCompositor', inheritAttrs: false })
import WeatherEffectsCanvas from './weather-effects-canvas.vue';
import { resolveWeatherEffectsCanvasRuntimeProps } from '../effects/canvas-resolver-runtime';
import {
  resolveEffectCanvasDpr,
  resolveEffectQuality,
} from '../effects/effect-compositor-quality';
import { TUNED_WEATHER_EFFECTS_CHECKPOINT_OVERRIDES } from '../effects/generated/tuned-presets.generated';
import type { WeatherEffectsTunedPresets } from '../effects/tuning';
import type { EffectSettings } from '../effects/types';
import type { WeatherEffectsCanvasProps } from '../effects/weather-effects-types';
import type { WeatherConditionCode } from '../schema';

const DEFAULT_TUNED_PRESETS: WeatherEffectsTunedPresets =
  TUNED_WEATHER_EFFECTS_CHECKPOINT_OVERRIDES;

interface EffectCompositorProps {
  conditionCode: WeatherConditionCode;
  windSpeed?: number;
  precipitationLevel?: 'none' | 'light' | 'moderate' | 'heavy';
  visibility?: number;
  timestamp?: string;
  timeOfDay?: number;
  settings?: EffectSettings;
  css?: { root?: string };
}

const props = defineProps<EffectCompositorProps>();

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

const enabled = computed(() => props.settings?.enabled !== false);
const reducedMotion = computed(() => props.settings?.reducedMotion ?? false);

const resolvedQuality = computed(() =>
  resolveEffectQuality(props.settings?.quality ?? 'auto')
);

const dpr = computed(() => resolveEffectCanvasDpr(resolvedQuality.value));

const canvasProps = computed<WeatherEffectsCanvasProps | null>(() => {
  if (!enabled.value || reducedMotion.value) return null;

  return resolveWeatherEffectsCanvasRuntimeProps({
    conditionCode: props.conditionCode,
    windSpeed: props.windSpeed,
    precipitationLevel: props.precipitationLevel,
    visibility: props.visibility,
    timestamp: props.timestamp,
    timeOfDay: props.timeOfDay,
    tunedPresets: DEFAULT_TUNED_PRESETS,
  });
});

const shouldRender = computed(() => {
  return (
    isMounted.value &&
    enabled.value &&
    !reducedMotion.value &&
    canvasProps.value !== null
  );
});
</script>

<template>
  <div
    v-if="shouldRender"
    v-bind="$attrs"
    :class="css?.root"
    style="
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      border-radius: inherit;
    "
    aria-hidden="true"
  >
    <weather-effects-canvas
      class="absolute inset-0"
      :dpr="dpr"
      v-bind="canvasProps!"
    />
  </div>
</template>
