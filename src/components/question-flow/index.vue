<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { cn } from './_adapter';
import type {
  QuestionFlowProps,
  QuestionFlowOption,
  QuestionFlowStepDefinition,
  QuestionFlowChoice,
} from './schema';

const props = defineProps<QuestionFlowProps>();

const emit = defineEmits<{
  select: [optionIds: string[]];
  back: [];
  stepChange: [stepId: string];
  complete: [answers: Record<string, string[]>];
}>();

// Determine which mode we're in
const isProgressive = computed(() => props.step !== undefined && props.options !== undefined && props.steps === undefined);
const isUpfront = computed(() => props.steps !== undefined && props.steps.length > 0);
const isReceipt = computed(() => props.choice !== undefined);

// Get typed props for each mode
const progressiveProps = computed(() =>
  isProgressive.value
    ? (props as Extract<QuestionFlowProps, { step: number; options: QuestionFlowOption[] }>)
    : null
);
const upfrontProps = computed(() =>
  isUpfront.value
    ? (props as Extract<QuestionFlowProps, { steps: QuestionFlowStepDefinition[] }>)
    : null
);
const receiptProps = computed(() =>
  isReceipt.value
    ? (props as Extract<QuestionFlowProps, { choice: QuestionFlowChoice }>)
    : null
);

// State for upfront mode
const currentStepIndex = ref(0);
const answers = ref<Record<string, string[]>>({});
const exitingStepData = ref<{
  stepKey: string;
  title: string;
  description?: string;
  options: QuestionFlowOption[];
  selectionMode: 'single' | 'multi';
  selectedIds: Set<string>;
} | null>(null);
const transitionDirection = ref<'forward' | 'backward'>('forward');

// State for progressive mode
const selectedIds = ref<Set<string>>(new Set());

// Initialize selectedIds from defaultValue in progressive mode
watch(
  () => progressiveProps.value?.defaultValue,
  (defaultValue) => {
    if (defaultValue && isProgressive.value) {
      selectedIds.value = new Set(defaultValue);
    }
  },
  { immediate: true }
);

// Current step data for upfront mode
const currentStep = computed<QuestionFlowStepDefinition | null>(() => {
  if (upfrontProps.value) {
    return upfrontProps.value.steps[currentStepIndex.value] ?? null;
  }
  return null;
});

const totalSteps = computed(() => {
  if (upfrontProps.value) {
    return upfrontProps.value.steps.length;
  }
  return 1;
});

const currentStepNumber = computed(() => {
  if (progressiveProps.value) {
    return progressiveProps.value.step;
  }
  return currentStepIndex.value + 1;
});

const isLastStep = computed(() => {
  if (upfrontProps.value) {
    return currentStepIndex.value === upfrontProps.value.steps.length - 1;
  }
  return true;
});

const showBack = computed(() => {
  if (progressiveProps.value) {
    return progressiveProps.value.step > 1 && !!progressiveProps.value.onBack;
  }
  return currentStepIndex.value > 0;
});

// Get current options based on mode
const currentOptions = computed<QuestionFlowOption[]>(() => {
  if (progressiveProps.value) {
    return progressiveProps.value.options;
  }
  if (currentStep.value) {
    return currentStep.value.options;
  }
  return [];
});

// Get current title
const currentTitle = computed(() => {
  if (progressiveProps.value) {
    return progressiveProps.value.title;
  }
  if (currentStep.value) {
    return currentStep.value.title;
  }
  return '';
});

// Get current description
const currentDescription = computed(() => {
  if (progressiveProps.value) {
    return progressiveProps.value.description;
  }
  if (currentStep.value) {
    return currentStep.value.description;
  }
  return undefined;
});

// Get current selection mode
const currentSelectionMode = computed<'single' | 'multi'>(() => {
  if (progressiveProps.value) {
    return progressiveProps.value.selectionMode ?? 'single';
  }
  if (currentStep.value) {
    return currentStep.value.selectionMode ?? 'single';
  }
  return 'single';
});

// Get current selected IDs
const currentSelectedIds = computed<Set<string>>(() => {
  if (progressiveProps.value) {
    return selectedIds.value;
  }
  if (currentStep.value) {
    const answer = answers.value[currentStep.value.id];
    return new Set(answer ?? []);
  }
  return new Set();
});

// Check if an option is selected
function isSelected(optionId: string): boolean {
  return currentSelectedIds.value.has(optionId);
}

