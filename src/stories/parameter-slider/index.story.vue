<script setup lang="ts">
import { reactive } from 'vue';
import { ParameterSlider } from '@lionad/vtu-components';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n';

const subtitle = useStoryLocale('content.subtitle', messages);
const lblCurrentValues = useStoryLocale('content.lblCurrentValues', messages)
const lblColorSettings = useStoryLocale('content.lblColorSettings', messages)
const lblEQSettings = useStoryLocale('content.lblEQSettings', messages)
const lblExportSettings = useStoryLocale('content.lblExportSettings', messages)
const lblReset = useStoryLocale('content.lblReset', messages)
const lblApply = useStoryLocale('content.lblApply', messages)
const lblFlat = useStoryLocale('content.lblFlat', messages)
const lblDefaults = useStoryLocale('content.lblDefaults', messages)
const lblExport = useStoryLocale('content.lblExport', messages)
const lblRandom = useStoryLocale('content.lblRandom', messages)
const lblExposure = useStoryLocale('content.lblExposure', messages)
const lblContrast = useStoryLocale('content.lblContrast', messages)
const lblHighlights = useStoryLocale('content.lblHighlights', messages)
const lblShadows = useStoryLocale('content.lblShadows', messages)
const lblTemperature = useStoryLocale('content.lblTemperature', messages)
const lblTint = useStoryLocale('content.lblTint', messages)
const lblSaturation = useStoryLocale('content.lblSaturation', messages)
const lblBass = useStoryLocale('content.lblBass', messages)
const lblMid = useStoryLocale('content.lblMid', messages)
const lblTreble = useStoryLocale('content.lblTreble', messages)
const lblBitrate = useStoryLocale('content.lblBitrate', messages)
const lblKeyframeInterval = useStoryLocale('content.lblKeyframeInterval', messages)
const lblCRFQuality = useStoryLocale('content.lblCRFQuality', messages)
const lblBgBlur = useStoryLocale('content.lblBgBlur', messages)
const lblVolume = useStoryLocale('content.lblVolume', messages)
const lblMuteLevel = useStoryLocale('content.lblMuteLevel', messages)
const lblRed = useStoryLocale('content.lblRed', messages)
const lblGreen = useStoryLocale('content.lblGreen', messages)
const lblBlue = useStoryLocale('content.lblBlue', messages)
const photoAdjustmentsGallery = useStoryLocale('content.photoAdjustmentsGallery', messages)
const colorGradingTitle = useStoryLocale('content.colorGradingTitle', messages)
const audioEqualizerDB = useStoryLocale('content.audioEqualizerDB', messages)
const videoExportSettings = useStoryLocale('content.videoExportSettings', messages)
const singleSlider = useStoryLocale('content.singleSlider', messages)
const withDisabledSlider = useStoryLocale('content.withDisabledSlider', messages)
const customStyling = useStoryLocale('content.customStyling', messages)

const imageAdjustments = reactive({
  exposure: 0.3,
  contrast: 15,
  highlights: -20,
  shadows: 25
});

const colorGrading = reactive({
  temperature: 5600,
  tint: -8,
  saturation: 12
});

const audioEq = reactive({
  bass: 3,
  mid: -2,
  treble: 4
});

const videoExport = reactive({
  bitrate: 24,
  keyframe: 2,
  quality: 18
});

function updateImageValues(values: Array<{ id: string; value: number }>) {
  const e = values.find(v => v.id === 'exposure');
  const c = values.find(v => v.id === 'contrast');
  const h = values.find(v => v.id === 'highlights');
  const s = values.find(v => v.id === 'shadows');
  if (e) imageAdjustments.exposure = e.value;
  if (c) imageAdjustments.contrast = c.value;
  if (h) imageAdjustments.highlights = h.value;
  if (s) imageAdjustments.shadows = s.value;
}

function updateColorValues(values: Array<{ id: string; value: number }>) {
  const t = values.find(v => v.id === 'temperature');
  const ti = values.find(v => v.id === 'tint');
  const s = values.find(v => v.id === 'saturation');
  if (t) colorGrading.temperature = t.value;
  if (ti) colorGrading.tint = ti.value;
  if (s) colorGrading.saturation = s.value;
}

function updateAudioValues(values: Array<{ id: string; value: number }>) {
  const b = values.find(v => v.id === 'bass');
  const m = values.find(v => v.id === 'mid');
  const t = values.find(v => v.id === 'treble');
  if (b) audioEq.bass = b.value;
  if (m) audioEq.mid = m.value;
  if (t) audioEq.treble = t.value;
}

function updateVideoValues(values: Array<{ id: string; value: number }>) {
  const b = values.find(v => v.id === 'bitrate');
  const k = values.find(v => v.id === 'keyframe');
  const q = values.find(v => v.id === 'quality');
  if (b) videoExport.bitrate = b.value;
  if (k) videoExport.keyframe = k.value;
  if (q) videoExport.quality = q.value;
}

