import { onMounted, onUnmounted, ref, watch,  } from 'vue';
import {
  createFramebuffer,
  createProgram,
  resizeFramebuffer,
  type Framebuffer,
} from '../effects/weather-effect-gl';
import {
  clearOffscreenPass,
  isLightningPassActive,
  renderCelestialPass,
  renderCloudPass,
  renderCompositePass,
  renderLightningPass,
  renderRainPass,
  renderSnowPass,
} from '../effects/weather-effect-render-passes';
import {
  CELESTIAL_FRAGMENT,
  CLOUD_FRAGMENT,
  COMPOSITE_FRAGMENT,
  FULLSCREEN_VERTEX,
  LIGHTNING_FRAGMENT,
  RAIN_FRAGMENT,
  SNOW_FRAGMENT,
} from '../effects/weather-effect-shaders';
import {
  releaseWeatherWebglBudgetSlotOnInitFailure,
  releaseWeatherWebglCanvasBudgetSlot,
  tryAcquireWeatherWebglCanvasBudgetSlot,
} from '../effects/weather-webgl-budget';
import type { ResolvedWeatherEffectsCanvasProps } from '../effects/weather-effects-types';
import type { Ref } from 'vue';

interface WeatherEffectsPrograms {
  celestial: WebGLProgram | null;
  cloud: WebGLProgram | null;
  rain: WebGLProgram | null;
  lightning: WebGLProgram | null;
  snow: WebGLProgram | null;
  composite: WebGLProgram | null;
}

interface InitFailureOptions {
  canvas: HTMLCanvasElement;
  contextLost?: boolean;
  markInitFailed?: boolean;
  warnMessage?: string;
  errorMessage?: string;
}