// Toggle option selection
function toggleOption(optionId: string) {
  const mode = currentSelectionMode.value;

  if (progressiveProps.value) {
    // Progressive mode - update selectedIds directly
    const next = new Set(selectedIds.value);
    if (mode === 'single') {
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.clear();
        next.add(optionId);
      }
    } else {
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }
    }
    selectedIds.value = next;
  } else if (currentStep.value) {
    // Upfront mode - update answers
    const stepId = currentStep.value.id;
    const current = answers.value[stepId] ?? [];
    let next: string[];

    if (mode === 'single') {
      next = current.includes(optionId) ? [] : [optionId];
    } else {
      next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
    }

    answers.value = { ...answers.value, [stepId]: next };
  }
}

// Handle next button
function handleNext() {
  if (currentSelectedIds.value.size === 0) return;

  if (isLastStep.value) {
    if (upfrontProps.value) {
      emit('complete', answers.value);
    } else if (progressiveProps.value) {
      emit('select', Array.from(selectedIds.value));
    }
  } else {
    // Save exiting step data for animation
    if (currentStep.value) {
      exitingStepData.value = {
        stepKey: currentStep.value.id,
        title: currentStep.value.title,
        description: currentStep.value.description,
        options: currentStep.value.options,
        selectionMode: currentStep.value.selectionMode ?? 'single',
        selectedIds: new Set(answers.value[currentStep.value.id] ?? []),
      };
    }
    transitionDirection.value = 'forward';
    currentStepIndex.value++;

    if (currentStep.value) {
      emit('stepChange', currentStep.value.id);
    }

    // Clear exiting step data after animation
    setTimeout(() => {
      exitingStepData.value = null;
    }, 250);
  }
}

// Handle back button
function handleBack() {
  if (progressiveProps.value) {
    emit('back');
  } else if (currentStepIndex.value > 0) {
    // Save exiting step data for animation
    if (currentStep.value) {
      exitingStepData.value = {
        stepKey: currentStep.value.id,
        title: currentStep.value.title,
        description: currentStep.value.description,
        options: currentStep.value.options,
        selectionMode: currentStep.value.selectionMode ?? 'single',
        selectedIds: new Set(answers.value[currentStep.value.id] ?? []),
      };
    }
    transitionDirection.value = 'backward';
    currentStepIndex.value--;

    if (currentStep.value) {
      emit('stepChange', currentStep.value.id);
    }

    // Clear exiting step data after animation
    setTimeout(() => {
      exitingStepData.value = null;
    }, 250);
  }
}

// Keyboard navigation
const optionRefs = ref<(HTMLButtonElement | null)[]>([]);
const activeIndex = ref(0);

function findFirstEnabledIndex(): number {
  const idx = currentOptions.value.findIndex((opt) => !opt.disabled);
  return idx >= 0 ? idx : 0;
}

function findLastEnabledIndex(): number {
  for (let i = currentOptions.value.length - 1; i >= 0; i--) {
    if (!currentOptions.value[i].disabled) return i;
  }
  return 0;
}

function findNextEnabledIndex(start: number, direction: 1 | -1): number {
  const len = currentOptions.value.length;
  if (len === 0) return 0;
  for (let step = 1; step <= len; step++) {
    const idx = (start + direction * step + len) % len;
    if (!currentOptions.value[idx].disabled) return idx;
  }
  return start;
}

function focusOptionAt(index: number) {
  activeIndex.value = index;
  const el = optionRefs.value[index];
  if (el) el.focus();
}

function handleKeyDown(event: KeyboardEvent) {
  if (currentOptions.value.length === 0 || exitingStepData.value) return;

  const key = event.key;

  if (key === 'ArrowDown') {
    event.preventDefault();
    focusOptionAt(findNextEnabledIndex(activeIndex.value, 1));
    return;
  }

  if (key === 'ArrowUp') {
    event.preventDefault();
    focusOptionAt(findNextEnabledIndex(activeIndex.value, -1));
    return;
  }

  if (key === 'Home') {
    event.preventDefault();
    focusOptionAt(findFirstEnabledIndex());
    return;
  }

  if (key === 'End') {
    event.preventDefault();
    focusOptionAt(findLastEnabledIndex());
    return;
  }

  if (key === 'Enter' || key === ' ') {
    event.preventDefault();
    const option = currentOptions.value[activeIndex.value];
    if (option && !option.disabled) {
      toggleOption(option.id);
    }
    return;
  }
}

