<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { cn } from './_adapter';
import type { OptionListProps, OptionListSelection, OptionListOption } from './schema';

defineOptions({ name: 'cmpt-option-list', inheritAttrs: false })

const props = withDefaults(defineProps<OptionListProps & { modelValue?: OptionListSelection } & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  change: [value: OptionListSelection];
  action: [actionId: string, value: OptionListSelection];
  'update:modelValue': [value: OptionListSelection];
}>();

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

// Simple SVG icons matching Lucide style
const CheckIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
};

// Icon mapping for common icons
const iconMap: Record<string, typeof CheckIcon> = {
  check: CheckIcon,
};

function getIconComponent(iconName: string | undefined) {
  if (!iconName) return null;
  return iconMap[iconName] ?? null;
}
</script>

<template>
  <!-- Receipt view -->
  <div
    v-if="isReceipt"
    v-bind="$attrs"
    :class="
      cn(
        '@container/option-list flex w-full max-w-md min-w-80 flex-col',
        'text-foreground',
        'motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:zoom-in-95 motion-safe:fill-mode-both motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]',
        props.css?.root,
      )
    "
    data-slot="option-list"
    :data-tool-ui-id="props.id"
    data-receipt="true"
    role="status"
    aria-label="Confirmed selection"
  >
    <div class="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60 px-5 py-2.5 shadow-xs">
      <template v-for="(option, index) in selectedOptions" :key="option.id">
        <div class="flex items-start gap-3 py-1">
          <span class="flex h-6 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4 shrink-0 text-primary"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span v-if="option.icon" class="flex h-6 items-center">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              <component
                :is="getIconComponent(option.icon)"
                v-if="getIconComponent(option.icon)"
                class="size-4"
              />
              <span v-else class="text-xs">{{ option.icon.charAt(0).toUpperCase() }}</span>
            </span>
          </span>
          <div class="flex flex-col text-left">
            <span class="text-base leading-6 font-medium text-pretty @md/option-list:text-sm">{{ option.label }}</span>
            <span v-if="option.description" class="text-sm font-normal text-pretty text-muted-foreground">
              {{ option.description }}
            </span>
          </div>
        </div>
        <hr v-if="index < selectedOptions.length - 1" class="my-1.5 border-border" />
      </template>
    </div>
  </div>

  <!-- Interactive view -->
  <div
    v-else
    v-bind="$attrs"
    :class="
      cn(
        '@container/option-list flex w-full max-w-md min-w-80 flex-col gap-3',
        'text-foreground',
        props.css?.root,
      )
    "
    data-slot="option-list"
    :data-tool-ui-id="props.id"
    role="group"
    aria-label="Option list"
  >
    <div
      :class="cn(
        'group/list flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card px-4 py-1.5 shadow-xs',
      )"
      role="listbox"
      :aria-multiselectable="resolvedSelectionMode === 'multi'"
      @keydown="handleListboxKeyDown"
    >
      <template v-for="(option, index) in props.options" :key="option.id">
        <hr
          v-if="index > 0"
          class="border-border transition-opacity [@media(hover:hover)]:[&:has(+_:hover)]:opacity-0 [@media(hover:hover)]:[.peer:hover+&]:opacity-0"
        />
        <button
          :ref="(el) => { if (el) optionRefs[index] = el as HTMLButtonElement }"
          type="button"
          :data-id="option.id"
          :class="
            cn(
              'peer group relative h-auto min-h-12 w-full justify-start text-left text-base font-medium',
              'rounded-none border-0 bg-transparent px-0 py-2 shadow-none transition-none hover:bg-transparent! @md/option-list:text-sm',
              index === 0 && 'pb-2.5',
              index > 0 && index < props.options.length - 1 && 'py-2.5',
            )
          "
          :aria-selected="getOptionState(option).isSelected"
          :disabled="getOptionState(option).isDisabled"
          :tabindex="index === activeIndex ? 0 : -1"
          role="option"
          @click="handleOptionClick(option)"
          @focus="activeIndex = index"
        >
          <span
            :class="cn(
              'absolute inset-0 -mx-3 -my-0.5 rounded-xl bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100',
            )"
          />
          <div class="relative flex items-start gap-3">
            <!-- Selection indicator -->
            <span class="flex h-6 items-center">
              <span
                :class="
                  cn(
                    'flex size-4 shrink-0 items-center justify-center border-2 transition-colors',
                    resolvedSelectionMode === 'single' ? 'rounded-full' : 'rounded',
                    getOptionState(option).isSelected
                      ? 'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 border-primary bg-primary text-primary-foreground motion-safe:duration-300 motion-safe:ease-out'
                      : 'border-muted-foreground/50',
                    getOptionState(option).isDisabled ? 'opacity-50' : undefined,
                  )
                "
              >
                <svg
                  v-if="resolvedSelectionMode === 'multi' && getOptionState(option).isSelected"
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
                  v-if="resolvedSelectionMode === 'single' && getOptionState(option).isSelected"
                  class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 size-2 rounded-full bg-current motion-safe:duration-300 motion-safe:ease-out"
                />
              </span>
            </span>

            <!-- Icon (if provided) -->
            <span v-if="option.icon" class="flex h-6 items-center">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <component
                  :is="getIconComponent(option.icon)"
                  v-if="getIconComponent(option.icon)"
                  class="size-4"
                />
                <span v-else class="text-xs">{{ option.icon.charAt(0).toUpperCase() }}</span>
              </span>
            </span>

            <!-- Content -->
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

    <!-- Actions -->
    <div class="@container/actions">
      <div
        :class="cn(
          'flex w-full flex-col gap-3',
          normalizedActions.align === 'left' ? 'flex-col @[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:justify-start @[240px]/actions:gap-2' :
          normalizedActions.align === 'center' ? 'flex-col @[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:justify-center @[240px]/actions:gap-2' :
          'flex-col @[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:justify-end @[240px]/actions:gap-2',
        )"
      >
        <button
          v-for="action in actionsWithDisabledState"
          :key="action.id"
          type="button"
          :class="cn(
            'inline-flex items-center justify-center rounded-full px-4 text-base font-medium transition-colors',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            'min-h-11 w-full text-base',
            '@[240px]/actions:min-h-0 @[240px]/actions:w-auto @[240px]/actions:px-3 @[240px]/actions:py-2 @[240px]/actions:text-sm',
            action.variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : action.variant === 'secondary'
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                : action.variant === 'ghost'
                  ? 'hover:bg-accent hover:text-accent-foreground'
                  : action.variant === 'outline'
                    ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )"
          :disabled="action.disabled"
          @click="handleAction(action.id)"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
  </div>
</template>
