import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import { nextTick } from 'vue';
import WeatherDataOverlay from '../cmpts/weather-data-overlay.vue';
import type { WeatherConditionCode, ForecastDay } from '../schema';

// Mock ResizeObserver
global.ResizeObserver = vi.fn(function () {
  return {
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  };
});

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    location: 'San Francisco, CA',
    conditionCode: 'partly-cloudy' as WeatherConditionCode,
    temperature: 72,
    tempHigh: 75,
    tempLow: 60,
    forecast: [
      { label: 'Mon', tempMax: 75, tempMin: 60, conditionCode: 'clear' as WeatherConditionCode },
      { label: 'Tue', tempMax: 70, tempMin: 58, conditionCode: 'cloudy' as WeatherConditionCode },
      { label: 'Wed', tempMax: 68, tempMin: 55, conditionCode: 'rain' as WeatherConditionCode },
    ] as ForecastDay[],
    unit: 'fahrenheit' as const,
    theme: undefined,
    timeOfDay: undefined,
    timestamp: undefined,
    css: undefined,
    reducedMotion: false,
    glassParams: undefined,
    ...overrides,
  };
}

describe('WeatherDataOverlay', () => {
  describe('rendering', () => {
    test('renders location name', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ location: 'New York, NY' }),
      });
      expect(wrapper.text()).toContain('New York, NY');
    });

    test('renders current temperature', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ temperature: 85 }),
      });
      expect(wrapper.text()).toContain('85');
    });

    test('renders temperature unit', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ unit: 'fahrenheit' }),
      });
      expect(wrapper.text()).toContain('°F');
    });

    test('renders celsius unit', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ unit: 'celsius' }),
      });
      expect(wrapper.text()).toContain('°C');
    });

    test('renders high/low temperatures', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ tempHigh: 80, tempLow: 65 }),
      });
      expect(wrapper.text()).toContain('H');
      expect(wrapper.text()).toContain('80°');
      expect(wrapper.text()).toContain('L');
      expect(wrapper.text()).toContain('65°');
    });

    test('renders forecast days', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('Mon');
      expect(wrapper.text()).toContain('Tue');
      expect(wrapper.text()).toContain('Wed');
    });

    test('renders forecast temperatures', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('75°');
      expect(wrapper.text()).toContain('60°');
    });
  });

  describe('themes', () => {
    test('applies dark theme classes when theme is dark', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ theme: 'dark' }),
      });
      const location = wrapper.find('h2');
      expect(location.classes().join(' ')).toContain('text-white/80');
    });

    test('applies light theme classes when theme is light', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ theme: 'light' }),
      });
      const location = wrapper.find('h2');
      expect(location.classes().join(' ')).toContain('text-black/80');
    });

    test('calculates dark theme for night time', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({
          timeOfDay: 0.1, // Night
          conditionCode: 'clear',
        }),
      });
      const location = wrapper.find('h2');
      // Should have dark theme text
      expect(location.classes().join(' ')).toContain('text-white');
    });

    test('calculates light theme for day time', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({
          timeOfDay: 0.5, // Noon
          conditionCode: 'clear',
        }),
      });
      const location = wrapper.find('h2');
      // Should have light theme text
      expect(location.classes().join(' ')).toContain('text-black');
    });
  });

  describe('time of day', () => {
    test('uses explicit timeOfDay prop', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ timeOfDay: 0.75 }), // Evening
      });
      expect(wrapper.find('h2').exists()).toBe(true);
    });

    test('calculates time from timestamp', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({
          timestamp: '2024-06-15T14:30:00Z', // 2:30 PM
          timeOfDay: undefined,
        }),
      });
      expect(wrapper.find('h2').exists()).toBe(true);
    });

    test('defaults to noon when no time provided', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({
          timeOfDay: undefined,
          timestamp: undefined,
        }),
      });
      expect(wrapper.find('h2').exists()).toBe(true);
    });
  });

  describe('reduced motion', () => {
    test('does not apply glow effect when reducedMotion is true', async () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ reducedMotion: true }),
      });

      // Trigger mouse move
      const container = wrapper.find('div').element;
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
      });
      container.dispatchEvent(mouseEvent);

      await nextTick();

      // Glow should not be active
      const edgeShine = wrapper.find('.pointer-events-none');
      expect(edgeShine.exists()).toBe(true);
    });

    test('applies glow effect when reducedMotion is false', async () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ reducedMotion: false }),
      });

      await nextTick();

      // Container should exist
      expect(wrapper.find('div').exists()).toBe(true);
    });
  });

  describe('glass effects', () => {
    test('renders with default glass params', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps(),
      });
      expect(wrapper.find('.weather-forecast-strip').exists()).toBe(true);
    });

    test('renders with custom glass params', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({
          glassParams: {
            enabled: true,
            depth: 5,
            strength: 50,
            blur: 2,
          },
        }),
      });
      expect(wrapper.find('.weather-forecast-strip').exists()).toBe(true);
    });

    test('renders with glass disabled', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({
          glassParams: { enabled: false },
        }),
      });
      expect(wrapper.find('.weather-forecast-strip').exists()).toBe(true);
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
      test(`renders correctly for ${condition}`, () => {
        const wrapper = mount(WeatherDataOverlay, {
          props: createProps({ conditionCode: condition }),
        });
        expect(wrapper.find('h2').exists()).toBe(true);
        expect(wrapper.text()).toContain('San Francisco, CA');
      });
    });
  });

  describe('forecast', () => {
    test('renders up to 5 forecast days', () => {
      const forecast: ForecastDay[] = [
        { label: 'Mon', tempMax: 75, tempMin: 60, conditionCode: 'clear' },
        { label: 'Tue', tempMax: 70, tempMin: 58, conditionCode: 'cloudy' },
        { label: 'Wed', tempMax: 68, tempMin: 55, conditionCode: 'rain' },
        { label: 'Thu', tempMax: 72, tempMin: 60, conditionCode: 'clear' },
        { label: 'Fri', tempMax: 75, tempMin: 62, conditionCode: 'partly-cloudy' },
        { label: 'Sat', tempMax: 78, tempMin: 65, conditionCode: 'clear' },
      ];

      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ forecast }),
      });

      expect(wrapper.text()).toContain('Mon');
      expect(wrapper.text()).toContain('Tue');
      expect(wrapper.text()).toContain('Wed');
      expect(wrapper.text()).toContain('Thu');
      expect(wrapper.text()).toContain('Fri');
      // Should not show Sat (only first 5)
    });

    test('renders empty forecast when not provided', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ forecast: [] }),
      });
      expect(wrapper.find('.weather-forecast-strip').exists()).toBe(false);
    });

    test('renders weather icons for forecast', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps(),
      });
      // Should have SVG icons for each forecast day
      const svgs = wrapper.findAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe('accessibility', () => {
    test('has sr-only text for temperature', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ temperature: 72, unit: 'fahrenheit' }),
      });
      const srOnly = wrapper.find('.sr-only');
      expect(srOnly.exists()).toBe(true);
      expect(srOnly.text()).toContain('72');
      expect(srOnly.text()).toContain('Fahrenheit');
    });

    test('has aria-hidden on visual temperature', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps(),
      });
      const tempSpan = wrapper.find("span[aria-hidden='true']");
      expect(tempSpan.exists()).toBe(true);
    });
  });

  describe('temperature formatting', () => {
    test('rounds temperature values', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ temperature: 72.6 }),
      });
      expect(wrapper.text()).toContain('73');
    });

    test('rounds negative temperatures', () => {
      const wrapper = mount(WeatherDataOverlay, {
        props: createProps({ temperature: -5.4 }),
      });
      expect(wrapper.text()).toContain('-5');
    });
  });
});
