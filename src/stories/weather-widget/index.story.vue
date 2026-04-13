<script setup lang="ts">
import { reactive, computed, type ComputedRef } from 'vue';
import { WeatherWidget } from '@lionad/vtu-components';
import type { WeatherConditionCode, TemperatureUnit, ForecastDay, EffectSettings } from '@lionad/vtu-components/weather-widget/schema';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import messages from './i18n'

const locLA = useStoryLocale('content.locLA', messages)
const locSeattle = useStoryLocale('content.locSeattle', messages)
const locLondon = useStoryLocale('content.locLondon', messages)
const locDenver = useStoryLocale('content.locDenver', messages)
const locMiami = useStoryLocale('content.locMiami', messages)
const locTokyo = useStoryLocale('content.locTokyo', messages)
const locPhoenix = useStoryLocale('content.locPhoenix', messages)
const locSF = useStoryLocale('content.locSF', messages)
const locChicago = useStoryLocale('content.locChicago', messages)
const locBoston = useStoryLocale('content.locBoston', messages)
const locDemo = useStoryLocale('content.locDemo', messages)
const locAccessible = useStoryLocale('content.locAccessible', messages)
const locRainy = useStoryLocale('content.locRainy', messages)
const locSnowy = useStoryLocale('content.locSnowy', messages)
const dayTue = useStoryLocale('content.dayTue', messages)
const dayWed = useStoryLocale('content.dayWed', messages)
const dayThu = useStoryLocale('content.dayThu', messages)
const dayFri = useStoryLocale('content.dayFri', messages)
const daySat = useStoryLocale('content.daySat', messages)
const dayNow = useStoryLocale('content.dayNow', messages)
const lblSunny = useStoryLocale('content.lblSunny', messages)
const lblPartlyCloudy = useStoryLocale('content.lblPartlyCloudy', messages)
const lblCloudy = useStoryLocale('content.lblCloudy', messages)
const lblRainy = useStoryLocale('content.lblRainy', messages)
const lblHeavyRain = useStoryLocale('content.lblHeavyRain', messages)
const lblSnowy = useStoryLocale('content.lblSnowy', messages)
const lblThunderstorm = useStoryLocale('content.lblThunderstorm', messages)
const lblClear = useStoryLocale('content.lblClear', messages)
const lblToggle = useStoryLocale('content.lblToggle', messages)
const lblTime = useStoryLocale('content.lblTime', messages)
const lblCondition = useStoryLocale('content.lblCondition', messages)
const lblReducedMotion = useStoryLocale('content.lblReducedMotion', messages)
const lblEnableEffects = useStoryLocale('content.lblEnableEffects', messages)
const lblQuality = useStoryLocale('content.lblQuality', messages)
const textTimeOfDay = useStoryLocale('content.textTimeOfDay', messages)
const textReducedMotion = useStoryLocale('content.textReducedMotion', messages)
const textPreferredMotion = useStoryLocale('content.textPreferredMotion', messages)
const textQualitySettings = useStoryLocale('content.textQualitySettings', messages)
const sunny = useStoryLocale('content.sunny', messages)
const cloudy = useStoryLocale('content.cloudy', messages)
const rainy = useStoryLocale('content.rainy', messages)
const snowy = useStoryLocale('content.snowy', messages)
const thunderstorm = useStoryLocale('content.thunderstorm', messages)
const celsius = useStoryLocale('content.celsius', messages)
const interactiveWeatherSimulator = useStoryLocale('content.interactiveWeatherSimulator', messages)
const allWeatherConditions = useStoryLocale('content.allWeatherConditions', messages)
const timeOfDayLightingSimulation = useStoryLocale('content.timeOfDayLightingSimulation', messages)
const accessibilityReducedMotion = useStoryLocale('content.accessibilityReducedMotion', messages)
const effectQualitySettings = useStoryLocale('content.effectQualitySettings', messages)

