import { ref, watch, nextTick, onMounted, onUnmounted, computed, toValue } from 'vue';
import { sliderRangeToPercent } from '../math';
import type { SliderConfig } from '../schema';
import type { SliderState } from './useSlider';
import type { MaybeRefOrGetter, Ref } from 'vue';

// Constants for layout calculations
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

export { THUMB_WIDTH, TEXT_VERTICAL_OFFSET, TRACK_EDGE_INSET };

export interface UseLayoutOptions {
  sliders: MaybeRefOrGetter<SliderConfig[]>;
  getSliderValue: (sliderId: string) => number;
  getSliderRowState: (sliderId: string) => SliderState;
  currentValues: Ref<{ id: string; value: number }[]>;
}

export interface LayoutReturns {
  trackRefs: Ref<Map<string, HTMLElement>>;
  labelRefs: Ref<Map<string, HTMLElement>>;
  valueRefs: Ref<Map<string, HTMLElement>>;
  updateLayout: (sliderId: string) => void;
  setTrackRef: (el: HTMLElement | null, sliderId: string) => void;
  setLabelRef: (el: HTMLElement | null, sliderId: string) => void;
  setValueRef: (el: HTMLElement | null, sliderId: string) => void;
}

// Utility functions
function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function getRadixThumbInBoundsOffsetPx(percent: number): number {
  const safePercent = clampPercent(percent);
  const halfWidth = THUMB_WIDTH / 2;
  return halfWidth - (safePercent * halfWidth) / 50;
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

export function useLayout(options: UseLayoutOptions): LayoutReturns {
  const { getSliderValue, getSliderRowState, currentValues } = options;

  // sliders 以 MaybeRefOrGetter 接收，避免 props 新引用时 layout 仍使用首帧快照。
  const sliders = computed(() => toValue(options.sliders));

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

  function updateLayout(sliderId: string) {
    const state = getSliderRowState(sliderId);
    const slider = sliders.value.find((s) => s.id === sliderId);
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
        sliders.value.forEach((slider) => updateLayout(slider.id));
      });
    },
    { deep: true },
  );

  // Resize observer
  let resizeObserver: ResizeObserver | null = null;

  onMounted(() => {
    nextTick(() => {
      sliders.value.forEach((slider) => updateLayout(slider.id));
    });

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        sliders.value.forEach((slider) => {
          const state = getSliderRowState(slider.id);
          state.layoutVersion++;
          updateLayout(slider.id);
        });
      });

      sliders.value.forEach((slider) => {
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
    sliders.value.forEach((slider) => {
      const state = getSliderRowState(slider.id);
      state.layoutVersion++;
      updateLayout(slider.id);
    });
  }

  return {
    trackRefs,
    labelRefs,
    valueRefs,
    updateLayout,
    setTrackRef,
    setLabelRef,
    setValueRef,
  };
}

// Tick generation
export function generateTicks(slider: SliderConfig) {
  const crossesZero = slider.min < 0 && slider.max > 0;
  const result: { percent: number; isCenter: boolean; isSubtick: boolean }[] = [];

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
