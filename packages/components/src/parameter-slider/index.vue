<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../core';
import {
  useSlider,
  useDrag,
  useLayout,
  useVisual,
  formatSignedValue,
  getAriaValueText,
  generateTicks,
  THUMB_WIDTH,
} from './states';
import { useI18n } from '../core/i18n';
import type { ParameterSliderProps, SliderValue } from './schema';

defineOptions({ name: 'CmptParameterSlider', inheritAttrs: false })

const props = withDefaults(defineProps<ParameterSliderProps>(), {
  css: () => ({}),
})

// i18n
const { t } = useI18n();

const emit = defineEmits<{
  change: [values: SliderValue[]];
  action: [actionId: string, values: SliderValue[]];
  commit: [values: SliderValue[]];
}>();

// Normalize actions config
const normalizedActions = computed(() => {
  if (!props.actions) {
    return {
      items: [
        { id: 'reset', label: t('parameterSlider.reset').value, variant: 'ghost' as const },
        { id: 'apply', label: t('parameterSlider.confirm').value, variant: 'default' as const },
      ],
      align: 'right' as const,
    };
  }

  if (Array.isArray(props.actions)) {
    return {
      items: props.actions.map((action) => ({
        ...action,
        variant:
          action.variant ||
          (action.id === 'apply' ? 'default' : ('ghost' as const)),
      })),
      align: 'right' as const,
    };
  }

  return props.actions;
});

// Slider state management
const sliderState = useSlider({
  sliders: () => props.sliders,
  values: () => props.values,
  emit: {
    change: (values) => emit('change', values),
    commit: (values) => emit('commit', values),
  },
});

// Layout management
const layoutState = useLayout({
  sliders: () => props.sliders,
  getSliderValue: sliderState.getSliderValue,
  getSliderRowState: sliderState.getSliderRowState,
  currentValues: sliderState.currentValues,
});

// Drag handling
const dragState = useDrag({
  sliders: () => props.sliders,
  trackRefs: layoutState.trackRefs,
  getSliderValue: sliderState.getSliderValue,
  updateSliderValue: sliderState.updateSliderValue,
  getSliderRowState: sliderState.getSliderRowState,
  emitCommit: () => emit('commit', sliderState.currentValues.value),
});

// Visual styles
const visualState = useVisual({
  sliders: computed(() => props.sliders),
  getSliderValue: sliderState.getSliderValue,
  getSliderRowState: sliderState.getSliderRowState,
});

// Action handlers
function handleReset() {
  sliderState.resetValues();
  emit('action', 'reset', sliderState.sliderSnapshot.value);
}

function handleAction(actionId: string) {
  if (actionId === 'reset') {
    handleReset();
  } else {
    emit('action', actionId, sliderState.currentValues.value);
  }
}
</script>

