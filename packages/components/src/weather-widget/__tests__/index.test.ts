import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import WeatherWidget from '../index.vue';
import type { WeatherConditionCode, ForecastDay } from '../schema';

// Mock VueUse
const mockPreferredReducedMotion = ref('no-preference');
vi.mock('@vueuse/core', () => ({
  usePreferredReducedMotion: () => mockPreferredReducedMotion,
}));

beforeEach(() => {
  mockPreferredReducedMotion.value = 'no-preference';
});


const EffectCompositorStub = {
  template: '<div data-testid="effect-compositor-stub" />',
  props: ['conditionCode', 'windSpeed', 'precipitationLevel', 'visibility', 'timestamp', 'timeOfDay', 'settings'],
};

const WeatherDataOverlayStub = {
  template: '<div data-testid="weather-data-overlay-stub" />',
  props: ['location', 'conditionCode', 'temperature', 'tempHigh', 'tempLow', 'forecast', 'unit', 'theme', 'timeOfDay', 'timestamp', 'reducedMotion', 'glassParams'],
};

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-weather',
    location: { name: 'San Francisco' },
    current: {
      temperature: 72,
      conditionCode: 'partly-cloudy' as WeatherConditionCode,
      tempMax: 75,
      tempMin: 60,
      windSpeed: 10,
      precipitationLevel: 'none' as const,
      visibility: 10,
    },
    forecast: [
      { label: 'Mon', tempMax: 75, tempMin: 60, conditionCode: 'clear' as WeatherConditionCode },
      { label: 'Tue', tempMax: 70, tempMin: 58, conditionCode: 'cloudy' as WeatherConditionCode },
      { label: 'Wed', tempMax: 68, tempMin: 55, conditionCode: 'rain' as WeatherConditionCode },
      { label: 'Thu', tempMax: 65, tempMin: 52, conditionCode: 'snow' as WeatherConditionCode },
      { label: 'Fri', tempMax: 70, tempMin: 56, conditionCode: 'thunderstorm' as WeatherConditionCode },
    ] as ForecastDay[],
    units: { temperature: 'fahrenheit' as const },
    effects: { enabled: true },
    updatedAt: '2024-01-01T12:00:00Z',
    ...overrides,
  };
}

