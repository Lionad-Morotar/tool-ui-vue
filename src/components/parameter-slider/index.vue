<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue';
import { cn } from '../../utils';
import {
  createSliderSignature,
  createSliderValueSnapshot,
  sliderRangeToPercent,
} from './math';
import type { ParameterSliderProps, SliderConfig, SliderValue } from './schema';

defineOptions({ name: 'cmpt-parameter-slider', inheritAttrs: false })

const props = withDefaults(defineProps<ParameterSliderProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  change: [values: SliderValue[]];
  action: [actionId: string, values: SliderValue[]];
  commit: [values: SliderValue[]]; // 只在拖拽/编辑结束时触发
}>();

// Constants matching React version
const TICK_COUNT = 16;
const TEXT_PADDING_X = 4;
const TEXT_PADDING_X_OUTER = 0;
const TEXT_PADDING_Y = 2;
const DETECTION_MARGIN_X = 12;
const DETECTION_MARGIN_X_OUTER = 4;
const DETECTION_MARGIN_Y = 12;
const TRACK_HEIGHT = 48;
const TEXT_RELEASE_INSET = 8;
const TRACK_EDGE_INSET = 4;
const THUMB_WIDTH = 12;
const TEXT_VERTICAL_OFFSET = 0.5;
const OUTER_EDGE_RADIUS_FACTOR = 0.3;

// Utility functions
function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function toInsetPosition(percent: number): string {
  const safePercent = clampPercent(percent);
  return `calc(${TRACK_EDGE_INSET}px + (100% - ${TRACK_EDGE_INSET * 2}px) * ${safePercent / 100})`;
}

function getRadixThumbInBoundsOffsetPx(percent: number): number {
  const safePercent = clampPercent(percent);
  const halfWidth = THUMB_WIDTH / 2;
  return halfWidth - (safePercent * halfWidth) / 50;
}

function toRadixThumbPosition(percent: number): string {
  const safePercent = clampPercent(percent);
  const offsetPx = getRadixThumbInBoundsOffsetPx(safePercent);
  return `calc(${safePercent}% + ${offsetPx}px)`;
}

function signedDistanceToRoundedRect(
  px: number,
  py: number,
  left: number,
  right: number,
  top: number,
  bottom: number,
  radiusLeft: number,
  radiusRight: number,
): number {
  const innerLeft = left + radiusLeft;
  const innerRight = right - radiusRight;
  const innerTop = top + Math.max(radiusLeft, radiusRight);
  const innerBottom = bottom - Math.max(radiusLeft, radiusRight);

  const inLeftCorner = px < innerLeft;
  const inRightCorner = px > innerRight;
  const inCornerY = py < innerTop || py > innerBottom;

  if ((inLeftCorner || inRightCorner) && inCornerY) {
    const radius = inLeftCorner ? radiusLeft : radiusRight;
    const cornerX = inLeftCorner ? innerLeft : innerRight;
    const cornerY = py < innerTop ? top + radius : bottom - radius;
    const distToCornerCenter = Math.hypot(px - cornerX, py - cornerY);
    return distToCornerCenter - radius;
  }

  const dx = Math.max(left - px, px - right, 0);
  const dy = Math.max(top - py, py - bottom, 0);

  if (dx === 0 && dy === 0) {
    return -Math.min(px - left, right - px, py - top, bottom - py);
  }

  return Math.max(dx, dy);
}