export function useWeatherEffects(
  canvasRef: Ref<HTMLCanvasElement | null>,
  propsGetter: () => ResolvedWeatherEffectsCanvasProps,
) {
  // Reactive state
  const glRef = ref<WebGL2RenderingContext | null>(null);
  const animationFrameRef = ref<number>(0);
  const startTimeRef = ref<number>(0);
  const lastFlashTimeRef = ref<number>(-100);
  const nextFlashTimeRef = ref<number>(0);
  const strikeSeedRef = ref<number>(0);
  const moonTextureRef = ref<WebGLTexture | null>(null);
  const moonTextureLoadedRef = ref<boolean>(false);
  const positionBufferRef = ref<WebGLBuffer | null>(null);
  const uniformLocationCacheRef = ref<
    WeakMap<WebGLProgram, Map<string, WebGLUniformLocation | null>>
  >(new WeakMap());
  const isVisibleRef = ref<boolean>(false);
  const isRunningRef = ref<boolean>(false);
  const isContextLostRef = ref<boolean>(false);
  const initFailedRef = ref<boolean>(false);
  const hasWebglBudgetSlotRef = ref<boolean | null>(null);

  // Programs and framebuffers
  const programsRef = ref<WeatherEffectsPrograms>({
    celestial: null,
    cloud: null,
    rain: null,
    lightning: null,
    snow: null,
    composite: null,
  });

  const fbRef = ref<{
    a: Framebuffer | null;
    b: Framebuffer | null;
  }>({ a: null, b: null });

  // Get uniform location with caching
  function getUniformLocationCached(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
  ): WebGLUniformLocation | null {
    let programCache = uniformLocationCacheRef.value.get(program);
    if (!programCache) {
      programCache = new Map();
      uniformLocationCacheRef.value.set(program, programCache);
    }

    const cached = programCache.get(name);
    if (cached !== undefined) {
      return cached;
    }

    const location = gl.getUniformLocation(program, name);
    programCache.set(name, location);
    return location;
  }

  // Stop render loop
  function stopRenderLoop() {
    if (animationFrameRef.value) {
      cancelAnimationFrame(animationFrameRef.value);
      animationFrameRef.value = 0;
    }
    isRunningRef.value = false;
  }

  // Release budget slot
  function releaseBudgetSlot(canvas: HTMLCanvasElement | null) {
    if (canvas && hasWebglBudgetSlotRef.value) {
      releaseWeatherWebglCanvasBudgetSlot(canvas);
    }
    hasWebglBudgetSlotRef.value = null;
  }

  // Dispose WebGL resources
  function disposeGL() {
    stopRenderLoop();

    const gl = glRef.value;
    const isContextLost = isContextLostRef.value;

    if (gl && !isContextLost) {
      for (const program of Object.values(programsRef.value)) {
        if (program) gl.deleteProgram(program);
      }

      for (const fb of [fbRef.value.a, fbRef.value.b]) {
        if (!fb) continue;
        gl.deleteFramebuffer(fb.fbo);
        gl.deleteTexture(fb.texture);
      }

      if (moonTextureRef.value) {
        gl.deleteTexture(moonTextureRef.value);
      }

      if (positionBufferRef.value) {
        gl.deleteBuffer(positionBufferRef.value);
      }
    }

    programsRef.value = {
      celestial: null,
      cloud: null,
      rain: null,
      lightning: null,
      snow: null,
      composite: null,
    };
    fbRef.value = { a: null, b: null };
    moonTextureRef.value = null;
    moonTextureLoadedRef.value = false;
    positionBufferRef.value = null;
    uniformLocationCacheRef.value = new WeakMap();
    glRef.value = null;
  }

  // Handle init failure
  function failInit({
    canvas,
    contextLost = false,
    markInitFailed = true,
    warnMessage,
    errorMessage,
  }: InitFailureOptions): false {
    if (contextLost) {
      isContextLostRef.value = true;
    }

    if (markInitFailed) {
      initFailedRef.value = true;
    }

    if (errorMessage) {
      console.error(errorMessage);
    }

    if (warnMessage && import.meta.env.DEV) {
      console.warn(warnMessage);
    }

    disposeGL();
    hasWebglBudgetSlotRef.value = releaseWeatherWebglBudgetSlotOnInitFailure(
      canvas,
      hasWebglBudgetSlotRef.value,
    );
    return false;
  }

  // Initialize WebGL
  function initGL(): boolean {
    if (initFailedRef.value) return false;

    const canvas = canvasRef.value;
    if (!canvas) return false;

    if (hasWebglBudgetSlotRef.value === false) return false;
    if (hasWebglBudgetSlotRef.value === null) {
      const ok = tryAcquireWeatherWebglCanvasBudgetSlot(canvas);
      if (!ok) {
        hasWebglBudgetSlotRef.value = false;
        if (import.meta.env.DEV) {
          console.warn(
            '[WeatherEffectsCanvas] Too many WebGL canvases on the page; rendering this widget without effects.',
          );
        }
        return false;
      }
      hasWebglBudgetSlotRef.value = true;
    }

    disposeGL();
    isContextLostRef.value = false;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      return failInit({
        canvas,
        warnMessage:
          '[WeatherEffectsCanvas] WebGL2 not supported; rendering without effects.',
      });
    }

    glRef.value = gl;
    if (gl.isContextLost()) {
      return failInit({
        canvas,
        contextLost: true,
        markInitFailed: false,
      });
    }

    // Create shader programs
    programsRef.value.celestial = createProgram(
      gl,
      FULLSCREEN_VERTEX,
      CELESTIAL_FRAGMENT,
    );
    programsRef.value.cloud = createProgram(gl, FULLSCREEN_VERTEX, CLOUD_FRAGMENT);
    programsRef.value.rain = createProgram(gl, FULLSCREEN_VERTEX, RAIN_FRAGMENT);
    programsRef.value.lightning = createProgram(
      gl,
      FULLSCREEN_VERTEX,
      LIGHTNING_FRAGMENT,
    );
    programsRef.value.snow = createProgram(gl, FULLSCREEN_VERTEX, SNOW_FRAGMENT);
    programsRef.value.composite = createProgram(
      gl,
      FULLSCREEN_VERTEX,
      COMPOSITE_FRAGMENT,
    );

    if (!programsRef.value.celestial || !programsRef.value.composite) {
      if (gl.isContextLost()) {
        return failInit({
          canvas,
          contextLost: true,
          markInitFailed: false,
        });
      }

      return failInit({
        canvas,
        errorMessage: 'Failed to create required WebGL programs',
      });
    }

    // Create framebuffers
    const dpr = propsGetter().dpr ?? window.devicePixelRatio;
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    const fbA = createFramebuffer(gl, width, height);
    const fbB = createFramebuffer(gl, width, height);

    if (!fbA || !fbB) {
      if (gl.isContextLost()) {
        return failInit({
          canvas,
          contextLost: true,
          markInitFailed: false,
        });
      }

      return failInit({
        canvas,
        errorMessage: 'Failed to create WebGL framebuffers',
      });
    }

    fbRef.value.a = fbA;
    fbRef.value.b = fbB;

    // Create moon texture
    const moonTexture = gl.createTexture();
    if (moonTexture) {
      gl.bindTexture(gl.TEXTURE_2D, moonTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([128, 128, 128, 255]),
      );
      moonTextureRef.value = moonTexture;

      // Note: Moon texture loading would require the actual image asset
      // This is simplified - in production, load actual moon texture
    }

    // Create position buffer
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const positionBuffer = gl.createBuffer();

    if (!positionBuffer) {
      if (gl.isContextLost()) {
        return failInit({
          canvas,
          contextLost: true,
          markInitFailed: false,
        });
      }

      return failInit({
        canvas,
        errorMessage: 'Failed to create WebGL buffer',
      });
    }

    positionBufferRef.value = positionBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Set up vertex attributes for all programs
    for (const program of Object.values(programsRef.value)) {
      if (!program) continue;
      const positionLoc = gl.getAttribLocation(program, 'a_position');
      if (positionLoc >= 0) {
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
      }
    }

    startTimeRef.value = performance.now();
    return true;
  }

  // Render frame
  function render() {
    const gl = glRef.value;
    const canvas = canvasRef.value;
    const programs = programsRef.value;
    const fb = fbRef.value;
    const runtimeProps = propsGetter();

    if (isContextLostRef.value || !isVisibleRef.value) {
      isRunningRef.value = false;
      animationFrameRef.value = 0;
      return;
    }

    if (!gl || !canvas || !fb.a || !fb.b) {
      isRunningRef.value = false;
      return;
    }

    // Resize if needed
    const dpr = runtimeProps.dpr ?? window.devicePixelRatio;
    const displayWidth = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const displayHeight = Math.max(1, Math.floor(canvas.clientHeight * dpr));

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      resizeFramebuffer(gl, fb.a, displayWidth, displayHeight);
      resizeFramebuffer(gl, fb.b, displayWidth, displayHeight);
    }

    const time = (performance.now() - startTimeRef.value) / 1000;

    const u = (program: WebGLProgram, name: string) =>
      getUniformLocationCached(gl, program, name);

    // Auto lightning
    if (
      runtimeProps.layers.lightning &&
      runtimeProps.lightning.enabled &&
      runtimeProps.lightning.autoMode &&
      time >= nextFlashTimeRef.value
    ) {
      lastFlashTimeRef.value = time;
      strikeSeedRef.value = Math.random();
      nextFlashTimeRef.value =
        time + runtimeProps.lightning.autoInterval * (0.5 + Math.random());
    }

    let readFB = fb.a;
    let writeFB = fb.b;

    const swapBuffers = () => {
      const temp = readFB;
      readFB = writeFB;
      writeFB = temp;
    };

    // Celestial pass
    if (runtimeProps.layers.celestial && programs.celestial) {
      renderCelestialPass({
        gl,
        program: programs.celestial,
        target: writeFB,
        displayWidth,
        displayHeight,
        time,
        params: runtimeProps.celestial,
        moonTexture: moonTextureRef.value,
        moonTextureLoaded: moonTextureLoadedRef.value,
        getUniformLocation: u,
      });
      swapBuffers();
    } else {
      clearOffscreenPass(gl, writeFB, displayWidth, displayHeight);
      swapBuffers();
    }

    // Cloud pass
    if (runtimeProps.layers.clouds && programs.cloud) {
      renderCloudPass({
        gl,
        program: programs.cloud,
        target: writeFB,
        sceneTexture: readFB.texture,
        displayWidth,
        displayHeight,
        time,
        params: runtimeProps.cloud,
        celestial: runtimeProps.celestial,
        getUniformLocation: u,
      });
      swapBuffers();
    }

    // Rain pass
    if (runtimeProps.layers.rain && programs.rain) {
      renderRainPass({
        gl,
        program: programs.rain,
        target: writeFB,
        sceneTexture: readFB.texture,
        displayWidth,
        displayHeight,
        time,
        params: runtimeProps.rain,
        interactions: runtimeProps.interactions,
        getUniformLocation: u,
      });
      swapBuffers();
    }

    // Lightning pass
    const lightningActive = isLightningPassActive(
      runtimeProps.layers,
      runtimeProps.lightning,
      programs.lightning,
      time,
      lastFlashTimeRef.value,
    );

    if (lightningActive && programs.lightning) {
      renderLightningPass({
        gl,
        program: programs.lightning,
        target: writeFB,
        sceneTexture: readFB.texture,
        displayWidth,
        displayHeight,
        time,
        params: runtimeProps.lightning,
        interactions: runtimeProps.interactions,
        lastFlashTime: lastFlashTimeRef.value,
        strikeSeed: strikeSeedRef.value,
        getUniformLocation: u,
      });
      swapBuffers();
    }

    // Snow pass
    if (runtimeProps.layers.snow && programs.snow) {
      renderSnowPass({
        gl,
        program: programs.snow,
        target: writeFB,
        sceneTexture: readFB.texture,
        displayWidth,
        displayHeight,
        time,
        params: runtimeProps.snow,
        getUniformLocation: u,
      });
      swapBuffers();
    }

    // Composite pass
    if (programs.composite) {
      renderCompositePass({
        gl,
        program: programs.composite,
        sceneTexture: readFB.texture,
        displayWidth,
        displayHeight,
        time,
        celestial: runtimeProps.celestial,
        interactions: runtimeProps.interactions,
        post: runtimeProps.post,
        lastFlashTime: lastFlashTimeRef.value,
        strikeSeed: strikeSeedRef.value,
        getUniformLocation: u,
      });
    }

    // Schedule next frame
    if (isVisibleRef.value && !isContextLostRef.value) {
      isRunningRef.value = true;
      animationFrameRef.value = requestAnimationFrame(render);
    } else {
      isRunningRef.value = false;
      animationFrameRef.value = 0;
    }
  }

  // Setup lifecycle
  onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    // Context loss handlers
    const onContextLost = (e: Event) => {
      e.preventDefault();
      isContextLostRef.value = true;
      disposeGL();
    };

    const onContextRestored = () => {
      isContextLostRef.value = false;
      initFailedRef.value = false;
      if (initGL() && isVisibleRef.value) {
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
      isRunningRef.value = true;
      render();
    }

    // Cleanup
    onUnmounted(() => {
      observer?.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost as EventListener);
      canvas.removeEventListener('webglcontextrestored', onContextRestored as EventListener);
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
