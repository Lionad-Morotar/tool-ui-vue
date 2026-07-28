import { computed, onUnmounted, ref, watch } from 'vue';
import type {
  QuestionFlowProps,
  QuestionFlowOption,
  QuestionFlowStepDefinition,
  QuestionFlowChoice,
} from '../schema';

export type QuestionFlowEmit = {
  (e: 'select', optionIds: string[]): void;
  (e: 'back'): void;
  (e: 'stepChange', stepId: string): void;
  (e: 'complete', answers: Record<string, string[]>): void;
};

const EXIT_DURATION = 250;
const ENTER_DELAY = 200;
const ENTER_DURATION = 250;

export function useQuestionFlow(
  props: QuestionFlowProps,
  emit: QuestionFlowEmit,
) {
  const rawProps = props as unknown as Record<string, unknown>;

  // Track timeouts for cleanup
  const timeoutIds = ref<Set<number>>(new Set());

  function scheduleTimeout(callback: () => void, delay: number): number {
    const id = window.setTimeout(() => {
      timeoutIds.value.delete(id);
      callback();
    }, delay);
    timeoutIds.value.add(id);
    return id;
  }

  function clearAllTimeouts() {
    timeoutIds.value.forEach((id) => clearTimeout(id));
    timeoutIds.value.clear();
  }

  onUnmounted(() => {
    clearAllTimeouts();
  });

  // Mode detection
  const isProgressive = computed(() =>
    rawProps.step !== undefined && rawProps.options !== undefined && rawProps.steps === undefined
  );
  const isUpfront = computed(() =>
    rawProps.steps !== undefined && Array.isArray(rawProps.steps) && (rawProps.steps as unknown[]).length > 0
  );
  const isReceipt = computed(() =>
    rawProps.choice !== undefined
  );

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

  // Upfront mode state
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

  // Progressive mode state
  const selectedIds = ref<Set<string>>(new Set());

  watch(
    () => progressiveProps.value?.defaultValue,
    (defaultValue) => {
      if (defaultValue && isProgressive.value) {
        selectedIds.value = new Set(defaultValue);
      }
    },
    { immediate: true }
  );

  const currentStep = computed<QuestionFlowStepDefinition | null>(() => {
    if (upfrontProps.value) {
      return upfrontProps.value.steps[currentStepIndex.value] ?? null;
    }
    return null;
  });

  const totalSteps = computed(() => {
    if (upfrontProps.value) return upfrontProps.value.steps.length;
    return 1;
  });

  const currentStepNumber = computed(() => {
    if (progressiveProps.value) return progressiveProps.value.step;
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

  const currentOptions = computed<QuestionFlowOption[]>(() => {
    if (progressiveProps.value) return progressiveProps.value.options;
    if (currentStep.value) return currentStep.value.options;
    return [];
  });

  const currentTitle = computed(() => {
    if (progressiveProps.value) return progressiveProps.value.title;
    if (currentStep.value) return currentStep.value.title;
    return '';
  });

  const currentDescription = computed(() => {
    if (progressiveProps.value) return progressiveProps.value.description;
    if (currentStep.value) return currentStep.value.description;
    return undefined;
  });

  const currentSelectionMode = computed<'single' | 'multi'>(() => {
    if (progressiveProps.value) return progressiveProps.value.selectionMode ?? 'single';
    if (currentStep.value) return currentStep.value.selectionMode ?? 'single';
    return 'single';
  });

  const currentSelectedIds = computed<Set<string>>(() => {
    if (progressiveProps.value) return selectedIds.value;
    if (currentStep.value) {
      const answer = answers.value[currentStep.value.id];
      return new Set(answer ?? []);
    }
    return new Set();
  });

  function isSelected(optionId: string): boolean {
    return currentSelectedIds.value.has(optionId);
  }

  function toggleOption(optionId: string) {
    const mode = currentSelectionMode.value;

    if (progressiveProps.value) {
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

  function saveExitingStepData() {
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
  }

  function handleNext() {
    if (currentSelectedIds.value.size === 0) return;

    if (isLastStep.value) {
      if (upfrontProps.value) {
        emit('complete', answers.value);
      } else if (progressiveProps.value) {
        emit('select', Array.from(selectedIds.value));
      }
    } else {
      saveExitingStepData();
      currentStepIndex.value++;

      if (currentStep.value) {
        emit('stepChange', currentStep.value.id);
      }

      scheduleTimeout(() => {
        exitingStepData.value = null;
      }, 250);
    }
  }

  function handleBack() {
    if (progressiveProps.value) {
      emit('back');
    } else if (currentStepIndex.value > 0) {
      saveExitingStepData();
      currentStepIndex.value--;

      if (currentStep.value) {
        emit('stepChange', currentStep.value.id);
      }

      scheduleTimeout(() => {
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

  watch(isTransitioning, (transitioning) => {
    if (transitioning) {
      exitingOpacity.value = 0;
      scheduleTimeout(() => {
        enteringOpacity.value = 1;
      }, ENTER_DELAY);
    } else {
      exitingOpacity.value = 1;
      enteringOpacity.value = 0;
    }
  });

  const canProceed = computed(() => currentSelectedIds.value.size > 0);

  function getStepIds(stepKey: string) {
    const safeId = encodeURIComponent(props.id).replace(/%/g, '_');
    const safeStepKey = encodeURIComponent(stepKey).replace(/%/g, '_');
    return {
      titleId: `${safeId}-${safeStepKey}-title`,
      descriptionId: `${safeId}-${safeStepKey}-description`,
    };
  }

  const currentStepKey = computed(() => currentStep.value?.id ?? 'current');
  const titleId = computed(() => getStepIds(currentStepKey.value).titleId);
  const descriptionId = computed(() => getStepIds(currentStepKey.value).descriptionId);

  return {
    isProgressive,
    isUpfront,
    isReceipt,
    progressiveProps,
    upfrontProps,
    receiptProps,
    currentStepIndex,
    currentStep,
    totalSteps,
    currentStepNumber,
    isLastStep,
    showBack,
    currentOptions,
    currentTitle,
    currentDescription,
    currentSelectionMode,
    isTransitioning,
    exitingStepData,
    exitingOpacity,
    enteringOpacity,
    EXIT_DURATION,
    ENTER_DURATION,
    optionRefs,
    activeIndex,
    canProceed,
    isSelected,
    toggleOption,
    handleNext,
    handleBack,
    handleKeyDown,
    focusOptionAt,
    titleId,
    descriptionId,
    currentStepKey,
  };
}
