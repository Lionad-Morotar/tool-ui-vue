import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import SparkLine from './cmpts/sparkline.vue';

describe('SparkLine', () => {
  describe('rendering', () => {
    test('renders svg element', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30, 40, 50],
        },
      });
      expect(wrapper.find('svg').exists()).toBe(true);
    });

    test('has correct viewBox', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          width: 100,
          height: 40,
        },
      });
      expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 100 40');
    });

    test('has aria-hidden attribute', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
        },
      });
      expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true');
    });

    test('renders polyline for data', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
        },
      });
      const polylines = wrapper.findAll('polyline');
      expect(polylines.length).toBeGreaterThanOrEqual(1);
    });

    test('renders base line with stroke-opacity', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
        },
      });
      const baseLine = wrapper.findAll('polyline').find((p) =>
        p.attributes('stroke-opacity') === '0.15'
      );
      expect(baseLine).toBeDefined();
    });

    test('renders animated line layers', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
        },
      });
      const polylines = wrapper.findAll('polyline');
      // Should have base line + 2 animated layers
      expect(polylines.length).toBe(3);
    });
  });

  describe('fill', () => {
    test('renders gradient definition when showFill is true', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          showFill: true,
        },
      });
      expect(wrapper.find('defs').exists()).toBe(true);
      expect(wrapper.find('linearGradient').exists()).toBe(true);
    });

    test('does not render gradient when showFill is false', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          showFill: false,
        },
      });
      expect(wrapper.find('defs').exists()).toBe(false);
    });

    test('renders polygon for fill area when showFill is true', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          showFill: true,
        },
      });
      expect(wrapper.find('polygon').exists()).toBe(true);
    });

    test('polygon has fill with url reference', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          showFill: true,
        },
      });
      const polygon = wrapper.find('polygon');
      expect(polygon.attributes('fill')).toMatch(/url\(#.*\)/);
    });

    test('gradient has correct stop colors', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          showFill: true,
          color: '#ff0000',
          fillOpacity: 0.2,
        },
      });
      const stops = wrapper.findAll('stop');
      expect(stops.length).toBe(2);
      expect(stops[0].attributes('stop-color')).toBe('#ff0000');
      expect(stops[0].attributes('stop-opacity')).toBe('0.2');
      expect(stops[1].attributes('stop-opacity')).toBe('0');
    });
  });

  describe('styling', () => {
    test('applies custom color to stroke', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          color: '#00ff00',
        },
      });
      const polyline = wrapper.find('polyline');
      expect(polyline.attributes('stroke')).toBe('#00ff00');
    });

    test('applies default color when not specified', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
        },
      });
      const polyline = wrapper.find('polyline');
      expect(polyline.attributes('stroke')).toBe('currentColor');
    });

    test('applies custom css.root', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          css: { root: 'my-sparkline' },
        },
      });
      expect(wrapper.find('svg').classes()).toContain('my-sparkline');
    });

    test('applies inline styles', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          style: { opacity: '0.5' },
        },
      });
      const svg = wrapper.find('svg');
      expect(svg.attributes('style')).toContain('opacity: 0.5');
    });

    test('has h-full and w-full classes', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
        },
      });
      const svg = wrapper.find('svg');
      expect(svg.classes()).toContain('h-full');
      expect(svg.classes()).toContain('w-full');
    });
  });

  describe('animation', () => {
    test('applies animation delay from style', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          style: { animationDelay: '250ms' },
        },
      });
      const animatedLines = wrapper.findAll('polyline').filter((p) =>
        p.classes().some((c) => c.includes('animate'))
      );
      expect(animatedLines.length).toBeGreaterThan(0);
    });

    test('animated lines have pathLength attribute', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
        },
      });
      const animatedLines = wrapper.findAll('polyline').filter((p) =>
        p.attributes('pathLength')
      );
      expect(animatedLines.length).toBe(2);
      animatedLines.forEach((line) => {
        expect(line.attributes('pathLength')).toBe('1');
      });
    });

    test('animated lines have stroke-dasharray', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
        },
      });
      const animatedLines = wrapper.findAll('polyline').filter((p) =>
        p.attributes('stroke-dasharray')
      );
      expect(animatedLines.length).toBe(2);
    });
  });

  describe('edge cases', () => {
    test('handles minimum data (2 points)', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20],
        },
      });
      expect(wrapper.find('svg').exists()).toBe(true);
      expect(wrapper.find('polyline').exists()).toBe(true);
    });

    test('handles large data arrays', () => {
      const data = Array.from({ length: 100 }, (_, i) => i);
      const wrapper = mount(SparkLine, {
        props: { data },
      });
      expect(wrapper.find('svg').exists()).toBe(true);
    });

    test('handles negative values', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [-50, -25, 0, 25, 50],
        },
      });
      expect(wrapper.find('svg').exists()).toBe(true);
      expect(wrapper.find('polyline').exists()).toBe(true);
    });

    test('handles all same values', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [50, 50, 50, 50],
        },
      });
      expect(wrapper.find('svg').exists()).toBe(true);
      expect(wrapper.find('polyline').exists()).toBe(true);
    });

    test('handles decimal values', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [1.5, 2.7, 3.14, 4.2],
        },
      });
      expect(wrapper.find('svg').exists()).toBe(true);
      expect(wrapper.find('polyline').exists()).toBe(true);
    });
  });

  describe('polygon points', () => {
    test('polygon has points attribute when showFill is true', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
          showFill: true,
        },
      });
      const polygon = wrapper.find('polygon');
      expect(polygon.attributes('points')).toBeTruthy();
    });

    test('polygon points include bottom corners', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20],
          width: 64,
          height: 24,
          showFill: true,
        },
      });
      const polygon = wrapper.find('polygon');
      const points = polygon.attributes('points') || '';
      // Should start at bottom-left and end at bottom-right
      expect(points).toContain('0,24');
      expect(points).toContain('64,24');
    });
  });

  describe('polyline attributes', () => {
    test('polylines have correct stroke attributes', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
        },
      });
      const polylines = wrapper.findAll('polyline');
      polylines.forEach((polyline) => {
        expect(polyline.attributes('fill')).toBe('none');
        expect(polyline.attributes('stroke-linecap')).toBe('round');
        expect(polyline.attributes('stroke-linejoin')).toBe('round');
      });
    });

    test('polylines have vector-effect attribute', () => {
      const wrapper = mount(SparkLine, {
        props: {
          data: [10, 20, 30],
        },
      });
      const polylines = wrapper.findAll('polyline');
      polylines.forEach((polyline) => {
        expect(polyline.attributes('vector-effect')).toBe('non-scaling-stroke');
      });
    });
  });
});
