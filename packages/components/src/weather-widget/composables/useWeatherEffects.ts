import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { ResolvedWeatherEffectsCanvasProps } from '../effects/weather-effects-types';
import type { Ref } from 'vue';
import { useRenderLoop } from './useRenderLoop';
import { useWebglResources } from './useWebglResources';

export function useWeatherEffects(
  canvasRef: Ref<HTMLCanvasElement | null>,
  propsGetter: () => ResolvedWeatherEffectsCanvasProps,
) {
  // Visibility and running state (managed by orchestrator)
  const isVisibleRef = ref<boolean>(false);
  const isRunningRef = ref<boolean>(false);

  // WebGL resources sub-composable
  const {
    glRef,
    programsRef,
    fbRef,
    moonTextureRef,
    moonTextureLoadedRef,
    positionBufferRef,
    uniformLocationCacheRef,
    isContextLostRef,
    initFailedRef,
    hasWebglBudgetSlotRef,
    getUniformLocationCached,
    disposeGL,
    initGL,
    releaseBudgetSlot,
  } = useWebglResources(canvasRef, propsGetter);

  // Render loop sub-composable
  const {
    animationFrameRef,
    startTimeRef,
    lastFlashTimeRef,
    nextFlashTimeRef,
    strikeSeedRef,
    render,
    stopRenderLoop,
  } = useRenderLoop(
    canvasRef,
    propsGetter,
    glRef,
    programsRef,
    fbRef,
    moonTextureRef,
    moonTextureLoadedRef,
    uniformLocationCacheRef,
    isVisibleRef,
    isContextLostRef,
    isRunningRef,
  );

  // Setup lifecycle
  onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    // Context loss handlers
    const onContextLost = (e: Event) => {
      e.preventDefault();
      isContextLostRef.value = true;
      stopRenderLoop();
      disposeGL();
    };

    const onContextRestored = () => {
      isContextLostRef.value = false;
      initFailedRef.value = false;
      if (initGL() && isVisibleRef.value) {
        startTimeRef.value = performance.now();
        isRunningRef.value = true;
        render();
      }
    };

    canvas.addEventListener('webglcontextlost', onContextLost, {
      passive: false,
    } as AddEventListenerOptions);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    // Intersection observer for visibility
    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              const visible = Boolean(entry?.isIntersecting);
              isVisibleRef.value = visible;

              if (!visible) {
                stopRenderLoop();
                disposeGL();
                releaseBudgetSlot(canvas);
                return;
              }

              if (!isRunningRef.value && !isContextLostRef.value) {
                if (glRef.value && fbRef.value.a && fbRef.value.b) {
                  isRunningRef.value = true;
                  render();
                } else if (initGL()) {
                  startTimeRef.value = performance.now();
                  isRunningRef.value = true;
                  render();
                }
              }
            },
            { threshold: 0 },
          )
        : null;

    if (!observer) {
      isVisibleRef.value = true;
    } else {
      observer.observe(canvas);
    }

    // Start rendering if no observer
    if (!observer && initGL() && isVisibleRef.value) {
      startTimeRef.value = performance.now();
      isRunningRef.value = true;
      render();
    }

    // Cleanup
    onUnmounted(() => {
      observer?.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost as EventListener);
      canvas.removeEventListener('webglcontextrestored', onContextRestored as EventListener);
      stopRenderLoop();
      disposeGL();
      releaseBudgetSlot(canvas);
    });
  });

  // NOTE: This watch intentionally has no side-effect callback. It exists
  // solely to register propsGetter() as a reactive dependency, ensuring
  // Vue's reactivity system tracks all nested prop accesses for the render loop.
  watch(
    () => propsGetter(),
    () => {
      // Props are accessed via propsGetter() in render loop.
      // No need to restart, just let next frame pick up new values.
    },
    { deep: true },
  );
}
