import { computed, ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { ParameterSliderProps, SliderValue } from '../schema';
import {
  createSliderSignature,
  createSliderValueSnapshot,
  sliderRangeToPercent,
} from '../math';

export interface UseSliderOptions extends Pick<ParameterSliderProps, 'sliders' | 'values'> {
  emit: {
    change: (values: SliderValue[]) => void;
    commit: (values: SliderValue[]) => void;
  };
}

export interface SliderState {
  isDragging: boolean;
  isHovered: boolean;
  dragGap: number;
  fullGap: number;
  intersectsText: boolean;
  layoutVersion: number;
}

export interface SliderReturns {
  // Refs
  sliderRowStates: Ref<Map<string, SliderState>>;

  // Computed
  slidersSignature: ComputedRef<string>;
  sliderSnapshot: ComputedRef<SliderValue[]>;
  isControlled: ComputedRef<boolean>;
  currentValues: ComputedRef<SliderValue[]>;

  // Actions
  getSliderValue: (sliderId: string) => number;
  updateSliderValue: (sliderId: string, newValue: number, isCommit?: boolean) => void;
  getSliderRowState: (sliderId: string) => SliderState;
  resetValues: () => void;
}

export function useSlider(options: UseSliderOptions): SliderReturns {
  const { sliders, values, emit } = options;

  // Controllable state implementation
  const slidersSignature = computed(() => createSliderSignature(sliders));
  const sliderSnapshot = computed(() => createSliderValueSnapshot(sliders));

  const isControlled = computed(() => values !== undefined);
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
    return sliders.map((slider) => {
      const fromProp = values?.find((v) => v.id === slider.id)?.value;
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
    const slider = sliders.find((s) => s.id === sliderId);
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
    emit.change(newValues);

    // 如果是最终提交（如拖拽结束），额外触发 commit 事件
    if (isCommit) {
      emit.commit(newValues);
    }
  }

  // Slider row component logic
  const sliderRowStates = ref<Map<string, SliderState>>(new Map());

  function getSliderRowState(sliderId: string): SliderState {
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

  function resetValues() {
    localValues.value = {};
    emit.change(sliderSnapshot.value);
  }

  return {
    sliderRowStates,
    slidersSignature,
    sliderSnapshot,
    isControlled,
    currentValues,
    getSliderValue,
    updateSliderValue,
    getSliderRowState,
    resetValues,
  };
}

// Formatting utilities
export interface FormatOptions {
  value: number;
  min: number;
  max: number;
  precision?: number;
  unit?: string;
}

export function formatSignedValue(options: FormatOptions): string {
  const { value, min, max, precision, unit } = options;
  const crossesZero = min < 0 && max > 0;
  const fixed =
    precision !== undefined ? value.toFixed(precision) : String(value);
  const numericPart = crossesZero && value >= 0 ? `+${fixed}` : fixed;
  return unit ? `${numericPart} ${unit}` : numericPart;
}

export function getAriaValueText(
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

// Slider percentage utilities
export interface PercentInput {
  value: number;
  min: number;
  max: number;
}

export function getSliderPercent(input: PercentInput): number {
  const { value, min, max } = input;
  return sliderRangeToPercent({ value, min, max });
}