/**
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier for the component |
 * | sliders | SliderConfig[] | required | Array of slider configurations |
 * | values | SliderValue[] | undefined | Controlled values for sliders |
 * | actions | Action[] \| SerializableActionsConfig | undefined | Action buttons config |
 * | css | { root?: string } | undefined | CSS classes for component elements |
 * | trackClassName | string | undefined | CSS class for track elements |
 * | fillClassName | string | undefined | CSS class for fill elements |
 * | handleClassName | string | undefined | CSS class for handle elements |
 *
 * ### SliderConfig
 * | Property | Type | Default | Description |
 * |----------|------|---------|-------------|
 * | id | string | required | Unique identifier for the slider |
 * | label | string | required | Display label |
 * | min | number | required | Minimum value |
 * | max | number | required | Maximum value |
 * | value | number | required | Initial value |
 * | step | number | undefined | Step increment |
 * | unit | string | undefined | Unit suffix (e.g., '%', 'dB') |
 * | precision | number | undefined | Decimal places to display |
 * | disabled | boolean | false | Disable the slider |
 * | trackClassName | string | undefined | Per-slider track class |
 * | fillClassName | string | undefined | Per-slider fill class |
 * | handleClassName | string | undefined | Per-slider handle class |
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | change | values: SliderValue[] | Emitted when any slider value changes |
 * | commit | values: SliderValue[] | Emitted when drag/change ends |
 * | action | actionId: string, values: SliderValue[] | Emitted when action button clicked |
 *
 * ## Slots
 *
 * This component does not use slots. All content is passed via props.
 *
 * ## Accessibility
 *
 * - Hidden native range inputs for screen readers
 * - aria-valuetext with formatted values
 * - Keyboard navigation support
 * - Focus indicators on handles
 *
 * ## Interaction Patterns
 *
 * - Drag handle to change value
 * - Value changes emit `change` event continuously
 * - `commit` event fires on drag end
 * - Cross-zero sliders show signed values (+/-)
 * - Text labels avoid collision with handle
 */

</script>

