<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core';
import { computed } from 'vue';
import { cn } from './_adapter';
import EffectCompositor from './cmpts/effect-compositor.vue';
import { TUNED_WEATHER_EFFECTS_CHECKPOINT_OVERRIDES } from './effects/generated/tuned-presets.generated';
import { getSceneBrightnessFromTimeOfDay, getWeatherTheme } from './effects/parameter-mapper';
import { getNearestCheckpoint } from './effects/tuning';
import { resolveWeatherTime, snapTimeOfDayToNearestCheckpoint } from './time';
import WeatherDataOverlay from './cmpts/weather-data-overlay.vue';
import type { WeatherWidgetProps } from './schema';

defineOptions({ name: 'cmpt-weather-widget', inheritAttrs: false })

const props = withDefaults(defineProps<WeatherWidgetProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

// Use VueUse for reduced motion preference
const preferredReducedMotion = usePreferredReducedMotion();

// Resolve reduced motion from props or system preference
const reducedMotion = computed(() => {
  // If explicitly set in props.effects, use that
  if (typeof props.effects?.reducedMotion === 'boolean') {
    return props.effects.reducedMotion;
  }
  // Otherwise use system preference
  return preferredReducedMotion.value === 'reduce';
});

// Determine if effects are enabled
const effectsEnabled = computed(() => {
  if (reducedMotion.value) return false;
  return props.effects?.enabled !== false;
});

// Resolve time
const resolvedTime = computed(() => {
  return resolveWeatherTime({
    time: props.time,
    updatedAt: props.updatedAt,
  });
});

const timeOfDay = computed(() => {
  return snapTimeOfDayToNearestCheckpoint(resolvedTime.value.timeOfDay);
});

// Get tuned overrides for glass effects
const tunedOverrides = computed(() => {
  return TUNED_WEATHER_EFFECTS_CHECKPOINT_OVERRIDES[props.current.conditionCode];
});

const checkpointOverrides = computed(() => {
  const checkpoint = getNearestCheckpoint(timeOfDay.value);
  return tunedOverrides.value?.[checkpoint];
});

const glassParams = computed(() => {
  return checkpointOverrides.value?.glass;
});

// Calculate theme based on brightness
const brightness = computed(() => {
  return getSceneBrightnessFromTimeOfDay(
    timeOfDay.value,
    props.current.conditionCode
  );
});

const weatherTheme = computed(() => {
  return getWeatherTheme(brightness.value);
});

const isWeatherDark = computed(() => weatherTheme.value === 'dark');

// Units with default fallback
const units = computed(() => {
  return props.units ?? { temperature: 'celsius' as const };
});

const backgroundClass = computed(() => {
  return isWeatherDark.value
    ? 'bg-gradient-to-b from-zinc-950 via-zinc-900/70 to-zinc-950'
    : 'bg-gradient-to-b from-sky-50 via-sky-100/70 to-white';
});
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
          backgroundClass
        )
      "
    >
      <!-- Effects Layer -->
      <effect-compositor
        v-if="effectsEnabled"
        class="absolute inset-0"
        :condition-code="current.conditionCode"
        :wind-speed="current.windSpeed"
        :precipitation-level="current.precipitationLevel"
        :visibility="current.visibility"
        :timestamp="updatedAt"
        :time-of-day="timeOfDay"
        :settings="{ enabled: true, reducedMotion: false }"
      />

      <!-- Weather Data Overlay -->
      <weather-data-overlay
        :location="location.name"
        :condition-code="current.conditionCode"
        :temperature="current.temperature"
        :temp-high="current.tempMax"
        :temp-low="current.tempMin"
        :forecast="forecast"
        :unit="units.temperature"
        :theme="weatherTheme"
        :time-of-day="timeOfDay"
        :timestamp="updatedAt"
        :reduced-motion="reducedMotion"
        :glass-params="glassParams"
      />
    </div>
  </article>
</template>
