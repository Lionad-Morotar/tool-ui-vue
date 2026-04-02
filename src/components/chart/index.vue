<script setup lang="ts">
import { computed, ref } from 'vue';
import { cn } from '../../utils';
import type { ChartProps, ChartDataPoint } from './schema';

defineOptions({ name: 'cmpt-chart', inheritAttrs: false })

const props = withDefaults(defineProps<ChartProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  dataPointClick: [point: ChartDataPoint];
}>();

const DEFAULT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const palette = computed(() =>
  props.colors?.length ? props.colors : DEFAULT_COLORS
);

const seriesColors = computed(() =>
  props.series.map(
    (seriesItem, index) =>
      seriesItem.color ?? palette.value[index % palette.value.length]
  )
);

function handleDataPointClick(
  seriesKey: string,
  seriesLabel: string,
  payload: Record<string, unknown>,
  index: number
) {
  emit('dataPointClick', {
    seriesKey,
    seriesLabel,
    xValue: payload[props.xKey],
    yValue: payload[seriesKey],
    index,
    payload,
  });
}

// Chart dimensions
const CHART_WIDTH = 600;
const CHART_HEIGHT = 240;
const MARGIN = { top: 8, right: 8, bottom: 40, left: 48 };
const INNER_WIDTH = CHART_WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

const allYValues = computed(() => {
  const values: number[] = [];
  for (const row of props.data) {
    for (const s of props.series) {
      const v = row[s.key];
      if (typeof v === 'number' && Number.isFinite(v)) {
        values.push(v);
      }
    }
  }
  return values;
});

const yMax = computed(() => {
  const vals = allYValues.value;
  if (vals.length === 0) return 1;
  const max = Math.max(...vals);
  return max === 0 ? 1 : max;
});

const yTicks = computed(() => {
  const max = yMax.value;
  const count = 4;
  const ticks: number[] = [];
  for (let i = 0; i <= count; i++) {
    ticks.push((max * i) / count);
  }
  return ticks;
});

function yScale(value: number) {
  return INNER_HEIGHT - (value / yMax.value) * INNER_HEIGHT;
}

function xScaleBar(index: number) {
  const bandWidth = INNER_WIDTH / props.data.length;
  const groupPadding = bandWidth * 0.2;
  const innerBand = bandWidth - groupPadding;
  const barWidth = innerBand / props.series.length;
  const x = MARGIN.left + index * bandWidth + groupPadding / 2;
  return { bandWidth, barWidth, x };
}

function xScaleLine(index: number) {
  return MARGIN.left + (index / (props.data.length - 1 || 1)) * INNER_WIDTH;
}

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
}

