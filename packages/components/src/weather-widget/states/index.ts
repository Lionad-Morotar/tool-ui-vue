import { usePreferredReducedMotion } from '@vueuse/core';
import { computed } from 'vue';
import { TUNED_WEATHER_EFFECTS_CHECKPOINT_OVERRIDES } from '../effects/generated/tuned-presets.generated';
import { getSceneBrightnessFromTimeOfDay, getWeatherTheme } from '../effects/parameter-mapper';
import { getNearestCheckpoint, type WeatherEffectsOverrides } from '../effects/tuning';
import { resolveWeatherTime, snapTimeOfDayToNearestCheckpoint } from '../time';
import type { WeatherWidgetProps } from '../schema';
// WeatherWidget component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only


interface GlassEffectParams {
  enabled?: boolean;
  depth?: number;
  strength?: number;
  chromaticAberration?: number;
  blur?: number;
  brightness?: number;
  saturation?: number;
}

export type UseWeatherWidgetOptions = WeatherWidgetProps;

export interface WeatherWidgetState {
  reducedMotion: boolean;
  effectsEnabled: boolean;
  resolvedTime: { timeOfDay: number };
  timeOfDay: number;
  checkpointOverrides: WeatherEffectsOverrides | undefined;
  glassParams: GlassEffectParams | undefined;
  brightness: number;
  weatherTheme: 'light' | 'dark';
  isWeatherDark: boolean;
  units: { temperature: 'celsius' | 'fahrenheit' };
  backgroundClass: string;
}

export function useWeatherWidget(options: UseWeatherWidgetOptions): WeatherWidgetState {
  const { effects, time, updatedAt, current } = options;

  const preferredReducedMotion = usePreferredReducedMotion();

  const reducedMotion = computed(() => {
    if (typeof effects?.reducedMotion === 'boolean') {
      return effects.reducedMotion;
    }
    return preferredReducedMotion.value === 'reduce';
  });

  const effectsEnabled = computed(() => {
    if (reducedMotion.value) return false;
    return effects?.enabled !== false;
  });

  const resolvedTime = computed(() => {
    return resolveWeatherTime({
      time,
      updatedAt,
    });
  });

  const timeOfDay = computed(() => {
    return snapTimeOfDayToNearestCheckpoint(resolvedTime.value.timeOfDay);
  });

  const tunedOverrides = computed(() => {
    return TUNED_WEATHER_EFFECTS_CHECKPOINT_OVERRIDES[current.conditionCode];
  });

  const checkpointOverrides = computed(() => {
    const checkpoint = getNearestCheckpoint(timeOfDay.value);
    return tunedOverrides.value?.[checkpoint];
  });

  const glassParams = computed(() => {
    return checkpointOverrides.value?.glass;
  });

  const brightness = computed(() => {
    return getSceneBrightnessFromTimeOfDay(
      timeOfDay.value,
      current.conditionCode
    );
  });

  const weatherTheme = computed(() => {
    return getWeatherTheme(brightness.value);
  });

  const isWeatherDark = computed(() => weatherTheme.value === 'dark');

  const units = computed(() => {
    return options.units ?? { temperature: 'celsius' as const };
  });

  const backgroundClass = computed(() => {
    return isWeatherDark.value
      ? 'bg-gradient-to-b from-zinc-950 via-zinc-900/70 to-zinc-950'
      : 'bg-gradient-to-b from-sky-50 via-sky-100/70 to-white';
  });

  return {
    reducedMotion: reducedMotion.value,
    effectsEnabled: effectsEnabled.value,
    resolvedTime: resolvedTime.value,
    timeOfDay: timeOfDay.value,
    checkpointOverrides: checkpointOverrides.value,
    glassParams: glassParams.value,
    brightness: brightness.value,
    weatherTheme: weatherTheme.value,
    isWeatherDark: isWeatherDark.value,
    units: units.value,
    backgroundClass: backgroundClass.value,
  };
}
