// OrderSummary component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { computed, type ComputedRef } from 'vue';
import type { OrderSummaryProps, OrderItem } from '../schema';

export type UseOrderSummaryOptions = OrderSummaryProps;

export interface OrderSummaryState {
  resolvedVariant: ComputedRef<'summary' | 'receipt'>;
  isReceipt: ComputedRef<boolean>;
  isMalformedPayload: ComputedRef<boolean>;
  receiptBadgeText: ComputedRef<string>;
  formatCurrency: (amount: number, currency?: string) => string;
  formatQuantity: (quantity: number) => string;
  getItemTotal: (item: OrderItem) => number;
  formatDate: (isoString: string) => string | undefined;
}

export function useOrderSummary(options: UseOrderSummaryOptions): OrderSummaryState {
  // Auto-resolve variant based on choice prop
  const resolvedVariant = computed(() => {
    if (options.variant) return options.variant;
    return options.choice === undefined ? 'summary' : 'receipt';
  });

  const isReceipt = computed(() => resolvedVariant.value === 'receipt');

  // Malformed payload detection
  const isMalformedPayload = computed(() => {
    const hasNoItems = !Array.isArray(options.items) || options.items.length === 0;
    const hasNoPricing = options.pricing == null;
    const isReceiptWithoutChoice = isReceipt.value && options.choice === undefined;
    return hasNoItems || hasNoPricing || isReceiptWithoutChoice;
  });

  // Receipt badge text
  const receiptBadgeText = computed(() => {
    if (!options.choice) return '';
    const parts = [
      options.choice.orderId && `#${options.choice.orderId}`,
      options.choice.confirmedAt && formatDate(options.choice.confirmedAt),
    ].filter(Boolean);
    return parts.join(' · ');
  });

  function formatCurrency(amount: number, currency?: string): string {
    const curr = currency || 'USD';
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: curr,
      }).format(amount);
    } catch {
      return `${curr} ${amount.toFixed(2)}`;
    }
  }

  function formatQuantity(quantity: number): string {
    return quantity === 1 ? '' : `Qty: ${quantity}`;
  }

  function getItemTotal(item: OrderItem): number {
    const qty = item.quantity ?? 1;
    return qty * item.unitPrice;
  }

  function formatDate(isoString: string): string | undefined {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return undefined;
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return undefined;
    }
  }

  return {
    resolvedVariant,
    isReceipt,
    isMalformedPayload,
    receiptBadgeText,
    formatCurrency,
    formatQuantity,
    getItemTotal,
    formatDate,
  };
}
