import type { SliderConfig } from '../schema';
import type { SliderState } from './useSlider';
import { sliderRangeToPercent } from '../math';
import { THUMB_WIDTH, TEXT_VERTICAL_OFFSET, TRACK_EDGE_INSET } from './useLayout';

// Constants
const TERMINAL_EPSILON = 1e-6;

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

export interface UseVisualOptions {
  getSliderValue: (sliderId: string) => number;
  getSliderRowState: (sliderId: string) => SliderState;
}

export interface VisualReturns {
  toInsetPosition: (percent: number) => string;
  getFillClipPath: (slider: SliderConfig) => string;
  getFillMaskImage: (slider: SliderConfig) => string;
  getReflectionStyle: (sliderId: string) => Record<string, string>;
  getReflectionOpacity: (sliderId: string) => number;
  getThumbSegmentHeights: (sliderId: string) => { top: string; bottom: string };
  getThumbSegmentOpacity: (sliderId: string) => number;
  getThumbWidth: (sliderId: string) => string;
  getThumbHeight: (sliderId: string) => string;
  getThumbLeftPosition: (sliderId: string) => string;
  getThumbSegmentRadius: (sliderId: string, position: 'top' | 'bottom') => string;
}

export function useVisual(options: UseVisualOptions): VisualReturns {
  const { getSliderValue, getSliderRowState } = options;

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
    const slider = getSliderRowState(sliderId);
    // This is a placeholder - reflection doesn't need slider config directly
    // The original code accessed slider config but didn't use it
    const state = slider;
    const value = getSliderValue(sliderId);
    const valuePercent = sliderRangeToPercent({
      value,
      min: -100, // Default values since we don't have slider config here
      max: 100,
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
    const state = getSliderRowState(sliderId);
    const value = getSliderValue(sliderId);
    const valuePercent = sliderRangeToPercent({
      value,
      min: -100,
      max: 100,
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
    const state = getSliderRowState(sliderId);
    const value = getSliderValue(sliderId);
    const valuePercent = sliderRangeToPercent({
      value,
      min: -100,
      max: 100,
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
    const value = getSliderValue(sliderId);
    const valuePercent = sliderRangeToPercent({
      value,
      min: -100,
      max: 100,
    });
    const offsetPx = getRadixThumbInBoundsOffsetPx(valuePercent);
    return `calc(${valuePercent}% + ${offsetPx}px)`;
  }

  function getThumbSegmentRadius(
    sliderId: string,
    position: 'top' | 'bottom',
  ): string {
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

  return {
    toInsetPosition,
    getFillClipPath,
    getFillMaskImage,
    getReflectionStyle,
    getReflectionOpacity,
    getThumbSegmentHeights,
    getThumbSegmentOpacity,
    getThumbWidth,
    getThumbHeight,
    getThumbLeftPosition,
    getThumbSegmentRadius,
  };
}