const weatherState = reactive({
  condition: 'clear' as WeatherConditionCode,
  temperature: 78,
  unit: 'fahrenheit' as TemperatureUnit,
  location: 'Los Angeles, CA'
});

const timeOfDayState = reactive({
  hour: 12,
  condition: 'clear' as WeatherConditionCode,
});

const effectsState = reactive<EffectSettings>({
  enabled: true,
  quality: 'auto',
  reducedMotion: false,
});

const conditions: { code: WeatherConditionCode; label: ComputedRef<string>; temp: number }[] = [
  { code: 'clear', label: lblSunny, temp: 78 },
  { code: 'partly-cloudy', label: lblPartlyCloudy, temp: 68 },
  { code: 'cloudy', label: lblCloudy, temp: 58 },
  { code: 'rain', label: lblRainy, temp: 55 },
  { code: 'heavy-rain', label: lblHeavyRain, temp: 52 },
  { code: 'snow', label: lblSnowy, temp: 28 },
  { code: 'thunderstorm', label: lblThunderstorm, temp: 72 },
];

const timeOfDayConditions: { code: WeatherConditionCode; label: ComputedRef<string> }[] = [
  { code: 'clear', label: lblClear },
  { code: 'partly-cloudy', label: lblPartlyCloudy },
  { code: 'cloudy', label: lblCloudy },
];

const currentWeather = computed(() => ({
  conditionCode: weatherState.condition,
  temperature: weatherState.temperature,
  tempMin: weatherState.temperature - 10,
  tempMax: weatherState.temperature + 5,
}));

const forecast = computed<ForecastDay[]>(() => [
  { label: dayTue.value, conditionCode: weatherState.condition, tempMin: weatherState.temperature - 8, tempMax: weatherState.temperature + 3 },
  { label: dayWed.value, conditionCode: 'partly-cloudy', tempMin: weatherState.temperature - 10, tempMax: weatherState.temperature + 2 },
  { label: dayThu.value, conditionCode: 'cloudy', tempMin: weatherState.temperature - 12, tempMax: weatherState.temperature },
  { label: dayFri.value, conditionCode: 'rain', tempMin: weatherState.temperature - 15, tempMax: weatherState.temperature - 3 },
  { label: daySat.value, conditionCode: 'clear', tempMin: weatherState.temperature - 8, tempMax: weatherState.temperature + 5 },
]);

function setCondition(code: WeatherConditionCode, temp: number) {
  weatherState.condition = code;
  weatherState.temperature = temp;
}

function toggleUnit() {
  weatherState.unit = weatherState.unit === 'fahrenheit' ? 'celsius' : 'fahrenheit';
  if (weatherState.unit === 'celsius') {
    weatherState.temperature = Math.round((weatherState.temperature - 32) * 5 / 9);
  } else {
    weatherState.temperature = Math.round(weatherState.temperature * 9 / 5 + 32);
  }
}

function setTimeOfDay(hour: number) {
  timeOfDayState.hour = hour;
}

function setTimeOfDayCondition(code: WeatherConditionCode) {
  timeOfDayState.condition = code;
}

