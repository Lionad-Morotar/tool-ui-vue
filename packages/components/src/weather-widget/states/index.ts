import { usePreferredReducedMotion } from '@vueuse/core';
import { type ComputedRef, computed } from 'vue';
import { usePropsValidator } from '../../core';
import { SerializableWeatherWidgetSchema } from '../schema';
import { TUNED_WEATHER_EFFECTS_CHECKPOINT_OVERRIDES } from '../effects/generated/tuned-presets.generated';
import { getSceneBrightnessFromTimeOfDay, getWeatherTheme } from '../effects/parameter-mapper';
import { getNearestCheckpoint, type WeatherEffectsOverrides } from '../effects/tuning';
import { type ResolvedWeatherTime, resolveWeatherTime, snapTimeOfDayToNearestCheckpoint } from '../time';
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
  reducedMotion: ComputedRef<boolean>;
  effectsEnabled: ComputedRef<boolean>;
  resolvedTime: ComputedRef<ResolvedWeatherTime>;
  timeOfDay: ComputedRef<number>;
  checkpointOverrides: ComputedRef<WeatherEffectsOverrides | undefined>;
  glassParams: ComputedRef<GlassEffectParams | undefined>;
  brightness: ComputedRef<number>;
  weatherTheme: ComputedRef<'light' | 'dark'>;
  isWeatherDark: ComputedRef<boolean>;
  units: ComputedRef<{ temperature: 'celsius' | 'fahrenheit' }>;
  backgroundClass: ComputedRef<string>;
}

export function useWeatherWidget(options: UseWeatherWidgetOptions): WeatherWidgetState {
  usePropsValidator(SerializableWeatherWidgetSchema, options, 'WeatherWidget');

  const preferredReducedMotion = usePreferredReducedMotion();

  const reducedMotion = computed(() => {
    if (typeof options.effects?.reducedMotion === 'boolean') {
      return options.effects.reducedMotion;
    }
    return preferredReducedMotion.value === 'reduce';
  });

  const effectsEnabled = computed(() => {
    if (reducedMotion.value) return false;
    return options.effects?.enabled !== false;
  });

  const resolvedTime = computed(() => {
    return resolveWeatherTime({
      time: options.time,
      updatedAt: options.updatedAt,
    });
  });

  const timeOfDay = computed(() => {
    return snapTimeOfDayToNearestCheckpoint(resolvedTime.value.timeOfDay);
  });

  const tunedOverrides = computed(() => {
    return TUNED_WEATHER_EFFECTS_CHECKPOINT_OVERRIDES[options.current.conditionCode];
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
      options.current.conditionCode
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
    reducedMotion,
    effectsEnabled,
    resolvedTime,
    timeOfDay,
    checkpointOverrides,
    glassParams,
    brightness,
    weatherTheme,
    isWeatherDark,
    units,
    backgroundClass,
  };
}
