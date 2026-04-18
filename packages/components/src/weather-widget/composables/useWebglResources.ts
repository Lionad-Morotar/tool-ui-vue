import { ref } from 'vue';
import {
  createFramebuffer,
  createProgram,
  type Framebuffer,
} from '../effects/weather-effect-gl';
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

export interface WeatherEffectsPrograms {
  celestial: WebGLProgram | null;
  cloud: WebGLProgram | null;
  rain: WebGLProgram | null;
  lightning: WebGLProgram | null;
  snow: WebGLProgram | null;
  composite: WebGLProgram | null;
}

export interface InitFailureOptions {
  canvas: HTMLCanvasElement;
  contextLost?: boolean;
  markInitFailed?: boolean;
  warnMessage?: string;
  errorMessage?: string;
}

export function useWebglResources(
  canvasRef: Ref<HTMLCanvasElement | null>,
  propsGetter: () => ResolvedWeatherEffectsCanvasProps,
) {
  // Resource refs
  const glRef = ref<WebGL2RenderingContext | null>(null);
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
  const moonTextureRef = ref<WebGLTexture | null>(null);
  const moonTextureLoadedRef = ref<boolean>(false);
  const positionBufferRef = ref<WebGLBuffer | null>(null);
  const uniformLocationCacheRef = ref<
    WeakMap<WebGLProgram, Map<string, WebGLUniformLocation | null>>
  >(new WeakMap());

  // State refs (managed here but consumed by render loop)
  const isContextLostRef = ref<boolean>(false);
  const initFailedRef = ref<boolean>(false);
  const hasWebglBudgetSlotRef = ref<boolean | null>(null);

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

  // Release budget slot
  function releaseBudgetSlot(canvas: HTMLCanvasElement | null) {
    if (canvas && hasWebglBudgetSlotRef.value) {
      releaseWeatherWebglCanvasBudgetSlot(canvas);
    }
    hasWebglBudgetSlotRef.value = null;
  }

  // Dispose WebGL resources
  function disposeGL() {
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

      // Note: Moon texture loading would require the actual image asset.
      // This is a placeholder (Unit 6.2 bug) — in production, load actual moon texture.
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

    return true;
  }

  return {
    // Refs
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
    // Functions
    getUniformLocationCached,
    disposeGL,
    initGL,
    releaseBudgetSlot,
  };
}
