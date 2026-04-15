import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import HexnutScene from './hexnut-scene.vue';

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let intersectionCallback: ((entries: { isIntersecting: boolean }[]) => void) | null = null;

class MockIntersectionObserver {
  constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
    intersectionCallback = callback;
  }
  observe = mockObserve;
  disconnect = mockDisconnect;
}

// @ts-expect-error global override for test
global.IntersectionObserver = MockIntersectionObserver;

vi.mock('./hexnut-geometry', () => ({
  createHexnutGeometry: vi.fn().mockReturnValue({ center: vi.fn(), dispose: vi.fn() }),
}));

vi.mock('three', () => {
  function WebGLRenderer() {
    return {
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      setClearColor: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
      forceContextLoss: vi.fn(),
    };
  }
  function Scene() {
    return {
      add: vi.fn(),
      remove: vi.fn(),
    };
  }
  function OrthographicCamera() {
    return {
      position: { z: 0 },
      updateProjectionMatrix: vi.fn(),
    };
  }
  function Mesh(_geometry?: unknown, _material?: unknown) {
    return {
      rotation: { z: 0, set: vi.fn() },
      scale: { set: vi.fn() },
      geometry: _geometry || { dispose: vi.fn() },
      material: _material || { dispose: vi.fn(), color: { set: vi.fn() } },
    };
  }
  function DirectionalLight() {
    return {
      position: { set: vi.fn() },
      intensity: 1,
    };
  }
  function MeshStandardMaterial() {
    return {
      color: { set: vi.fn() },
      dispose: vi.fn(),
    };
  }
  function ShaderMaterial() {
    return {
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: { set: vi.fn() } },
        uFadeStart: { value: 0.5 },
      },
      dispose: vi.fn(),
    };
  }
  function CylinderGeometry() {
    return {
      rotateX: vi.fn(),
      dispose: vi.fn(),
    };
  }
  function Color() {
    return {
      set: vi.fn(),
    };
  }
  return {
    WebGLRenderer,
    Scene,
    OrthographicCamera,
    Mesh,
    DirectionalLight,
    MeshStandardMaterial,
    ShaderMaterial,
    CylinderGeometry,
    Color,
    AdditiveBlending: 1,
    DoubleSide: 2,
  };
});

vi.mock('@vueuse/core', () => {
  return {
    useColorMode: vi.fn().mockReturnValue({ value: 'dark' }),
  };
});

describe('HexnutScene', () => {
  let rafIds: number[] = [];
  const originalRAF = global.requestAnimationFrame;
  const originalCAF = global.cancelAnimationFrame;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    intersectionCallback = null;
    rafIds = [];

    global.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      const id = window.setTimeout(() => cb(performance.now()), 16);
      rafIds.push(id);
      return id;
    }) as unknown as typeof requestAnimationFrame;

    global.cancelAnimationFrame = vi.fn((id: number) => {
      window.clearTimeout(id);
      rafIds = rafIds.filter((i) => i !== id);
    }) as unknown as typeof cancelAnimationFrame;
  });

  afterEach(() => {
    vi.useRealTimers();
    global.requestAnimationFrame = originalRAF;
    global.cancelAnimationFrame = originalCAF;
  });

  test('mounts and observes container with IntersectionObserver', async () => {
    mount(HexnutScene, {
      attachTo: document.body,
    });
    await nextTick();
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  test('pauses RAF when leaving viewport', async () => {
    mount(HexnutScene, {
      attachTo: document.body,
    });
    await nextTick();

    expect(intersectionCallback).not.toBeNull();

    // Enter viewport first to start RAF
    intersectionCallback!([{ isIntersecting: true }]);
    await nextTick();
    expect(rafIds.length).toBeGreaterThan(0);

    // Leave viewport
    intersectionCallback!([{ isIntersecting: false }]);
    await nextTick();
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  test('resumes RAF when entering viewport', async () => {
    mount(HexnutScene, {
      attachTo: document.body,
    });
    await nextTick();

    // Leave first
    intersectionCallback!([{ isIntersecting: false }]);
    await nextTick();

    const callCountBefore = (global.requestAnimationFrame as ReturnType<typeof vi.fn>).mock.calls.length;

    // Re-enter
    intersectionCallback!([{ isIntersecting: true }]);
    await nextTick();

    const callCountAfter = (global.requestAnimationFrame as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(callCountAfter).toBeGreaterThan(callCountBefore);
  });

  test('disconnects observer on unmount', async () => {
    const wrapper = mount(HexnutScene, {
      attachTo: document.body,
    });
    await nextTick();
    wrapper.unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
