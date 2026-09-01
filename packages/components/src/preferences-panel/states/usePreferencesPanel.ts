import { useVModel } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import type {
  PreferencesPanelProps,
  PreferencesPanelReceiptProps,
  PreferencesValue,
  PreferenceItem,
  PreferenceSection,
} from '../schema';

export type PreferencesPanelEmit = {
  (e: 'change', value: PreferencesValue): void;
  (e: 'action', actionId: string, value: PreferencesValue): void;
  (e: 'beforeAction', actionId: string, value: PreferencesValue): void;
};

function isReceiptProps(
  props: PreferencesPanelProps & Partial<PreferencesPanelReceiptProps>
): props is PreferencesPanelReceiptProps {
  return props.choice !== undefined;
}

export function usePreferencesPanel(
  props: PreferencesPanelProps & Partial<PreferencesPanelReceiptProps> & { css?: { root?: string } },
  emit: PreferencesPanelEmit,
) {

  // Determine if we're in receipt mode
  const isReceipt = computed(() => isReceiptProps(props));

  // Get initial value for an item
  function getInitialValue(item: PreferenceItem): string | string[] | boolean {
    switch (item.type) {
      case 'switch':
        return item.defaultChecked ?? false;
      case 'toggle': {
        if (item.multiple) {
          if (item.defaultValue === undefined) return [];
          return Array.isArray(item.defaultValue) ? item.defaultValue : [item.defaultValue];
        }
        return typeof item.defaultValue === 'string' ? item.defaultValue : (item.options?.[0]?.value ?? '');
      }
      case 'select':
        return item.defaultSelected ?? item.selectOptions?.[0]?.value ?? '';
      case 'input':
      case 'textarea':
        return item.defaultValue ?? '';
    }
  }

  // Compute initial values from all sections
  function computeInitialValues(sections: PreferenceSection[]): PreferencesValue {
    return sections.reduce<PreferencesValue>((acc, section) => {
      section.items.forEach((item) => {
        acc[item.id] = getInitialValue(item);
      });
      return acc;
    }, {});
  }

  // Get all sections (common for both modes)
  const sections = computed<PreferenceSection[]>(() => props.sections || []);

  // Initial values computed from sections
  const initialValues = computed(() => computeInitialValues(sections.value));

  // Controlled mode: use v-model if value prop is provided
  // Uncontrolled mode: use local ref
  const localValues = ref<PreferencesValue>({});
  const controlledValue = computed(() =>
    !isReceipt.value && 'value' in props ? props.value : undefined
  );

  // Use VueUse's useVModel for controlled state
  const modelValue = useVModel(props, 'value', emit, {
    passive: true,
    defaultValue: initialValues.value,
  });

  // Get current value for an item (handles both controlled and uncontrolled modes)
  function getItemValue(item: PreferenceItem): string | string[] | boolean {
    if (isReceiptProps(props)) {
      return props.choice[item.id] ?? getInitialValue(item);
    }

    // Controlled mode: use modelValue
    if (controlledValue.value !== undefined) {
      return modelValue.value?.[item.id] ?? getInitialValue(item);
    }

    // Uncontrolled mode: use localValues
    if (item.id in localValues.value) {
      return localValues.value[item.id];
    }

    return getInitialValue(item);
  }

  // Current values for all items (used for action emission)
  const currentValues = computed<PreferencesValue>(() => {
    const result: PreferencesValue = {};
    sections.value.forEach((section) => {
      section.items.forEach((item) => {
        result[item.id] = getItemValue(item);
      });
    });
    return result;
  });

  // Update value (only in interactive mode)
  function updateValue(itemId: string, value: string | string[] | boolean) {
    if (isReceipt.value) return;

    if (controlledValue.value !== undefined) {
      // Controlled mode
      modelValue.value = { ...modelValue.value, [itemId]: value };
    } else {
      // Uncontrolled mode
      localValues.value = { ...localValues.value, [itemId]: value };
      emit('change', currentValues.value);
    }
  }

  // Check if dirty (has changes from initial)
  const isDirty = computed(() => {
    if (isReceipt.value) return false;
    return Object.keys(currentValues.value).some((key) => {
      const current = currentValues.value[key];
      const initial = initialValues.value[key];
      if (Array.isArray(current) && Array.isArray(initial)) {
        if (current.length !== initial.length) return true;
        return current.some((v, i) => v !== initial[i]);
      }
      return current !== initial;
    });
  });

  // Format display value
  function formatDisplayValue(item: PreferenceItem, value: string | string[] | boolean): string {
    if (item.type === 'switch') {
      return typeof value === 'boolean' && value ? 'On' : 'Off';
    }

    if (item.type === 'input' || item.type === 'textarea') {
      return typeof value === 'string' ? value : '';
    }

    const options = item.type === 'toggle' ? item.options : item.selectOptions;

    // Multi-select toggle: join selected option labels with comma
    if (Array.isArray(value)) {
      const labels = value
        .map((v) => options?.find((opt) => opt.value === v)?.label ?? v)
        .filter(Boolean);
      return labels.join(', ') || '-';
    }

    const stringValue = typeof value === 'string' ? value : '';
    const option = options?.find((opt) => opt.value === stringValue);
    return option?.label ?? stringValue;
  }

  // Normalize actions config
  const normalizedActions = computed(() => {
    if (isReceiptProps(props)) return null;

    const actionsProp = props.actions;
    if (!actionsProp) {
      return {
        items: [
          { id: 'cancel', label: 'Cancel', variant: 'ghost' as const },
          { id: 'save', label: 'Save Changes', variant: 'default' as const },
        ],
        align: 'right' as const,
      };
    }

    // Handle array of actions
    if (Array.isArray(actionsProp)) {
      return {
        items: actionsProp.map((action) => ({
          ...action,
          variant: action.variant || (action.id === 'save' ? 'default' : 'ghost'),
        })),
        align: 'right' as const,
      };
    }

    // Handle actions config object
    return {
      items: actionsProp.items,
      align: actionsProp.align ?? 'right',
    };
  });

  // Actions with disabled state
  const actionsWithState = computed(() => {
    if (!normalizedActions.value) return [];

    return normalizedActions.value.items.map((action) => {
      const isSaveAction = action.id === 'save';
      const baseDisabled = action.disabled ?? false;
      const shouldDisable = baseDisabled || (isSaveAction && !isDirty.value);

      return {
        ...action,
        disabled: shouldDisable,
      };
    });
  });

  function handleCancel() {
    if (controlledValue.value !== undefined) {
      modelValue.value = initialValues.value;
    } else {
      localValues.value = {};
    }
    emit('change', initialValues.value);
    emit('action', 'cancel', initialValues.value);
  }

  async function handleAction(actionId: string) {
    // Emit beforeAction for interception
    emit('beforeAction', actionId, currentValues.value);

    if (actionId === 'cancel') {
      handleCancel();
    } else {
      emit('action', actionId, currentValues.value);
    }
  }

  // Check if there are errors (receipt mode only)
  const hasErrors = computed(() => {
    if (!isReceiptProps(props)) return false;
    const error = props.error;
    return error !== undefined && Object.keys(error).length > 0;
  });

  // Check if item has error (receipt mode only)
  function getItemError(item: PreferenceItem): string | undefined {
    if (!isReceiptProps(props)) return undefined;
    const error = props.error;
    return error?.[item.id];
  }

  // Reset state when sections change (signature reset)
  watch(
    () => sections.value.map((s: PreferenceSection) => s.items.map((i: PreferenceItem) => i.id).join(',')).join('|'),
    () => {
      if (!isReceipt.value && controlledValue.value === undefined) {
        localValues.value = {};
      }
    }
  );

  return {
    isReceipt,
    sections,
    getItemValue,
    currentValues,
    updateValue,
    isDirty,
    formatDisplayValue,
    normalizedActions,
    actionsWithState,
    handleAction,
    hasErrors,
    getItemError,
  };
}