// Line smoothing (monotone-like cubic bezier)
function linePathD(seriesKey: string) {
  const points = props.data.map((row, i) => ({
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
const tooltip = ref<{
  visible: boolean;
  x: number;
  y: number;
  title: string;
  items: { label: string; value: string; color: string }[];
}>({
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
    title: String(row[props.xKey]),
    items: props.series.map((s, i) => ({
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
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn('relative w-full min-w-80', css?.root)"
    data-slot="chart"
    :data-tool-ui-id="id"
  >
    <div
      :class="
        cn(
          'group relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-xl',
          'border border-border bg-card text-sm shadow-xs'
        )
      "
    >
      <!-- Header -->
      <div
        v-if="title || description"
        class="border-b px-4 pt-4 pb-3"
      >
        <h3
          v-if="title"
          class="text-[15px] leading-tight font-semibold tracking-tight"
        >
          {{ title }}
        </h3>
        <p
          v-if="description"
          class="mt-1 text-sm leading-snug text-muted-foreground"
        >
          {{ description }}
        </p>
      </div>

      <!-- Content -->
      <div class="relative p-4">
        <svg
          class="h-auto w-full"
          :viewBox="`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`"
          role="img"
          aria-label="chart"
        >
          <!-- Grid lines -->
          <template v-if="showGrid !== false">
            <line
              v-for="(tick, i) in yTicks"
              :key="`grid-${i}`"
              class="grid-line text-muted-foreground/20"
              :x1="MARGIN.left"
              :y1="MARGIN.top + yScale(tick)"
              :x2="MARGIN.left + INNER_WIDTH"
              :y2="MARGIN.top + yScale(tick)"
              stroke="currentColor"
              stroke-width="1"
              stroke-dasharray="3,3"
            />
          </template>

          <!-- Y-axis labels -->
          <text
            v-for="(tick, i) in yTicks"
            :key="`y-label-${i}`"
            class="y-axis-label fill-muted-foreground text-xs"
            :x="MARGIN.left - 8"
            :y="MARGIN.top + yScale(tick) + 4"
            text-anchor="end"
          >
            {{ formatNumber(tick) }}
          </text>

          <!-- Bars -->
          <template v-if="type === 'bar'">
            <g
              v-for="(row, rowIndex) in data"
              :key="`group-${rowIndex}`"
            >
              <rect
                v-for="(s, sIndex) in series"
                :key="`bar-${rowIndex}-${sIndex}`"
                class="transition-opacity hover:opacity-80"
                :x="
                  xScaleBar(rowIndex).x + sIndex * xScaleBar(rowIndex).barWidth
                "
                :y="MARGIN.top + yScale(Number(row[s.key]) || 0)"
                :width="Math.max(1, xScaleBar(rowIndex).barWidth - 4)"
                :height="INNER_HEIGHT - yScale(Number(row[s.key]) || 0)"
                :fill="seriesColors[sIndex]"
                rx="4"
                ry="4"
                :cursor="onDataPointClick ? 'pointer' : undefined"
                @mouseenter="showTooltip($event, row, sIndex)"
                @mousemove="moveTooltip"
                @mouseleave="hideTooltip"
                @click="handleDataPointClick(s.key, s.label, row, rowIndex)"
              />
            </g>
          </template>

          <!-- Lines -->
          <template v-if="type === 'line'">
            <path
              v-for="(s, sIndex) in series"
              :key="`line-${s.key}`"
              class="chart-line"
              fill="none"
              :stroke="seriesColors[sIndex]"
              stroke-width="2"
              :d="linePathD(s.key)"
            />

            <circle
              v-for="item in data.flatMap((row, rowIndex) =>
                series.map((s, sIndex) => ({ row, rowIndex, s, sIndex }))
              )"
              :key="`dot-${item.rowIndex}-${item.sIndex}`"
              class="chart-dot hover:r-6 transition-all"
              :cx="xScaleLine(item.rowIndex)"
              :cy="MARGIN.top + yScale(Number(item.row[item.s.key]) || 0)"
              r="4"
              :fill="seriesColors[item.sIndex]"
              :cursor="onDataPointClick ? 'pointer' : undefined"
              @mouseenter="showTooltip($event, item.row, item.sIndex)"
              @mousemove="moveTooltip"
              @mouseleave="hideTooltip"
              @click="
                handleDataPointClick(
                  item.s.key,
                  item.s.label,
                  item.row,
                  item.rowIndex
                )
              "
            />
          </template>

          <!-- X-axis labels -->
          <text
            v-for="(row, i) in data"
            :key="`x-label-${i}`"
            class="x-axis-label fill-muted-foreground text-xs"
            :x="
              type === 'bar'
                ? xScaleBar(i).x + xScaleBar(i).barWidth * (series.length / 2)
                : xScaleLine(i)
            "
            :y="CHART_HEIGHT - 10"
            text-anchor="middle"
          >
            {{ String(row[xKey]).slice(0, 8) }}
          </text>
        </svg>

        <!-- Tooltip -->
        <div
          v-if="tooltip.visible"
          data-testid="chart-tooltip"
          class="pointer-events-none absolute z-10 min-w-[120px] rounded border bg-background px-2 py-1.5 text-xs shadow"
          :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
        >
          <div class="mb-1 font-medium">{{ tooltip.title }}</div>
          <div class="flex flex-col gap-0.5">
            <div
              v-for="item in tooltip.items"
              :key="item.label"
              class="flex items-center gap-1.5"
            >
              <span
                class="size-2 rounded-full"
                :style="{ backgroundColor: item.color }"
              />
              <span class="text-muted-foreground">{{ item.label }}:</span>
              <span class="font-medium">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div
          v-if="showLegend && series.length > 0"
          data-testid="chart-legend"
          class="mt-4 flex flex-wrap items-center justify-center gap-4"
        >
          <div
            v-for="(s, sIndex) in series"
            :key="`legend-${s.key}`"
            class="flex items-center gap-1.5"
          >
            <div
              class="size-2 rounded-full"
              :style="{ backgroundColor: seriesColors[sIndex] }"
            />
            <span class="text-xs text-muted-foreground">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
