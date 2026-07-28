import { computed, ref, watch, toValue } from 'vue';
import {
  createSliderSignature,
  createSliderValueSnapshot,
  sliderRangeToPercent,
} from '../math';
import type { SliderConfig, SliderValue } from '../schema';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';

export interface UseSliderOptions {
  sliders: MaybeRefOrGetter<SliderConfig[]>;
  values?: MaybeRefOrGetter<SliderValue[] | undefined>;
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
  const { emit } = options;

  // sliders/values 以 MaybeRefOrGetter 接收：setup 同步作用域里直接解构会把 props
  // 数组固化在挂载首帧；computed + toValue 让读取发生在消费方的活跃 effect 内，
  // 父层 setProps 新引用后组件才能跟随更新。
  const sliders = computed(() => toValue(options.sliders));
  const values = computed(() => toValue(options.values));

  // Controllable state implementation
  const slidersSignature = computed(() => createSliderSignature(sliders.value));
  const sliderSnapshot = computed(() => createSliderValueSnapshot(sliders.value));

  const isControlled = computed(() => values.value !== undefined);
  const localValues = ref<Record<string, number>>({});

  // Reset when sliders change
  watch(slidersSignature, () => {
    if (!isControlled.value) {
      localValues.value = {};
    }
  });

  const currentValues = computed<SliderValue[]>(() => {
    return sliders.value.map((slider) => {
      const fromProp = values.value?.find((v) => v.id === slider.id)?.value;
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
    const slider = sliders.value.find((s) => s.id === sliderId);
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
      return unit ? `+${value} ${unit}` : `+${value}`;
    } else if (value < 0) {
      return unit
        ? `${value} ${unit}`
        : String(value);
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
