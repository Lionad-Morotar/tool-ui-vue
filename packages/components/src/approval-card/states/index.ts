// ApprovalCard component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { useI18n } from '../../core/i18n';
import { icons } from 'lucide-vue-next';
import { computed, type ComputedRef, type Component } from 'vue';
import type { ApprovalCardBaseProps } from '../schema';

export type ApprovalCardEmit = {
  (e: 'confirm'): void;
  (e: 'cancel'): void;
};

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

export function useApprovalCard(
  props: ApprovalCardBaseProps,
  emit: ApprovalCardEmit,
): ApprovalCardState {
  const { t } = useI18n();
  const resolvedVariant = computed(() => props.variant ?? 'default');
  const resolvedConfirmLabel = computed(() => props.confirmLabel ?? t('approvalCard.approve').value);
  const resolvedCancelLabel = computed(() => props.cancelLabel ?? t('approvalCard.reject').value);
  const isDestructive = computed(() => resolvedVariant.value === 'destructive');

  // Dynamic icon lookup using lucide-vue-next
  const IconComponent = computed(() => {
    if (!props.icon) return null;

    // Convert kebab-case to PascalCase for icon lookup
    const pascalName = props.icon
      .split('-')
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const Icon = icons[pascalName as keyof typeof icons];
    return Icon ?? null;
  });

  // Receipt display label
  const receiptLabel = computed(() => {
    if (props.choice === 'approved') {
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
