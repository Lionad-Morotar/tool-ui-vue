/**
 * WeatherWidget — 天气小组件
 *
 * 本文件定义了 WeatherWidget 组件的数据契约（Contract）：
 * - Zod Schema：运行时数据校验
 * - TypeScript 类型推导
 * - Vue Props 接口
 *
 * @module tool-ui-vue/components/weather-widget/schema
 */

import { defineToolUiContract, ToolUIIdSchema  } from '@lionad/core';
import { z } from 'zod';

/** WeatherConditionCodeSchema Zod Schema */
export const WeatherConditionCodeSchema = z.enum([
  'clear',
  'partly-cloudy',
  'cloudy',
  'overcast',
  'fog',
  'drizzle',
  'rain',
  'heavy-rain',
  'thunderstorm',
  'snow',
  'sleet',
  'hail',
  'windy',
]);

export type WeatherConditionCode = z.infer<typeof WeatherConditionCodeSchema>;

/** TemperatureUnitSchema Zod Schema */
export const TemperatureUnitSchema = z.enum(['celsius', 'fahrenheit']);

export type TemperatureUnit = z.infer<typeof TemperatureUnitSchema>;

/** ForecastDaySchema Zod Schema */
export const ForecastDaySchema = z.object({
  label: z.string(),
  conditionCode: WeatherConditionCodeSchema,
  tempMin: z.number(),
  tempMax: z.number(),
});

export type ForecastDay = z.infer<typeof ForecastDaySchema>;

/** PrecipitationLevelSchema Zod Schema */
export const PrecipitationLevelSchema = z.enum([
  'none',
  'light',
  'moderate',
  'heavy',
]);

export type PrecipitationLevel = z.infer<typeof PrecipitationLevelSchema>;

/** WeatherWidgetCurrentSchema Zod Schema */
export const WeatherWidgetCurrentSchema = z.object({
  conditionCode: WeatherConditionCodeSchema,
  temperature: z.number(),
  tempMin: z.number(),
  tempMax: z.number(),
  windSpeed: z.number().optional(),
  precipitationLevel: PrecipitationLevelSchema.optional(),
  visibility: z.number().optional(),
});

export type WeatherWidgetCurrent = z.infer<typeof WeatherWidgetCurrentSchema>;

/** WeatherWidgetTimeSchema Zod Schema */
export const WeatherWidgetTimeSchema = z.object({
  timeBucket: z.number().min(0).max(11).optional(),
  localTimeOfDay: z.number().min(0).max(1).optional(),
});

export type WeatherWidgetTime = z.infer<typeof WeatherWidgetTimeSchema>;

/** WeatherWidgetLocationSchema Zod Schema */
export const WeatherWidgetLocationSchema = z.object({
  name: z.string(),
});

export type WeatherWidgetLocation = z.infer<typeof WeatherWidgetLocationSchema>;

/** EffectQualitySchema Zod Schema */
export const EffectQualitySchema = z.enum(['low', 'medium', 'high', 'auto']);

export type EffectQuality = z.infer<typeof EffectQualitySchema>;

/** EffectSettingsSchema Zod Schema */
export const EffectSettingsSchema = z.object({
  enabled: z.boolean().optional(),
  quality: EffectQualitySchema.optional(),
  reducedMotion: z.boolean().optional(),
});

export type EffectSettings = z.infer<typeof EffectSettingsSchema>;

/**
 * WeatherWidgetCssSchema Zod Schema
 */
export const WeatherWidgetCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  current: z.string().optional(),
  forecast: z.string().optional(),
  canvas: z.string().optional(),
  overlay: z.string().optional(),
});

/** SerializableWeatherWidgetSchema 的可序列化 Zod Schema */
export const SerializableWeatherWidgetSchema = z.object({
  id: ToolUIIdSchema,
  location: WeatherWidgetLocationSchema,
  units: z.object({
    temperature: TemperatureUnitSchema,
  }),
  current: WeatherWidgetCurrentSchema,
  forecast: z.array(ForecastDaySchema),
  time: WeatherWidgetTimeSchema.optional(),
  updatedAt: z.iso.datetime().optional(),
});

/** SerializableWeatherWidget 类型，由 Zod Schema 推导 */
export type SerializableWeatherWidget = z.infer<typeof SerializableWeatherWidgetSchema>;

/** WeatherWidgetProps 组件属性接口 */
export interface WeatherWidgetProps {
  id: string;
  location: WeatherWidgetLocation;
  units: {
    temperature: TemperatureUnit;
  };
  current: WeatherWidgetCurrent;
  forecast: ForecastDay[];
  time?: WeatherWidgetTime;
  updatedAt?: string;
  css?: { root?: string; header?: string; current?: string; forecast?: string; canvas?: string; overlay?: string };
  effects?: EffectSettings;
}

const SerializableWeatherWidgetSchemaContract = defineToolUiContract(
  'WeatherWidget',
  SerializableWeatherWidgetSchema,
);

export const parseSerializableWeatherWidget: (
  input: unknown,
) => SerializableWeatherWidget = SerializableWeatherWidgetSchemaContract.parse;

export const safeParseSerializableWeatherWidget: (
  input: unknown,
) => SerializableWeatherWidget | null = SerializableWeatherWidgetSchemaContract.safeParse;
