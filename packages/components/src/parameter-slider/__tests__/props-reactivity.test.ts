import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';
import { setupConsoleGuard } from '../../../../../src/test/console-guard';
import ParameterSlider from '../index.vue';

const currentLocale = ref('en');
const messagesByLocale: Record<string, Record<string, string>> = {
  en: { 'parameterSlider.reset': 'Reset', 'parameterSlider.confirm': 'Confirm' },
  'zh-CN': { 'parameterSlider.reset': '重置', 'parameterSlider.confirm': '确认' },
};

vi.mock('../../core/i18n', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => computed(() => {
        const msgs = messagesByLocale[currentLocale.value] ?? {};
        return msgs[key] ?? key;
      }),
      locale: computed(() => currentLocale.value),
      setLocale: (locale: string) => { currentLocale.value = locale; },
    }),
  };
});


setupConsoleGuard();

// props 响应式契约：父层以新数组引用更新 sliders/values 时（增量渲染场景
// 每帧灌入新引用），组件必须跟随重渲染。聚合层若以值传参，子 composable
// 在 setup 同步作用域拿到的只是挂载首帧快照，组件会停留在初始状态不再更新。

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-parameter-slider-reactive',
    sliders: [
      { id: 'brightness', label: 'Brightness', min: 0, max: 100, value: 50 },
      { id: 'contrast', label: 'Contrast', min: -50, max: 50, value: 0, step: 1, unit: '%' },
    ],
    ...overrides,
  };
}

describe('ParameterSlider props 响应式', () => {
  beforeEach(() => { currentLocale.value = 'en'; });

  test('values 以新引用更新时显示值跟随变化', async () => {
    const wrapper = mount(ParameterSlider, {
      props: createProps({
        values: [
          { id: 'brightness', value: 50 },
          { id: 'contrast', value: 0 },
        ],
      }),
    });
    expect(wrapper.text()).toContain('50');
    expect(wrapper.text()).toContain('+0');

    await wrapper.setProps({
      values: [
        { id: 'brightness', value: 75 },
        { id: 'contrast', value: 25 },
      ],
    });
    expect(wrapper.text()).toContain('75');
    expect(wrapper.text()).toContain('+25');
  });

  test('sliders 以新引用更新时配置与显示跟随变化', async () => {
    const wrapper = mount(ParameterSlider, { props: createProps() });
    expect(wrapper.text()).toContain('Brightness');
    expect(wrapper.text()).toContain('Contrast');

    await wrapper.setProps({
      sliders: [
        { id: 'volume', label: 'Volume', min: 0, max: 100, value: 30 },
      ],
    });
    expect(wrapper.text()).toContain('Volume');
    expect(wrapper.text()).not.toContain('Brightness');
    expect(wrapper.text()).toContain('30');
  });
});
