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

  /** Programmatically generate a moon surface texture with craters and maria */
function generateMoonTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const width = 128;
  const height = 64;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Fallback: return a 1x1 gray texture
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128, 255]));
    return tex;
  }

  // Base gray background (lunar regolith)
  ctx.fillStyle = '#a8a8a0';
  ctx.fillRect(0, 0, width, height);

  // Add subtle noise for surface texture
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 0.3 + Math.random() * 0.7;
    const brightness = 160 + Math.random() * 40;
    ctx.fillStyle = `rgba(${brightness}, ${brightness - 4}, ${brightness - 8}, 0.15)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw maria (dark lunar seas) - large irregular dark patches
  const maria = [
    { x: 0.25, y: 0.35, rx: 18, ry: 12, rot: 0.3 },
    { x: 0.55, y: 0.25, rx: 14, ry: 10, rot: -0.2 },
    { x: 0.70, y: 0.55, rx: 16, ry: 9, rot: 0.5 },
    { x: 0.40, y: 0.65, rx: 12, ry: 8, rot: -0.4 },
    { x: 0.15, y: 0.60, rx: 10, ry: 7, rot: 0.1 },
  ];

  for (const m of maria) {
    ctx.save();
    ctx.translate(m.x * width, m.y * height);
    ctx.rotate(m.rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(75, 75, 78, 0.35)';
    ctx.fill();
    ctx.restore();
  }

  // Draw craters
  const craters = [
    // Large craters
    { x: 0.30, y: 0.30, r: 6 },
    { x: 0.60, y: 0.40, r: 5 },
    { x: 0.45, y: 0.55, r: 7 },
    { x: 0.75, y: 0.30, r: 4 },
    { x: 0.20, y: 0.50, r: 5 },
    // Medium craters
    { x: 0.35, y: 0.45, r: 3 },
    { x: 0.55, y: 0.60, r: 3.5 },
    { x: 0.65, y: 0.25, r: 2.5 },
    { x: 0.40, y: 0.20, r: 3 },
    { x: 0.80, y: 0.50, r: 2.5 },
    { x: 0.25, y: 0.70, r: 3 },
    { x: 0.50, y: 0.35, r: 2 },
    // Small craters
    { x: 0.28, y: 0.38, r: 1.5 },
    { x: 0.62, y: 0.48, r: 1.5 },
    { x: 0.48, y: 0.62, r: 1.8 },
    { x: 0.72, y: 0.42, r: 1.2 },
    { x: 0.33, y: 0.58, r: 1.3 },
    { x: 0.58, y: 0.28, r: 1.4 },
    { x: 0.42, y: 0.48, r: 1 },
    { x: 0.68, y: 0.60, r: 1.2 },
    { x: 0.38, y: 0.25, r: 1 },
  ];

  for (const c of craters) {
    const cx = c.x * width;
    const cy = c.y * height;
    const r = c.r;

    // Crater floor (darker)
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(90, 90, 88, 0.4)';
    ctx.fill();

    // Crater rim highlight (brighter on top-left)
    ctx.beginPath();
    ctx.arc(cx - r * 0.15, cy - r * 0.15, r * 0.85, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(180, 178, 172, 0.25)';
    ctx.lineWidth = r * 0.2;
    ctx.stroke();

    // Crater shadow (darker on bottom-right)
    ctx.beginPath();
    ctx.arc(cx + r * 0.1, cy + r * 0.1, r * 0.9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(70, 70, 68, 0.2)';
    ctx.lineWidth = r * 0.15;
    ctx.stroke();
  }

  // Upload to WebGL
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texture;
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

    // Create moon texture (procedurally generated)
    const moonTexture = generateMoonTexture(gl);
    moonTextureRef.value = moonTexture;
    moonTextureLoadedRef.value = true;

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