function calculateGap(
  thumbCenterX: number,
  textRect: { left: number; right: number; height: number; centerY: number },
  isLeftAligned: boolean,
): number {
  const { left, right, height, centerY } = textRect;
  const paddingLeft = isLeftAligned ? TEXT_PADDING_X_OUTER : TEXT_PADDING_X;
  const paddingRight = isLeftAligned ? TEXT_PADDING_X : TEXT_PADDING_X_OUTER;
  const marginLeft = isLeftAligned
    ? DETECTION_MARGIN_X_OUTER
    : DETECTION_MARGIN_X;
  const marginRight = isLeftAligned
    ? DETECTION_MARGIN_X
    : DETECTION_MARGIN_X_OUTER;
  const paddingY = TEXT_PADDING_Y;
  const marginY = DETECTION_MARGIN_Y;
  const thumbCenterY = centerY;

  const innerLeft = left - paddingLeft;
  const innerRight = right + paddingRight;
  const innerTop = centerY - height / 2 - paddingY;
  const innerBottom = centerY + height / 2 + paddingY;
  const innerHeight = height + paddingY * 2;
  const innerRadius = innerHeight / 2;
  const innerRadiusLeft = isLeftAligned
    ? innerRadius * OUTER_EDGE_RADIUS_FACTOR
    : innerRadius;
  const innerRadiusRight = isLeftAligned
    ? innerRadius
    : innerRadius * OUTER_EDGE_RADIUS_FACTOR;

  const outerLeft = left - paddingLeft - marginLeft;
  const outerRight = right + paddingRight + marginRight;
  const outerTop = centerY - height / 2 - paddingY - marginY;
  const outerBottom = centerY + height / 2 + paddingY + marginY;
  const outerHeight = height + paddingY * 2 + marginY * 2;
  const outerRadius = outerHeight / 2;
  const outerRadiusLeft = isLeftAligned
    ? outerRadius * OUTER_EDGE_RADIUS_FACTOR
    : outerRadius;
  const outerRadiusRight = isLeftAligned
    ? outerRadius
    : outerRadius * OUTER_EDGE_RADIUS_FACTOR;

  const outerDist = signedDistanceToRoundedRect(
    thumbCenterX,
    thumbCenterY,
    outerLeft,
    outerRight,
    outerTop,
    outerBottom,
    outerRadiusLeft,
    outerRadiusRight,
  );

  if (outerDist > 0) return 0;

  const innerDist = signedDistanceToRoundedRect(
    thumbCenterX,
    thumbCenterY,
    innerLeft,
    innerRight,
    innerTop,
    innerBottom,
    innerRadiusLeft,
    innerRadiusRight,
  );

  const maxGap = height + paddingY * 2;
  if (innerDist <= 0) return maxGap;

  const totalDist = Math.abs(outerDist) + innerDist;
  const t = Math.abs(outerDist) / totalDist;

  return maxGap * t;
}

function formatSignedValue(
  value: number,
  min: number,
  max: number,
  precision?: number,
  unit?: string,
): string {
  const crossesZero = min < 0 && max > 0;
  const fixed =
    precision !== undefined ? value.toFixed(precision) : String(value);
  const numericPart = crossesZero && value >= 0 ? `+${fixed}` : fixed;
  return unit ? `${numericPart} ${unit}` : numericPart;
}

function getAriaValueText(
  value: number,
  min: number,
  max: number,
  unit?: string,
): string {
  const crossesZero = min < 0 && max > 0;
  if (crossesZero) {
    if (value > 0) {
      return unit ? `plus ${value} ${unit}` : `plus ${value}`;
    } else if (value < 0) {
      return unit
        ? `minus ${Math.abs(value)} ${unit}`
        : `minus ${Math.abs(value)}`;
    }
  }
  return unit ? `${value} ${unit}` : String(value);
}

// Controllable state implementation
const slidersSignature = computed(() => createSliderSignature(props.sliders));
const sliderSnapshot = computed(() => createSliderValueSnapshot(props.sliders));

const isControlled = computed(() => props.values !== undefined);
const localValues = ref<Record<string, number>>({});

// Reset when sliders change
const previousSignature = ref(slidersSignature.value);
watch(slidersSignature, (newSignature) => {
  if (newSignature !== previousSignature.value) {
    previousSignature.value = newSignature;
    if (!isControlled.value) {
      localValues.value = {};
    }
  }
});

const currentValues = computed<SliderValue[]>(() => {
  return props.sliders.map((slider) => {
    const fromProp = props.values?.find((v) => v.id === slider.id)?.value;
    const fromLocal = localValues.value[slider.id];
    return {
      id: slider.id,
      value: fromLocal ?? fromProp ?? slider.value,
    };
  });
});

