<script setup lang="ts">
defineOptions({ name: 'CmptWeatherDataOverlay', inheritAttrs: false })

import { cn } from '@lionad/vtu-core';
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useGlassStyles } from '../composables/useGlassStyles';
import {
  getSceneBrightnessFromTimeOfDay,
  getTimeOfDay,
  getWeatherTheme,
  type WeatherTheme,
} from '../effects/parameter-mapper';
import type {
  ForecastDay,
  TemperatureUnit,
  WeatherConditionCode,
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
  css?: { root?: string };
  reducedMotion?: boolean;
  glassParams?: GlassEffectParams;
}

const props = withDefaults(defineProps<WeatherDataOverlayProps>(), {
  forecast: () => [],
  unit: 'fahrenheit',
  theme: undefined,
  timeOfDay: undefined,
  timestamp: undefined,
  css: () => ({ root: '' }),
  reducedMotion: false,
  glassParams: undefined,
});

// Glow state for mouse interaction
interface GlowState {
  x: number;
  y: number;
  intensity: number;
}

const glowState = ref<GlowState>({ x: 0, y: 0, intensity: 0 });
const cardDimensions = ref({ width: 0, height: 0 });
const cardRef = ref<HTMLDivElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const pendingGlowState = ref<GlowState | null>(null);
const pendingGlowFrame = ref<number | null>(null);

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
const resolvedGlassStyles = computed(() => {
  const hasBackdropFilter = Boolean(glassStyles.value.backdropFilter);
  if (hasBackdropFilter) return glassStyles.value;

  const blur = `blur(${blurAmount.value}px)`;
  return {
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
  };
});

// Update card dimensions
function updateCardDimensions() {
  if (cardRef.value) {
    const rect = cardRef.value.getBoundingClientRect();
    cardDimensions.value = {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  }
}

// Glow effect helpers
function commitGlowState(nextState: GlowState) {
  if (
    glowState.value.x === nextState.x &&
    glowState.value.y === nextState.y &&
    glowState.value.intensity === nextState.intensity
  ) {
    return;
  }
  glowState.value = nextState;
}

function cancelPendingGlowFrame() {
  pendingGlowState.value = null;
  if (pendingGlowFrame.value !== null) {
    cancelAnimationFrame(pendingGlowFrame.value);
    pendingGlowFrame.value = null;
  }
}

function scheduleGlowState(nextState: GlowState) {
  pendingGlowState.value = nextState;

  if (pendingGlowFrame.value !== null) {
    return;
  }

  pendingGlowFrame.value = requestAnimationFrame(() => {
    pendingGlowFrame.value = null;
    const pending = pendingGlowState.value;
    pendingGlowState.value = null;
    if (pending) {
      commitGlowState(pending);
    }
  });
}

function clearGlowIntensity() {
  cancelPendingGlowFrame();
  if (glowState.value.intensity !== 0) {
    glowState.value = { ...glowState.value, intensity: 0 };
  }
}

// Mouse event handlers
function handleMouseMove(e: MouseEvent) {
  if (!cardRef.value || props.reducedMotion) return;

  const cardRect = cardRef.value.getBoundingClientRect();
  const clampedX = Math.max(
    cardRect.left,
    Math.min(e.clientX, cardRect.right)
  );
  const clampedY = Math.max(
    cardRect.top,
    Math.min(e.clientY, cardRect.bottom)
  );

  const distanceX =
    e.clientX < cardRect.left
      ? cardRect.left - e.clientX
      : e.clientX > cardRect.right
        ? e.clientX - cardRect.right
        : 0;
  const distanceY =
    e.clientY < cardRect.top
      ? cardRect.top - e.clientY
      : e.clientY > cardRect.bottom
        ? e.clientY - cardRect.bottom
        : 0;
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  const maxDistance = 150;
  const intensity = Math.max(0, 1 - distance / maxDistance);

  scheduleGlowState({
    x: clampedX - cardRect.left,
    y: clampedY - cardRect.top,
    intensity,
  });
}

function handleMouseLeave() {
  clearGlowIntensity();
}

// Setup event listeners
onMounted(() => {
  updateCardDimensions();

  // Resize observer for card dimensions
  let resizeObserver: ResizeObserver | null = null;
  if (cardRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateCardDimensions);
    resizeObserver.observe(cardRef.value);
  }

  // Mouse events for glow effect
  const container = containerRef.value;
  if (container && !props.reducedMotion) {
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
  }

  onUnmounted(() => {
    resizeObserver?.disconnect();
    if (container) {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    }
    cancelPendingGlowFrame();
  });
});

