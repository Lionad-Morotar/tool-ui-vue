// ApprovalCard component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { computed, type ComputedRef, type Component } from 'vue';
import { useI18n } from '../../core/i18n';
import { resolveLucideIcon } from '../../shared/resolve-lucide-icon';
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

  // Async icon lookup — unused icons are never bundled
  const IconComponent = computed(() => resolveLucideIcon(props.icon));

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
