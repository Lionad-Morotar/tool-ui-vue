// OrderSummary component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { computed } from 'vue';
import type { OrderSummaryProps, OrderItem } from '../schema';

export interface UseOrderSummaryOptions extends OrderSummaryProps {}

export interface OrderSummaryState {
  resolvedVariant: 'summary' | 'receipt';
  isReceipt: boolean;
  isMalformedPayload: boolean;
  receiptBadgeText: string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatQuantity: (quantity: number) => string;
  getItemTotal: (item: OrderItem) => number;
  formatDate: (isoString: string) => string | undefined;
}

export function useOrderSummary(options: UseOrderSummaryOptions): OrderSummaryState {
  const { variant, choice, items, pricing } = options;

  // Auto-resolve variant based on choice prop
  const resolvedVariant = computed(() => {
    if (variant) return variant;
    return choice === undefined ? 'summary' : 'receipt';
  });

  const isReceipt = computed(() => resolvedVariant.value === 'receipt');

  // Malformed payload detection
  const isMalformedPayload = computed(() => {
    const hasNoItems = !Array.isArray(items) || items.length === 0;
    const hasNoPricing = pricing == null;
    const isReceiptWithoutChoice = isReceipt.value && choice === undefined;
    return hasNoItems || hasNoPricing || isReceiptWithoutChoice;
  });

  // Receipt badge text
  const receiptBadgeText = computed(() => {
    if (!choice) return '';
    const parts = [
      choice.orderId && `#${choice.orderId}`,
      choice.confirmedAt && formatDate(choice.confirmedAt),
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
    resolvedVariant: resolvedVariant.value,
    isReceipt: isReceipt.value,
    isMalformedPayload: isMalformedPayload.value,
    receiptBadgeText: receiptBadgeText.value,
    formatCurrency,
    formatQuantity,
    getItemTotal,
    formatDate,
  };
}
