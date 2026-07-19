<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../../core';
import type { SparklineProps } from '../schema';

defineOptions({ name: 'CmptSparkline', inheritAttrs: false })

const props = withDefaults(defineProps<SparklineProps>(), {
  color: 'currentColor',
  width: 64,
  height: 24,
  css: () => ({}),
  style: undefined,
  showFill: false,
  fillOpacity: 0.09,
});

// Generate unique gradient ID
const gradientId = computed(() => `sparkline-gradient-${Math.random().toString(36).slice(2, 11)}`);

const linePointsString = computed(() => {
  if (props.data.length < 2) return '';

  const minVal = Math.min(...props.data);
  const maxVal = Math.max(...props.data);
  const range = maxVal - minVal || 1;

  const padding = 0;
  const usableWidth = props.width;
  const usableHeight = props.height;

  const linePoints = props.data.map((value, index) => {
    const x = padding + (index / (props.data.length - 1)) * usableWidth;
    const y = padding + usableHeight - ((value - minVal) / range) * usableHeight;
    return { x, y };
  });

  return linePoints.map((p) => `${p.x},${p.y}`).join(' ');
});

const areaPointsString = computed(() => {
  if (props.data.length < 2) return '';

  const minVal = Math.min(...props.data);
  const maxVal = Math.max(...props.data);
  const range = maxVal - minVal || 1;

  const padding = 0;
  const usableWidth = props.width;
  const usableHeight = props.height;

  const linePoints = props.data.map((value, index) => {
    const x = padding + (index / (props.data.length - 1)) * usableWidth;
    const y = padding + usableHeight - ((value - minVal) / range) * usableHeight;
    return { x, y };
  });

  return [
    `${padding},${props.height}`,
    ...linePoints.map((p) => `${p.x},${p.y}`),
    `${props.width - padding},${props.height}`,
  ].join(' ');
});

const animationDelay = computed(() => {
  const raw = props.style?.animationDelay;
  if (raw === undefined || raw === null) return '0ms';
  return typeof raw === 'number' ? `${raw}ms` : String(raw);
});

const baseAnimationDelay = animationDelay;
const secondaryAnimationDelay = computed(() => `calc(${baseAnimationDelay.value} + 100ms)`);
</script>

<template>
  <svg
    v-bind="$attrs"
    :viewBox="`0 0 ${width} ${height}`"
    aria-hidden="true"
    :class="cn('size-full shrink-0', css?.root)"
    :style="style"
    preserveAspectRatio="none"
  >
    <defs v-if="showFill">
      <linearGradient
        :id="gradientId"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop offset="0%" :stop-color="color" :stop-opacity="fillOpacity" />
        <stop offset="100%" :stop-color="color" :stop-opacity="0" />
      </linearGradient>
    </defs>
    <polygon
      v-if="showFill"
      :points="areaPointsString"
      :fill="`url(#${gradientId})`"
      class="animate-in fade-in fill-mode-both duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :style="{ animationDelay: baseAnimationDelay }"
    />
    <!-- Base line -->
    <polyline
      :points="linePointsString"
      fill="none"
      :stroke="color"
      stroke-width="1"
      stroke-opacity="0.15"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
    <!-- Animated line layer 1 -->
    <polyline
      :points="linePointsString"
      fill="none"
      :stroke="color"
      stroke-width="0.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
      pathLength="1"
      stroke-dasharray="0.36 0.64"
      stroke-dashoffset="0"
      stroke-opacity="0.2"
      class="motion-safe:animate-in motion-safe:fade-in motion-safe:fill-mode-both opacity-0 motion-safe:duration-700 motion-safe:ease-out"
      :style="{ animationDelay: baseAnimationDelay }"
    />
    <!-- Animated line layer 2 -->
    <polyline
      :points="linePointsString"
      fill="none"
      :stroke="color"
      stroke-width="0.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
      pathLength="1"
      stroke-dasharray="0.24 0.76"
      stroke-dashoffset="0"
      stroke-opacity="0.65"
      class="motion-safe:animate-in motion-safe:fade-in motion-safe:fill-mode-both opacity-0 motion-safe:duration-500 motion-safe:ease-out"
      :style="{ animationDelay: secondaryAnimationDelay }"
    />
  </svg>
</template>
