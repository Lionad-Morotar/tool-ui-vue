// ApprovalCard component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { computed, type ComputedRef, type Component } from 'vue';
import { icons } from 'lucide-vue-next';
import type { ApprovalCardBaseProps } from '../schema';

export interface UseApprovalCardOptions extends ApprovalCardBaseProps {
  emit: {
    (e: 'confirm'): void;
    (e: 'cancel'): void;
  };
}

export interface ApprovalCardState {
  resolvedVariant: ComputedRef<'default' | 'destructive'>;
  resolvedConfirmLabel: ComputedRef<string>;
  resolvedCancelLabel: ComputedRef<string>;
  isDestructive: ComputedRef<boolean>;
  IconComponent: ComputedRef<Component | null>;
  receiptLabel: ComputedRef<string>;
  handleConfirm: () => void;
  handleCancel: () => void;
  handleKeyDown: (event: KeyboardEvent) => void;
}

export function useApprovalCard(options: UseApprovalCardOptions): ApprovalCardState {
  const { variant, confirmLabel, cancelLabel, choice, icon, emit } = options;

  const resolvedVariant = computed(() => variant ?? 'default');
  const resolvedConfirmLabel = computed(() => confirmLabel ?? 'Approve');
  const resolvedCancelLabel = computed(() => cancelLabel ?? 'Deny');
  const isDestructive = computed(() => resolvedVariant.value === 'destructive');

  // Dynamic icon lookup using lucide-vue-next
  const IconComponent = computed(() => {
    if (!icon) return null;

    // Convert kebab-case to PascalCase for icon lookup
    const pascalName = icon
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const Icon = icons[pascalName as keyof typeof icons];
    return Icon ?? null;
  });

  // Receipt display label
  const receiptLabel = computed(() => {
    if (choice === 'approved') {
      return resolvedConfirmLabel.value;
    }
    return resolvedCancelLabel.value;
  });

  function handleConfirm() {
    emit('confirm');
  }

  function handleCancel() {
    emit('cancel');
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      emit('cancel');
    }
  }

  return {
    resolvedVariant,
    resolvedConfirmLabel,
    resolvedCancelLabel,
    isDestructive,
    IconComponent,
    receiptLabel,
    handleConfirm,
    handleCancel,
    handleKeyDown,
  };
}
