<script setup lang="ts">
import { WeatherWidget } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const locSeattle = useStoryLocale('content.locSeattle', messages)
const locLondon = useStoryLocale('content.locLondon', messages)
const locDenver = useStoryLocale('content.locDenver', messages)
const dayTue = useStoryLocale('content.dayTue', messages)
const dayWed = useStoryLocale('content.dayWed', messages)
const dayThu = useStoryLocale('content.dayThu', messages)
const dayFri = useStoryLocale('content.dayFri', messages)
const daySat = useStoryLocale('content.daySat', messages)
const cloudy = useStoryLocale('content.cloudy', messages)
const rainy = useStoryLocale('content.rainy', messages)
const snowy = useStoryLocale('content.snowy', messages)
</script>

<template>
  <Story title="WeatherWidget/Conditions">
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
  </Story>
</template>
