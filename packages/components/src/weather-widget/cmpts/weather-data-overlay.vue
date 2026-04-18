<script setup lang="ts">
defineOptions({ name: 'CmptWeatherDataOverlay', inheritAttrs: false })

import { cn } from '../../core';
import { computed } from 'vue';
import { useGlassStyles } from '../composables/useGlassStyles';
import { useGlowEffect } from '../composables/useGlowEffect';
import {
  getSceneBrightnessFromTimeOfDay,
  getTimeOfDay,
  getWeatherTheme,
  type WeatherTheme,
} from '../effects/parameter-mapper';
import WeatherCurrentDisplay from './weather-current-display.vue';
import WeatherForecastStrip from './weather-forecast-strip.vue';
import type {
  ForecastDay,
  TemperatureUnit,
  WeatherConditionCode,
  WeatherDataOverlayCss,
} from '../schema';

interface GlassEffectParams {
  enabled?: boolean;
  depth?: number;
  strength?: number;
  chromaticAberration?: number;
  blur?: number;
  brightness?: number;
  saturation?: number;
}

interface WeatherDataOverlayProps {
  location: string;
  conditionCode: WeatherConditionCode;
  temperature: number;
  tempHigh: number;
  tempLow: number;
  forecast?: ForecastDay[];
  unit?: TemperatureUnit;
  theme?: WeatherTheme;
  timeOfDay?: number;
  timestamp?: string;
  css?: WeatherDataOverlayCss;
  reducedMotion?: boolean;
  glassParams?: GlassEffectParams;
}

const props = withDefaults(defineProps<WeatherDataOverlayProps>(), {
  forecast: () => [],
  unit: 'fahrenheit',
  theme: undefined,
  timeOfDay: undefined,
  timestamp: undefined,
  css: () => ({}),
  reducedMotion: false,
  glassParams: undefined,
});

// Resolved time of day
const resolvedTimeOfDay = computed(() => {
  if (typeof props.timeOfDay === 'number') {
    return props.timeOfDay;
  }
  if (typeof props.timestamp === 'string') {
    return getTimeOfDay(props.timestamp);
  }
  return 0.5;
});

// Theme calculation
const theme = computed(() => {
  if (props.theme) return props.theme;
  const brightness = getSceneBrightnessFromTimeOfDay(
    resolvedTimeOfDay.value,
    props.conditionCode
  );
  return getWeatherTheme(brightness);
});

const isDark = computed(() => theme.value === 'dark');

// Glow effect composable
const { cardRef, containerRef, cardDimensions, edgeShineStyle, innerGlowStyle } = useGlowEffect(
  isDark,
  computed(() => props.reducedMotion)
);

// Text colors based on theme
const textPrimary = computed(() => (isDark.value ? 'text-white' : 'text-black'));
const textPrimarySoft = computed(() =>
  isDark.value ? 'text-white/90' : 'text-black/85'
);
const textSecondary = computed(() =>
  isDark.value ? 'text-white/80' : 'text-black/80'
);
const textSubtle = computed(() =>
  isDark.value ? 'text-white/40' : 'text-black/40'
);

// Peak intensity for lighting effects
const peakIntensity = computed(() => {
  const timeOfDay = resolvedTimeOfDay.value;
  const noonDistance = Math.abs(timeOfDay - 0.5);
  const midnightDistance = Math.min(timeOfDay, 1 - timeOfDay);
  const minDistance = Math.min(noonDistance, midnightDistance);
  return Math.max(0, 1 - minDistance * 4);
});

// Background opacity calculation
const bgOpacity = computed(() => {
  const baseBgOpacity = isDark.value ? 0.04 : 0.04;
  return baseBgOpacity * (1 - peakIntensity.value * 0.7);
});

// Blur amount calculation
const blurAmount = computed(() => {
  const timeOfDay = resolvedTimeOfDay.value;
  const midnightDistance = Math.min(timeOfDay, 1 - timeOfDay);
  const baseBlur = isDark.value ? 2 + midnightDistance * 38 : 24;
  return isDark.value
    ? baseBlur
    : baseBlur - peakIntensity.value * (baseBlur - 8);
});

// Dawn intensity for text shadow
const dawnIntensity = computed(() => {
  const timeOfDay = resolvedTimeOfDay.value;
  const isDawn = timeOfDay > 0.1 && timeOfDay < 0.4;
  return isDawn ? 1 - Math.abs(timeOfDay - 0.25) * 4 : 0;
});

const forecastTextShadow = computed(() => {
  if (dawnIntensity.value > 0) {
    return `0 0.5px 1px rgba(0,0,0,${(dawnIntensity.value * 0.4).toFixed(2)})`;
  }
  return undefined;
});

const shadowStyle = computed(() =>
  isDark.value
    ? '0 1px 8px rgba(0,0,0,0.3)'
    : '0 1px 8px rgba(255,255,255,0.3)'
);

// Glass effect styles
const glassEnabled = computed(() => props.glassParams?.enabled !== false);

const glassStyles = useGlassStyles({
  width: cardDimensions.value.width,
  height: cardDimensions.value.height,
  depth: props.glassParams?.depth ?? 3,
  radius: 12,
  strength: props.glassParams?.strength ?? 75,
  chromaticAberration: props.glassParams?.chromaticAberration ?? 6,
  blur: props.glassParams?.blur ?? 1.5,
  brightness: props.glassParams?.brightness ?? 0.8,
  saturation: props.glassParams?.saturation ?? 1.3,
  enabled: glassEnabled.value,
});

// Resolved glass backdrop filter styles
const resolvedGlassStyles = computed<Record<string, string | undefined>>(() => {
  const hasBackdropFilter = Boolean(glassStyles.value.backdropFilter);
  if (hasBackdropFilter) return glassStyles.value as Record<string, string | undefined>;

  const blur = `blur(${blurAmount.value}px)`;
  return {
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
  };
});
</script>

<template>
  <div
    ref="containerRef"
    v-bind="$attrs"
    :class="
      cn(
        'pointer-events-auto absolute inset-0 z-10 flex flex-col select-none',
        props.css?.root
      )
    "
  >
    <WeatherCurrentDisplay
      :location="location"
      :temperature="temperature"
      :temp-high="tempHigh"
      :temp-low="tempLow"
      :unit="unit"
      :is-dark="isDark"
      :text-primary="textPrimary"
      :text-primary-soft="textPrimarySoft"
      :text-secondary="textSecondary"
      :text-subtle="textSubtle"
      :shadow-style="shadowStyle"
      :css="{ header: props.css?.header, current: props.css?.current }"
    />

    <!-- Spacer -->
    <div class="flex-1" />

    <div ref="cardRef">
      <WeatherForecastStrip
        :forecast="forecast"
      :is-dark="isDark"
      :text-primary="textPrimary"
      :text-subtle="textSubtle"
      :bg-opacity="bgOpacity"
      :resolved-glass-styles="resolvedGlassStyles"
      :edge-shine-style="edgeShineStyle"
      :inner-glow-style="innerGlowStyle"
      :forecast-text-shadow="forecastTextShadow"
      :css="{ forecast: props.css?.forecast }"
    />
  </div>
  </div>
</template>
