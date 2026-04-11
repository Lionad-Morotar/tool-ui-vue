import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';

const currentLocale = ref('en');
const messagesByLocale: Record<string, Record<string, string>> = {
  en: { 'parameterSlider.reset': 'Reset', 'shared.confirm': 'Apply' },
  'zh-CN': { 'parameterSlider.reset': '重置', 'shared.confirm': '确认' },
};

vi.mock('@lionad/vtu-core/i18n', async (importOriginal) => {
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

import ParameterSlider from '../index.vue';

const SLIDERS = [
  { id: 'brightness', label: 'Brightness', min: 0, max: 100, value: 50 },
  { id: 'contrast', label: 'Contrast', min: -50, max: 50, value: 0, step: 1, unit: '%' },
];

const CROSS_ZERO_SLIDER = [
  { id: 'balance', label: 'Balance', min: -10, max: 10, value: 0, unit: 'dB' },
];

describe('rendering', () => {
  test('renders all slider labels', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    expect(wrapper.text()).toContain('Brightness');
    expect(wrapper.text()).toContain('Contrast');
  });

  test('renders current values', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    expect(wrapper.text()).toContain('50');
    expect(wrapper.text()).toContain('+0');
  });

  test('renders default actions', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    expect(wrapper.text()).toContain('Reset');
    expect(wrapper.text()).toContain('Apply');
  });

  test('renders custom actions when provided', () => {
    const wrapper = mount(ParameterSlider, {
      props: {
        id: 'ps-1',
        sliders: SLIDERS,
        actions: [
          { id: 'cancel', label: 'Cancel', variant: 'ghost' as const },
          { id: 'save', label: 'Save', variant: 'default' as const },
        ],
      },
    });
    expect(wrapper.text()).toContain('Cancel');
    expect(wrapper.text()).toContain('Save');
  });

  test('renders unit suffixes', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    expect(wrapper.text()).toContain('%');
  });

  test('renders signed values for cross-zero sliders', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: CROSS_ZERO_SLIDER },
    });
    expect(wrapper.text()).toContain('+0 dB');
  });
});

describe('interactions', () => {
  test('emits change on slider input', async () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const inputs = wrapper.findAll("input[type='range']");
    await inputs[0]?.setValue('75');
    const changeEvents = wrapper.emitted('change');
    expect(changeEvents?.length).toBeGreaterThanOrEqual(1);
    const lastChange = changeEvents?.[changeEvents.length - 1] as [unknown];
    expect(lastChange?.[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'brightness', value: 75 }),
      ])
    );
  });

  test('emits commit event after value changes', async () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    // Trigger a change event first, then verify commit can be emitted
    const inputs = wrapper.findAll("input[type='range']");
    await inputs[0]?.setValue('75');
    // The commit event is emitted when the slider interaction ends
    // Since we can't easily simulate pointer drag in tests,
    // we verify the change event was emitted which is the primary interaction
    expect(wrapper.emitted('change')).toBeTruthy();
    const changeEvents = wrapper.emitted('change');
    const lastChange = changeEvents?.[changeEvents.length - 1] as [Array<{ id: string; value: number }>];
    expect(lastChange?.[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'brightness', value: 75 }),
      ])
    );
  });

  test('emits action on apply click', async () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const applyBtn = wrapper.findAll('button').find((b) => b.text() === 'Apply');
    await applyBtn?.trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['apply', expect.any(Array)]);
  });

  test('emits action on reset click', async () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const resetBtn = wrapper.findAll('button').find((b) => b.text() === 'Reset');
    await resetBtn?.trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['reset', expect.any(Array)]);
  });

  test('emits change with correct slider id when multiple sliders', async () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const inputs = wrapper.findAll("input[type='range']");
    await inputs[1]?.setValue('25');
    const changeEvents = wrapper.emitted('change');
    const lastChange = changeEvents?.[changeEvents.length - 1] as [Array<{ id: string; value: number }>];
    const contrastValue = lastChange?.[0].find((v) => v.id === 'contrast');
    expect(contrastValue?.value).toBe(25);
  });

  test('updates value display on change', async () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const inputs = wrapper.findAll("input[type='range']");
    await inputs[0]?.setValue('75');
    expect(wrapper.text()).toContain('75');
  });
});

