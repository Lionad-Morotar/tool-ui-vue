<script setup lang="ts">
defineOptions({ name: 'CmptWeatherCurrentDisplay', inheritAttrs: false })

import { cn } from '../../core';
import { useI18n } from '../../core/i18n';
import { computed } from 'vue';
import type { TemperatureUnit } from '../schema';

interface WeatherCurrentDisplayProps {
  location: string;
  temperature: number;
  tempHigh: number;
  tempLow: number;
  unit: TemperatureUnit;
  isDark: boolean;
  textPrimary: string;
  textPrimarySoft: string;
  textSecondary: string;
  textSubtle: string;
  shadowStyle: string;
  css?: {
    header?: string;
    current?: string;
  };
}

const props = defineProps<WeatherCurrentDisplayProps>();

const { t } = useI18n();
const roundedTemperature = computed(() => Math.round(props.temperature));
const unitSymbol = computed(() => (props.unit === 'celsius' ? 'C' : 'F'));
const spokenUnit = computed(() => {
  const key = props.unit === 'celsius'
    ? 'weatherWidget.spokenUnitCelsius'
    : 'weatherWidget.spokenUnitFahrenheit';
  return t(key).value;
});

const forecastFontFamily = '"SF Pro Text", Inter, "Noto Sans", system-ui, sans-serif';
const fontFeatureSettings = '"tnum" 1, "case" 1';

const locationStyle = computed(() => ({
  fontSize: 'clamp(13px, 7.5cqmin, 17px)',
  fontFamily: forecastFontFamily,
  textShadow: props.shadowStyle,
}));

const temperatureStyle = computed(() => ({
  fontSize: 'clamp(48px, 32cqmin, 72px)',
  fontFamily: forecastFontFamily,
  fontFeatureSettings,
  textShadow: props.isDark
    ? '0 2px 20px rgba(0,0,0,0.25)'
    : '0 2px 20px rgba(255,255,255,0.3)',
}));

const degreeStyle = computed(() => ({
  fontSize: 'clamp(18px, 12cqmin, 28px)',
  fontFamily: forecastFontFamily,
  fontFeatureSettings,
}));

const hiLoStyle = computed(() => ({
  fontSize: 'clamp(11px, 6.5cqmin, 15px)',
}));

const hiLoContainerStyle = computed(() => ({
  fontFamily: forecastFontFamily,
  fontFeatureSettings,
}));
</script>

<template>
  <div :class="cn('px-6 pt-6', css?.header)">
    <div :class="cn('flex flex-col items-start', css?.current)">
      <h2
        :class="cn('leading-[1.08] font-medium tracking-tight', textSecondary)"
        :style="locationStyle"
      >
        {{ location }}
      </h2>

      <div class="-mt-0.5 flex items-start gap-1">
        <span
          :class="
            cn(
              'leading-[1.02] font-[250] tracking-[-0.015em] tabular-nums',
              textPrimarySoft
            )
          "
          :style="temperatureStyle"
          aria-hidden="true"
        >
          {{ roundedTemperature }}
        </span>
        <span
          :class="cn('mt-2 font-[250] tabular-nums', textSecondary)"
          :style="degreeStyle"
          aria-hidden="true"
        >
          °{{ unitSymbol }}
        </span>
        <span class="sr-only">
          {{ t('weatherWidget.srTemperature', { temp: roundedTemperature, unit: spokenUnit }) }}
        </span>
      </div>

      <div
        class="mt-0.5 flex items-center gap-3"
        :style="hiLoContainerStyle"
      >
        <span
          class="font-medium tabular-nums"
          :style="hiLoStyle"
        >
          <span :class="textSubtle">H </span>
          <span :class="textPrimary">{{ Math.round(tempHigh) }}°</span>
        </span>
        <span
          class="font-medium tabular-nums"
          :style="hiLoStyle"
        >
          <span :class="textSubtle">L </span>
          <span :class="textPrimary">{{ Math.round(tempLow) }}°</span>
        </span>
      </div>
    </div>
  </div>
</template>