function getSliderValue(sliderId: string): number {
  return currentValues.value.find((v) => v.id === sliderId)?.value ?? 0;
}

function updateSliderValue(sliderId: string, newValue: number, isCommit = false) {
  const slider = props.sliders.find((s) => s.id === sliderId);
  if (!slider) return;

  // Clamp to range
  const clamped = Math.max(slider.min, Math.min(slider.max, newValue));
  // Apply step
  const stepped = slider.step
    ? Math.round(clamped / slider.step) * slider.step
    : clamped;
  // Apply precision
  const precision = slider.precision ?? 0;
  const rounded = Number(stepped.toFixed(precision));

  if (!isControlled.value) {
    localValues.value[sliderId] = rounded;
  }

  const newValues = currentValues.value.map((v) =>
    v.id === sliderId ? { ...v, value: rounded } : v,
  );
  emit('change', newValues);

  // 如果是最终提交（如拖拽结束），额外触发 commit 事件
  if (isCommit) {
    emit('commit', newValues);
  }
}

function handleReset() {
  localValues.value = {};
  emit('change', sliderSnapshot.value);
  emit('action', 'reset', sliderSnapshot.value);
}

function handleAction(actionId: string) {
  if (actionId === 'reset') {
    handleReset();
  } else {
    emit('action', actionId, currentValues.value);
  }
}

// Normalize actions config
const normalizedActions = computed(() => {
  if (!props.actions) {
    return {
      items: [
        { id: 'reset', label: 'Reset', variant: 'ghost' as const },
        { id: 'apply', label: 'Apply', variant: 'default' as const },
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

// Slider row component logic
interface SliderRowState {
  isDragging: boolean;
  isHovered: boolean;
  dragGap: number;
  fullGap: number;
  intersectsText: boolean;
  layoutVersion: number;
}

const sliderRowStates = ref<Map<string, SliderRowState>>(new Map());

function getSliderRowState(sliderId: string): SliderRowState {
  if (!sliderRowStates.value.has(sliderId)) {
    sliderRowStates.value.set(sliderId, {
      isDragging: false,
      isHovered: false,
      dragGap: 0,
      fullGap: 0,
      intersectsText: false,
      layoutVersion: 0,
    });
  }
  return sliderRowStates.value.get(sliderId)!;
}

// Track and text refs
const trackRefs = ref<Map<string, HTMLElement>>(new Map());
const labelRefs = ref<Map<string, HTMLElement>>(new Map());
const valueRefs = ref<Map<string, HTMLElement>>(new Map());

function setTrackRef(el: HTMLElement | null, sliderId: string) {
  if (el) trackRefs.value.set(sliderId, el);
}

function setLabelRef(el: HTMLElement | null, sliderId: string) {
  if (el) labelRefs.value.set(sliderId, el);
}

function setValueRef(el: HTMLElement | null, sliderId: string) {
  if (el) valueRefs.value.set(sliderId, el);
}

// Layout calculation
function updateLayout(sliderId: string) {
  const state = getSliderRowState(sliderId);
  const slider = props.sliders.find((s) => s.id === sliderId);
  if (!slider) return;

  const track = trackRefs.value.get(sliderId);
  const labelEl = labelRefs.value.get(sliderId);
  const valueEl = valueRefs.value.get(sliderId);

  if (!track || !labelEl || !valueEl) return;

  const trackRect = track.getBoundingClientRect();
  const labelRect = labelEl.getBoundingClientRect();
  const valueRect = valueEl.getBoundingClientRect();

  const trackWidth = trackRect.width;
  const value = getSliderValue(sliderId);
  const valuePercent = sliderRangeToPercent({
    value,
    min: slider.min,
    max: slider.max,
  });
  const thumbCenterPx =
    (trackWidth * clampPercent(valuePercent)) / 100 +
    getRadixThumbInBoundsOffsetPx(valuePercent);
  const thumbHalfWidth = THUMB_WIDTH / 2;
  const trackCenterY = TRACK_HEIGHT / 2 - TEXT_VERTICAL_OFFSET;

  const labelGap = calculateGap(
    thumbCenterPx,
    {
      left: labelRect.left - trackRect.left,
      right: labelRect.right - trackRect.left,
      height: labelRect.height,
      centerY: trackCenterY,
    },
    true,
  );

  const valueGap = calculateGap(
    thumbCenterPx,
    {
      left: valueRect.left - trackRect.left,
      right: valueRect.right - trackRect.left,
      height: valueRect.height,
      centerY: trackCenterY,
    },
    false,
  );

  state.dragGap = Math.max(labelGap, valueGap);

  const labelLeft = labelRect.left - trackRect.left + TEXT_RELEASE_INSET;
  const labelRight = labelRect.right - trackRect.left - TEXT_RELEASE_INSET;
  const valueLeft = valueRect.left - trackRect.left + TEXT_RELEASE_INSET;
  const valueRight = valueRect.right - trackRect.left - TEXT_RELEASE_INSET;

  const thumbLeft = thumbCenterPx - thumbHalfWidth;
  const thumbRight = thumbCenterPx + thumbHalfWidth;

  const hitsLabel = thumbRight > labelLeft && thumbLeft < labelRight;
  const hitsValue = thumbRight > valueLeft && thumbLeft < valueRight;

  state.intersectsText = hitsLabel || hitsValue;

  const labelFullGap = labelRect.height + TEXT_PADDING_Y * 2;
  const valueFullGap = valueRect.height + TEXT_PADDING_Y * 2;
  state.fullGap =
    hitsLabel && hitsValue
      ? Math.max(labelFullGap, valueFullGap)
      : hitsLabel
        ? labelFullGap
        : hitsValue
          ? valueFullGap
          : 0;
}

// Watch for value changes and update layout
watch(
  currentValues,
  () => {
    nextTick(() => {
      props.sliders.forEach((slider) => updateLayout(slider.id));
    });
  },
  { deep: true },
);

// Resize observer
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  nextTick(() => {
    props.sliders.forEach((slider) => updateLayout(slider.id));
  });

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      props.sliders.forEach((slider) => {
        const state = getSliderRowState(slider.id);
        state.layoutVersion++;
        updateLayout(slider.id);
      });
    });

    props.sliders.forEach((slider) => {
      const track = trackRefs.value.get(slider.id);
      const labelEl = labelRefs.value.get(slider.id);
      const valueEl = valueRefs.value.get(slider.id);
      if (track) resizeObserver?.observe(track);
      if (labelEl) resizeObserver?.observe(labelEl);
      if (valueEl) resizeObserver?.observe(valueEl);
    });
  }

  window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', handleWindowResize);
});