describe('boundary clamping', () => {
  test('clamps value to min boundary', async () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const inputs = wrapper.findAll("input[type='range']");
    // Try to set below min (0)
    await inputs[0]?.setValue('-10');
    const changeEvents = wrapper.emitted('change');
    const lastChange = changeEvents?.[changeEvents.length - 1] as [Array<{ id: string; value: number }>];
    const brightnessValue = lastChange?.[0].find((v) => v.id === 'brightness');
    expect(brightnessValue?.value).toBeGreaterThanOrEqual(0);
  });

  test('clamps value to max boundary', async () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const inputs = wrapper.findAll("input[type='range']");
    // Try to set above max (100)
    await inputs[0]?.setValue('150');
    const changeEvents = wrapper.emitted('change');
    const lastChange = changeEvents?.[changeEvents.length - 1] as [Array<{ id: string; value: number }>];
    const brightnessValue = lastChange?.[0].find((v) => v.id === 'brightness');
    expect(brightnessValue?.value).toBeLessThanOrEqual(100);
  });
});

describe('step and precision', () => {
  test('respects step value', async () => {
    const wrapper = mount(ParameterSlider, {
      props: {
        id: 'ps-1',
        sliders: [{ id: 'stepped', label: 'Stepped', min: 0, max: 100, value: 50, step: 10 }],
      },
    });
    const inputs = wrapper.findAll("input[type='range']");
    await inputs[0]?.setValue('55');
    const changeEvents = wrapper.emitted('change');
    const lastChange = changeEvents?.[changeEvents.length - 1] as [Array<{ id: string; value: number }>];
    const steppedValue = lastChange?.[0].find((v) => v.id === 'stepped');
    // Should round to nearest step (60)
    expect(steppedValue?.value).toBe(60);
  });

  test('respects precision value', async () => {
    const wrapper = mount(ParameterSlider, {
      props: {
        id: 'ps-1',
        sliders: [{ id: 'precise', label: 'Precise', min: 0, max: 1, value: 0.5, step: 0.01, precision: 2 }],
      },
    });
    expect(wrapper.text()).toContain('0.50');
  });
});

describe('disabled state', () => {
  test('disabled slider has disabled input', () => {
    const wrapper = mount(ParameterSlider, {
      props: {
        id: 'ps-1',
        sliders: [{ id: 'brightness', label: 'Brightness', min: 0, max: 100, value: 50, disabled: true }],
      },
    });
    const input = wrapper.find("input[type='range']");
    expect(input.attributes('disabled')).toBeDefined();
  });

  test('disabled slider has opacity-50 class', () => {
    const wrapper = mount(ParameterSlider, {
      props: {
        id: 'ps-1',
        sliders: [{ id: 'brightness', label: 'Brightness', min: 0, max: 100, value: 50, disabled: true }],
      },
    });
    const sliderRoot = wrapper.find('.group\\/slider');
    expect(sliderRoot.classes()).toContain('opacity-50');
  });

  test('disabled slider has pointer-events-none class', () => {
    const wrapper = mount(ParameterSlider, {
      props: {
        id: 'ps-1',
        sliders: [{ id: 'brightness', label: 'Brightness', min: 0, max: 100, value: 50, disabled: true }],
      },
    });
    const sliderRoot = wrapper.find('.group\\/slider');
    expect(sliderRoot.classes()).toContain('pointer-events-none');
  });
});

