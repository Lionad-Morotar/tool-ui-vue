<script setup lang="ts">
import { reactive, computed, type ComputedRef } from 'vue';
import { WeatherWidget } from '@lionad/vtu-components';
import type { WeatherConditionCode, TemperatureUnit, ForecastDay, EffectSettings } from '@lionad/vtu-components/weather-widget/schema';
import { useStoryLocale, currentLocale } from './_shared/use-story-locale'

const locLA = useStoryLocale({ zh: '洛杉矶，加利福尼亚州', en: 'Los Angeles, CA' })
const locSeattle = useStoryLocale({ zh: '西雅图，华盛顿州', en: 'Seattle, WA' })
const locLondon = useStoryLocale({ zh: '伦敦，英国', en: 'London, UK' })
const locDenver = useStoryLocale({ zh: '丹佛，科罗拉多州', en: 'Denver, CO' })
const locMiami = useStoryLocale({ zh: '迈阿密，佛罗里达州', en: 'Miami, FL' })
const locTokyo = useStoryLocale({ zh: '东京，日本', en: 'Tokyo, Japan' })
const locPhoenix = useStoryLocale({ zh: '凤凰城，亚利桑那州', en: 'Phoenix, AZ' })
const locSF = useStoryLocale({ zh: '旧金山，加利福尼亚州', en: 'San Francisco, CA' })
const locChicago = useStoryLocale({ zh: '芝加哥，伊利诺伊州', en: 'Chicago, IL' })
const locBoston = useStoryLocale({ zh: '波士顿，马萨诸塞州', en: 'Boston, MA' })
const locDemo = useStoryLocale({ zh: '演示城市', en: 'Demo City' })
const locAccessible = useStoryLocale({ zh: '无障碍城市', en: 'Accessible City' })
const locRainy = useStoryLocale({ zh: '多雨之城', en: 'Rainy City' })
const locSnowy = useStoryLocale({ zh: '雪落小镇', en: 'Snowy Town' })

const dayTue = useStoryLocale({ zh: '周二', en: 'Tue' })
const dayWed = useStoryLocale({ zh: '周三', en: 'Wed' })
const dayThu = useStoryLocale({ zh: '周四', en: 'Thu' })
const dayFri = useStoryLocale({ zh: '周五', en: 'Fri' })
const daySat = useStoryLocale({ zh: '周六', en: 'Sat' })
const dayNow = useStoryLocale({ zh: '现在', en: 'Now' })

const lblSunny = useStoryLocale({ zh: '晴天', en: 'Sunny' })
const lblPartlyCloudy = useStoryLocale({ zh: '局部多云', en: 'Partly Cloudy' })
const lblCloudy = useStoryLocale({ zh: '多云', en: 'Cloudy' })
const lblRainy = useStoryLocale({ zh: '雨天', en: 'Rainy' })
const lblHeavyRain = useStoryLocale({ zh: '大雨', en: 'Heavy Rain' })
const lblSnowy = useStoryLocale({ zh: '雪天', en: 'Snowy' })
const lblThunderstorm = useStoryLocale({ zh: '雷暴', en: 'Thunderstorm' })
const lblClear = useStoryLocale({ zh: '晴朗', en: 'Clear' })

const lblToggle = useStoryLocale({ zh: '切换', en: 'Toggle' })
const lblTime = useStoryLocale({ zh: '时间', en: 'Time' })
const lblCondition = useStoryLocale({ zh: '天气状况', en: 'Condition' })
const lblReducedMotion = useStoryLocale({ zh: '启用减少动画', en: 'Enable Reduced Motion' })
const lblEnableEffects = useStoryLocale({ zh: '启用特效', en: 'Enable Effects' })
const lblQuality = useStoryLocale({ zh: '质量', en: 'Quality' })

const textTimeOfDay = useStoryLocale({
  zh: '演示一天中不同时间的光照模拟。黎明（早上6点）、正午（中午12点）、黄昏（下午6点）和午夜（凌晨12点）根据太阳的位置显示不同的背景渐变和亮度级别。',
  en: 'Demonstrates time-of-day lighting simulation. Dawn (6 AM), Noon (12 PM), Dusk (6 PM), and Midnight (12 AM) show different background gradients and brightness levels based on the sun\'s position.'
})

const textReducedMotion = useStoryLocale({
  zh: '减少运动：启用后，WebGL 特效将被禁用，鼠标驱动的光晕效果也会被抑制。这通过 prefers-reduced-motion 媒体查询尊重用户的系统减少运动偏好。',
  en: 'Reduced Motion: When enabled, WebGL effects are disabled and mouse-driven glow effects are suppressed. This respects the user\'s system preference for reduced motion via the prefers-reduced-motion media query.'
})

const textPreferredMotion = useStoryLocale({
  zh: '组件使用 VueUse 的 usePreferredReducedMotion 组合式函数自动检测系统偏好。',
  en: 'The component uses VueUse\'s usePreferredReducedMotion composable to detect system preferences automatically.'
})

const textQualitySettings = useStoryLocale({
  zh: '质量设置影响 WebGL 画布使用的 DPR（设备像素比）。低 = 0.5x，中 = 1x，高 = 2x，自动 = 基于设备性能。',
  en: 'Quality settings affect the DPR (Device Pixel Ratio) used for the WebGL canvas. Low = 0.5x, Medium = 1x, High = 2x, Auto = based on device capabilities.'
})

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

const sunny = useStoryLocale({ zh: '晴天', en: 'Sunny' })
const cloudy = useStoryLocale({ zh: '多云', en: 'Cloudy' })
const rainy = useStoryLocale({ zh: '雨天', en: 'Rainy' })
const snowy = useStoryLocale({ zh: '雪天', en: 'Snowy' })
const thunderstorm = useStoryLocale({ zh: '雷暴', en: 'Thunderstorm' })
const celsius = useStoryLocale({ zh: '摄氏度', en: 'Celsius' })
const interactiveWeatherSimulator = useStoryLocale({ zh: '交互 - 天气模拟器', en: 'Interactive - Weather Simulator' })
const allWeatherConditions = useStoryLocale({ zh: '所有天气状况', en: 'All Weather Conditions' })
const timeOfDayLightingSimulation = useStoryLocale({ zh: '一天中的时间 - 光照模拟', en: 'Time of Day - Lighting Simulation' })
const accessibilityReducedMotion = useStoryLocale({ zh: '无障碍 - 减少动画', en: 'Accessibility - Reduced Motion' })
const effectQualitySettings = useStoryLocale({ zh: '特效质量设置', en: 'Effect Quality Settings' })
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