<template>
  <Story title="ParameterSlider/All Variants">
    <Variant :title="photoAdjustmentsGallery">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-md">
        <div class="mb-4 rounded-lg bg-muted p-4 text-center">
          <p class="text-sm font-medium">{{ lblCurrentValues }}:</p>
          <p class="text-sm text-muted-foreground">
            {{ lblExposure }}: {{ imageAdjustments.exposure > 0 ? '+' : '' }}{{ imageAdjustments.exposure }}EV |
            {{ lblContrast }}: {{ imageAdjustments.contrast > 0 ? '+' : '' }}{{ imageAdjustments.contrast }}% |
            {{ lblHighlights }}: {{ imageAdjustments.highlights > 0 ? '+' : '' }}{{ imageAdjustments.highlights }}% |
            {{ lblShadows }}: {{ imageAdjustments.shadows > 0 ? '+' : '' }}{{ imageAdjustments.shadows }}%
          </p>
        </div>
        <parameter-slider
          id="parameter-slider-photo"
          :sliders="[
            { id: 'exposure', label: lblExposure, value: imageAdjustments.exposure, min: -3, max: 3, step: 0.1, unit: 'EV', precision: 1 },
            { id: 'contrast', label: lblContrast, value: imageAdjustments.contrast, min: -100, max: 100, step: 5, unit: '%' },
            { id: 'highlights', label: lblHighlights, value: imageAdjustments.highlights, min: -100, max: 100, step: 5, unit: '%' },
            { id: 'shadows', label: lblShadows, value: imageAdjustments.shadows, min: -100, max: 100, step: 5, unit: '%' },
          ]"
          :actions="[
            { id: 'reset', label: lblReset, variant: 'ghost' },
            { id: 'apply', label: lblApply, variant: 'default' },
          ]"
          @change="updateImageValues"
        />
      </div>
    </Variant>

    <Variant :title="colorGradingTitle">
      <div class="w-full max-w-md">
        <div class="mb-4 rounded-lg bg-muted p-4 text-center">
          <p class="text-sm font-medium">{{ lblColorSettings }}:</p>
          <p class="text-sm text-muted-foreground">
            {{ colorGrading.temperature }}K | {{ lblTint }}: {{ colorGrading.tint > 0 ? '+' : '' }}{{ colorGrading.tint }} | {{ lblSaturation }}: {{ colorGrading.saturation > 0 ? '+' : '' }}{{ colorGrading.saturation }}%
          </p>
        </div>
        <parameter-slider
          id="parameter-slider-color"
          :sliders="[
            { id: 'temperature', label: lblTemperature, value: colorGrading.temperature, min: 2000, max: 10000, step: 100, unit: 'K' },
            { id: 'tint', label: lblTint, value: colorGrading.tint, min: -100, max: 100, step: 5 },
            { id: 'saturation', label: lblSaturation, value: colorGrading.saturation, min: -100, max: 100, step: 5, unit: '%' },
          ]"
          :actions="[
            { id: 'reset', label: lblReset, variant: 'ghost' },
            { id: 'apply', label: lblApply, variant: 'default' },
          ]"
          @change="updateColorValues"
        />
      </div>
    </Variant>

    <Variant :title="audioEqualizerDB">
      <div class="w-full max-w-md">
        <div class="mb-4 rounded-lg bg-muted p-4 text-center">
          <p class="text-sm font-medium">{{ lblEQSettings }}:</p>
          <p class="text-sm text-muted-foreground">
            {{ lblBass }}: {{ audioEq.bass > 0 ? '+' : '' }}{{ audioEq.bass }}dB |
            {{ lblMid }}: {{ audioEq.mid > 0 ? '+' : '' }}{{ audioEq.mid }}dB |
            {{ lblTreble }}: {{ audioEq.treble > 0 ? '+' : '' }}{{ audioEq.treble }}dB
          </p>
        </div>
        <parameter-slider
          id="parameter-slider-audio"
          :sliders="[
            { id: 'bass', label: lblBass, value: audioEq.bass, min: -12, max: 12, step: 1, unit: 'dB' },
            { id: 'mid', label: lblMid, value: audioEq.mid, min: -12, max: 12, step: 1, unit: 'dB' },
            { id: 'treble', label: lblTreble, value: audioEq.treble, min: -12, max: 12, step: 1, unit: 'dB' },
          ]"
          :actions="[
            { id: 'reset', label: lblFlat, variant: 'ghost' },
            { id: 'apply', label: lblApply, variant: 'default' },
          ]"
          @change="updateAudioValues"
        />
      </div>
    </Variant>

    <Variant :title="videoExportSettings">
      <div class="w-full max-w-md">
        <div class="mb-4 rounded-lg bg-muted p-4 text-center">
          <p class="text-sm font-medium">{{ lblExportSettings }}:</p>
          <p class="text-sm text-muted-foreground">
            {{ videoExport.bitrate }} Mbps | {{ lblKeyframeInterval }}: {{ videoExport.keyframe }}s | CRF: {{ videoExport.quality }}
          </p>
        </div>
        <parameter-slider
          id="parameter-slider-video"
          :sliders="[
            { id: 'bitrate', label: lblBitrate, value: videoExport.bitrate, min: 1, max: 50, step: 0.5, unit: 'Mbps', precision: 1 },
            { id: 'keyframe', label: lblKeyframeInterval, value: videoExport.keyframe, min: 1, max: 10, step: 1, unit: 'sec' },
            { id: 'quality', label: lblCRFQuality, value: videoExport.quality, min: 0, max: 51, step: 1 },
          ]"
          :actions="[
            { id: 'reset', label: lblDefaults, variant: 'ghost' },
            { id: 'apply', label: lblExport, variant: 'default' },
          ]"
          @change="updateVideoValues"
        />
      </div>
    </Variant>

    <Variant :title="singleSlider">
      <div class="w-full max-w-sm">
        <parameter-slider
          id="parameter-slider-single"
          :sliders="[
            { id: 'blur', label: lblBgBlur, value: 35, min: 0, max: 100, step: 5, unit: '%' },
          ]"
          :actions="[
            { id: 'reset', label: lblReset, variant: 'ghost' },
            { id: 'apply', label: lblApply, variant: 'default' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="withDisabledSlider">
      <div class="w-full max-w-md">
        <parameter-slider
          id="parameter-slider-disabled"
          :sliders="[
            { id: 'volume', label: lblVolume, value: 75, min: 0, max: 100, unit: '%' },
            { id: 'mute', label: lblMuteLevel, value: 0, min: 0, max: 100, unit: '%', disabled: true },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="customStyling">
      <div class="w-full max-w-md">
        <parameter-slider
          id="parameter-slider-custom"
          :sliders="[
            { id: 'red', label: lblRed, value: 128, min: 0, max: 255, step: 1, trackClassName: 'bg-red-100', fillClassName: 'bg-red-500/30', handleClassName: 'bg-red-600' },
            { id: 'green', label: lblGreen, value: 128, min: 0, max: 255, step: 1, trackClassName: 'bg-green-100', fillClassName: 'bg-green-500/30', handleClassName: 'bg-green-600' },
            { id: 'blue', label: lblBlue, value: 128, min: 0, max: 255, step: 1, trackClassName: 'bg-blue-100', fillClassName: 'bg-blue-500/30', handleClassName: 'bg-blue-600' },
          ]"
          :actions="[
            { id: 'reset', label: lblReset, variant: 'ghost' },
            { id: 'random', label: lblRandom, variant: 'default' },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