function handleWindowResize() {
  props.sliders.forEach((slider) => {
    const state = getSliderRowState(slider.id);
    state.layoutVersion++;
    updateLayout(slider.id);
  });
}

// Drag handling
const activeSliderId = ref<string | null>(null);

function handlePointerDown(sliderId: string, event: PointerEvent) {
  const slider = props.sliders.find((s) => s.id === sliderId);
  if (!slider || slider.disabled) return;

  const state = getSliderRowState(sliderId);
  state.isDragging = true;
  activeSliderId.value = sliderId;

  (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  updateValueFromPointer(sliderId, event);
}

function handlePointerMove(event: PointerEvent) {
  if (!activeSliderId.value) return;
  updateValueFromPointer(activeSliderId.value, event);
}

function handlePointerUp() {
  if (activeSliderId.value) {
    const state = getSliderRowState(activeSliderId.value);
    state.isDragging = false;
    // 拖拽结束时触发 commit 事件
    emit('commit', currentValues.value);
    activeSliderId.value = null;
  }
}

function updateValueFromPointer(sliderId: string, event: PointerEvent) {
  const slider = props.sliders.find((s) => s.id === sliderId);
  if (!slider) return;

  const track = trackRefs.value.get(sliderId);
  if (!track) return;

  const trackRect = track.getBoundingClientRect();
  const percent = (event.clientX - trackRect.left) / trackRect.width;
  const clampedPercent = Math.max(0, Math.min(1, percent));

  const range = slider.max - slider.min;
  const newValue = slider.min + clampedPercent * range;

  updateSliderValue(sliderId, newValue);
}

// Global pointer events for drag
onMounted(() => {
  document.addEventListener('pointermove', handlePointerMove);
  document.addEventListener('pointerup', handlePointerUp);
});

onUnmounted(() => {
  document.removeEventListener('pointermove', handlePointerMove);
  document.removeEventListener('pointerup', handlePointerUp);
});

// Hover handling
function handlePointerEnter(sliderId: string) {
  const state = getSliderRowState(sliderId);
  state.isHovered = true;
}

function handlePointerLeave(sliderId: string) {
  const state = getSliderRowState(sliderId);
  state.isHovered = false;
}

// Tick generation
function generateTicks(slider: SliderConfig) {
  const crossesZero = slider.min < 0 && slider.max > 0;
  const result: { percent: number; isCenter: boolean; isSubtick: boolean }[] =
    [];

  for (let i = 0; i <= TICK_COUNT; i++) {
    const percent = (i / TICK_COUNT) * 100;
    const isCenter = !crossesZero && percent === 50;

    if (crossesZero && percent === 50) continue;

    if (i > 0) {
      const prevPercent = ((i - 1) / TICK_COUNT) * 100;
      const midPercent = (prevPercent + percent) / 2;
      if (!(crossesZero && midPercent === 50)) {
        result.push({
          percent: midPercent,
          isCenter: false,
          isSubtick: true,
        });
      }
    }

    result.push({ percent, isCenter, isSubtick: false });
  }

  return result;
}

// Fill clip path calculation
function getFillClipPath(slider: SliderConfig): string {
  const value = getSliderValue(slider.id);
  const valuePercent = sliderRangeToPercent({
    value,
    min: slider.min,
    max: slider.max,
  });
  const crossesZero = slider.min < 0 && slider.max > 0;

  const toClipFromRightInset = (percent: number) =>
    `calc(100% - ${toRadixThumbPosition(percent)})`;
  const toClipFromLeftInset = (percent: number) =>
    toRadixThumbPosition(percent);
  const TERMINAL_EPSILON = 1e-6;
  const snapLeftInset = (percent: number) => {
    if (percent <= TERMINAL_EPSILON) return '0';
    if (percent >= 100 - TERMINAL_EPSILON) return '100%';
    return toClipFromLeftInset(percent);
  };
  const snapRightInset = (percent: number) => {
    if (percent <= TERMINAL_EPSILON) return '100%';
    if (percent >= 100 - TERMINAL_EPSILON) return '0';
    return toClipFromRightInset(percent);
  };

  if (crossesZero) {
    const zeroPercent = sliderRangeToPercent({
      value: 0,
      min: slider.min,
      max: slider.max,
    });
    const lowPercent = Math.min(valuePercent, zeroPercent);
    const highPercent = Math.max(valuePercent, zeroPercent);
    return `inset(0 ${snapRightInset(highPercent)} 0 ${snapLeftInset(lowPercent)})`;
  }
  return `inset(0 ${snapRightInset(valuePercent)} 0 0)`;
}

// Fill mask image
function getFillMaskImage(slider: SliderConfig): string {
  const crossesZero = slider.min < 0 && slider.max > 0;
  return crossesZero
    ? 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.7) 100%)'
    : 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)';
}

