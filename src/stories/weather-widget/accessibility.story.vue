<script setup lang="ts">
import { reactive } from 'vue';
import { WeatherWidget } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'
import type { EffectSettings } from '@lionad/vtu-components/weather-widget/schema';

const locAccessible = useStoryLocale('content.locAccessible', messages)
const locRainy = useStoryLocale('content.locRainy', messages)
const locSnowy = useStoryLocale('content.locSnowy', messages)
const dayTue = useStoryLocale('content.dayTue', messages)
const dayWed = useStoryLocale('content.dayWed', messages)
const lblReducedMotion = useStoryLocale('content.lblReducedMotion', messages)
const lblEnableEffects = useStoryLocale('content.lblEnableEffects', messages)
const lblQuality = useStoryLocale('content.lblQuality', messages)
const textReducedMotion = useStoryLocale('content.textReducedMotion', messages)
const textPreferredMotion = useStoryLocale('content.textPreferredMotion', messages)
const textQualitySettings = useStoryLocale('content.textQualitySettings', messages)
const accessibilityReducedMotion = useStoryLocale('content.accessibilityReducedMotion', messages)
const effectQualitySettings = useStoryLocale('content.effectQualitySettings', messages)

const effectsState = reactive<EffectSettings>({
  enabled: true,
  quality: 'auto',
  reducedMotion: false,
});
</script>

<template>
  <Story title="WeatherWidget/Accessibility">
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
