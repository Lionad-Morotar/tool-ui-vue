<script setup lang="ts">
import { reactive, computed, type ComputedRef } from 'vue';
import { WeatherWidget } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import type { WeatherConditionCode, TemperatureUnit, ForecastDay } from '@lionad/vtu-components/weather-widget/schema';

const locPhoenix = useStoryLocale('content.locPhoenix', messages)
const locSF = useStoryLocale('content.locSF', messages)
const locChicago = useStoryLocale('content.locChicago', messages)
const locBoston = useStoryLocale('content.locBoston', messages)
const locDemo = useStoryLocale('content.locDemo', messages)
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
const textTimeOfDay = useStoryLocale('content.textTimeOfDay', messages)
const interactiveWeatherSimulator = useStoryLocale('content.interactiveWeatherSimulator', messages)
const allWeatherConditions = useStoryLocale('content.allWeatherConditions', messages)
const timeOfDayLightingSimulation = useStoryLocale('content.timeOfDayLightingSimulation', messages)

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
  <Story title="WeatherWidget/Simulation">
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
  </Story>
</template>
