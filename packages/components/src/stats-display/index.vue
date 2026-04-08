<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { reactive } from 'vue';
import Sparkline from './cmpts/sparkline.vue';
import { useStatsDisplay } from './states';
import type { StatsDisplayProps } from './schema';

defineOptions({ name: 'CmptStatsDisplay', inheritAttrs: false })

const props = withDefaults(defineProps<StatsDisplayProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

// All business logic delegated to states layer
const state = reactive(useStatsDisplay(props));
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn(
      'w-full max-w-xl min-w-80',
      state.isSingle && 'max-w-sm',
      css?.root
    )"
    data-slot="stats-display"
    :data-tool-ui-id="props.id"
    lang="en"
    aria-busy="false"
  >
    <div
      :class="cn(
        'overflow-clip rounded-2xl border border-border bg-card !pt-2 !pb-0 shadow-sm',
        state.hasHeader && '!gap-0'
      )"
    >
      <!-- Header -->
      <div
        v-if="state.hasHeader"
        class="border-b border-border px-6 pt-3 pb-4"
      >
        <h2 v-if="title" class="text-base font-semibold text-pretty">{{ title }}</h2>
        <p v-if="description" class="text-sm text-pretty text-muted-foreground">{{ description }}</p>
      </div>

      <!-- Stats Grid -->
      <div class="@container overflow-hidden p-0">
        <div
          class="grid @[440px]:-mt-px @[440px]:-ml-px"
          :style="{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }"
        >
          <div
            v-for="(stat, index) in stats"
            :key="stat.key"
            :class="cn(
              'overflow-clip py-3 first:pt-0 @[440px]:border-t @[440px]:border-l @[440px]:border-border @[440px]:py-3 @[440px]:first:pt-3',
              index > 0 && 'border-t border-border'
            )"
          >
            <div
              :class="cn(
                'relative flex min-h-28 flex-col gap-1 px-6',
                state.isSingle ? 'justify-center' : 'justify-end'
              )"
            >
              <!-- SparkLine -->
              <sparkline
                v-if="stat.sparkline"
                :data="stat.sparkline.data"
                :color="stat.sparkline.color || 'var(--muted-foreground)'"
                :show-fill="true"
                :fill-opacity="0.09"
                class="animate-in fade-in slide-in-from-bottom-12 fill-mode-both pointer-events-none absolute inset-x-0 top-2 bottom-2 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                :style="{ animationDelay: `${index * 175}ms` }"
              />

              <!-- Label -->
              <span
                class="animate-in fade-in slide-in-from-bottom-1 fill-mode-both relative text-xs font-normal text-muted-foreground opacity-90 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                :style="{ animationDelay: `${index * 175 + 75}ms` }"
              >
                {{ stat.label }}
              </span>

              <!-- Value and Diff -->
              <div
                class="animate-in fade-in slide-in-from-bottom-2 fill-mode-both relative flex flex-wrap items-baseline gap-x-1.5 pb-2 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                :style="{ animationDelay: `${index * 175 + 150}ms` }"
              >
                <span
                  :class="cn(
                    'font-light tracking-normal',
                    state.isSingle ? 'text-5xl' : 'text-3xl'
                  )"
                >
                  <!-- number compact -->
                  <span
                    v-if="stat.format?.kind === 'number' && stat.format?.compact"
                    class="font-light tabular-nums"
                    :aria-label="state.formatCompactFullNumber(Number(stat.value))"
                  >
                    <template
                      v-for="(part, i) in state.formatCompactNumberParts(Number(stat.value), stat.format.decimals ?? 0)"
                      :key="i"
                    >
                      <span
                        v-if="part.type === 'compact'"
                        class="ml-0.5 text-[0.65em] opacity-80"
                        aria-hidden="true"
                      >
                        {{ part.value }}
                      </span>
                      <span v-else>{{ part.value }}</span>
                    </template>
                  </span>

                  <!-- currency -->
                  <span
                    v-else-if="stat.format?.kind === 'currency'"
                    class="font-light tabular-nums"
                    :aria-label="state.formatCurrencySpoken(Number(stat.value), stat.format.currency, stat.format.decimals ?? 2)"
                  >
                    {{ state.formatCurrency(Number(stat.value), stat.format.currency, stat.format.decimals ?? 2) }}
                  </span>

                  <!-- percent -->
                  <span
                    v-else-if="stat.format?.kind === 'percent'"
                    class="font-light tabular-nums"
                    :aria-label="`${state.formatPercent(Number(stat.value), stat.format.decimals ?? 2, stat.format.basis ?? 'fraction')} percent`"
                  >
                    {{ state.formatPercent(Number(stat.value), stat.format.decimals ?? 2, stat.format.basis ?? 'fraction') }}
                    <span class="ml-0.5 text-[0.65em] opacity-80" aria-hidden="true">%</span>
                  </span>

                  <!-- default text / number -->
                  <span v-else class="font-light tabular-nums">
                    <template v-if="stat.format?.kind === 'number'">
                      {{ state.formatNumber(Number(stat.value), stat.format.decimals ?? 0) }}
                    </template>
                    <template v-else>
                      {{ String(stat.value) }}
                    </template>
                  </span>
                </span>

                <!-- Diff -->
                <span
                  v-if="stat.diff"
                  :class="cn(
                    'inline-flex items-center gap-0.5 text-sm font-medium tabular-nums',
                    state.deltaColorClasses(stat.diff)
                  )"
                >
                  <span v-if="state.deltaArrow(stat.diff)" class="text-[0.9em]">{{ state.deltaArrow(stat.diff) }}</span>
                  {{ state.deltaDisplay(stat.diff) }}
                  <span v-if="stat.diff.label" class="font-normal text-muted-foreground">{{ stat.diff.label }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
