<script setup lang="ts">
import { reactive } from 'vue';
import { ParameterSlider } from '@lionad/components';

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
    <Variant title="Photo Adjustments (Gallery)">
      <div class="w-full max-w-md">
        <div class="mb-4 rounded-lg bg-muted p-4 text-center">
          <p class="text-sm font-medium">Current Values:</p>
          <p class="text-sm text-muted-foreground">
            Exposure: {{ imageAdjustments.exposure > 0 ? '+' : '' }}{{ imageAdjustments.exposure }}EV |
            Contrast: {{ imageAdjustments.contrast > 0 ? '+' : '' }}{{ imageAdjustments.contrast }}% |
            Highlights: {{ imageAdjustments.highlights > 0 ? '+' : '' }}{{ imageAdjustments.highlights }}% |
            Shadows: {{ imageAdjustments.shadows > 0 ? '+' : '' }}{{ imageAdjustments.shadows }}%
          </p>
        </div>
        <parameter-slider
          id="parameter-slider-photo"
          :sliders="[
            { id: 'exposure', label: 'Exposure', value: imageAdjustments.exposure, min: -3, max: 3, step: 0.1, unit: 'EV', precision: 1 },
            { id: 'contrast', label: 'Contrast', value: imageAdjustments.contrast, min: -100, max: 100, step: 5, unit: '%' },
            { id: 'highlights', label: 'Highlights', value: imageAdjustments.highlights, min: -100, max: 100, step: 5, unit: '%' },
            { id: 'shadows', label: 'Shadows', value: imageAdjustments.shadows, min: -100, max: 100, step: 5, unit: '%' },
          ]"
          :actions="[
            { id: 'reset', label: 'Reset', variant: 'ghost' },
            { id: 'apply', label: 'Apply', variant: 'default' },
          ]"
          @change="updateImageValues"
        />
      </div>
    </Variant>

    <Variant title="Color Grading">
      <div class="w-full max-w-md">
        <div class="mb-4 rounded-lg bg-muted p-4 text-center">
          <p class="text-sm font-medium">Color Settings:</p>
          <p class="text-sm text-muted-foreground">
            {{ colorGrading.temperature }}K | Tint: {{ colorGrading.tint > 0 ? '+' : '' }}{{ colorGrading.tint }} | Saturation: {{ colorGrading.saturation > 0 ? '+' : '' }}{{ colorGrading.saturation }}%
          </p>
        </div>
        <parameter-slider
          id="parameter-slider-color"
          :sliders="[
            { id: 'temperature', label: 'Temperature', value: colorGrading.temperature, min: 2000, max: 10000, step: 100, unit: 'K' },
            { id: 'tint', label: 'Tint', value: colorGrading.tint, min: -100, max: 100, step: 5 },
            { id: 'saturation', label: 'Saturation', value: colorGrading.saturation, min: -100, max: 100, step: 5, unit: '%' },
          ]"
          :actions="[
            { id: 'reset', label: 'Reset', variant: 'ghost' },
            { id: 'apply', label: 'Apply', variant: 'default' },
          ]"
          @change="updateColorValues"
        />
      </div>
    </Variant>

    <Variant title="Audio Equalizer (dB)">
      <div class="w-full max-w-md">
        <div class="mb-4 rounded-lg bg-muted p-4 text-center">
          <p class="text-sm font-medium">EQ Settings:</p>
          <p class="text-sm text-muted-foreground">
            Bass: {{ audioEq.bass > 0 ? '+' : '' }}{{ audioEq.bass }}dB |
            Mid: {{ audioEq.mid > 0 ? '+' : '' }}{{ audioEq.mid }}dB |
            Treble: {{ audioEq.treble > 0 ? '+' : '' }}{{ audioEq.treble }}dB
          </p>
        </div>
        <parameter-slider
          id="parameter-slider-audio"
          :sliders="[
            { id: 'bass', label: 'Bass', value: audioEq.bass, min: -12, max: 12, step: 1, unit: 'dB' },
            { id: 'mid', label: 'Mid', value: audioEq.mid, min: -12, max: 12, step: 1, unit: 'dB' },
            { id: 'treble', label: 'Treble', value: audioEq.treble, min: -12, max: 12, step: 1, unit: 'dB' },
          ]"
          :actions="[
            { id: 'reset', label: 'Flat', variant: 'ghost' },
            { id: 'apply', label: 'Apply', variant: 'default' },
          ]"
          @change="updateAudioValues"
        />
      </div>
    </Variant>

    <Variant title="Video Export Settings">
      <div class="w-full max-w-md">
        <div class="mb-4 rounded-lg bg-muted p-4 text-center">
          <p class="text-sm font-medium">Export Settings:</p>
          <p class="text-sm text-muted-foreground">
            {{ videoExport.bitrate }} Mbps | Keyframe: {{ videoExport.keyframe }}s | CRF: {{ videoExport.quality }}
          </p>
        </div>
        <parameter-slider
          id="parameter-slider-video"
          :sliders="[
            { id: 'bitrate', label: 'Bitrate', value: videoExport.bitrate, min: 1, max: 50, step: 0.5, unit: 'Mbps', precision: 1 },
            { id: 'keyframe', label: 'Keyframe Interval', value: videoExport.keyframe, min: 1, max: 10, step: 1, unit: 'sec' },
            { id: 'quality', label: 'CRF Quality', value: videoExport.quality, min: 0, max: 51, step: 1 },
          ]"
          :actions="[
            { id: 'reset', label: 'Defaults', variant: 'ghost' },
            { id: 'apply', label: 'Export', variant: 'default' },
          ]"
          @change="updateVideoValues"
        />
      </div>
    </Variant>

    <Variant title="Single Slider">
      <div class="w-full max-w-sm">
        <parameter-slider
          id="parameter-slider-single"
          :sliders="[
            { id: 'blur', label: 'Background Blur', value: 35, min: 0, max: 100, step: 5, unit: '%' },
          ]"
          :actions="[
            { id: 'reset', label: 'Reset', variant: 'ghost' },
            { id: 'apply', label: 'Apply', variant: 'default' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="With Disabled Slider">
      <div class="w-full max-w-md">
        <parameter-slider
          id="parameter-slider-disabled"
          :sliders="[
            { id: 'volume', label: 'Volume', value: 75, min: 0, max: 100, unit: '%' },
            { id: 'mute', label: 'Mute Level', value: 0, min: 0, max: 100, unit: '%', disabled: true },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Custom Styling">
      <div class="w-full max-w-md">
        <parameter-slider
          id="parameter-slider-custom"
          :sliders="[
            { id: 'red', label: 'Red', value: 128, min: 0, max: 255, step: 1, trackClassName: 'bg-red-100', fillClassName: 'bg-red-500/30', handleClassName: 'bg-red-600' },
            { id: 'green', label: 'Green', value: 128, min: 0, max: 255, step: 1, trackClassName: 'bg-green-100', fillClassName: 'bg-green-500/30', handleClassName: 'bg-green-600' },
            { id: 'blue', label: 'Blue', value: 128, min: 0, max: 255, step: 1, trackClassName: 'bg-blue-100', fillClassName: 'bg-blue-500/30', handleClassName: 'bg-blue-600' },
          ]"
          :actions="[
            { id: 'reset', label: 'Reset', variant: 'ghost' },
            { id: 'random', label: 'Random', variant: 'default' },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