// Initialize active index
watch(
  () => currentOptions.value,
  (options) => {
    if (!options || options.length === 0) return;
    const firstSelected = options.findIndex(
      (opt) => isSelected(opt.id) && !opt.disabled
    );
    if (firstSelected >= 0) {
      activeIndex.value = firstSelected;
    } else {
      const firstEnabled = findFirstEnabledIndex();
      activeIndex.value = firstEnabled >= 0 ? firstEnabled : 0;
    }
  },
  { immediate: true }
);

// Animation state
const isTransitioning = computed(() => exitingStepData.value !== null);
const exitingOpacity = ref(1);
const enteringOpacity = ref(0);

// Cross-fade animation timing:
// 0ms: exit starts at opacity 1, starts fading out
// 200ms (80% of 250ms): enter starts fading in from opacity 0
// 450ms: animation complete
const EXIT_DURATION = 250;
const ENTER_DELAY = 200;
const ENTER_DURATION = 250;

// Watch for transition state changes to trigger animations
watch(isTransitioning, (transitioning) => {
  if (transitioning) {
    // Start fade out
    exitingOpacity.value = 0;
    // Start fade in after delay
    setTimeout(() => {
      enteringOpacity.value = 1;
    }, ENTER_DELAY);
  } else {
    // Reset for next transition
    exitingOpacity.value = 1;
    enteringOpacity.value = 0;
  }
});

const canProceed = computed(() => currentSelectedIds.value.size > 0);

// Get step IDs for aria attributes
function getStepIds(stepKey: string) {
  const safeId = encodeURIComponent(props.id).replace(/%/g, '_');
  const safeStepKey = encodeURIComponent(stepKey).replace(/%/g, '_');
  return {
    titleId: `${safeId}-${safeStepKey}-title`,
    descriptionId: `${safeId}-${safeStepKey}-description`,
  };
}

