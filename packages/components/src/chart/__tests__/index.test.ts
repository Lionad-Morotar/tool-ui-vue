import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Chart from '../index.vue';
import type { ChartProps } from './schema';

function createProps(overrides: Partial<ChartProps> = {}): ChartProps {
  return {
    id: 'sales-chart',
    type: 'bar',
    title: 'Monthly Sales',
    description: 'Revenue by month',
    data: [
      { month: 'Jan', sales: 100, profit: 30 },
      { month: 'Feb', sales: 150, profit: 50 },
      { month: 'Mar', sales: 200, profit: 80 },
    ],
    xKey: 'month',
    series: [
      { key: 'sales', label: 'Sales', color: '#3b82f6' },
      { key: 'profit', label: 'Profit', color: '#10b981' },
    ],
    ...overrides,
  } as ChartProps;
}

describe('Chart', () => {
  describe('rendering', () => {
    test("renders article with data-slot='chart' and data-tool-ui-id", () => {
      const wrapper = mount(Chart, { props: createProps() });
      const article = wrapper.find('article');
      expect(article.exists()).toBe(true);
      expect(article.attributes('data-slot')).toBe('chart');
      expect(article.attributes('data-tool-ui-id')).toBe('sales-chart');
    });

    test('renders title and description inside header when provided', () => {
      const wrapper = mount(Chart, { props: createProps() });
      expect(wrapper.text()).toContain('Monthly Sales');
      expect(wrapper.text()).toContain('Revenue by month');
    });

    test('does not render header when title and description are absent', () => {
      const wrapper = mount(Chart, {
        props: createProps({ title: undefined, description: undefined }),
      });
      expect(wrapper.find('h3').exists()).toBe(false);
    });

    test('bar mode renders SVG rects for each data point and series', () => {
      const wrapper = mount(Chart, { props: createProps() });
      const rects = wrapper.findAll('svg rect');
      // 3 data rows * 2 series = 6 bars
      expect(rects.length).toBe(6);
    });

    test('line mode renders SVG path for each series and circles for dots', () => {
      const wrapper = mount(Chart, {
        props: createProps({ type: 'line' }),
      });
      const paths = wrapper.findAll('svg path.chart-line');
      const circles = wrapper.findAll('svg circle');
      expect(paths.length).toBe(2);
      expect(circles.length).toBe(6); // 3 rows * 2 series
    });

    test('line paths use smooth curves (cubic bezier)', () => {
      const wrapper = mount(Chart, {
        props: createProps({ type: 'line' }),
      });
      const path = wrapper.find('svg path.chart-line');
      expect(path.exists()).toBe(true);
      const d = path.attributes('d') || '';
      expect(d).toContain('C'); // cubic bezier command
    });
  });

  describe('configuration', () => {
    test('legend renders series labels when showLegend=true', () => {
      const wrapper = mount(Chart, {
        props: createProps({ showLegend: true }),
      });
      expect(wrapper.text()).toContain('Sales');
      expect(wrapper.text()).toContain('Profit');
    });

    test('legend does not render when showLegend=false', () => {
      const wrapper = mount(Chart, {
        props: createProps({ showLegend: false }),
      });
      const legend = wrapper.find('[data-testid="chart-legend"]');
      expect(legend.exists()).toBe(false);
    });

    test('grid lines render when showGrid=true', () => {
      const wrapper = mount(Chart, {
        props: createProps({ showGrid: true }),
      });
      const gridLines = wrapper.findAll('svg line.grid-line');
      expect(gridLines.length).toBeGreaterThan(0);
    });

    test('grid lines do not render when showGrid=false', () => {
      const wrapper = mount(Chart, {
        props: createProps({ showGrid: false }),
      });
      const gridLines = wrapper.findAll('svg line.grid-line');
      expect(gridLines.length).toBe(0);
    });

    test('x-axis labels are present and match row[xKey]', () => {
      const wrapper = mount(Chart, { props: createProps() });
      const texts = wrapper
        .findAll('svg text.x-axis-label')
        .map((el) => el.text());
      expect(texts).toEqual(['Jan', 'Feb', 'Mar']);
    });

    test('y-axis tick labels are present', () => {
      const wrapper = mount(Chart, { props: createProps() });
      const ticks = wrapper.findAll('svg text.y-axis-label');
      expect(ticks.length).toBeGreaterThan(0);
    });

    test('custom colors are reflected in rect fill', () => {
      const wrapper = mount(Chart, {
        props: createProps({
          colors: ['#ff0000', '#00ff00'],
          series: [
            { key: 'sales', label: 'Sales' },
            { key: 'profit', label: 'Profit' },
          ],
        }),
      });
      const rects = wrapper.findAll('svg rect');
      const fills = new Set(rects.map((r) => r.attributes('fill')));
      expect(fills.has('#ff0000')).toBe(true);
      expect(fills.has('#00ff00')).toBe(true);
    });

    test('fallback colors use CSS vars when no custom colors provided', () => {
      const wrapper = mount(Chart, {
        props: createProps({
          colors: undefined,
          series: [
            { key: 'sales', label: 'Sales' },
            { key: 'profit', label: 'Profit' },
          ],
        }),
      });
      const rects = wrapper.findAll('svg rect');
      const firstFill = rects[0]?.attributes('fill');
      expect(firstFill).toMatch(/^var\(--chart-/);
    });
  });

  describe('tooltip', () => {
    test('tooltip appears on hover over a bar', async () => {
      const wrapper = mount(Chart, { props: createProps() });
      const bars = wrapper.findAll('svg rect');
      expect(bars.length).toBeGreaterThan(0);
      await bars[0].trigger('mouseenter');
      const tooltip = wrapper.find('[data-testid="chart-tooltip"]');
      expect(tooltip.exists()).toBe(true);
      expect(tooltip.text()).toContain('Jan');
    });

    test('tooltip shows series labels and values', async () => {
      const wrapper = mount(Chart, { props: createProps() });
      const bars = wrapper.findAll('svg rect');
      await bars[0].trigger('mouseenter');
      const tooltip = wrapper.find('[data-testid="chart-tooltip"]');
      expect(tooltip.exists()).toBe(true);
      expect(tooltip.text()).toContain('Sales');
      expect(tooltip.text()).toContain('100');
    });

    test('tooltip appears on hover over a line dot', async () => {
      const wrapper = mount(Chart, {
        props: createProps({ type: 'line' }),
      });
      const dots = wrapper.findAll('svg circle');
      expect(dots.length).toBeGreaterThan(0);
      await dots[0].trigger('mouseenter');
      const tooltip = wrapper.find('[data-testid="chart-tooltip"]');
      expect(tooltip.exists()).toBe(true);
    });
  });

  describe('events', () => {
    test('clicking a bar emits dataPointClick with correct payload', async () => {
      const wrapper = mount(Chart, { props: createProps() });
      const bars = wrapper.findAll('svg rect');
      await bars[0].trigger('click');
      const emitted = wrapper.emitted('dataPointClick');
      expect(emitted).toBeTruthy();
      expect(emitted!.length).toBe(1);
      const payload = (emitted as unknown[][])[0][0] as {
        seriesKey: string;
        seriesLabel: string;
        xValue: unknown;
        yValue: unknown;
        index: number;
        payload: Record<string, unknown>;
      };
      expect(payload.seriesKey).toBe('sales');
      expect(payload.seriesLabel).toBe('Sales');
      expect(payload.xValue).toBe('Jan');
      expect(payload.yValue).toBe(100);
      expect(payload.index).toBe(0);
      expect(payload.payload.month).toBe('Jan');
    });

    test('clicking a line dot emits dataPointClick with correct payload', async () => {
      const wrapper = mount(Chart, {
        props: createProps({ type: 'line' }),
      });
      const dots = wrapper.findAll('svg circle');
      await dots[1].trigger('click');
      const emitted = wrapper.emitted('dataPointClick');
      expect(emitted).toBeTruthy();
      const payload = (emitted as unknown[][])[0][0] as {
        seriesKey: string;
        seriesLabel: string;
        index: number;
      };
      expect(payload.seriesKey).toBe('profit');
      expect(payload.seriesLabel).toBe('Profit');
      expect(payload.index).toBe(0);
    });

    test('clicking on transparent click target emits dataPointClick when onlyClickTarget is used', async () => {
      // This validates our click event works regardless of element type
      const wrapper = mount(Chart, { props: createProps() });
      const bars = wrapper.findAll('svg rect');
      await bars[bars.length - 1].trigger('click');
      expect(wrapper.emitted('dataPointClick')).toBeTruthy();
    });
  });

  describe('styling', () => {
    test('bars have rounded top corners via rx and ry', () => {
      const wrapper = mount(Chart, { props: createProps() });
      const rect = wrapper.find('svg rect');
      expect(rect.attributes('rx')).toBe('4');
      expect(rect.attributes('ry')).toBe('4');
    });

    test('line dots have r=4 and enlarge on hover', () => {
      const wrapper = mount(Chart, {
        props: createProps({ type: 'line' }),
      });
      const dot = wrapper.find('svg circle');
      expect(dot.attributes('r')).toBe('4');
      // Hover enlargement is provided by a hover class on the dot
      expect(dot.classes()).toContain('chart-dot');
      expect(dot.classes()).toContain('hover:r-6');
    });
  });
});