function formatTime(hour: number): string {
  const isZh = currentLocale.value === 'zh-CN';
  if (hour === 6) return isZh ? '早上6点' : '6 AM';
  if (hour === 12) return isZh ? '中午12点' : '12 PM';
  if (hour === 18) return isZh ? '晚上6点' : '6 PM';
  if (hour === 0) return isZh ? '凌晨12点' : '12 AM';
  const displayHour = hour % 12 || 12;
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${displayHour} ${period}`;
}

function getTimeOfDayValue(hour: number): number {
  return hour / 24;
}

</script>

<template>
  <Story title="WeatherWidget/All Variants">
    <Variant :title="sunny">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-sunny"
          :location="{ name: locLA }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{
            conditionCode: 'clear',
            temperature: 78,
            tempMin: 65,
            tempMax: 82,
          }"
          :forecast="[
            { label: dayTue, conditionCode: 'clear', tempMin: 64, tempMax: 80 },
            { label: dayWed, conditionCode: 'partly-cloudy', tempMin: 62, tempMax: 78 },
            { label: dayThu, conditionCode: 'clear', tempMin: 65, tempMax: 83 },
            { label: dayFri, conditionCode: 'clear', tempMin: 66, tempMax: 85 },
            { label: daySat, conditionCode: 'partly-cloudy', tempMin: 63, tempMax: 79 },
          ]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant :title="cloudy">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-cloudy"
          :location="{ name: locSeattle }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{
            conditionCode: 'cloudy',
            temperature: 58,
            tempMin: 52,
            tempMax: 62,
          }"
          :forecast="[
            { label: dayTue, conditionCode: 'rain', tempMin: 50, tempMax: 58 },
            { label: dayWed, conditionCode: 'cloudy', tempMin: 51, tempMax: 60 },
            { label: dayThu, conditionCode: 'partly-cloudy', tempMin: 52, tempMax: 63 },
            { label: dayFri, conditionCode: 'cloudy', tempMin: 50, tempMax: 59 },
            { label: daySat, conditionCode: 'rain', tempMin: 49, tempMax: 57 },
          ]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant :title="rainy">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-rainy"
          :location="{ name: locLondon }"
          :units="{ temperature: 'celsius' }"
          :current="{
            conditionCode: 'rain',
            temperature: 12,
            tempMin: 9,
            tempMax: 14,
          }"
          :forecast="[
            { label: dayTue, conditionCode: 'heavy-rain', tempMin: 8, tempMax: 13 },
            { label: dayWed, conditionCode: 'rain', tempMin: 9, tempMax: 14 },
            { label: dayThu, conditionCode: 'cloudy', tempMin: 10, tempMax: 15 },
            { label: dayFri, conditionCode: 'drizzle', tempMin: 9, tempMax: 13 },
            { label: daySat, conditionCode: 'rain', tempMin: 8, tempMax: 12 },
          ]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant :title="snowy">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-snowy"
          :location="{ name: locDenver }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{
            conditionCode: 'snow',
            temperature: 28,
            tempMin: 15,
            tempMax: 32,
          }"
          :forecast="[
            { label: dayTue, conditionCode: 'snow', tempMin: 12, tempMax: 28 },
            { label: dayWed, conditionCode: 'sleet', tempMin: 14, tempMax: 30 },
            { label: dayThu, conditionCode: 'partly-cloudy', tempMin: 16, tempMax: 33 },
            { label: dayFri, conditionCode: 'clear', tempMin: 18, tempMax: 35 },
            { label: daySat, conditionCode: 'snow', tempMin: 15, tempMax: 29 },
          ]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant :title="thunderstorm">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-storm"
          :location="{ name: locMiami }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{
            conditionCode: 'thunderstorm',
            temperature: 85,
            tempMin: 78,
            tempMax: 90,
          }"
          :forecast="[
            { label: dayTue, conditionCode: 'thunderstorm', tempMin: 76, tempMax: 88 },
            { label: dayWed, conditionCode: 'heavy-rain', tempMin: 75, tempMax: 86 },
            { label: dayThu, conditionCode: 'rain', tempMin: 77, tempMax: 87 },
            { label: dayFri, conditionCode: 'partly-cloudy', tempMin: 78, tempMax: 89 },
            { label: daySat, conditionCode: 'clear', tempMin: 79, tempMax: 91 },
          ]"
          :updated-at="new Date().toISOString()"
          :effects="{ enabled: true }"
        />
      </div>
    </Variant>

    <Variant :title="celsius">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-celsius"
          :location="{ name: locTokyo }"
          :units="{ temperature: 'celsius' }"
          :current="{
            conditionCode: 'partly-cloudy',
            temperature: 22,
            tempMin: 18,
            tempMax: 25,
          }"
          :forecast="[
            { label: dayTue, conditionCode: 'clear', tempMin: 17, tempMax: 26 },
            { label: dayWed, conditionCode: 'clear', tempMin: 18, tempMax: 27 },
            { label: dayThu, conditionCode: 'partly-cloudy', tempMin: 19, tempMax: 25 },
            { label: dayFri, conditionCode: 'cloudy', tempMin: 18, tempMax: 24 },
            { label: daySat, conditionCode: 'rain', tempMin: 17, tempMax: 22 },
          ]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant :title="interactiveWeatherSimulator">
      <div class="w-full max-w-sm">
        <div class="mb-4 space-y-3">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cond in conditions"
              :key="cond.code"
              :class="[
                'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                weatherState.condition === cond.code
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              ]"
              @click="setCondition(cond.code, cond.temp)"
            >
              {{ cond.label }}
            </button>
          </div>
          <div class="flex items-center gap-4">
            <button
              class="rounded-md bg-muted px-3 py-1 text-sm font-medium hover:bg-muted/80"
              @click="toggleUnit"
            >
              {{ lblToggle }} °{{ weatherState.unit === 'fahrenheit' ? 'F' : 'C' }}
            </button>
            <input
              v-model.number="weatherState.temperature"
              type="range"
              :min="weatherState.unit === 'fahrenheit' ? 0 : -20"
              :max="weatherState.unit === 'fahrenheit' ? 110 : 45"
              class="flex-1"
            />
            <span class="w-12 text-right text-sm font-medium">{{ weatherState.temperature }}°</span>
          </div>
        </div>
        <weather-widget
          id="weather-interactive"
          :location="{ name: weatherState.location }"
          :units="{ temperature: weatherState.unit }"
          :current="currentWeather"
          :forecast="forecast"
          :time="{ localTimeOfDay: 0.5 }"
          :updated-at="new Date().toISOString()"
          :effects="{ enabled: true }"
        />
      </div>
    </Variant>

    <Variant :title="allWeatherConditions">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="grid grid-cols-2 gap-4">
        <weather-widget
          id="weather-all-sunny"
          :location="{ name: locPhoenix }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{ conditionCode: 'clear', temperature: 95, tempMin: 80, tempMax: 98 }"
          :forecast="[{ label: dayTue, conditionCode: 'clear', tempMin: 78, tempMax: 96 }]"
          :updated-at="new Date().toISOString()"
        />
        <weather-widget
          id="weather-all-foggy"
          :location="{ name: locSF }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{ conditionCode: 'fog', temperature: 58, tempMin: 54, tempMax: 62 }"
          :forecast="[{ label: dayTue, conditionCode: 'fog', tempMin: 52, tempMax: 60 }]"
          :updated-at="new Date().toISOString()"
        />
        <weather-widget
          id="weather-all-windy"
          :location="{ name: locChicago }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{ conditionCode: 'windy', temperature: 45, tempMin: 38, tempMax: 50 }"
          :forecast="[{ label: dayTue, conditionCode: 'windy', tempMin: 36, tempMax: 48 }]"
          :updated-at="new Date().toISOString()"
        />
        <weather-widget
          id="weather-all-sleet"
          :location="{ name: locBoston }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{ conditionCode: 'sleet', temperature: 32, tempMin: 28, tempMax: 36 }"
          :forecast="[{ label: dayTue, conditionCode: 'sleet', tempMin: 26, tempMax: 34 }]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant :title="timeOfDayLightingSimulation">
      <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">{{ lblTime }}:</span>
            <div class="flex gap-1">
              <button
                v-for="hour in [6, 12, 18, 0]"
                :key="hour"
                :class="[
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  timeOfDayState.hour === hour
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                ]"
                @click="setTimeOfDay(hour)"
              >
                {{ formatTime(hour) }}
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">{{ lblCondition }}:</span>
            <div class="flex gap-1">
              <button
                v-for="cond in timeOfDayConditions"
                :key="cond.code"
                :class="[
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  timeOfDayState.condition === cond.code
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                ]"
                @click="setTimeOfDayCondition(cond.code)"
              >
                {{ cond.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="w-full max-w-sm">
          <weather-widget
            id="weather-time-of-day"
            :location="{ name: locDemo }"
            :units="{ temperature: 'fahrenheit' }"
            :current="{
              conditionCode: timeOfDayState.condition,
              temperature: 72,
              tempMin: 65,
              tempMax: 78,
            }"
            :forecast="[
              { label: dayNow, conditionCode: timeOfDayState.condition, tempMin: 65, tempMax: 78 },
            ]"
            :time="{ localTimeOfDay: getTimeOfDayValue(timeOfDayState.hour) }"
            :updated-at="new Date().toISOString()"
          />
        </div>
        <p class="text-xs text-muted-foreground">
          {{ textTimeOfDay }}
        </p>
      </div>
    </Variant>

    <Variant :title="accessibilityReducedMotion">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="effectsState.reducedMotion"
              type="checkbox"
              class="rounded border-gray-300"
            />
            <span>{{ lblReducedMotion }}</span>
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="effectsState.enabled"
              type="checkbox"
              class="rounded border-gray-300"
            />
            <span>{{ lblEnableEffects }}</span>
          </label>
        </div>
        <div class="w-full max-w-sm">
          <weather-widget
            id="weather-reduced-motion"
            :location="{ name: locAccessible }"
            :units="{ temperature: 'fahrenheit' }"
            :current="{
              conditionCode: 'thunderstorm',
              temperature: 68,
              tempMin: 60,
              tempMax: 72,
              windSpeed: 15,
              precipitationLevel: 'heavy',
              visibility: 5,
            }"
            :forecast="[
              { label: dayTue, conditionCode: 'thunderstorm', tempMin: 58, tempMax: 70 },
              { label: dayWed, conditionCode: 'rain', tempMin: 60, tempMax: 72 },
            ]"
            :updated-at="new Date().toISOString()"
            :effects="effectsState"
          />
        </div>
        <div class="space-y-1 text-xs text-muted-foreground">
          <p>
            <strong>{{ lblReducedMotion }}:</strong> {{ textReducedMotion }}
          </p>
          <p>
            {{ textPreferredMotion }}
          </p>
        </div>
      </div>
    </Variant>

    <Variant :title="effectQualitySettings">
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">{{ lblQuality }}:</span>
          <div class="flex gap-1">
            <button
              v-for="quality in ['low', 'medium', 'high', 'auto']"
              :key="quality"
              :class="[
                'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                effectsState.quality === quality
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              ]"
              @click="effectsState.quality = quality as 'low' | 'medium' | 'high' | 'auto'"
            >
              {{ quality }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <weather-widget
            id="weather-quality-rain"
            :location="{ name: locRainy }"
            :units="{ temperature: 'fahrenheit' }"
            :current="{
              conditionCode: 'heavy-rain',
              temperature: 55,
              tempMin: 50,
              tempMax: 60,
              windSpeed: 20,
              precipitationLevel: 'heavy',
              visibility: 3,
            }"
            :forecast="[{ label: dayTue, conditionCode: 'rain', tempMin: 48, tempMax: 58 }]"
            :updated-at="new Date().toISOString()"
            :effects="{ enabled: true, quality: effectsState.quality }"
          />
          <weather-widget
            id="weather-quality-snow"
            :location="{ name: locSnowy }"
            :units="{ temperature: 'fahrenheit' }"
            :current="{
              conditionCode: 'snow',
              temperature: 28,
              tempMin: 20,
              tempMax: 32,
              windSpeed: 10,
              precipitationLevel: 'moderate',
              visibility: 2,
            }"
            :forecast="[{ label: dayTue, conditionCode: 'snow', tempMin: 18, tempMax: 30 }]"
            :updated-at="new Date().toISOString()"
            :effects="{ enabled: true, quality: effectsState.quality }"
          />
        </div>
        <p class="text-xs text-muted-foreground">
          {{ textQualitySettings }}
        </p>
      </div>
    </Variant>
  </Story>
</template>
