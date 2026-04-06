import { computed, ref } from 'vue';
import type { ChartProps, ChartDataPoint } from '../schema';
import type { ComputedRef, Ref } from 'vue';

export type ChartEmit = {
  (e: 'dataPointClick', point: ChartDataPoint): void;
};

export interface ChartTooltipState {
  visible: boolean;
  x: number;
  y: number;
  title: string;
  items: { label: string; value: string; color: string }[];
}

export interface ChartReturns {
  // Constants
  CHART_WIDTH: number;
  CHART_HEIGHT: number;
  MARGIN: { top: number; right: number; bottom: number; left: number };
  INNER_WIDTH: number;
  INNER_HEIGHT: number;

  // State
  tooltip: Ref<ChartTooltipState>;

  // Computed
  palette: ComputedRef<string[]>;
  seriesColors: ComputedRef<string[]>;
  allYValues: ComputedRef<number[]>;
  yMax: ComputedRef<number>;
  yTicks: ComputedRef<number[]>;

  // Actions
  yScale: (value: number) => number;
  xScaleBar: (index: number) => { bandWidth: number; barWidth: number; x: number };
  xScaleLine: (index: number) => number;
  linePathD: (seriesKey: string) => string;
  showTooltip: (event: MouseEvent, row: Record<string, unknown>, seriesIndex?: number) => void;
  moveTooltip: (event: MouseEvent) => void;
  hideTooltip: () => void;
  handleDataPointClick: (
    seriesKey: string,
    seriesLabel: string,
    payload: Record<string, unknown>,
    index: number
  ) => void;
  formatNumber: (n: number) => string;
}

const DEFAULT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

// Chart dimensions
const CHART_WIDTH = 600;
const CHART_HEIGHT = 240;
const MARGIN = { top: 8, right: 8, bottom: 40, left: 48 };
const INNER_WIDTH = CHART_WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

export function useChart(
  props: ChartProps,
  emit: ChartEmit,
): ChartReturns {

  // Computed palette
  const palette = computed(() =>
    colors?.length ? colors : DEFAULT_COLORS
  );

  // Computed series colors
  const seriesColors = computed(() =>
    series.map(
      (seriesItem, index) =>
        seriesItem.color ?? palette.value[index % palette.value.length]
    )
  );

  // Computed Y values
  const allYValues = computed(() => {
    const values: number[] = [];
    for (const row of data) {
      for (const s of series) {
        const v = row[s.key];
        if (typeof v === 'number' && Number.isFinite(v)) {
          values.push(v);
        }
      }
    }
    return values;
  });

  // Computed Y max
  const yMax = computed(() => {
    const vals = allYValues.value;
    if (vals.length === 0) return 1;
    const max = Math.max(...vals);
    return max === 0 ? 1 : max;
  });

  // Computed Y ticks
  const yTicks = computed(() => {
    const max = yMax.value;
    const count = 4;
    const ticks: number[] = [];
    for (let i = 0; i <= count; i++) {
      ticks.push((max * i) / count);
    }
    return ticks;
  });

  // Y scale function
  function yScale(value: number): number {
    return INNER_HEIGHT - (value / yMax.value) * INNER_HEIGHT;
  }

  // X scale for bar charts
  function xScaleBar(index: number) {
    const bandWidth = INNER_WIDTH / data.length;
    const groupPadding = bandWidth * 0.2;
    const innerBand = bandWidth - groupPadding;
    const barWidth = innerBand / series.length;
    const x = MARGIN.left + index * bandWidth + groupPadding / 2;
    return { bandWidth, barWidth, x };
  }

  // X scale for line charts
  function xScaleLine(index: number) {
    return MARGIN.left + (index / (data.length - 1 || 1)) * INNER_WIDTH;
  }

  // Line smoothing (monotone-like cubic bezier)
  function linePathD(seriesKey: string) {
    const points = data.map((row, i) => ({
      x: xScaleLine(i),
      y: yScale(Number(row[seriesKey]) || 0),
    }));

    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
  }

  // Tooltip state
  const tooltip = ref<ChartTooltipState>({
    visible: false,
    x: 0,
    y: 0,
    title: '',
    items: [],
  });

  function showTooltip(
    event: MouseEvent,
    row: Record<string, unknown>,
    _seriesIndex?: number
  ) {
    const target = event.currentTarget as SVGElement;
    const rect = target.getBoundingClientRect();
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left + 12,
      y: event.clientY - rect.top - 12,
      title: String(row[xKey]),
      items: series.map((s, i) => ({
        label: s.label,
        value: String(row[s.key] ?? ''),
        color: seriesColors.value[i],
      })),
    };
  }

  function moveTooltip(event: MouseEvent) {
    const target = event.currentTarget as SVGElement;
    const rect = target.getBoundingClientRect();
    tooltip.value.x = event.clientX - rect.left + 12;
    tooltip.value.y = event.clientY - rect.top - 12;
  }

  function hideTooltip() {
    tooltip.value.visible = false;
  }

  function handleDataPointClick(
    seriesKey: string,
    seriesLabel: string,
    payload: Record<string, unknown>,
    index: number
  ) {
    if (onDataPointClick) {
      onDataPointClick({
        seriesKey,
        seriesLabel,
        xValue: payload[xKey],
        yValue: payload[seriesKey],
        index,
        payload,
      });
    }
  }

  function formatNumber(n: number) {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(Math.round(n));
  }

  return {
    // Constants
    CHART_WIDTH,
    CHART_HEIGHT,
    MARGIN,
    INNER_WIDTH,
    INNER_HEIGHT,

    // State
    tooltip,

    // Computed
    palette,
    seriesColors,
    allYValues,
    yMax,
    yTicks,

    // Actions
    yScale,
    xScaleBar,
    xScaleLine,
    linePathD,
    showTooltip,
    moveTooltip,
    hideTooltip,
    handleDataPointClick,
    formatNumber,
  };
}