// Reflection style
function getReflectionStyle(sliderId: string): Record<string, string> {
  const slider = props.sliders.find((s) => s.id === sliderId);
  if (!slider) return {};

  const state = getSliderRowState(sliderId);
  const value = getSliderValue(sliderId);
  const valuePercent = sliderRangeToPercent({
    value,
    min: slider.min,
    max: slider.max,
  });

  const edgeThreshold = 3;
  const nearEdge =
    valuePercent <= edgeThreshold || valuePercent >= 100 - edgeThreshold;

  const spreadPercent = nearEdge && !state.isDragging ? 6.5 : 10;
  const handlePos = toRadixThumbPosition(valuePercent);
  const start = `clamp(0%, calc(${handlePos} - ${spreadPercent}%), 100%)`;
  const end = `clamp(0%, calc(${handlePos} + ${spreadPercent}%), 100%)`;

  const gradient = `linear-gradient(to right, transparent ${start}, white ${handlePos}, transparent ${end})`;

  return {
    background: gradient,
    WebkitMask:
      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    padding: '1px',
  };
}

// Reflection opacity
function getReflectionOpacity(sliderId: string): number {
  const slider = props.sliders.find((s) => s.id === sliderId);
  if (!slider) return 0;

  const state = getSliderRowState(sliderId);
  const value = getSliderValue(sliderId);
  const valuePercent = sliderRangeToPercent({
    value,
    min: slider.min,
    max: slider.max,
  });

  const edgeThreshold = 3;
  const atEdge =
    valuePercent <= edgeThreshold || valuePercent >= 100 - edgeThreshold;

  if (state.isDragging || atEdge) {
    return 1;
  }
  if (state.isHovered) {
    return 0.6;
  }
  return 0;
}

