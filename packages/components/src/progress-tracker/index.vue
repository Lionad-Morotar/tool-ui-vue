<script setup lang="ts">
import { cn } from '../core';
import { computed } from 'vue';
import { useProgressTracker } from './states';
import type { ProgressTrackerProps } from './schema';

defineOptions({ name: 'CmptProgressTracker', inheritAttrs: false })

const props = withDefaults(defineProps<ProgressTrackerProps>(), {
  css: () => ({}),
})

// All business logic delegated to states layer - re-create state when props change
const trackerState = computed(() => useProgressTracker({
  steps: props.steps,
  choice: props.choice,
  elapsedTime: props.elapsedTime,
}));

// Destructure for cleaner template access
const progress = computed(() => trackerState.value.progress.value);
const currentStepId = computed(() => trackerState.value.currentStepId.value);
const receiptState = computed(() => trackerState.value.receiptState.value);
const formatElapsedTime = (ms: number) => trackerState.value.formatElapsedTime(ms);
const formatElapsedTimeDateTime = (ms: number) => trackerState.value.formatElapsedTimeDateTime(ms);
</script>

<template>
  <!-- Receipt State -->
  <div
    v-if="choice && receiptState"
    v-bind="$attrs"
    :class="cn(
      'isolate flex w-full max-w-md min-w-80 flex-col',
      'text-foreground select-none',
      'motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:zoom-in-95 motion-safe:fill-mode-both motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]',
      css?.root
    )"
    data-slot="progress-tracker"
    :data-tool-ui-id="id"
    data-receipt="true"
    role="status"
    :aria-label="choice.summary"
  >
    <div class="flex w-full flex-col gap-4 rounded-2xl border border-border bg-card/60 p-5 shadow-xs">
      <div class="flex items-center justify-between">
        <!-- Elapsed Time -->
        <div v-if="elapsedTime" class="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="-mt-px size-3.5"
          >
            <line
              x1="10"
              x2="14"
              y1="2"
              y2="2"
            />
            <line
              x1="12"
              x2="15"
              y1="14"
              y2="11"
            />
            <circle cx="12" cy="14" r="8" />
          </svg>
          <time :datetime="formatElapsedTimeDateTime(elapsedTime)">
            {{ formatElapsedTime(elapsedTime) }}
          </time>
        </div>

        <!-- Outcome Badge -->
        <span :class="cn('flex items-center gap-1.5 text-xs font-medium', receiptState?.toneClass)">
          <svg
            v-if="receiptState?.icon === 'check'"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3.5"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <svg
            v-else-if="receiptState?.icon === 'alert'"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line
              x1="12"
              x2="12"
              y1="8"
              y2="12"
            />
            <line
              x1="12"
              x2="12.01"
              y1="16"
              y2="16"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3.5"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          {{ choice.summary }}
        </span>
      </div>

      <!-- Steps -->
      <ol class="m-0 flex list-none flex-col gap-2 p-0">
        <li
          v-for="(step, index) in steps"
          :key="step.id"
          :class="cn('relative -mx-2 flex items-start gap-3 rounded-lg px-2 py-1.5', css?.step)"
        >
          <div
            v-if="index < steps.length - 1"
            class="absolute top-8 left-5 w-px bg-border"
            :style="{ height: 'calc(100% + 0.5rem)' }"
            aria-hidden="true"
          />
          <div class="relative z-10">
            <!-- Pending -->
            <span
              v-if="step.status === 'pending'"
              class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card motion-safe:transition-all motion-safe:duration-200"
              aria-hidden="true"
            />
            <!-- In Progress -->
            <span
              v-else-if="step.status === 'in-progress'"
              class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-[0_0_0_4px_hsl(var(--primary)/0.1)] motion-safe:transition-all motion-safe:duration-300"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-5 text-primary motion-safe:animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </span>
            <!-- Completed -->
            <span
              v-else-if="step.status === 'completed'"
              class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground shadow-sm motion-safe:duration-300 motion-safe:ease-out"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both size-4 motion-safe:delay-75 motion-safe:duration-200"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <!-- Failed -->
            <span
              v-else-if="step.status === 'failed'"
              class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 flex size-6 shrink-0 items-center justify-center rounded-full border border-destructive bg-destructive text-white shadow-sm motion-safe:duration-300 motion-safe:ease-out dark:border-red-600 dark:bg-red-600"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both size-4 motion-safe:delay-75 motion-safe:duration-200"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </span>
          </div>

          <div class="flex flex-1 flex-col gap-0.5">
            <span class="text-sm leading-6 font-medium">{{ step.label }}</span>
            <span v-if="step.description" class="text-sm text-muted-foreground">{{ step.description }}</span>
          </div>
        </li>
      </ol>
    </div>
  </div>

  <!-- Live State -->
  <article
    v-else
    v-bind="$attrs"
    :class="cn(
      'isolate flex w-full max-w-md min-w-80 flex-col gap-3',
      'text-foreground select-none',
      css?.root
    )"
    data-slot="progress-tracker"
    :data-tool-ui-id="id"
    role="status"
    aria-live="polite"
    :aria-busy="progress.inProgress > 0"
  >
    <div class="flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs">
      <!-- Elapsed Time -->
      <div v-if="elapsedTime" class="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="-mt-px size-3.5"
        >
          <line
            x1="10"
            x2="14"
            y1="2"
            y2="2"
          />
          <line
            x1="12"
            x2="15"
            y1="14"
            y2="11"
          />
          <circle cx="12" cy="14" r="8" />
        </svg>
        <time :datetime="formatElapsedTimeDateTime(elapsedTime)">
          {{ formatElapsedTime(elapsedTime) }}
        </time>
      </div>

      <!-- Steps -->
      <ol class="m-0 flex list-none flex-col gap-3 p-0">
        <li
          v-for="(step, index) in steps"
          :key="step.id"
          :class="cn('relative -mx-2', css?.step)"
          :aria-current="step.id === currentStepId ? 'step' : undefined"
        >
          <!-- Connector Line -->
          <div
            v-if="index < steps.length - 1"
            :class="cn(
              'absolute top-6 left-5 w-px bg-border',
              'motion-safe:transition-all motion-safe:duration-300',
            )"
            :style="{ height: 'calc(100% + 0.25rem)' }"
            aria-hidden="true"
          />

          <div
            :class="cn(
              'relative z-10 flex items-start gap-3 rounded-lg px-2 py-1.5',
              'motion-safe:transition-all motion-safe:duration-300',
              step.id === currentStepId && 'bg-primary/5',
            )"
            :style="{ backdropFilter: step.id === currentStepId ? 'blur(2px)' : undefined }"
          >
            <div class="relative z-10">
              <!-- Pending -->
              <span
                v-if="step.status === 'pending'"
                class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card motion-safe:transition-all motion-safe:duration-200"
                aria-hidden="true"
              />
              <!-- In Progress -->
              <span
                v-else-if="step.status === 'in-progress'"
                class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-[0_0_0_4px_hsl(var(--primary)/0.1)] motion-safe:transition-all motion-safe:duration-300"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-5 text-primary motion-safe:animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </span>
              <!-- Completed -->
              <span
                v-else-if="step.status === 'completed'"
                class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground shadow-sm motion-safe:duration-300 motion-safe:ease-out"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both size-4 motion-safe:delay-75 motion-safe:duration-200"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <!-- Failed -->
              <span
                v-else-if="step.status === 'failed'"
                class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 flex size-6 shrink-0 items-center justify-center rounded-full border border-destructive bg-destructive text-white shadow-sm motion-safe:duration-300 motion-safe:ease-out dark:border-red-600 dark:bg-red-600"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both size-4 motion-safe:delay-75 motion-safe:duration-200"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </span>
            </div>

            <div class="flex flex-1 flex-col">
              <span
                :class="cn(
                  'text-sm leading-6 font-medium',
                  step.status === 'pending' && 'text-muted-foreground',
                  step.status === 'in-progress' && 'motion-safe:shimmer shimmer-invert text-foreground',
                )"
              >
                {{ step.label }}
              </span>
              <div
                v-if="step.description"
                :class="cn(
                  'grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-300 motion-safe:ease-out',
                  (step.status === 'in-progress' || step.status === 'failed')
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0',
                )"
                :aria-hidden="!(step.status === 'in-progress' || step.status === 'failed')"
              >
                <div class="overflow-hidden">
                  <span class="block pt-0.5 text-sm text-muted-foreground">
                    {{ step.description }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </article>
</template>