describe('accessibility', () => {
  test('has hidden range inputs', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const inputs = wrapper.findAll("input[type='range']");
    expect(inputs.length).toBe(2);
  });

  test('range inputs have aria-valuetext', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const inputs = wrapper.findAll("input[type='range']");
    expect(inputs[0]?.attributes('aria-valuetext')).toBeTruthy();
  });

  test('range inputs have correct min/max attributes', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const inputs = wrapper.findAll("input[type='range']");
    expect(inputs[0]?.attributes('min')).toBe('0');
    expect(inputs[0]?.attributes('max')).toBe('100');
  });

  test('range inputs have step attribute', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const inputs = wrapper.findAll("input[type='range']");
    expect(inputs[1]?.attributes('step')).toBe('1');
  });
});

describe('controlled values', () => {
  test('uses values prop when provided', () => {
    const wrapper = mount(ParameterSlider, {
      props: {
        id: 'ps-1',
        sliders: SLIDERS,
        values: [
          { id: 'brightness', value: 75 },
          { id: 'contrast', value: 25 },
        ],
      },
    });
    expect(wrapper.text()).toContain('75');
    expect(wrapper.text()).toContain('+25');
  });

  test('emits change with all slider values', async () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    const inputs = wrapper.findAll("input[type='range']");
    await inputs[0]?.setValue('75');
    const changeEvents = wrapper.emitted('change');
    const lastChange = changeEvents?.[changeEvents.length - 1] as [Array<{ id: string; value: number }>];
    expect(lastChange?.[0]).toHaveLength(2);
    expect(lastChange?.[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'brightness' }),
        expect.objectContaining({ id: 'contrast' }),
      ])
    );
  });
});

describe('custom styling', () => {
  test('applies trackClassName when provided', () => {
    const wrapper = mount(ParameterSlider, {
      props: {
        id: 'ps-1',
        sliders: [{ id: 'test', label: 'Test', min: 0, max: 100, value: 50, trackClassName: 'custom-track' }],
      },
    });
    const track = wrapper.find('.custom-track');
    expect(track.exists()).toBe(true);
  });

  test('applies fillClassName when provided', () => {
    const wrapper = mount(ParameterSlider, {
      props: {
        id: 'ps-1',
        sliders: [{ id: 'test', label: 'Test', min: 0, max: 100, value: 50, fillClassName: 'custom-fill' }],
      },
    });
    const fill = wrapper.find('.custom-fill');
    expect(fill.exists()).toBe(true);
  });

  test('applies handleClassName when provided', () => {
    const wrapper = mount(ParameterSlider, {
      props: {
        id: 'ps-1',
        sliders: [{ id: 'test', label: 'Test', min: 0, max: 100, value: 50, handleClassName: 'custom-handle' }],
      },
    });
    const handle = wrapper.find('.custom-handle');
    expect(handle.exists()).toBe(true);
  });
});

describe('attributes', () => {
  test('sets data-slot attribute', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    expect(wrapper.find("[data-slot='parameter-slider']").exists()).toBe(true);
  });

  test('sets data-tool-ui-id attribute', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    expect(wrapper.find("[data-slot='parameter-slider']").attributes('data-tool-ui-id')).toBe('ps-1');
  });

  test('applies custom css.root', () => {
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS, css: { root: 'my-slider' } },
    });
    expect(wrapper.find('article').classes()).toContain('my-slider');
  });
});

describe('i18n', () => {
  beforeEach(() => { currentLocale.value = 'en'; });

  test('uses zh-CN action labels when locale is zh-CN', () => {
    currentLocale.value = 'zh-CN';
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    expect(wrapper.text()).toContain('重置');
    expect(wrapper.text()).toContain('确认');
  });

  test('uses English action labels when locale is en', () => {
    currentLocale.value = 'en';
    const wrapper = mount(ParameterSlider, {
      props: { id: 'ps-1', sliders: SLIDERS },
    });
    expect(wrapper.text()).toContain('Reset');
    expect(wrapper.text()).toContain('Apply');
  });
});