// Thumb segment heights
function getThumbSegmentHeights(sliderId: string): {
  top: string;
  bottom: string;
} {
  const state = getSliderRowState(sliderId);
  const isActive = state.isHovered || state.isDragging;
  const gap = isActive
    ? Math.max(state.dragGap, state.intersectsText ? state.fullGap : 0)
    : state.intersectsText
      ? state.fullGap
      : 0;

  if (isActive && gap > 0) {
    return {
      top: `calc(50% - ${gap / 2 + TEXT_VERTICAL_OFFSET}px)`,
      bottom: `calc(50% - ${gap / 2 - TEXT_VERTICAL_OFFSET}px)`,
    };
  }
  return { top: '50%', bottom: '50%' };
}

// Thumb opacity for segments
function getThumbSegmentOpacity(sliderId: string): number {
  const slider = props.sliders.find((s) => s.id === sliderId);
  if (!slider) return 0.25;

  const state = getSliderRowState(sliderId);
  const value = getSliderValue(sliderId);
  const valuePercent = sliderRangeToPercent({
    value,
    min: slider.min,
    max: slider.max,
  });

  const edgeThreshold = 3;
  const atEdge =
    valuePercent <= edgeThreshold || valuePercent >= 100 - edgeThreshold;

  if (!state.isHovered && !state.isDragging) {
    return atEdge ? 0 : 0.25;
  }
  return 1;
}

// Thumb width
function getThumbWidth(sliderId: string): string {
  const state = getSliderRowState(sliderId);
  if (state.isDragging) return '0.5rem'; // w-2
  if (state.isHovered) return '0.375rem'; // w-1.5
  return '1px'; // w-px
}

// Thumb height
function getThumbHeight(sliderId: string): string {
  const state = getSliderRowState(sliderId);
  if (state.isDragging) return '56px';
  if (state.isHovered) return '54px';
  return '48px'; // h-12
}

