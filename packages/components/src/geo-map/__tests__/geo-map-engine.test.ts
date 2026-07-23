import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import GeoMapEngine from '../cmpts/geo-map-engine.vue';
import type { GeoMapMarker } from '../schema';

// 生产环境 leaflet 是 CJS 包，Vite/esbuild 的 __toESM interop 会以
// Object.defineProperty(w, 'default', { value, enumerable: true }) 挂 default——
// writable:false + configurable:false 的数据属性。若组件把模块对象放进 deep reactive
// （deep ref / deep watch 遍历），Vue 的 get 陷阱返回重包装对象、与 target 实际值不等，
// 违反 Proxy invariant 直接抛 TypeError。mock 忠实复刻该形态以复现生产崩溃。
vi.mock('leaflet', () => {
  const mod = {
    divIcon: () => ({ type: 'divIcon' }),
    latLngBounds: () => ({ isValid: () => true }),
  };
  // Vue 读响应式标志（__v_isShallow/__v_isRef 等）时，真实模块命名空间对不存在的属性
  // 返回 undefined，而 vitest mock 代理对未定义导出直接抛错，故显式定义以对齐生产行为
  const ns: Record<string, unknown> = {
    divIcon: mod.divIcon,
    latLngBounds: mod.latLngBounds,
    __v_isShallow: undefined,
    __v_isReactive: undefined,
    __v_isReadonly: undefined,
    __v_isRef: undefined,
    __v_skip: undefined,
    __v_raw: undefined,
  };
  Object.defineProperty(ns, 'default', { value: mod, enumerable: true });
  return ns;
});

// 引擎只消费这些组件的渲染占位，真实实现依赖浏览器地图运行时，与回归目标无关
vi.mock('@vue-leaflet/vue-leaflet', () => {
  const stub = (name: string) => ({ name, template: `<div data-stub="${name}"><slot /></div>` });
  return {
    LMap: stub('LMap'),
    LTileLayer: stub('LTileLayer'),
    LPolyline: stub('LPolyline'),
    LControlZoom: stub('LControlZoom'),
    LMarker: stub('LMarker'),
    LCircleMarker: stub('LCircleMarker'),
    LPopup: stub('LPopup'),
    LTooltip: stub('LTooltip'),
  };
});

vi.mock('../cmpts/geo-map-cluster-layer.vue', () => ({
  default: { name: 'GeoMapClusterLayer', template: '<div data-stub="geo-map-cluster-layer" />' },
}));
vi.mock('../cmpts/geo-map-marker-layer.vue', () => ({
  default: { name: 'GeoMapMarkerLayer', template: '<div data-stub="geo-map-marker-layer" />' },
}));
vi.mock('../cmpts/geo-map-marker-popup.vue', () => ({
  default: { name: 'GeoMapMarkerPopup', template: '<div data-stub="geo-map-marker-popup" />' },
}));

function createEngineProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-map',
    markers: [{ id: 'm1', lat: 31.23, lng: 121.47, label: '上海' }] as GeoMapMarker[],
    showZoomControl: true,
    tileUrl: 'https://example.com/{z}/{x}/{y}.png',
    mapAriaLabel: '测试地图',
    ...overrides,
  };
}

const isProxyInvariantError = (e: unknown) =>
  e instanceof TypeError && /read-only and non-configurable/.test(e.message);

describe('GeoMapEngine', () => {
  test('loads leaflet module and becomes ready', async () => {
    const wrapper = mount(GeoMapEngine, {
      props: createEngineProps(),
      global: { config: { errorHandler: () => {} } },
    });
    await flushPromises();
    expect(wrapper.emitted('ready')?.[0]).toEqual([true]);
    expect(wrapper.html()).toContain('data-stub="LMap"');
  });

  test('storing the leaflet module must not trigger a Proxy invariant error', async () => {
    // 模块对象必须按原值存储（shallowRef）：引擎内的 deep watch 会遍历监听源，
    // 一旦模块对象被 deep reactive 包裹，遍历到 interop default 即违反 Proxy invariant
    const errors: unknown[] = [];
    const wrapper = mount(GeoMapEngine, {
      props: createEngineProps(),
      global: {
        config: { errorHandler: (err: unknown) => errors.push(err) },
      },
    });
    // 等 onMounted 动态 import 落库 + pre 队列 watcher 执行（首次遍历）
    await flushPromises();
    // markers 变更再次触发 deep watch 遍历（复现路径不依赖单次时序）
    await wrapper.setProps({
      markers: [
        { id: 'm1', lat: 31.23, lng: 121.47, label: '上海' },
        { id: 'm2', lat: 39.9, lng: 116.4, label: '北京' },
      ],
    });
    await flushPromises();

    expect(errors.filter(isProxyInvariantError)).toEqual([]);
  });
});
