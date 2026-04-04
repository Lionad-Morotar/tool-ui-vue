import EffectCompositor from './cmpts/effect-compositor.vue'
import WeatherDataOverlay from './cmpts/weather-data-overlay.vue'
import WeatherWidget from './index.vue'

export { WeatherWidget, WeatherDataOverlay, EffectCompositor }
export default WeatherWidget
export type {
  WeatherWidgetProps,
  SerializableWeatherWidget,
  WeatherConditionCode,
  ForecastDay,
  TemperatureUnit,
  PrecipitationLevel,
  EffectSettings,
  EffectQuality,
  WeatherWidgetLocation,
  WeatherWidgetCurrent,
  WeatherWidgetTime,
} from './schema';
export {
  SerializableWeatherWidgetSchema,
  WeatherConditionCodeSchema,
  ForecastDaySchema,
  TemperatureUnitSchema,
  PrecipitationLevelSchema,
  EffectSettingsSchema,
  parseSerializableWeatherWidget,
  safeParseSerializableWeatherWidget,
} from './schema';
export {
  useGlassStyles,
  DEFAULT_GLASS_OPTIONS,
} from './composables/useGlassStyles';
export type {
  UseGlassStylesOptions,
  GlassStyles,
} from './composables/useGlassStyles';
export {
  getSceneBrightnessFromTimeOfDay,
  getWeatherTheme,
  getTimeOfDay,
  getSunAltitude,
  isNightTime,
  getMoonPhase,
  mapWeatherToEffects,
  timeOfDayToSunAltitude,
} from './effects/parameter-mapper';
export type { WeatherTheme } from './effects/parameter-mapper';
export {
  resolveWeatherTime,
  snapTimeOfDayToNearestCheckpoint,
  timeBucketToTimeOfDay,
} from './time';
export type {
  ResolveWeatherTimeInput,
  ResolvedWeatherTime,
  WeatherTimeSource,
} from './time';
