<script setup lang="ts">
import { reactive, computed } from 'vue';
import { WeatherWidget } from '../components';
import type { WeatherConditionCode, TemperatureUnit, ForecastDay, EffectSettings } from '../components/weather-widget/schema';

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

const conditions: { code: WeatherConditionCode; label: string; temp: number }[] = [
  { code: 'clear', label: 'Sunny', temp: 78 },
  { code: 'partly-cloudy', label: 'Partly Cloudy', temp: 68 },
  { code: 'cloudy', label: 'Cloudy', temp: 58 },
  { code: 'rain', label: 'Rainy', temp: 55 },
  { code: 'heavy-rain', label: 'Heavy Rain', temp: 52 },
  { code: 'snow', label: 'Snowy', temp: 28 },
  { code: 'thunderstorm', label: 'Thunderstorm', temp: 72 },
];

const timeOfDayConditions: { code: WeatherConditionCode; label: string }[] = [
  { code: 'clear', label: 'Clear' },
  { code: 'partly-cloudy', label: 'Partly Cloudy' },
  { code: 'cloudy', label: 'Cloudy' },
];

const currentWeather = computed(() => ({
  conditionCode: weatherState.condition,
  temperature: weatherState.temperature,
  tempMin: weatherState.temperature - 10,
  tempMax: weatherState.temperature + 5,
}));

