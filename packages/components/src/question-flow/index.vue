<script setup lang="ts">
import { cn } from '@lionad/core';
import { reactive } from 'vue';
import { useQuestionFlow } from './states';
import type { QuestionFlowProps } from './schema';

defineOptions({ name: 'CmptQuestionFlow', inheritAttrs: false })

const props = withDefaults(defineProps<QuestionFlowProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  select: [optionIds: string[]];
  back: [];
  stepChange: [stepId: string];
  complete: [answers: Record<string, string[]>];
}>();

// All business logic delegated to states layer
const state = reactive(useQuestionFlow({
  props,
  emit: {
    select: (ids: string[]) => (emit as (n: string, ...a: unknown[]) => void)('select', ids),
    back: () => (emit as (n: string, ...a: unknown[]) => void)('back'),
    stepChange: (id: string) => (emit as (n: string, ...a: unknown[]) => void)('stepChange', id),
    complete: (answers: Record<string, string[]>) => (emit as (n: string, ...a: unknown[]) => void)('complete', answers),
  },
}));

// Chevron left icon
const ChevronLeftIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
};

// Check icon
const CheckIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
};
</script>

<template>
  <!-- Receipt State -->
  <div
    v-if="state.isReceipt && state.receiptProps"
    v-bind="$attrs"
    :class="
      cn(
        '@container/question-flow flex w-full max-w-md min-w-80 flex-col',
        'text-foreground',
        'motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:zoom-in-95 motion-safe:fill-mode-both motion-safe:duration-300 motion-safe:ease-out',
        state.receiptProps.css?.root
      )
    "
    data-slot="question-flow"
    :data-tool-ui-id="props.id"
    data-receipt="true"
    role="status"
    :aria-label="state.receiptProps.choice?.title"
  >
    <div
      class="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card/60 px-5 py-4 shadow-xs"
    >
      <div class="flex items-center justify-between gap-3">
        <span class="text-base font-medium">{{ state.receiptProps.choice?.title ?? 'Completed' }}</span>
        <span class="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500">
          <component :is="CheckIcon" class="size-3.5" />
          Complete
        </span>
      </div>
      <div v-if="state.receiptProps.choice?.summary" class="flex flex-col">
        <template v-for="(item, index) in state.receiptProps.choice.summary" :key="item.label">
          <hr v-if="index > 0" class="my-2 border-border" />
          <div
            class="motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:slide-in-from-bottom-1 motion-safe:fill-mode-both flex flex-col gap-0.5 text-sm motion-safe:duration-300 motion-safe:ease-out"
            :style="{ animationDelay: `${150 + index * 75}ms` }"
          >
            <span class="text-muted-foreground">{{ item.label }}</span>
            <span class="font-medium">{{ item.value }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>

  <!-- Interactive State -->
  <div
    v-else
    v-bind="$attrs"
    :class="
      cn(
        '@container/question-flow flex w-full max-w-md min-w-80 flex-col gap-3',
        'text-foreground',
        (state.progressiveProps?.css?.root || state.upfrontProps?.css?.root)
      )
    "
    data-slot="question-flow"
    :data-tool-ui-id="props.id"
    role="form"
    :aria-labelledby="state.titleId"
    :aria-describedby="state.currentDescription ? state.descriptionId : undefined"
  >
    <div
      class="flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs"
    >
      <!-- Progress -->
      <div class="flex flex-col gap-1">
        <div class="flex flex-col gap-2">
          <span
            class="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            :aria-label="`Step ${state.currentStepNumber} of ${state.totalSteps}`"
          >
            Step {{ state.currentStepNumber }} of {{ state.totalSteps }}
          </span>
          <div
            v-if="state.totalSteps > 1"
            class="flex h-1.5 gap-1"
            role="progressbar"
            :aria-valuenow="state.currentStepNumber"
            aria-valuemin="1"
            :aria-valuemax="state.totalSteps"
          >
            <div
              v-for="i in state.totalSteps"
              :key="i"
              class="relative flex-1 overflow-hidden rounded-full bg-muted"
            >
              <div
                :class="cn(
                  'absolute inset-0 origin-left rounded-full bg-primary',
                  'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[var(--cubic-ease-in-out)]',
                  i <= state.currentStepNumber ? 'scale-x-100' : 'scale-x-0',
                )"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Content with cross-fade transitions -->
      <div class="relative mt-1">
        <!-- Exiting step -->
        <div
          v-if="state.exitingStepData"
          class="absolute inset-0 flex flex-col gap-4"
          :style="{
            opacity: state.exitingOpacity,
            transition: `opacity ${state.EXIT_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          }"
          aria-hidden="true"
        >
          <div class="flex flex-col gap-1">
            <h2 class="text-lg leading-tight font-semibold">{{ state.exitingStepData.title }}</h2>
            <p v-if="state.exitingStepData.description" class="text-sm text-muted-foreground">
              {{ state.exitingStepData.description }}
            </p>
          </div>
          <!-- Exiting step options (read-only) -->
          <div class="flex flex-col px-1">
            <template v-for="(option, index) in state.exitingStepData.options" :key="option.id">
              <hr
                v-if="index > 0"
                class="border-border"
              />
              <div
                :class="
                  cn(
                    'peer group relative h-auto min-h-[50px] w-full justify-start text-left text-sm font-medium',
                    'rounded-none border-0 bg-transparent px-0 py-2 text-base shadow-none @md/question-flow:text-sm',
                    index === 0 && 'pb-2.5',
                    index > 0 && index < state.exitingStepData.options.length - 1 && 'py-2.5',
                  )
                "
              >
                <div class="relative flex items-start gap-3">
                  <span class="flex h-6 items-center">
                    <span
                      :class="
                        cn(
                          'flex size-4 shrink-0 items-center justify-center border-2',
                          state.exitingStepData.selectionMode === 'single' ? 'rounded-full' : 'rounded',
                          state.exitingStepData.selectedIds.has(option.id)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/50',
                        )
                      "
                    >
                      <svg
                        v-if="state.exitingStepData.selectionMode === 'multi' && state.exitingStepData.selectedIds.has(option.id)"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span
                        v-if="state.exitingStepData.selectionMode === 'single' && state.exitingStepData.selectedIds.has(option.id)"
                        class="size-2 rounded-full bg-current"
                      />
                    </span>
                  </span>
                  <div class="flex flex-col text-left">
                    <span class="leading-6 text-pretty">{{ option.label }}</span>
                    <span
                      v-if="option.description"
                      class="text-sm font-normal text-pretty text-muted-foreground"
                    >
                      {{ option.description }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Current step -->
        <div
          :class="cn('flex flex-col gap-4', state.isTransitioning && 'motion-safe:blur-in-sm')"
          :style="state.isTransitioning ? {
            opacity: state.enteringOpacity,
            transition: `opacity ${state.ENTER_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          } : undefined"
        >
          <div class="flex flex-col gap-1">
            <h2 :id="state.titleId" class="text-lg leading-tight font-semibold">{{ state.currentTitle }}</h2>
            <p v-if="state.currentDescription" :id="state.descriptionId" class="text-sm text-muted-foreground">
              {{ state.currentDescription }}
            </p>
          </div>

          <!-- Options -->
          <div
            class="flex flex-col px-1"
            role="listbox"
            :aria-multiselectable="state.currentSelectionMode === 'multi'"
            @keydown="state.handleKeyDown"
          >
            <template v-for="(option, index) in state.currentOptions" :key="option.id">
              <hr
                v-if="index > 0"
                class="border-border transition-opacity [@media(hover:hover)]:[&:has(+_:hover)]:opacity-0 [@media(hover:hover)]:[.peer:hover+&]:opacity-0"
              />
              <button
                :ref="(el) => { if (el) state.optionRefs[index] = el as HTMLButtonElement }"
                type="button"
                :data-id="option.id"
                :disabled="option.disabled || state.isTransitioning"
                :class="
                  cn(
                    'peer group relative h-auto min-h-[50px] w-full justify-start text-left text-sm font-medium',
                    'rounded-none border-0 bg-transparent px-0 py-2 text-base shadow-none transition-none hover:bg-transparent! @md/question-flow:text-sm',
                    index === 0 && 'pb-2.5',
                    index > 0 && index < state.currentOptions.length - 1 && 'py-2.5',
                  )
                "
                role="option"
                :aria-selected="state.isSelected(option.id)"
                :tabindex="index === state.activeIndex ? 0 : -1"
                @click="state.toggleOption(option.id)"
                @focus="state.activeIndex = index"
              >
                <span
                  :class="cn(
                    'absolute inset-0 -mx-3 -my-0.5 rounded-xl bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100',
                  )"
                />
                <div class="relative flex items-start gap-3">
                  <span class="flex h-6 items-center">
                    <span
                      :class="
                        cn(
                          'flex size-4 shrink-0 items-center justify-center border-2',
                          'motion-safe:transition-colors motion-safe:duration-200',
                          state.currentSelectionMode === 'single' ? 'rounded-full' : 'rounded',
                          state.isSelected(option.id)
                            ? 'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 border-primary bg-primary text-primary-foreground motion-safe:duration-300 motion-safe:ease-out'
                            : 'border-muted-foreground/50',
                          option.disabled ? 'opacity-50' : undefined,
                        )
                      "
                    >
                      <svg
                        v-if="state.currentSelectionMode === 'multi' && state.isSelected(option.id)"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both motion-safe:delay-75 motion-safe:duration-200"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span
                        v-if="state.currentSelectionMode === 'single' && state.isSelected(option.id)"
                        class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 size-2 rounded-full bg-current motion-safe:duration-300 motion-safe:ease-out"
                      />
                    </span>
                  </span>
                  <div class="flex flex-col text-left">
                    <span class="leading-6 text-pretty">{{ option.label }}</span>
                    <span
                      v-if="option.description"
                      class="text-sm font-normal text-pretty text-muted-foreground"
                    >
                      {{ option.description }}
                    </span>
                  </div>
                </div>
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-2">
        <button
          v-if="state.showBack"
          type="button"
          :disabled="state.isTransitioning"
          :class="
            cn(
              'inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              'text-muted-foreground hover:bg-accent',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:pointer-events-none disabled:opacity-50',
            )
          "
          @click="state.handleBack"
        >
          <component :is="ChevronLeftIcon" class="size-4" />
          Back
        </button>
        <div v-else />
        <button
          type="button"
          :disabled="!state.canProceed || state.isTransitioning"
          :class="
            cn(
              'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:pointer-events-none disabled:opacity-50',
            )
          "
          @click="state.handleNext"
        >
          {{ state.isLastStep ? 'Complete' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>
