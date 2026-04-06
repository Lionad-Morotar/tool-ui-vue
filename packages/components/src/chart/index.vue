<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { reactive } from 'vue';
import { useChart } from './states';
import type { ChartProps } from './schema';

defineOptions({ name: 'CmptChart', inheritAttrs: false })

const props = withDefaults(defineProps<ChartProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  dataPointClick: [point: { seriesKey: string; seriesLabel: string; xValue: unknown; yValue: unknown; index: number; payload: Record<string, unknown> }];
}>();

// All business logic delegated to states layer
const chartState = reactive(useChart(props, emit));

// Destructure constants for template
const { CHART_WIDTH, CHART_HEIGHT, MARGIN, INNER_WIDTH, INNER_HEIGHT } = chartState;
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
              v-for="(tick, i) in chartState.yTicks"
              :key="`grid-${i}`"
              class="grid-line text-muted-foreground/20"
              :x1="MARGIN.left"
              :y1="MARGIN.top + chartState.yScale(tick)"
              :x2="MARGIN.left + INNER_WIDTH"
              :y2="MARGIN.top + chartState.yScale(tick)"
              stroke="currentColor"
              stroke-width="1"
              stroke-dasharray="3,3"
            />
          </template>

          <!-- Y-axis labels -->
          <text
            v-for="(tick, i) in chartState.yTicks"
            :key="`y-label-${i}`"
            class="y-axis-label fill-muted-foreground text-xs"
            :x="MARGIN.left - 8"
            :y="MARGIN.top + chartState.yScale(tick) + 4"
            text-anchor="end"
          >
            {{ chartState.formatNumber(tick) }}
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
                  chartState.xScaleBar(rowIndex).x + sIndex * chartState.xScaleBar(rowIndex).barWidth
                "
                :y="MARGIN.top + chartState.yScale(Number(row[s.key]) || 0)"
                :width="Math.max(1, chartState.xScaleBar(rowIndex).barWidth - 4)"
                :height="INNER_HEIGHT - chartState.yScale(Number(row[s.key]) || 0)"
                :fill="chartState.seriesColors[sIndex]"
                rx="4"
                ry="4"
                :cursor="onDataPointClick ? 'pointer' : undefined"
                @mouseenter="chartState.showTooltip($event, row, sIndex)"
                @mousemove="chartState.moveTooltip"
                @mouseleave="chartState.hideTooltip"
                @click="chartState.handleDataPointClick(s.key, s.label, row, rowIndex)"
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
              :stroke="chartState.seriesColors[sIndex]"
              stroke-width="2"
              :d="chartState.linePathD(s.key)"
            />

            <circle
              v-for="item in data.flatMap((row, rowIndex) =>
                series.map((s, sIndex) => ({ row, rowIndex, s, sIndex }))
              )"
              :key="`dot-${item.rowIndex}-${item.sIndex}`"
              class="chart-dot hover:r-6 transition-all"
              :cx="chartState.xScaleLine(item.rowIndex)"
              :cy="MARGIN.top + chartState.yScale(Number(item.row[item.s.key]) || 0)"
              r="4"
              :fill="chartState.seriesColors[item.sIndex]"
              :cursor="onDataPointClick ? 'pointer' : undefined"
              @mouseenter="chartState.showTooltip($event, item.row, item.sIndex)"
              @mousemove="chartState.moveTooltip"
              @mouseleave="chartState.hideTooltip"
              @click="
                chartState.handleDataPointClick(
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
                ? chartState.xScaleBar(i).x + chartState.xScaleBar(i).bandWidth * (series.length / 2)
                : chartState.xScaleLine(i)
            "
            :y="CHART_HEIGHT - 10"
            text-anchor="middle"
          >
            {{ String(row[xKey]).slice(0, 8) }}
          </text>
        </svg>

        <!-- Tooltip -->
        <div
          v-if="chartState.tooltip.visible"
          data-testid="chart-tooltip"
          class="pointer-events-none absolute z-10 min-w-[120px] rounded border bg-background px-2 py-1.5 text-xs shadow"
          :style="{ left: `${chartState.tooltip.x}px`, top: `${chartState.tooltip.y}px` }"
        >
          <div class="mb-1 font-medium">{{ chartState.tooltip.title }}</div>
          <div class="flex flex-col gap-0.5">
            <div
              v-for="item in chartState.tooltip.items"
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
              :style="{ backgroundColor: chartState.seriesColors[sIndex] }"
            />
            <span class="text-xs text-muted-foreground">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
