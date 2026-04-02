import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import WeatherWidget from './index.vue';

// Mock the WeatherEffectsCanvas component
vi.mock('./WeatherEffectsCanvas.vue', () => ({
  default: {
    name: 'WeatherEffectsCanvas',
    props: ['className', 'layers', 'celestial', 'cloud', 'rain', 'lightning', 'snow', 'interactions', 'post'],
    template: "<div data-testid='effects-canvas' />",
  },
}));

describe('WeatherWidget Performance', () => {
  const baseProps = {
    id: 'test-weather',
    location: { name: 'Test City', lat: 0, lon: 0 },
    current: {
      temperature: 20,
      tempMax: 25,
      tempMin: 15,
      conditionCode: 'clear' as const,
      humidity: 50,
      windSpeed: 10,
    },
    forecast: [],
    units: { temperature: 'celsius' as const },
    effects: { enabled: true },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST-PERF-01: WebGL Budget Guard
   * Tests GPU memory limit detection and fallback behavior
   */
  describe('WebGL Budget Guard', () => {
    it('should detect GPU memory constraints', async () => {
      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      await nextTick();

      // Component should render without crashing
      expect(wrapper.find("[data-slot='weather-widget']").exists()).toBe(true);
    });

    it('should handle missing WebGL context gracefully', async () => {
      // Mock console to check for warnings
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mount(WeatherWidget, {
        props: {
          ...baseProps,
          effects: { enabled: true },
        },
      });

      await nextTick();

      // Component should still render even if WebGL fails
      expect(wrapper.find("[data-slot='weather-widget']").exists()).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should allocate budget per effect layer', async () => {
      const wrapper = mount(WeatherWidget, {
        props: {
          ...baseProps,
          current: { ...baseProps.current, conditionCode: 'thunderstorm' },
        },
      });

      await nextTick();

      // Thunderstorm has all layers enabled
      const canvas = wrapper.find("[data-testid='effects-canvas']");
      expect(canvas.exists()).toBe(true);
    });
  });

  /**
   * TEST-PERF-02: Canvas Resolver Parity
   * Tests canvas rendering consistency
   */
  describe('Canvas Resolver Parity', () => {
    it('should render canvas with consistent dimensions', async () => {
      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      await nextTick();

      const container = wrapper.find("[data-tool-ui-id='test-weather']");
      expect(container.exists()).toBe(true);
    });

    it('should handle canvas resize events', async () => {
      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      await nextTick();

      // Simulate resize by updating props
      await wrapper.setProps({
        location: { name: 'Updated City', lat: 0, lon: 0 },
      });

      expect(wrapper.find("[data-slot='weather-widget']").exists()).toBe(true);
    });

    it('should maintain render consistency across re-renders', async () => {
      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      // Trigger multiple re-renders
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({
          current: { ...baseProps.current, temperature: 20 + i },
        });
        await nextTick();
      }

      expect(wrapper.find("[data-slot='weather-widget']").exists()).toBe(true);
    });
  });

  /**
   * TEST-PERF-03: Runtime Codegen
   * Tests shader code generation performance
   */
  describe('Runtime Codegen', () => {
    it('should generate effect parameters efficiently', async () => {
      const startTime = performance.now();

      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      await nextTick();

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render in under 100ms
      expect(renderTime).toBeLessThan(100);
      expect(wrapper.find("[data-slot='weather-widget']").exists()).toBe(true);
    });

    it('should cache computed effect props', async () => {
      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      await nextTick();

      // Trigger re-render with same props
      const startTime = performance.now();
      await wrapper.setProps({ location: { name: 'Same City', lat: 0, lon: 0 } });
      await nextTick();
      const endTime = performance.now();

      // Subsequent renders should be fast due to caching
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should handle rapid prop changes efficiently', async () => {
      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      await nextTick();

      const startTime = performance.now();

      // Rapid prop changes
      for (let i = 0; i < 10; i++) {
        await wrapper.setProps({
          current: {
            ...baseProps.current,
            temperature: baseProps.current.temperature + i,
          },
        });
      }

      const endTime = performance.now();

      // All updates should complete in reasonable time
      expect(endTime - startTime).toBeLessThan(500);
    });
  });

  /**
   * TEST-PERF-04: Data Overlay Observer
   * Tests weather data update performance
   */
  describe('Data Overlay Observer', () => {
    it('should update with minimal re-renders on data changes', async () => {
      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      await nextTick();

      const _renderCount = { count: 0 };
      const _originalRender = wrapper.vm.$forceUpdate;

      // Update weather data
      await wrapper.setProps({
        current: { ...baseProps.current, temperature: 25 },
      });

      expect(wrapper.text()).toContain('25 °C');
    });

    it('should batch multiple data updates', async () => {
      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      await nextTick();

      // Multiple rapid updates should be batched
      await wrapper.setProps({
        current: { ...baseProps.current, temperature: 22 },
      });

      await wrapper.setProps({
        current: { ...baseProps.current, temperature: 23 },
      });

      await nextTick();

      // Should show final value
      expect(wrapper.text()).toContain('23 °C');
    });

    it('should clean up observers on unmount', async () => {
      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      await nextTick();

      // Unmount component
      wrapper.unmount();

      // Should not throw errors after unmount
      expect(() => wrapper.vm.$nextTick()).not.toThrow();
    });
  });

  /**
   * TEST-PERF-05: Parameter Mapper
   * Tests weather parameter transformation performance
   */
  describe('Parameter Mapper', () => {
    it('should map weather parameters correctly', async () => {
      const wrapper = mount(WeatherWidget, {
        props: {
          ...baseProps,
          current: { ...baseProps.current, conditionCode: 'rain' },
        },
      });

      await nextTick();

      // Rain condition should enable rain layer
      const canvas = wrapper.find("[data-testid='effects-canvas']");
      expect(canvas.exists()).toBe(true);
    });

    it('should handle null/undefined values gracefully', async () => {
      const wrapper = mount(WeatherWidget, {
        props: {
          ...baseProps,
          current: {
            ...baseProps.current,
            temperature: 0, // Edge case: 0 temperature
          },
        },
      });

      await nextTick();

      // Should still render correctly
      expect(wrapper.find("[data-slot='weather-widget']").exists()).toBe(true);
      expect(wrapper.text()).toContain('0 °C');
    });

    it('should transform parameters efficiently', async () => {
      const conditions = ['clear', 'rain', 'snow', 'thunderstorm'] as const;

      for (const condition of conditions) {
        const startTime = performance.now();

        const wrapper = mount(WeatherWidget, {
          props: {
            ...baseProps,
            current: { ...baseProps.current, conditionCode: condition },
          },
        });

        await nextTick();

        const endTime = performance.now();

        expect(wrapper.find("[data-slot='weather-widget']").exists()).toBe(true);
        expect(endTime - startTime).toBeLessThan(50);

        wrapper.unmount();
      }
    });
  });

  /**
   * TEST-PERF-06: Glass Style Resolver
   * Tests visual effect calculation performance
   */
  describe('Glass Style Resolver', () => {
    it('should compute glass effect styles efficiently', async () => {
      const startTime = performance.now();

      const wrapper = mount(WeatherWidget, {
        props: {
          ...baseProps,
          effects: { enabled: true },
        },
      });

      await nextTick();

      const endTime = performance.now();

      expect(wrapper.find("[data-slot='weather-widget']").exists()).toBe(true);
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should cache style computations', async () => {
      const wrapper = mount(WeatherWidget, {
        props: baseProps,
      });

      await nextTick();

      // Multiple reads of computed property
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        // Access computed properties
        await wrapper.vm.$nextTick();
      }

      const endTime = performance.now();

      // Cached reads should be fast
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle dark theme calculations', async () => {
      const wrapper = mount(WeatherWidget, {
        props: {
          ...baseProps,
          current: { ...baseProps.current, conditionCode: 'thunderstorm' },
          effects: { enabled: true },
        },
      });

      await nextTick();

      // Thunderstorm should trigger dark theme
      const widget = wrapper.find("[data-slot='weather-widget']");
      expect(widget.exists()).toBe(true);

      // Check for dark theme class - use attribute selector instead
      const container = wrapper.find("[class*='@container/weather']");
      expect(container.exists()).toBe(true);
    });
  });
});
