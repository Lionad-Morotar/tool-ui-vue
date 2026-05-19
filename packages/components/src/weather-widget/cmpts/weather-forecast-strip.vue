<script setup lang="ts">
defineOptions({ name: 'CmptWeatherForecastStrip', inheritAttrs: false })

import { cn } from '../../core';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudHail,
  Wind,
} from 'lucide-vue-next';
import { computed } from 'vue';
import type { ForecastDay, WeatherConditionCode } from '../schema';
import type { StyleValue } from 'vue';

const conditionIcons: Record<WeatherConditionCode, typeof Sun> = {
  clear: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  overcast: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  'heavy-rain': CloudRain,
  thunderstorm: CloudLightning,
  snow: Snowflake,
  sleet: CloudHail,
  hail: CloudHail,
  windy: Wind,
};

interface WeatherForecastStripProps {
  forecast: ForecastDay[];
  isDark: boolean;
  textPrimary: string;
  textSubtle: string;
  bgOpacity: number;
  resolvedGlassStyles: Record<string, string | number | undefined>;
  edgeShineStyle: StyleValue;
  innerGlowStyle: StyleValue;
  forecastTextShadow?: string;
  css?: {
    forecast?: string;
  };
}

const props = defineProps<WeatherForecastStripProps>();

const forecastFontFamily = '"SF Pro Text", Inter, "Noto Sans", system-ui, sans-serif';
const fontFeatureSettings = '"tnum" 1, "case" 1';

const forecastItemStyle = computed(() => ({
  fontFamily: forecastFontFamily,
  fontFeatureSettings,
  textShadow: props.forecastTextShadow,
}));

const forecastCardStyle = computed(() => ({
  backgroundColor: `rgba(255, 255, 255, ${props.bgOpacity})`,
  ...props.resolvedGlassStyles,
}));
</script>

<template>
  <div v-if="forecast.length > 0" :class="cn('px-3 pb-3', css?.forecast)">
    <div
      class="weather-forecast-strip relative hidden"
    >
      <!-- Edge shine - outside overflow-hidden so it aligns with border -->
      <div
        class="pointer-events-none absolute inset-0 z-10 rounded-xl transition-opacity duration-300 ease-out"
        :style="edgeShineStyle"
      />
      <div
        class="relative overflow-hidden rounded-xl px-3 py-2.5"
        :style="forecastCardStyle"
      >
        <!-- Inner glow -->
        <div
          class="pointer-events-none absolute inset-0 mix-blend-color-dodge transition-opacity duration-300 ease-out"
          :style="innerGlowStyle"
        />
        <div class="relative flex items-center justify-between">
          <div
            v-for="(day, index) in forecast.slice(0, 5)"
            :key="`${day.label}-${index}`"
            class="flex flex-1 flex-col items-center gap-0.5"
            :style="forecastItemStyle"
          >
            <span
              :class="
                cn(
                  'text-[10px] tracking-[0.08em] uppercase',
                  index === 0 ? 'font-semibold' : 'font-medium',
                  textPrimary
                )
              "
            >
              {{ day.label }}
            </span>
            <component
              :is="conditionIcons[day.conditionCode]"
              :class="
                cn(
                  'my-0.5 shrink-0 size-5',
                  textPrimary,
                  index === 0 ? 'opacity-100' : 'opacity-70',
                  'weather-forecast-icon hidden'
                )
              "
              :stroke-width="1.5"
              aria-hidden="true"
            />
            <div class="flex flex-col items-center gap-0.5">
              <span
                :class="
                  cn(
                    'text-[15px] leading-[1.2] tracking-[-0.01em] tabular-nums',
                    index === 0 ? 'font-semibold' : 'font-medium',
                    textPrimary
                  )
                "
              >
                {{ Math.round(day.tempMax) }}°
              </span>
              <span
                :class="
                  cn(
                    'text-[12px] leading-[1.3] font-normal tabular-nums',
                    textPrimary
                  )
                "
              >
                {{ Math.round(day.tempMin) }}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@container weather (min-height: 245px) {
  :deep(.weather-forecast-strip) {
    display: block !important;
  }
}
@container weather (min-height: 280px) {
  :deep(.weather-forecast-icon) {
    display: block !important;
  }
}
</style>