const currentStepKey = computed(() => currentStep.value?.id ?? 'current');
const { titleId, descriptionId } = getStepIds(currentStepKey.value);

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
    v-if="isReceipt && receiptProps"
    :class="
      cn(
        '@container/question-flow flex w-full max-w-md min-w-80 flex-col',
        'text-foreground',
        'motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:zoom-in-95 motion-safe:fill-mode-both motion-safe:duration-300 motion-safe:ease-out',
        receiptProps.className
      )
    "
    data-slot="question-flow"
    :data-tool-ui-id="id"
    data-receipt="true"
    role="status"
    :aria-label="receiptProps.choice?.title"
  >
    <div
      class="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card/60 px-5 py-4 shadow-xs"
    >
      <div class="flex items-center justify-between gap-3">
        <span class="text-base font-medium">{{ receiptProps.choice?.title ?? 'Completed' }}</span>
        <span class="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500">
          <component :is="CheckIcon" class="size-3.5" />
          Complete
        </span>
      </div>
      <div v-if="receiptProps.choice?.summary" class="flex flex-col">
        <template v-for="(item, index) in receiptProps.choice.summary" :key="item.label">
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
    :class="
      cn(
        '@container/question-flow flex w-full max-w-md min-w-80 flex-col gap-3',
        'text-foreground',
        (progressiveProps?.className || upfrontProps?.className)
      )
    "
    data-slot="question-flow"
    :data-tool-ui-id="id"
    role="form"
    :aria-labelledby="titleId"
    :aria-describedby="currentDescription ? descriptionId : undefined"
  >
    <div
      class="flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs"
    >
      <!-- Progress -->
      <div class="flex flex-col gap-1">
        <div class="flex flex-col gap-2">
          <span
            class="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            :aria-label="`Step ${currentStepNumber} of ${totalSteps}`"
          >
            Step {{ currentStepNumber }} of {{ totalSteps }}
          </span>
          <div
            v-if="totalSteps > 1"
            class="flex h-1.5 gap-1"
            role="progressbar"
            :aria-valuenow="currentStepNumber"
            aria-valuemin="1"
            :aria-valuemax="totalSteps"
          >
            <div
              v-for="i in totalSteps"
              :key="i"
              class="relative flex-1 overflow-hidden rounded-full bg-muted"
            >
              <div
                :class="cn(
                  'absolute inset-0 origin-left rounded-full bg-primary',
                  'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[var(--cubic-ease-in-out)]',
                  i <= currentStepNumber ? 'scale-x-100' : 'scale-x-0',
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
          v-if="exitingStepData"
          class="absolute inset-0 flex flex-col gap-4"
          :style="{
            opacity: exitingOpacity,
            transition: `opacity ${EXIT_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          }"
          aria-hidden="true"
        >
          <div class="flex flex-col gap-1">
            <h2 class="text-lg leading-tight font-semibold">{{ exitingStepData.title }}</h2>
            <p v-if="exitingStepData.description" class="text-sm text-muted-foreground">
              {{ exitingStepData.description }}
            </p>
          </div>
          <!-- Exiting step options (read-only) -->
          <div class="flex flex-col px-1">
            <template v-for="(option, index) in exitingStepData.options" :key="option.id">
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
                    index > 0 && index < exitingStepData.options.length - 1 && 'py-2.5',
                  )
                "
              >
                <div class="relative flex items-start gap-3">
                  <span class="flex h-6 items-center">
                    <span
                      :class="
                        cn(
                          'flex size-4 shrink-0 items-center justify-center border-2',
                          exitingStepData.selectionMode === 'single' ? 'rounded-full' : 'rounded',
                          exitingStepData.selectedIds.has(option.id)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/50',
                        )
                      "
                    >
                      <svg
                        v-if="exitingStepData.selectionMode === 'multi' && exitingStepData.selectedIds.has(option.id)"
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
                        v-if="exitingStepData.selectionMode === 'single' && exitingStepData.selectedIds.has(option.id)"
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
          :class="cn('flex flex-col gap-4', isTransitioning && 'motion-safe:blur-in-sm')"
          :style="isTransitioning ? {
            opacity: enteringOpacity,
            transition: `opacity ${ENTER_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          } : undefined"
        >
          <div class="flex flex-col gap-1">
            <h2 :id="titleId" class="text-lg leading-tight font-semibold">{{ currentTitle }}</h2>
            <p v-if="currentDescription" :id="descriptionId" class="text-sm text-muted-foreground">
              {{ currentDescription }}
            </p>
          </div>

          <!-- Options -->
          <div
            class="flex flex-col px-1"
            role="listbox"
            :aria-multiselectable="currentSelectionMode === 'multi'"
            @keydown="handleKeyDown"
          >
            <template v-for="(option, index) in currentOptions" :key="option.id">
              <hr
                v-if="index > 0"
                class="border-border transition-opacity [@media(hover:hover)]:[&:has(+_:hover)]:opacity-0 [@media(hover:hover)]:[.peer:hover+&]:opacity-0"
              />
              <button
                :ref="(el) => { if (el) optionRefs[index] = el as HTMLButtonElement }"
                type="button"
                :data-id="option.id"
                :disabled="option.disabled || isTransitioning"
                :class="
                  cn(
                    'peer group relative h-auto min-h-[50px] w-full justify-start text-left text-sm font-medium',
                    'rounded-none border-0 bg-transparent px-0 py-2 text-base shadow-none transition-none hover:bg-transparent! @md/question-flow:text-sm',
                    index === 0 && 'pb-2.5',
                    index > 0 && index < currentOptions.length - 1 && 'py-2.5',
                  )
                "
                role="option"
                :aria-selected="isSelected(option.id)"
                :tabindex="index === activeIndex ? 0 : -1"
                @click="toggleOption(option.id)"
                @focus="activeIndex = index"
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
                          currentSelectionMode === 'single' ? 'rounded-full' : 'rounded',
                          isSelected(option.id)
                            ? 'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 border-primary bg-primary text-primary-foreground motion-safe:duration-300 motion-safe:ease-out'
                            : 'border-muted-foreground/50',
                          option.disabled ? 'opacity-50' : undefined,
                        )
                      "
                    >
                      <svg
                        v-if="currentSelectionMode === 'multi' && isSelected(option.id)"
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
                        v-if="currentSelectionMode === 'single' && isSelected(option.id)"
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
          v-if="showBack"
          type="button"
          :disabled="isTransitioning"
          :class="
            cn(
              'inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              'text-muted-foreground hover:bg-accent',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:pointer-events-none disabled:opacity-50',
            )
          "
          @click="handleBack"
        >
          <component :is="ChevronLeftIcon" class="size-4" />
          Back
        </button>
        <div v-else />
        <button
          type="button"
          :disabled="!canProceed || isTransitioning"
          :class="
            cn(
              'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:pointer-events-none disabled:opacity-50',
            )
          "
          @click="handleNext"
        >
          {{ isLastStep ? 'Complete' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>
