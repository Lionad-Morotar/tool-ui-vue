import { ref, onMounted, onUnmounted } from 'vue';
import type { SliderConfig } from '../schema';
import type { Ref } from 'vue';

export interface UseDragOptions {
  sliders: SliderConfig[];
  trackRefs: Ref<Map<string, HTMLElement>>;
  getSliderValue: (sliderId: string) => number;
  updateSliderValue: (sliderId: string, newValue: number, isCommit?: boolean) => void;
  getSliderRowState: (sliderId: string) => { isDragging: boolean; isHovered: boolean };
  emitCommit: (sliderId?: string) => void;
}

export interface DragReturns {
  activeSliderId: Ref<string | null>;
  handlePointerDown: (sliderId: string, event: PointerEvent) => void;
  handlePointerEnter: (sliderId: string) => void;
  handlePointerLeave: (sliderId: string) => void;
}

export function useDrag(options: UseDragOptions): DragReturns {
  const {
    sliders,
    trackRefs,
    updateSliderValue,
    getSliderRowState,
    emitCommit,
  } = options;

  const activeSliderId = ref<string | null>(null);

  function handlePointerDown(sliderId: string, event: PointerEvent) {
    const slider = sliders.find((s) => s.id === sliderId);
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
      emitCommit(activeSliderId.value);
      activeSliderId.value = null;
    }
  }

  function updateValueFromPointer(sliderId: string, event: PointerEvent) {
    const slider = sliders.find((s) => s.id === sliderId);
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

  return {
    activeSliderId,
    handlePointerDown,
    handlePointerEnter,
    handlePointerLeave,
  };
}
