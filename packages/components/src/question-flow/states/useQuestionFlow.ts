import { computed, onUnmounted, ref, watch } from 'vue';
import type { PreferenceFieldValue, PreferenceItem } from '../../preferences-panel/schema';
import type {
  QuestionFlowProps,
  QuestionFlowOption,
  QuestionFlowStepDefinition,
  QuestionFlowChoice,
  QuestionFlowFieldAnswers,
} from '../schema';

export type QuestionFlowEmit = {
  (e: 'select', optionIds: string[]): void;
  (e: 'back'): void;
  (e: 'stepChange', stepId: string): void;
  (e: 'complete', answers: Record<string, string[] | QuestionFlowFieldAnswers>): void;
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
  // 选项步骤存 optionId 数组,字段步骤存 itemId → 值映射
  const answers = ref<Record<string, string[] | QuestionFlowFieldAnswers>>({});
  const exitingStepData = ref<{
    stepKey: string;
    title: string;
    description?: string;
    options?: QuestionFlowOption[];
    fields?: PreferenceItem[];
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
    if (currentStep.value) return currentStep.value.options ?? [];
    return [];
  });

  // 字段步骤:当前步骤的 fields 定义与已归集的字段值

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

  // 字段步骤:当前步骤的 fields 定义与已归集的字段值
  const currentFields = computed<PreferenceItem[]>(() => currentStep.value?.fields ?? []);

  const currentFieldValues = computed<QuestionFlowFieldAnswers>(() => {
    if (!currentStep.value) return {};
    const record = answers.value[currentStep.value.id];
    return record && !Array.isArray(record) ? record : {};
  });

  function updateFieldValue(itemId: string, value: PreferenceFieldValue) {
    if (!currentStep.value) return;
    const record = currentFieldValues.value;
    answers.value = { ...answers.value, [currentStep.value.id]: { ...record, [itemId]: value } };
  }

  // 字段步骤推进门槛:所有 required 字段非空(空态语义与 PreferencesPanel 一致,
  // 空串/空数组/null/undefined 均视为未填)
  const requiredFieldsFilled = computed(() =>
    currentFields.value.every((f) => {
      if (!('required' in f) || !f.required) return true;
      const v = currentFieldValues.value[f.id];
      if (v === undefined || v === null) return false;
      if (typeof v === 'string') return v !== '';
      if (Array.isArray(v)) return v.length > 0;
      return true;
    })
  );

  const currentSelectedIds = computed<Set<string>>(() => {
    if (progressiveProps.value) return selectedIds.value;
    if (currentStep.value) {
      const answer = answers.value[currentStep.value.id];
      return new Set(Array.isArray(answer) ? answer : []);
    }
    return new Set();
  });

  function isSelected(optionId: string): boolean {
    return currentSelectedIds.value.has(optionId);
  }

  // reka Listbox 的 v-model 契约(单选 string|undefined、多选 string[])与内部
  // 选中态(progressive 用 Set、upfront 按 step 存数组)之间的双向桥;
  // 单选 toggle 回吐 undefined 即取消选中,与旧手写语义一致
  const listboxModel = computed<string | string[] | undefined>({
    get() {
      const ids = currentSelectedIds.value;
      if (currentSelectionMode.value === 'multi') {
        return Array.from(ids);
      }
      return ids.values().next().value as string | undefined;
    },
    set(value) {
      const next =
        value === undefined || value === null ? [] : Array.isArray(value) ? value : [value];
      if (progressiveProps.value) {
        selectedIds.value = new Set(next);
      } else if (currentStep.value) {
        answers.value = { ...answers.value, [currentStep.value.id]: next };
      }
    },
  });

  function saveExitingStepData() {
    if (currentStep.value) {
      const record = answers.value[currentStep.value.id];
      exitingStepData.value = {
        stepKey: currentStep.value.id,
        title: currentStep.value.title,
        description: currentStep.value.description,
        options: currentStep.value.options,
        fields: currentStep.value.fields,
        selectionMode: currentStep.value.selectionMode ?? 'single',
        selectedIds: new Set(Array.isArray(record) ? record : []),
      };
    }
  }

  function handleNext() {
    if (!canProceed.value) return;

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

  // 推进门槛:选项步骤看选中数,字段步骤看 required 字段是否填齐
  const canProceed = computed(() =>
    currentFields.value.length > 0 ? requiredFieldsFilled.value : currentSelectedIds.value.size > 0
  );

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
    currentFields,
    currentFieldValues,
    updateFieldValue,
    isTransitioning,
    exitingStepData,
    exitingOpacity,
    enteringOpacity,
    EXIT_DURATION,
    ENTER_DURATION,
    canProceed,
    isSelected,
    listboxModel,
    handleNext,
    handleBack,
    titleId,
    descriptionId,
    currentStepKey,
  };
}
