import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';

export interface GlowState {
  x: number;
  y: number;
  intensity: number;
}

export interface UseGlowEffectReturn {
  cardRef: Ref<HTMLDivElement | null>;
  containerRef: Ref<HTMLDivElement | null>;
  cardDimensions: Ref<{ width: number; height: number }>;
  edgeShineStyle: ComputedRef<Record<string, string | number>>;
  innerGlowStyle: ComputedRef<Record<string, string | number>>;
}

export function useGlowEffect(
  isDark: ComputedRef<boolean>,
  reducedMotion: ComputedRef<boolean>
): UseGlowEffectReturn {
  const glowState = ref<GlowState>({ x: 0, y: 0, intensity: 0 });
  const cardDimensions = ref({ width: 0, height: 0 });
  const cardRef = ref<HTMLDivElement | null>(null);
  const containerRef = ref<HTMLDivElement | null>(null);
  const pendingGlowState = ref<GlowState | null>(null);
  const pendingGlowFrame = ref<number | null>(null);

  function updateCardDimensions() {
    if (cardRef.value) {
      const rect = cardRef.value.getBoundingClientRect();
      cardDimensions.value = {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }
  }

  function commitGlowState(nextState: GlowState) {
    if (
      glowState.value.x === nextState.x &&
      glowState.value.y === nextState.y &&
      glowState.value.intensity === nextState.intensity
    ) {
      return;
    }
    glowState.value = nextState;
  }

  function cancelPendingGlowFrame() {
    pendingGlowState.value = null;
    if (pendingGlowFrame.value !== null) {
      cancelAnimationFrame(pendingGlowFrame.value);
      pendingGlowFrame.value = null;
    }
  }

  function scheduleGlowState(nextState: GlowState) {
    pendingGlowState.value = nextState;

    if (pendingGlowFrame.value !== null) {
      return;
    }

    pendingGlowFrame.value = requestAnimationFrame(() => {
      pendingGlowFrame.value = null;
      const pending = pendingGlowState.value;
      pendingGlowState.value = null;
      if (pending) {
        commitGlowState(pending);
      }
    });
  }

  function clearGlowIntensity() {
    cancelPendingGlowFrame();
    if (glowState.value.intensity !== 0) {
      glowState.value = { ...glowState.value, intensity: 0 };
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (!cardRef.value || reducedMotion.value) return;

    const cardRect = cardRef.value.getBoundingClientRect();
    const clampedX = Math.max(
      cardRect.left,
      Math.min(e.clientX, cardRect.right)
    );
    const clampedY = Math.max(
      cardRect.top,
      Math.min(e.clientY, cardRect.bottom)
    );

    const distanceX =
      e.clientX < cardRect.left
        ? cardRect.left - e.clientX
        : e.clientX > cardRect.right
          ? e.clientX - cardRect.right
          : 0;
    const distanceY =
      e.clientY < cardRect.top
        ? cardRect.top - e.clientY
        : e.clientY > cardRect.bottom
          ? e.clientY - cardRect.bottom
          : 0;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    const maxDistance = 150;
    const intensity = Math.max(0, 1 - distance / maxDistance);

    scheduleGlowState({
      x: clampedX - cardRect.left,
      y: clampedY - cardRect.top,
      intensity,
    });
  }

  function handleMouseLeave() {
    clearGlowIntensity();
  }

  function sineEasedGradient(
    x: number,
    y: number,
    radius: number,
    peakOpacity: number,
    steps = 8
  ): string {
    const stops: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const eased = Math.sin((t * Math.PI) / 2);
      const opacity = peakOpacity * (1 - eased);
      const position = t * 100;
      stops.push(
        `rgba(255,255,255,${opacity.toFixed(4)}) ${position.toFixed(1)}%`
      );
    }
    return `radial-gradient(circle ${radius}px at ${x}px ${y}px, ${stops.join(', ')})`;
  }

  const edgeShineStyle = computed(() => ({
    opacity: glowState.value.intensity,
    background: sineEasedGradient(
      glowState.value.x,
      glowState.value.y,
      100,
      isDark.value ? 0.6 : 1
    ),
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    WebkitMaskComposite: 'xor',
    padding: '0.5px',
  }));

  const innerGlowStyle = computed(() => ({
    opacity: glowState.value.intensity,
    background: sineEasedGradient(
      glowState.value.x,
      glowState.value.y,
      120,
      isDark.value ? 0.06 : 0.15
    ),
  }));

  onMounted(() => {
    updateCardDimensions();

    let resizeObserver: ResizeObserver | null = null;
    if (cardRef.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateCardDimensions);
      resizeObserver.observe(cardRef.value);
    }

    const container = containerRef.value;
    if (container && !reducedMotion.value) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    onUnmounted(() => {
      resizeObserver?.disconnect();
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelPendingGlowFrame();
    });
  });

  watch(
    () => reducedMotion.value,
    (reduced) => {
      if (reduced) {
        clearGlowIntensity();
      }
    }
  );

  return {
    cardRef,
    containerRef,
    cardDimensions,
    edgeShineStyle,
    innerGlowStyle,
  };
}