describe('WeatherWidget', () => {
  describe('rendering', () => {
    test('renders with required props', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps(),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      expect(wrapper.find('[data-slot="weather-widget"]').exists()).toBe(true);
      expect(wrapper.find('[data-tool-ui-id="test-weather"]').exists()).toBe(true);
    });

    test('applies correct background class for sunny weather', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          current: { temperature: 75, conditionCode: 'clear', tempMax: 80, tempMin: 65 },
          effects: { enabled: false },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const container = wrapper.find('[data-slot="weather-widget"] > div');
      expect(container.classes().join(' ')).toContain('from-sky-50');
    });

    test('applies dark background class for stormy weather', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          current: { temperature: 60, conditionCode: 'thunderstorm', tempMax: 65, tempMin: 50 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const container = wrapper.find('[data-slot="weather-widget"] > div');
      expect(container.classes().join(' ')).toContain('from-zinc-950');
    });

    test('applies dark background class for heavy rain', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          current: { temperature: 55, conditionCode: 'heavy-rain', tempMax: 60, tempMin: 50 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const container = wrapper.find('[data-slot="weather-widget"] > div');
      expect(container.classes().join(' ')).toContain('from-zinc-950');
    });

    test('applies dark background class for overcast', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          time: { localTimeOfDay: 0.0 }, // Night time to ensure dark theme
          current: { temperature: 58, conditionCode: 'overcast', tempMax: 62, tempMin: 54 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const container = wrapper.find('[data-slot="weather-widget"] > div');
      expect(container.classes().join(' ')).toContain('from-zinc-950');
    });
  });

  describe('effects', () => {
    test('renders EffectCompositor when effects are enabled', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({ effects: { enabled: true } }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      expect(wrapper.find('[data-testid="effect-compositor-stub"]').exists()).toBe(true);
    });

    test('does not render EffectCompositor when effects are disabled', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({ effects: { enabled: false } }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      expect(wrapper.find('[data-testid="effect-compositor-stub"]').exists()).toBe(false);
    });

    test('does not render EffectCompositor when reduced motion is enabled', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({ effects: { enabled: true, reducedMotion: true } }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      expect(wrapper.find('[data-testid="effect-compositor-stub"]').exists()).toBe(false);
    });

    test('passes correct props to EffectCompositor', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          current: {
            temperature: 72,
            conditionCode: 'rain',
            tempMax: 75,
            tempMin: 60,
            windSpeed: 15,
            precipitationLevel: 'moderate',
            visibility: 5,
          },
          updatedAt: '2024-06-15T14:30:00Z',
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const compositor = wrapper.findComponent(EffectCompositorStub);
      expect(compositor.exists()).toBe(true);
      expect(compositor.props('conditionCode')).toBe('rain');
      expect(compositor.props('windSpeed')).toBe(15);
      expect(compositor.props('precipitationLevel')).toBe('moderate');
      expect(compositor.props('visibility')).toBe(5);
      expect(compositor.props('timestamp')).toBe('2024-06-15T14:30:00Z');
    });
  });

  describe('WeatherDataOverlay', () => {
    test('renders WeatherDataOverlay', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps(),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      expect(wrapper.find('[data-testid="weather-data-overlay-stub"]').exists()).toBe(true);
    });

    test('passes correct props to WeatherDataOverlay', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          location: { name: 'New York, NY' },
          current: {
            temperature: 85,
            conditionCode: 'clear',
            tempMax: 90,
            tempMin: 75,
          },
          units: { temperature: 'fahrenheit' },
          effects: { enabled: true, reducedMotion: false },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
      expect(overlay.props('location')).toBe('New York, NY');
      expect(overlay.props('conditionCode')).toBe('clear');
      expect(overlay.props('temperature')).toBe(85);
      expect(overlay.props('tempHigh')).toBe(90);
      expect(overlay.props('tempLow')).toBe(75);
      expect(overlay.props('unit')).toBe('fahrenheit');
      expect(overlay.props('reducedMotion')).toBe(false);
    });

    test('passes reducedMotion to WeatherDataOverlay', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({ effects: { enabled: true, reducedMotion: true } }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.props('reducedMotion')).toBe(true);
    });
  });

  describe('weather conditions', () => {
    const conditions: Array<{ code: WeatherConditionCode; temp: number }> = [
      { code: 'clear', temp: 78 },
      { code: 'partly-cloudy', temp: 68 },
      { code: 'cloudy', temp: 58 },
      { code: 'overcast', temp: 55 },
      { code: 'fog', temp: 52 },
      { code: 'drizzle', temp: 55 },
      { code: 'rain', temp: 55 },
      { code: 'heavy-rain', temp: 52 },
      { code: 'thunderstorm', temp: 72 },
      { code: 'snow', temp: 28 },
      { code: 'sleet', temp: 32 },
      { code: 'hail', temp: 45 },
      { code: 'windy', temp: 65 },
    ];

    conditions.forEach(({ code, temp }) => {
      test(`renders correctly for ${code} condition`, () => {
        const wrapper = mount(WeatherWidget, {
          props: createProps({
            current: { temperature: temp, conditionCode: code, tempMax: temp + 10, tempMin: temp - 5 },
          }),
          global: {
            stubs: {
              EffectCompositor: EffectCompositorStub,
              WeatherDataOverlay: WeatherDataOverlayStub,
            },
          },
        });
        expect(wrapper.find('[data-slot="weather-widget"]').exists()).toBe(true);
      });
    });
  });

  describe('time of day', () => {
    test('handles morning time correctly', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          updatedAt: '2024-01-01T08:00:00Z',
          current: { temperature: 65, conditionCode: 'clear', tempMax: 70, tempMin: 55 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
    });

    test('handles noon time correctly', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          updatedAt: '2024-01-01T12:00:00Z',
          current: { temperature: 75, conditionCode: 'clear', tempMax: 80, tempMin: 65 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
    });

    test('handles evening time correctly', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          updatedAt: '2024-01-01T18:00:00Z',
          current: { temperature: 70, conditionCode: 'clear', tempMax: 75, tempMin: 60 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
    });

    test('handles night time correctly', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          updatedAt: '2024-01-01T02:00:00Z',
          current: { temperature: 55, conditionCode: 'clear', tempMax: 60, tempMin: 50 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
    });

    test('handles explicit timeOfDay prop', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          time: { localTimeOfDay: 0.75 },
          current: { temperature: 70, conditionCode: 'clear', tempMax: 75, tempMin: 60 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
    });

    test('handles timeBucket prop', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          time: { timeBucket: 6 },
          current: { temperature: 70, conditionCode: 'clear', tempMax: 75, tempMin: 60 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
    });
  });

  describe('temperature units', () => {
    test('handles celsius unit', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          units: { temperature: 'celsius' },
          current: { temperature: 22, conditionCode: 'clear', tempMax: 25, tempMin: 18 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.props('unit')).toBe('celsius');
    });

    test('handles fahrenheit unit', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          units: { temperature: 'fahrenheit' },
          current: { temperature: 72, conditionCode: 'clear', tempMax: 75, tempMin: 60 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.props('unit')).toBe('fahrenheit');
    });
  });

  describe('reduced motion system preference', () => {
    test('disables effects when system prefers reduced motion', () => {
      mockPreferredReducedMotion.value = 'reduce';

      const wrapper = mount(WeatherWidget, {
        props: createProps({ effects: { enabled: true } }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      // EffectCompositor should not render when system prefers reduced motion
      expect(wrapper.find('[data-testid="effect-compositor-stub"]').exists()).toBe(false);
    });

    test('passes reducedMotion to overlay when system prefers reduced motion', () => {
      mockPreferredReducedMotion.value = 'reduce';

      const wrapper = mount(WeatherWidget, {
        props: createProps(),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.props('reducedMotion')).toBe(true);
    });

    test('props.reducedMotion overrides system preference when explicitly false', () => {
      mockPreferredReducedMotion.value = 'reduce';

      const wrapper = mount(WeatherWidget, {
        props: createProps({ effects: { enabled: true, reducedMotion: false } }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      // When explicitly set to false, effects should be enabled
      expect(wrapper.find('[data-testid="effect-compositor-stub"]').exists()).toBe(true);
    });

    test('props.reducedMotion overrides system preference when explicitly true', () => {
      mockPreferredReducedMotion.value = 'no-preference';

      const wrapper = mount(WeatherWidget, {
        props: createProps({ effects: { enabled: true, reducedMotion: true } }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      // When explicitly set to true, effects should be disabled
      expect(wrapper.find('[data-testid="effect-compositor-stub"]').exists()).toBe(false);
    });
  });

  describe('time-of-day lighting simulation', () => {
    test('applies dawn lighting (6am)', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          updatedAt: '2024-01-01T06:00:00Z',
          current: { temperature: 60, conditionCode: 'clear', tempMax: 70, tempMin: 50 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
      expect(overlay.props('timeOfDay')).toBeDefined();
    });

    test('applies noon lighting (12pm)', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          updatedAt: '2024-01-01T12:00:00Z',
          current: { temperature: 75, conditionCode: 'clear', tempMax: 80, tempMin: 65 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const container = wrapper.find('[data-slot="weather-widget"] > div');
      expect(container.classes().join(' ')).toContain('from-sky-50');
    });

    test('applies dusk lighting (6pm)', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          updatedAt: '2024-01-01T18:00:00Z',
          current: { temperature: 70, conditionCode: 'clear', tempMax: 75, tempMin: 60 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
    });

    test('applies midnight lighting (12am)', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          updatedAt: '2024-01-01T00:00:00Z',
          current: { temperature: 50, conditionCode: 'clear', tempMax: 60, tempMin: 45 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const container = wrapper.find('[data-slot="weather-widget"] > div');
      expect(container.classes().join(' ')).toContain('from-zinc-950');
    });

    test('uses explicit timeOfDay over updatedAt', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          time: { localTimeOfDay: 0.25 }, // 6am
          updatedAt: '2024-01-01T12:00:00Z', // Would be noon
          current: { temperature: 65, conditionCode: 'clear', tempMax: 70, tempMin: 55 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
    });

    test('uses timeBucket when provided', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          time: { timeBucket: 0 }, // Early morning
          current: { temperature: 55, conditionCode: 'clear', tempMax: 65, tempMin: 45 },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.exists()).toBe(true);
    });
  });

  describe('effect quality settings', () => {
    test('passes quality setting to EffectCompositor', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          effects: { enabled: true, quality: 'high' },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const compositor = wrapper.findComponent(EffectCompositorStub);
      expect(compositor.exists()).toBe(true);
    });

    test('passes auto quality setting', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          effects: { enabled: true, quality: 'auto' },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const compositor = wrapper.findComponent(EffectCompositorStub);
      expect(compositor.exists()).toBe(true);
    });
  });

  describe('edge cases', () => {
    test('handles missing optional current fields gracefully', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          current: {
            conditionCode: 'clear',
            temperature: 72,
            tempMax: 75,
            tempMin: 60,
            // windSpeed, precipitationLevel, visibility are optional
          },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      expect(wrapper.find('[data-slot="weather-widget"]').exists()).toBe(true);
    });

    test('handles empty forecast array', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          forecast: [],
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.props('forecast')).toEqual([]);
    });

    test('handles missing updatedAt', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          updatedAt: undefined,
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      expect(wrapper.find('[data-slot="weather-widget"]').exists()).toBe(true);
    });

    test('handles extreme temperatures', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          current: {
            conditionCode: 'clear',
            temperature: -40,
            tempMax: -35,
            tempMin: -45,
          },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.props('temperature')).toBe(-40);
    });

    test('handles very high temperatures', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({
          current: {
            conditionCode: 'clear',
            temperature: 120,
            tempMax: 125,
            tempMin: 110,
          },
        }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });

      const overlay = wrapper.findComponent(WeatherDataOverlayStub);
      expect(overlay.props('temperature')).toBe(120);
    });
  });

  describe('structure', () => {
    test('has data-slot attribute', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps(),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      expect(wrapper.find('[data-slot="weather-widget"]').exists()).toBe(true);
    });

    test('has data-tool-ui-id attribute', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps(),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      expect(wrapper.find('[data-tool-ui-id="test-weather"]').exists()).toBe(true);
    });

    test('applies custom css.root', () => {
      const wrapper = mount(WeatherWidget, {
        props: createProps({ css: { root: 'custom-class' } }),
        global: {
          stubs: {
            EffectCompositor: EffectCompositorStub,
            WeatherDataOverlay: WeatherDataOverlayStub,
          },
        },
      });
      expect(wrapper.find('[data-slot="weather-widget"]').classes()).toContain('custom-class');
    });
  });
});