const forecast = computed<ForecastDay[]>(() => [
  { label: 'Tue', conditionCode: weatherState.condition, tempMin: weatherState.temperature - 8, tempMax: weatherState.temperature + 3 },
  { label: 'Wed', conditionCode: 'partly-cloudy', tempMin: weatherState.temperature - 10, tempMax: weatherState.temperature + 2 },
  { label: 'Thu', conditionCode: 'cloudy', tempMin: weatherState.temperature - 12, tempMax: weatherState.temperature },
  { label: 'Fri', conditionCode: 'rain', tempMin: weatherState.temperature - 15, tempMax: weatherState.temperature - 3 },
  { label: 'Sat', conditionCode: 'clear', tempMin: weatherState.temperature - 8, tempMax: weatherState.temperature + 5 },
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
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour} ${period}`;
}

function getTimeOfDayValue(hour: number): number {
  return hour / 24;
}
</script>

<template>
  <Story title="WeatherWidget/All Variants">
    <Variant title="Sunny">
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-sunny"
          :location="{ name: 'Los Angeles, CA' }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{
            conditionCode: 'clear',
            temperature: 78,
            tempMin: 65,
            tempMax: 82,
          }"
          :forecast="[
            { label: 'Tue', conditionCode: 'clear', tempMin: 64, tempMax: 80 },
            { label: 'Wed', conditionCode: 'partly-cloudy', tempMin: 62, tempMax: 78 },
            { label: 'Thu', conditionCode: 'clear', tempMin: 65, tempMax: 83 },
            { label: 'Fri', conditionCode: 'clear', tempMin: 66, tempMax: 85 },
            { label: 'Sat', conditionCode: 'partly-cloudy', tempMin: 63, tempMax: 79 },
          ]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant title="Cloudy">
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-cloudy"
          :location="{ name: 'Seattle, WA' }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{
            conditionCode: 'cloudy',
            temperature: 58,
            tempMin: 52,
            tempMax: 62,
          }"
          :forecast="[
            { label: 'Tue', conditionCode: 'rain', tempMin: 50, tempMax: 58 },
            { label: 'Wed', conditionCode: 'cloudy', tempMin: 51, tempMax: 60 },
            { label: 'Thu', conditionCode: 'partly-cloudy', tempMin: 52, tempMax: 63 },
            { label: 'Fri', conditionCode: 'cloudy', tempMin: 50, tempMax: 59 },
            { label: 'Sat', conditionCode: 'rain', tempMin: 49, tempMax: 57 },
          ]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant title="Rainy">
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-rainy"
          :location="{ name: 'London, UK' }"
          :units="{ temperature: 'celsius' }"
          :current="{
            conditionCode: 'rain',
            temperature: 12,
            tempMin: 9,
            tempMax: 14,
          }"
          :forecast="[
            { label: 'Tue', conditionCode: 'heavy-rain', tempMin: 8, tempMax: 13 },
            { label: 'Wed', conditionCode: 'rain', tempMin: 9, tempMax: 14 },
            { label: 'Thu', conditionCode: 'cloudy', tempMin: 10, tempMax: 15 },
            { label: 'Fri', conditionCode: 'drizzle', tempMin: 9, tempMax: 13 },
            { label: 'Sat', conditionCode: 'rain', tempMin: 8, tempMax: 12 },
          ]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant title="Snowy">
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-snowy"
          :location="{ name: 'Denver, CO' }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{
            conditionCode: 'snow',
            temperature: 28,
            tempMin: 15,
            tempMax: 32,
          }"
          :forecast="[
            { label: 'Tue', conditionCode: 'snow', tempMin: 12, tempMax: 28 },
            { label: 'Wed', conditionCode: 'sleet', tempMin: 14, tempMax: 30 },
            { label: 'Thu', conditionCode: 'partly-cloudy', tempMin: 16, tempMax: 33 },
            { label: 'Fri', conditionCode: 'clear', tempMin: 18, tempMax: 35 },
            { label: 'Sat', conditionCode: 'snow', tempMin: 15, tempMax: 29 },
          ]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant title="Thunderstorm">
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-storm"
          :location="{ name: 'Miami, FL' }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{
            conditionCode: 'thunderstorm',
            temperature: 85,
            tempMin: 78,
            tempMax: 90,
          }"
          :forecast="[
            { label: 'Tue', conditionCode: 'thunderstorm', tempMin: 76, tempMax: 88 },
            { label: 'Wed', conditionCode: 'heavy-rain', tempMin: 75, tempMax: 86 },
            { label: 'Thu', conditionCode: 'rain', tempMin: 77, tempMax: 87 },
            { label: 'Fri', conditionCode: 'partly-cloudy', tempMin: 78, tempMax: 89 },
            { label: 'Sat', conditionCode: 'clear', tempMin: 79, tempMax: 91 },
          ]"
          :updated-at="new Date().toISOString()"
          :effects="{ enabled: true }"
        />
      </div>
    </Variant>

    <Variant title="Celsius">
      <div class="w-full max-w-sm">
        <weather-widget
          id="weather-celsius"
          :location="{ name: 'Tokyo, Japan' }"
          :units="{ temperature: 'celsius' }"
          :current="{
            conditionCode: 'partly-cloudy',
            temperature: 22,
            tempMin: 18,
            tempMax: 25,
          }"
          :forecast="[
            { label: 'Tue', conditionCode: 'clear', tempMin: 17, tempMax: 26 },
            { label: 'Wed', conditionCode: 'clear', tempMin: 18, tempMax: 27 },
            { label: 'Thu', conditionCode: 'partly-cloudy', tempMin: 19, tempMax: 25 },
            { label: 'Fri', conditionCode: 'cloudy', tempMin: 18, tempMax: 24 },
            { label: 'Sat', conditionCode: 'rain', tempMin: 17, tempMax: 22 },
          ]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant title="Interactive - Weather Simulator">
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
              Toggle °{{ weatherState.unit === 'fahrenheit' ? 'F' : 'C' }}
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
          :updated-at="new Date().toISOString()"
          :effects="{ enabled: ['rain', 'heavy-rain', 'snow', 'thunderstorm'].includes(weatherState.condition) }"
        />
      </div>
    </Variant>

    <Variant title="All Weather Conditions">
      <div class="grid grid-cols-2 gap-4">
        <weather-widget
          id="weather-all-sunny"
          :location="{ name: 'Phoenix, AZ' }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{ conditionCode: 'clear', temperature: 95, tempMin: 80, tempMax: 98 }"
          :forecast="[{ label: 'Tue', conditionCode: 'clear', tempMin: 78, tempMax: 96 }]"
          :updated-at="new Date().toISOString()"
        />
        <weather-widget
          id="weather-all-foggy"
          :location="{ name: 'San Francisco, CA' }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{ conditionCode: 'fog', temperature: 58, tempMin: 54, tempMax: 62 }"
          :forecast="[{ label: 'Tue', conditionCode: 'fog', tempMin: 52, tempMax: 60 }]"
          :updated-at="new Date().toISOString()"
        />
        <weather-widget
          id="weather-all-windy"
          :location="{ name: 'Chicago, IL' }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{ conditionCode: 'windy', temperature: 45, tempMin: 38, tempMax: 50 }"
          :forecast="[{ label: 'Tue', conditionCode: 'windy', tempMin: 36, tempMax: 48 }]"
          :updated-at="new Date().toISOString()"
        />
        <weather-widget
          id="weather-all-sleet"
          :location="{ name: 'Boston, MA' }"
          :units="{ temperature: 'fahrenheit' }"
          :current="{ conditionCode: 'sleet', temperature: 32, tempMin: 28, tempMax: 36 }"
          :forecast="[{ label: 'Tue', conditionCode: 'sleet', tempMin: 26, tempMax: 34 }]"
          :updated-at="new Date().toISOString()"
        />
      </div>
    </Variant>

    <Variant title="Time of Day - Lighting Simulation">
      <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">Time:</span>
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
            <span class="text-sm font-medium">Condition:</span>
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
            :location="{ name: 'Demo City' }"
            :units="{ temperature: 'fahrenheit' }"
            :current="{
              conditionCode: timeOfDayState.condition,
              temperature: 72,
              tempMin: 65,
              tempMax: 78,
            }"
            :forecast="[
              { label: 'Now', conditionCode: timeOfDayState.condition, tempMin: 65, tempMax: 78 },
            ]"
            :time="{ localTimeOfDay: getTimeOfDayValue(timeOfDayState.hour) }"
            :updated-at="new Date().toISOString()"
          />
        </div>
        <p class="text-xs text-muted-foreground">
          Demonstrates time-of-day lighting simulation. Dawn (6AM), Noon (12PM), Dusk (6PM), and Midnight (12AM)
          show different background gradients and brightness levels based on the sun's position.
        </p>
      </div>
    </Variant>

    <Variant title="Accessibility - Reduced Motion">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="effectsState.reducedMotion"
              type="checkbox"
              class="rounded border-gray-300"
            />
            <span>Enable Reduced Motion</span>
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="effectsState.enabled"
              type="checkbox"
              class="rounded border-gray-300"
            />
            <span>Enable Effects</span>
          </label>
        </div>
        <div class="w-full max-w-sm">
          <weather-widget
            id="weather-reduced-motion"
            :location="{ name: 'Accessible City' }"
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
              { label: 'Tue', conditionCode: 'thunderstorm', tempMin: 58, tempMax: 70 },
              { label: 'Wed', conditionCode: 'rain', tempMin: 60, tempMax: 72 },
            ]"
            :updated-at="new Date().toISOString()"
            :effects="effectsState"
          />
        </div>
        <div class="space-y-1 text-xs text-muted-foreground">
          <p>
            <strong>Reduced Motion:</strong> When enabled, WebGL effects are disabled and mouse-driven
            glow effects are suppressed. This respects the user's system preference for reduced motion
            via the <code>prefers-reduced-motion</code> media query.
          </p>
          <p>
            The component uses VueUse's <code>usePreferredReducedMotion</code> composable to detect
            system preferences automatically.
          </p>
        </div>
      </div>
    </Variant>

    <Variant title="Effect Quality Settings">
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">Quality:</span>
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
            :location="{ name: 'Rainy City' }"
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
            :forecast="[{ label: 'Tue', conditionCode: 'rain', tempMin: 48, tempMax: 58 }]"
            :updated-at="new Date().toISOString()"
            :effects="{ enabled: true, quality: effectsState.quality }"
          />
          <weather-widget
            id="weather-quality-snow"
            :location="{ name: 'Snowy Town' }"
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
            :forecast="[{ label: 'Tue', conditionCode: 'snow', tempMin: 18, tempMax: 30 }]"
            :updated-at="new Date().toISOString()"
            :effects="{ enabled: true, quality: effectsState.quality }"
          />
        </div>
        <p class="text-xs text-muted-foreground">
          Quality settings affect the DPR (Device Pixel Ratio) used for the WebGL canvas.
          Low = 0.5x, Medium = 1x, High = 2x, Auto = based on device capabilities.
        </p>
      </div>
    </Variant>
  </Story>
</template>