// Watch for reduced motion changes
watch(
  () => props.reducedMotion,
  (reduced) => {
    if (reduced) {
      clearGlowIntensity();
    }
  }
);

// Condition icons mapping
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

// Formatting helpers
const roundedTemperature = computed(() => Math.round(props.temperature));
const unitSymbol = computed(() => (props.unit === 'celsius' ? 'C' : 'F'));
const spokenUnit = computed(() =>
  props.unit === 'celsius' ? 'Celsius' : 'Fahrenheit'
);

// Font styles - computed to avoid template escaping issues
const forecastFontFamily = '"SF Pro Text", Inter, "Noto Sans", system-ui, sans-serif';
const fontFeatureSettings = '"tnum" 1, "case" 1';

// Location text style
const locationStyle = computed(() => ({
  fontSize: 'clamp(13px, 7.5cqmin, 17px)',
  fontFamily: forecastFontFamily,
  textShadow: shadowStyle.value,
}));

// Temperature style
const temperatureStyle = computed(() => ({
  fontSize: 'clamp(48px, 32cqmin, 72px)',
  fontFamily: forecastFontFamily,
  fontFeatureSettings,
  textShadow: isDark.value
    ? '0 2px 20px rgba(0,0,0,0.25)'
    : '0 2px 20px rgba(255,255,255,0.3)',
}));

// Degree symbol style
const degreeStyle = computed(() => ({
  fontSize: 'clamp(18px, 12cqmin, 28px)',
  fontFamily: forecastFontFamily,
  fontFeatureSettings,
}));

// Hi/Lo style
const hiLoStyle = computed(() => ({
  fontSize: 'clamp(11px, 6.5cqmin, 15px)',
}));

// Hi/Lo container style
const hiLoContainerStyle = computed(() => ({
  fontFamily: forecastFontFamily,
  fontFeatureSettings,
}));

// Forecast item style
const forecastItemStyle = computed(() => ({
  fontFamily: forecastFontFamily,
  fontFeatureSettings,
  textShadow: forecastTextShadow.value,
}));

// Sine eased gradient for glow effect
function sineEasedGradient(
  x: number,
  y: number,
  radius: number,
  peakOpacity: number,
  steps = 8
): string {
  const stops: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const eased = Math.sin((t * Math.PI) / 2);
    const opacity = peakOpacity * (1 - eased);
    const position = t * 100;
    stops.push(
      `rgba(255,255,255,${opacity.toFixed(4)}) ${position.toFixed(1)}%`
    );
  }
  return `radial-gradient(circle ${radius}px at ${x}px ${y}px, ${stops.join(', ')})`;
}

// Edge shine style
const edgeShineStyle = computed(() => ({
  opacity: glowState.value.intensity,
  background: sineEasedGradient(
    glowState.value.x,
    glowState.value.y,
    100,
    isDark.value ? 0.6 : 1
  ),
  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  maskComposite: 'exclude',
  WebkitMaskComposite: 'xor',
  padding: '0.5px',
}));

// Forecast card style
const forecastCardStyle = computed(() => ({
  backgroundColor: `rgba(255, 255, 255, ${bgOpacity.value})`,
  ...resolvedGlassStyles.value,
}));

// Inner glow style
const innerGlowStyle = computed(() => ({
  opacity: glowState.value.intensity,
  background: sineEasedGradient(
    glowState.value.x,
    glowState.value.y,
    120,
    isDark.value ? 0.06 : 0.15
  ),
}));
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
    <!-- Current weather (more inset than forecast strip) -->
    <div class="px-6 pt-6">
      <div class="flex flex-col items-start">
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
            {{ roundedTemperature }} degrees {{ spokenUnit }}
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

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Forecast strip -->
    <div v-if="forecast.length > 0" class="px-3 pb-3">
      <div
        ref="cardRef"
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
                    'my-0.5 size-5',
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