// Thumb position calculation
function getThumbLeftPosition(sliderId: string): string {
  const slider = props.sliders.find((s) => s.id === sliderId);
  if (!slider) return '0%';
  const value = getSliderValue(sliderId);
  const valuePercent = sliderRangeToPercent({
    value,
    min: slider.min,
    max: slider.max,
  });
  const offsetPx = getRadixThumbInBoundsOffsetPx(valuePercent);
  return `calc(${valuePercent}% + ${offsetPx}px)`;
}
function getThumbSegmentRadius(sliderId: string, position: 'top' | 'bottom'): string {
  const state = getSliderRowState(sliderId);
  const isActive = state.isHovered || state.isDragging;
  const activeGap = Math.max(
    state.dragGap,
    state.intersectsText ? state.fullGap : 0,
  );
  const gap = state.isDragging
    ? activeGap
    : state.intersectsText
      ? state.fullGap
      : 0;
  const hasGap = isActive && gap > 0;

  if (hasGap) {
    return '9999px'; // rounded-full
  }
  if (isActive) {
    return position === 'top' ? '9999px 9999px 0 0' : '0 0 9999px 9999px';
  }
  return position === 'top' ? '2px 2px 0 0' : '0 0 2px 2px'; // rounded-t-sm / rounded-b-sm
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
              getSliderRowState(slider.id).isDragging
                ? '[&>span]:transition-[left,transform] [&>span]:duration-45 [&>span]:ease-linear'
                : '[&>span]:transition-[left,transform] [&>span]:duration-90 [&>span]:ease-[cubic-bezier(0.22,1,0.36,1)]',
              '[&>span]:will-change-[left,transform]',
              'motion-reduce:[&>span]:transition-none',
              slider.disabled && 'pointer-events-none opacity-50',
            )
          "
          @pointerdown="handlePointerDown(slider.id, $event)"
          @pointerenter="handlePointerEnter(slider.id)"
          @pointerleave="handlePointerLeave(slider.id)"
        >
          <!-- Track -->
          <span
            :ref="(el) => setTrackRef(el as HTMLElement, slider.id)"
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
                  getSliderRowState(slider.id).isDragging
                    ? 'transition-[clip-path] duration-45 ease-linear'
                    : 'transition-[clip-path] duration-90 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  'motion-reduce:transition-none',
                  slider.fillClassName ?? 'bg-primary/30 dark:bg-primary/40',
                )
              "
              :style="{
                maskImage: getFillMaskImage(slider),
                WebkitMaskImage: getFillMaskImage(slider),
                clipPath: getFillClipPath(slider),
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
                left: toInsetPosition(tick.percent),
                transform: 'translateX(-50%)',
              }"
            />
          </span>

          <!-- Metallic Reflection -->
          <span
            :class="
              cn(
                'squircle pointer-events-none absolute inset-0 rounded-sm',
                getSliderRowState(slider.id).isDragging
                  ? 'transition-[opacity,background] duration-45 ease-linear'
                  : 'transition-[opacity,background] duration-90 ease-[cubic-bezier(0.22,1,0.36,1)]',
                'motion-reduce:transition-none',
              )
            "
            :style="{
              ...getReflectionStyle(slider.id),
              opacity: getReflectionOpacity(slider.id),
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
              height: getThumbHeight(slider.id),
              width: THUMB_WIDTH + 'px',
              left: getThumbLeftPosition(slider.id),
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
                height: getThumbSegmentHeights(slider.id).top,
                width: getThumbWidth(slider.id),
                opacity: getThumbSegmentOpacity(slider.id),
                borderRadius: getThumbSegmentRadius(slider.id, 'top'),
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
                height: getThumbSegmentHeights(slider.id).bottom,
                width: getThumbWidth(slider.id),
                opacity: getThumbSegmentOpacity(slider.id),
                borderRadius: getThumbSegmentRadius(slider.id, 'bottom'),
              }"
            />
          </span>

          <!-- Text Labels -->
          <div
            class="pointer-events-none absolute inset-x-3 top-1/2 z-10 flex items-center justify-between"
            :style="{
              transform: `translateY(calc(-50% - ${TEXT_VERTICAL_OFFSET}px))`,
            }"
          >
            <span
              :ref="(el) => setLabelRef(el as HTMLElement, slider.id)"
              class="-mt-px rounded-full px-2 py-px text-sm font-normal tracking-wide text-primary"
            >
              {{ slider.label }}
            </span>
            <span
              :ref="(el) => setValueRef(el as HTMLElement, slider.id)"
              class="-mt-px -mb-0.5 flex h-6 items-center rounded-full px-2 font-mono text-xs text-foreground tabular-nums"
            >
              {{
                formatSignedValue(
                  getSliderValue(slider.id),
                  slider.min,
                  slider.max,
                  slider.precision,
                  slider.unit,
                )
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
          :value="getSliderValue(slider.id)"
          :disabled="slider.disabled"
          class="sr-only"
          :aria-valuetext="
            getAriaValueText(
              getSliderValue(slider.id),
              slider.min,
              slider.max,
              slider.unit,
            )
          "
          @input="
            updateSliderValue(
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
