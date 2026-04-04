// ParameterSlider component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

export {
  useSlider,
  formatSignedValue,
  getAriaValueText,
  getSliderPercent,
  type UseSliderOptions,
  type SliderReturns,
  type SliderState,
  type FormatOptions,
  type PercentInput,
} from './useSlider';

export {
  useDrag,
  type UseDragOptions,
  type DragReturns,
} from './useDrag';

export {
  useLayout,
  generateTicks,
  THUMB_WIDTH,
  TEXT_VERTICAL_OFFSET,
  TRACK_EDGE_INSET,
  type UseLayoutOptions,
  type LayoutReturns,
} from './useLayout';

export {
  useVisual,
  type UseVisualOptions,
  type VisualReturns,
} from './useVisual';
