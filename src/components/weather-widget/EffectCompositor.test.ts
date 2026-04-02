import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { nextTick } from 'vue';
import EffectCompositor from './EffectCompositor.vue';
import type { WeatherConditionCode } from '../schema';

const WeatherEffectsCanvasStub = {
  template: '<div data-testid="weather-effects-canvas-stub" />',
  props: ['css', 'dpr', 'layers', 'celestial', 'cloud', 'rain', 'lightning', 'snow', 'interactions', 'post'],
};

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    conditionCode: 'clear' as WeatherConditionCode,
    windSpeed: 10,
    precipitationLevel: 'none' as const,
    visibility: 10,
    timestamp: '2024-01-01T12:00:00Z',
    timeOfDay: 0.5,
    settings: { enabled: true, reducedMotion: false },
    css: undefined,
    ...overrides,
  };
}

describe('EffectCompositor', () => {
  describe('rendering', () => {
    test('renders when effects are enabled', async () => {
      const wrapper = mount(EffectCompositor, {
        props: createProps(),
        global: {
          stubs: {
            WeatherEffectsCanvas: WeatherEffectsCanvasStub,
          },
        },
      });

      await nextTick();

      expect(wrapper.find('[data-testid="weather-effects-canvas-stub"]').exists()).toBe(true);
    });

    test('does not render when effects are disabled', async () => {
      const wrapper = mount(EffectCompositor, {
        props: createProps({ settings: { enabled: false } }),
        global: {
          stubs: {
            WeatherEffectsCanvas: WeatherEffectsCanvasStub,
          },
        },
      });

      await nextTick();

      expect(wrapper.find('[data-testid="weather-effects-canvas-stub"]').exists()).toBe(false);
      expect(wrapper.find('div').exists()).toBe(false);
    });

    test('does not render when reducedMotion is true', async () => {
      const wrapper = mount(EffectCompositor, {
        props: createProps({ settings: { enabled: true, reducedMotion: true } }),
        global: {
          stubs: {
            WeatherEffectsCanvas: WeatherEffectsCanvasStub,
          },
        },
      });

      await nextTick();

      expect(wrapper.find('[data-testid="weather-effects-canvas-stub"]').exists()).toBe(false);
    });

    test('applies css.root prop', async () => {
      const wrapper = mount(EffectCompositor, {
        props: createProps({ css: { root: 'custom-effect-class' } }),
        global: {
          stubs: {
            WeatherEffectsCanvas: WeatherEffectsCanvasStub,
          },
        },
      });

      await nextTick();

      const container = wrapper.find('div');
      expect(container.classes()).toContain('custom-effect-class');
    });
  });

  describe('weather conditions', () => {
    const conditions: WeatherConditionCode[] = [
      'clear',
      'partly-cloudy',
      'cloudy',
      'overcast',
      'fog',
      'drizzle',
      'rain',
      'heavy-rain',
      'thunderstorm',
      'snow',
      'sleet',
      'hail',
      'windy',
    ];

    conditions.forEach((condition) => {
      test(`renders for ${condition} condition`, async () => {
        const wrapper = mount(EffectCompositor, {
          props: createProps({ conditionCode: condition }),
          global: {
            stubs: {
              WeatherEffectsCanvas: WeatherEffectsCanvasStub,
            },
          },
        });

        await nextTick();

        expect(wrapper.find('[data-testid="weather-effects-canvas-stub"]').exists()).toBe(true);
      });
    });
  });

  describe('props passing', () => {
    test('passes correct props to WeatherEffectsCanvas', async () => {
      const wrapper = mount(EffectCompositor, {
        props: createProps({
          conditionCode: 'rain',
          windSpeed: 20,
          precipitationLevel: 'heavy',
          visibility: 5,
          timestamp: '2024-06-15T14:30:00Z',
          timeOfDay: 0.6,
        }),
        global: {
          stubs: {
            WeatherEffectsCanvas: WeatherEffectsCanvasStub,
          },
        },
      });

      await nextTick();

      const canvas = wrapper.findComponent(WeatherEffectsCanvasStub);
      expect(canvas.exists()).toBe(true);
      expect(canvas.props('dpr')).toBeDefined();
      expect(canvas.props('layers')).toBeDefined();
      expect(canvas.props('celestial')).toBeDefined();
    });

    test('passes dpr based on quality setting', async () => {
      const wrapper = mount(EffectCompositor, {
        props: createProps({
          settings: { enabled: true, quality: 'high' },
        }),
        global: {
          stubs: {
            WeatherEffectsCanvas: WeatherEffectsCanvasStub,
          },
        },
      });

      await nextTick();

      const canvas = wrapper.findComponent(WeatherEffectsCanvasStub);
      expect(canvas.exists()).toBe(true);
      expect(canvas.props('dpr')).toBeDefined();
    });

    test('handles auto quality setting', async () => {
      const wrapper = mount(EffectCompositor, {
        props: createProps({
          settings: { enabled: true, quality: 'auto' },
        }),
        global: {
          stubs: {
            WeatherEffectsCanvas: WeatherEffectsCanvasStub,
          },
        },
      });

      await nextTick();

      const canvas = wrapper.findComponent(WeatherEffectsCanvasStub);
      expect(canvas.exists()).toBe(true);
      expect(canvas.props('dpr')).toBeDefined();
    });
  });

  describe('accessibility', () => {
    test('has aria-hidden attribute', async () => {
      const wrapper = mount(EffectCompositor, {
        props: createProps(),
        global: {
          stubs: {
            WeatherEffectsCanvas: WeatherEffectsCanvasStub,
          },
        },
      });

      await nextTick();

      const container = wrapper.find("div[aria-hidden='true']");
      expect(container.exists()).toBe(true);
    });

    test('has pointer-events-none style', async () => {
      const wrapper = mount(EffectCompositor, {
        props: createProps(),
        global: {
          stubs: {
            WeatherEffectsCanvas: WeatherEffectsCanvasStub,
          },
        },
      });

      await nextTick();

      const container = wrapper.find('div');
      expect(container.attributes('style')).toContain('pointer-events: none');
    });
  });
});