<template>
  <article
    v-bind="$attrs"
    :class="
      cn(
        '@container/parameter-slider isolate flex w-full max-w-md min-w-80 flex-col gap-3',
        'text-foreground',
        props.css?.root,
      )
    "
    data-slot="parameter-slider"
    :data-tool-ui-id="props.id"
  >
    <div
      :class="
        cn(
          'flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card px-5 py-3 shadow-xs',
          props.css?.slider,
        )
      "
    >
      <div
        v-for="slider in props.sliders"
        :key="slider.id"
        class="py-2"
      >
        <!-- Slider Root -->
        <div
          :class="
            cn(
              'group/slider relative flex w-full touch-none items-center select-none',
              'isolate h-12',
              sliderState.getSliderRowState(slider.id).isDragging
                ? '[&>span]:transition-[left,transform] [&>span]:duration-45 [&>span]:ease-linear'
                : '[&>span]:transition-[left,transform] [&>span]:duration-90 [&>span]:ease-[cubic-bezier(0.22,1,0.36,1)]',
              '[&>span]:will-change-[left,transform]',
              'motion-reduce:[&>span]:transition-none',
              slider.disabled && 'pointer-events-none opacity-50',
            )
          "
          @pointerdown="dragState.handlePointerDown(slider.id, $event)"
          @pointerenter="dragState.handlePointerEnter(slider.id)"
          @pointerleave="dragState.handlePointerLeave(slider.id)"
        >
          <!-- Track -->
          <span
            :ref="(el) => layoutState.setTrackRef(el as HTMLElement, slider.id)"
            :class="
              cn(
                'squircle relative h-12 w-full grow overflow-hidden rounded-sm',
                'ring-1 ring-border ring-inset',
                'dark:ring-white/10',
                slider.trackClassName ?? 'bg-muted',
              )
            "
          >
            <!-- Fill -->
            <span
              :class="
                cn(
                  'absolute inset-0 will-change-[clip-path]',
                  sliderState.getSliderRowState(slider.id).isDragging
                    ? 'transition-[clip-path] duration-45 ease-linear'
                    : 'transition-[clip-path] duration-90 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  'motion-reduce:transition-none',
                  slider.fillClassName ?? 'bg-primary/30 dark:bg-primary/40',
                )
              "
              :style="{
                maskImage: visualState.getFillMaskImage(slider),
                WebkitMaskImage: visualState.getFillMaskImage(slider),
                clipPath: visualState.getFillClipPath(slider),
              }"
            />

            <!-- Ticks -->
            <span
              v-for="(tick, i) in generateTicks(slider)"
              :key="i"
              :class="
                cn(
                  'pointer-events-none absolute bottom-px w-px',
                  tick.isSubtick ? 'h-1.5' : 'h-2',
                  !tick.isSubtick && (tick.percent === 0 || tick.percent === 100)
                    ? 'bg-transparent'
                    : tick.isSubtick
                      ? 'bg-foreground/8 dark:bg-white/5'
                      : tick.isCenter
                        ? 'bg-foreground/30 dark:bg-white/25'
                        : 'bg-foreground/15 dark:bg-white/8',
                )
              "
              :style="{
                left: visualState.toInsetPosition(tick.percent),
                transform: 'translateX(-50%)',
              }"
            />
          </span>

          <!-- Metallic Reflection -->
          <span
            :class="
              cn(
                'squircle pointer-events-none absolute inset-0 rounded-sm',
                sliderState.getSliderRowState(slider.id).isDragging
                  ? 'transition-[opacity,background] duration-45 ease-linear'
                  : 'transition-[opacity,background] duration-90 ease-[cubic-bezier(0.22,1,0.36,1)]',
                'motion-reduce:transition-none',
              )
            "
            :style="{
              ...visualState.getReflectionStyle(slider.id),
              opacity: visualState.getReflectionOpacity(slider.id),
              filter: 'blur(1px)',
              mixBlendMode: 'overlay',
            }"
          />

          <!-- Thumb -->
          <span
            :class="
              cn(
                'group/thumb z-0 block w-3 shrink-0 cursor-grab rounded-sm',
                'relative bg-transparent outline-none',
                'transition-[height,opacity] duration-150 ease-[var(--cubic-ease-in-out)]',
                'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
                'active:cursor-grabbing',
                'disabled:pointer-events-none disabled:opacity-50',
              )
            "
            :style="{
              height: visualState.getThumbHeight(slider.id),
              width: THUMB_WIDTH + 'px',
              left: visualState.getThumbLeftPosition(slider.id),
              position: 'absolute',
              transform: 'translateX(-50%)',
            }"
          >
            <!-- Top segment -->
            <span
              :class="
                cn(
                  'absolute top-0 left-1/2',
                  'transition-all duration-100 ease-[var(--cubic-ease-in-out)]',
                  slider.handleClassName ?? 'bg-primary',
                )
              "
              :style="{
                transform: 'translateX(-50%)',
                height: visualState.getThumbSegmentHeights(slider.id).top,
                width: visualState.getThumbWidth(slider.id),
                opacity: visualState.getThumbSegmentOpacity(slider.id),
                borderRadius: visualState.getThumbSegmentRadius(slider.id, 'top'),
              }"
            />
            <!-- Bottom segment -->
            <span
              :class="
                cn(
                  'absolute bottom-0 left-1/2',
                  'transition-all duration-100 ease-[var(--cubic-ease-in-out)]',
                  slider.handleClassName ?? 'bg-primary',
                )
              "
              :style="{
                transform: 'translateX(-50%)',
                height: visualState.getThumbSegmentHeights(slider.id).bottom,
                width: visualState.getThumbWidth(slider.id),
                opacity: visualState.getThumbSegmentOpacity(slider.id),
                borderRadius: visualState.getThumbSegmentRadius(slider.id, 'bottom'),
              }"
            />
          </span>

          <!-- Text Labels -->
          <div
            class="pointer-events-none absolute inset-x-3 top-1/2 z-10 flex items-center justify-between"
            :style="{
              transform: 'translateY(calc(-50% - 0.5px))',
            }"
          >
            <span
              :ref="(el) => layoutState.setLabelRef(el as HTMLElement, slider.id)"
              class="-mt-px rounded-full px-2 py-px text-sm font-normal tracking-wide text-primary"
            >
              {{ slider.label }}
            </span>
            <span
              :ref="(el) => layoutState.setValueRef(el as HTMLElement, slider.id)"
              class="-mt-px -mb-0.5 flex h-6 items-center rounded-full px-2 font-mono text-xs text-foreground tabular-nums"
            >
              {{
                formatSignedValue({
                  value: sliderState.getSliderValue(slider.id),
                  min: slider.min,
                  max: slider.max,
                  precision: slider.precision,
                  unit: slider.unit,
                })
              }}
            </span>
          </div>
        </div>

        <!-- Hidden input for accessibility -->
        <input
          type="range"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step || 'any'"
          :value="sliderState.getSliderValue(slider.id)"
          :disabled="slider.disabled"
          class="sr-only"
          :aria-valuetext="
            getAriaValueText(
              sliderState.getSliderValue(slider.id),
              slider.min,
              slider.max,
              slider.unit,
            )
          "
          @input="
            sliderState.updateSliderValue(
              slider.id,
              Number(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="@container/actions">
      <div
        :class="
          cn(
            'flex w-full flex-col gap-3',
            normalizedActions.align === 'left'
              ? 'flex-col @[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:justify-start @[240px]/actions:gap-2'
              : normalizedActions.align === 'center'
                ? 'flex-col @[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:justify-center @[240px]/actions:gap-2'
                : 'flex-col @[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:justify-end @[240px]/actions:gap-2',
            props.css?.actions,
          )
        "
      >
        <button
          v-for="action in normalizedActions.items"
          :key="action.id"
          type="button"
          :class="
            cn(
              'inline-flex items-center justify-center rounded-full px-4 text-base font-medium transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:pointer-events-none disabled:opacity-50',
              'min-h-11 w-full text-base',
              '@[240px]/actions:min-h-0 @[240px]/actions:w-auto @[240px]/actions:px-3 @[240px]/actions:py-2 @[240px]/actions:text-sm',
              action.variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : action.variant === 'secondary'
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  : action.variant === 'ghost'
                    ? 'hover:bg-accent hover:text-accent-foreground'
                    : action.variant === 'outline'
                      ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )
          "
          :disabled="action.disabled"
          @click="handleAction(action.id)"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
  </article>
</template>
