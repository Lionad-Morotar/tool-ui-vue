import { ref } from 'vue';
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
  resizeFramebuffer,
} from '../effects/weather-effect-gl';
import type { Framebuffer } from '../effects/weather-effect-gl';
import type { ResolvedWeatherEffectsCanvasProps } from '../effects/weather-effects-types';
import type { Ref } from 'vue';
import type { WeatherEffectsPrograms } from './useWebglResources';

export function useRenderLoop(
  canvasRef: Ref<HTMLCanvasElement | null>,
  propsGetter: () => ResolvedWeatherEffectsCanvasProps,
  glRef: Ref<WebGL2RenderingContext | null>,
  programsRef: Ref<WeatherEffectsPrograms>,
  fbRef: Ref<{ a: Framebuffer | null; b: Framebuffer | null }>,
  moonTextureRef: Ref<WebGLTexture | null>,
  moonTextureLoadedRef: Ref<boolean>,
  uniformLocationCacheRef: Ref<
    WeakMap<WebGLProgram, Map<string, WebGLUniformLocation | null>>
  >,
  isVisibleRef: Ref<boolean>,
  isContextLostRef: Ref<boolean>,
  isRunningRef: Ref<boolean>,
) {
  // Render loop refs
  const animationFrameRef = ref<number>(0);
  const startTimeRef = ref<number>(0);
  const lastFlashTimeRef = ref<number>(-100);
  const nextFlashTimeRef = ref<number>(0);
  const strikeSeedRef = ref<number>(0);

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

  return {
    // Refs
    animationFrameRef,
    startTimeRef,
    lastFlashTimeRef,
    nextFlashTimeRef,
    strikeSeedRef,
    // Functions
    render,
    stopRenderLoop,
  };
}
