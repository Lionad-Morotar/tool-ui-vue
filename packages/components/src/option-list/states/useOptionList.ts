import { computed, ref, watch } from 'vue';
import { resolveLucideIcon } from '../../shared/resolve-lucide-icon';
import type { OptionListProps, OptionListSelection, OptionListOption } from '../schema';

export type OptionListEmit = {
  (e: 'change', value: OptionListSelection): void;
  (e: 'update:modelValue', value: OptionListSelection): void;
  (e: 'action', actionId: string, value: OptionListSelection): void;
};

export function useOptionList(
  props: OptionListProps & { modelValue?: OptionListSelection } & { css?: { root?: string } },
  emit: OptionListEmit,
) {

  // Normalize actions config
  const normalizedActions = computed(() => {
    if (!props.actions) {
      return {
        items: [
          { id: 'cancel', label: 'Clear', variant: 'ghost' as const },
          { id: 'confirm', label: 'Confirm', variant: 'default' as const },
        ],
        align: 'right' as const,
      };
    }

    // Handle array of actions
    if (Array.isArray(props.actions)) {
      return {
        items: props.actions.map((action) => ({
          ...action,
          variant: action.variant || (action.id === 'confirm' ? 'default' : 'ghost'),
        })),
        align: 'right' as const,
      };
    }

    // Handle actions config object
    return props.actions;
  });

  // Actions with disabled state
  const actionsWithDisabledState = computed(() => {
    return normalizedActions.value.items.map((action) => {
      const isDisabledByValidation =
        (action.id === 'confirm' && isConfirmDisabled.value) ||
        (action.id === 'cancel' && hasNothingToClear.value);
      return {
        ...action,
        disabled: action.disabled || isDisabledByValidation,
        label:
          action.id === 'confirm' &&
          resolvedSelectionMode.value === 'multi' &&
          selectedCount.value > 0
            ? `${action.label} (${selectedCount.value})`
            : action.label,
      };
    });
  });

  // Internal state for uncontrolled mode
  const internalValue = ref<OptionListSelection>(null);

  // Track active index for keyboard navigation
  const activeIndex = ref(0);
  const optionRefs = ref<(HTMLButtonElement | null)[]>([]);

  // Determine if component is in receipt mode
  const isReceipt = computed(() => props.choice !== undefined && props.choice !== null);

  // Determine selection mode
  const resolvedSelectionMode = computed(() => props.selectionMode ?? 'single');

  // Effective max selections (single mode = 1)
  const effectiveMaxSelections = computed(() =>
    resolvedSelectionMode.value === 'single' ? 1 : props.maxSelections
  );

  // Min selections (default 1)
  const minSelections = computed(() => props.minSelections ?? 1);

  // Get current selection (controlled or uncontrolled)
  const currentSelection = computed<OptionListSelection>(() => {
    if (props.modelValue !== undefined) return props.modelValue;
    if (props.value !== undefined) return props.value;
    if (internalValue.value !== null) return internalValue.value;
    return props.defaultValue ?? null;
  });

  // Convert selection to Set of IDs for efficient lookup
  const selectedIds = computed(() => {
    const selection = isReceipt.value ? props.choice : currentSelection.value;
    const ids = new Set<string>();
    if (selection === null) return ids;
    if (typeof selection === 'string') ids.add(selection);
    if (Array.isArray(selection)) selection.forEach((id) => ids.add(id));
    return ids;
  });

  const selectedCount = computed(() => selectedIds.value.size);

  // Check if an option is selected
  function isSelected(optionId: string): boolean {
    return selectedIds.value.has(optionId);
  }

  // Check if an option is disabled due to max selections
  function isSelectionLocked(optionId: string): boolean {
    if (resolvedSelectionMode.value === 'single') return false;
    if (effectiveMaxSelections.value === undefined) return false;
    if (selectedCount.value < effectiveMaxSelections.value) return false;
    return !isSelected(optionId);
  }

  // Get option state (selected + disabled)
  function getOptionState(option: OptionListOption) {
    const selected = isSelected(option.id);
    const locked = isSelectionLocked(option.id);
    return {
      isSelected: selected,
      isDisabled: option.disabled || locked,
    };
  }

  // Get selected options for receipt display
  const selectedOptions = computed(() => {
    if (!isReceipt.value || !props.choice) return [];
    const ids = selectedIds.value;
    return props.options.filter((opt) => ids.has(opt.id));
  });

  // Convert selection to proper format
  function convertToSelection(ids: Set<string>): OptionListSelection {
    if (resolvedSelectionMode.value === 'single') {
      const [first] = ids;
      return first ?? null;
    }
    return Array.from(ids);
  }

  // Update selection
  function updateSelection(newIds: Set<string>) {
    const newValue = convertToSelection(newIds);
    if (props.value === undefined && props.modelValue === undefined) {
      internalValue.value = newValue;
    }
    emit('change', newValue);
    emit('update:modelValue', newValue);
  }

  // Handle option click
  function handleOptionClick(option: OptionListOption) {
    if (isReceipt.value || option.disabled || isSelectionLocked(option.id)) return;

    const currentIds = new Set(selectedIds.value);
    const isCurrentlySelected = currentIds.has(option.id);

    if (resolvedSelectionMode.value === 'single') {
      if (isCurrentlySelected) {
        currentIds.delete(option.id);
      } else {
        currentIds.clear();
        currentIds.add(option.id);
      }
    } else {
      // Multi selection with max limit
      if (isCurrentlySelected) {
        currentIds.delete(option.id);
      } else {
        if (effectiveMaxSelections.value && currentIds.size >= effectiveMaxSelections.value) {
          return; // Max reached
        }
        currentIds.add(option.id);
      }
    }

    updateSelection(currentIds);
  }

  // Keyboard navigation
  function findFirstEnabledIndex(): number {
    return props.options.findIndex((opt) => !opt.disabled && !isSelectionLocked(opt.id));
  }

  function findLastEnabledIndex(): number {
    for (let i = props.options.length - 1; i >= 0; i--) {
      if (!props.options[i].disabled && !isSelectionLocked(props.options[i].id)) return i;
    }
    return 0;
  }

  function findNextEnabledIndex(start: number, direction: 1 | -1): number {
    const len = props.options.length;
    if (len === 0) return 0;
    for (let step = 1; step <= len; step++) {
      const idx = (start + direction * step + len) % len;
      if (!props.options[idx].disabled && !isSelectionLocked(props.options[idx].id)) return idx;
    }
    return start;
  }

  function focusOptionAt(index: number) {
    activeIndex.value = index;
    const el = optionRefs.value[index];
    if (el) el.focus();
  }

  function handleListboxKeyDown(event: KeyboardEvent) {
    if (props.options.length === 0) return;

    const key = event.key;

    if (key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      focusOptionAt(findNextEnabledIndex(activeIndex.value, 1));
      return;
    }

    if (key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      focusOptionAt(findNextEnabledIndex(activeIndex.value, -1));
      return;
    }

    if (key === 'Home') {
      event.preventDefault();
      event.stopPropagation();
      focusOptionAt(findFirstEnabledIndex());
      return;
    }

    if (key === 'End') {
      event.preventDefault();
      event.stopPropagation();
      focusOptionAt(findLastEnabledIndex());
      return;
    }

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      const option = props.options[activeIndex.value];
      if (option && !option.disabled && !isSelectionLocked(option.id)) {
        handleOptionClick(option);
      }
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (selectedCount.value > 0) {
        handleClear();
      }
    }
  }

  // Handle clear action
  function handleClear() {
    if (props.value === undefined && props.modelValue === undefined) {
      internalValue.value = null;
    }
    const newValue = null;
    emit('change', newValue);
    emit('update:modelValue', newValue);
    emit('action', 'cancel', newValue);
  }

  // Handle confirm action
  function handleConfirm() {
    const currentValue = currentSelection.value;
    emit('action', 'confirm', currentValue);
  }

  // Handle action button click
  async function handleAction(actionId: string) {
    if (actionId === 'cancel') {
      handleClear();
    } else if (actionId === 'confirm') {
      handleConfirm();
    } else {
      // Custom action
      emit('action', actionId, currentSelection.value);
    }
  }

  // Initialize active index to first selected or first enabled
  watch(
    () => props.options,
    () => {
      const firstSelected = props.options.findIndex(
        (opt) => isSelected(opt.id) && !opt.disabled && !isSelectionLocked(opt.id)
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

  // Computed for button disabled states
  const isConfirmDisabled = computed(() => selectedCount.value < minSelections.value || selectedCount.value === 0);
  const hasNothingToClear = computed(() => selectedCount.value === 0);

  const CheckIcon = {
    template: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  };

  const iconMap: Record<string, typeof CheckIcon> = {
    check: CheckIcon,
  };

  /** Resolve icon — custom SVGs first, then async Lucide lookup with first-char fallback */
  function getIconComponent(iconName: string | undefined) {
    if (!iconName) return null;

    // Inline icon map takes priority (custom SVGs like "check")
    if (iconMap[iconName]) return iconMap[iconName];

    return resolveLucideIcon(iconName);
  }

  return {
    normalizedActions,
    actionsWithDisabledState,
    isReceipt,
    resolvedSelectionMode,
    selectedOptions,
    isSelected,
    getOptionState,
    handleOptionClick,
    optionRefs,
    activeIndex,
    handleListboxKeyDown,
    handleAction,
    isConfirmDisabled,
    hasNothingToClear,
    getIconComponent,
  };
}
