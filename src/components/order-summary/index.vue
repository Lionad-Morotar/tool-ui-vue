<script setup lang="ts">
import { Package, CheckCircle } from 'lucide-vue-next';
import { computed } from 'vue';
import { cn } from './_adapter';
import type { OrderSummaryProps, OrderItem } from './schema';

const props = defineProps<OrderSummaryProps>();

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

// Auto-resolve variant based on choice prop
const resolvedVariant = computed(() => {
  if (props.variant) return props.variant;
  return props.choice === undefined ? 'summary' : 'receipt';
});

const isReceipt = computed(() => resolvedVariant.value === 'receipt');

// Malformed payload detection
const isMalformedPayload = computed(() => {
  const hasNoItems = !Array.isArray(props.items) || props.items.length === 0;
  const hasNoPricing = props.pricing == null;
  const isReceiptWithoutChoice = isReceipt.value && props.choice === undefined;
  return hasNoItems || hasNoPricing || isReceiptWithoutChoice;
});

// Receipt badge text
const receiptBadgeText = computed(() => {
  if (!props.choice) return '';
  const parts = [
    props.choice.orderId && `#${props.choice.orderId}`,
    props.choice.confirmedAt && formatDate(props.choice.confirmedAt),
  ].filter(Boolean);
  return parts.join(' · ');
});
</script>

<template>
  <!-- Malformed Payload State -->
  <article
    v-if="isMalformedPayload"
    :class="cn('flex max-w-md min-w-80 flex-col gap-3', className)"
    data-slot="order-summary"
    :data-tool-ui-id="id"
    :aria-labelledby="`${id}-title`"
  >
    <div class="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <h2 :id="`${id}-title`" class="text-base font-semibold">
        {{ title || "Order Summary" }}
      </h2>
      <p class="mt-2 text-sm text-muted-foreground">
        Unable to render order summary
      </p>
    </div>
  </article>

  <!-- Receipt State -->
  <article
    v-else-if="isReceipt"
    :class="cn(
      'flex max-w-md min-w-80 flex-col gap-3',
      'text-foreground',
      className
    )"
    data-slot="order-summary"
    :data-tool-ui-id="id"
    data-receipt="true"
    role="status"
    :aria-labelledby="`${id}-title`"
  >
    <div class="rounded-lg border border-border bg-card/60 text-card-foreground shadow-sm">
      <div class="space-y-4 p-4 opacity-95">
        <div>
          <h2
            :id="`${id}-title`"
            class="flex items-center gap-2 text-base font-semibold"
          >
            <check-circle
              class="h-5 w-5 text-green-600 dark:text-green-500"
              aria-hidden="true"
              :focusable="false"
            />
            {{ title || "Order Summary" }}
          </h2>
          <p v-if="receiptBadgeText" class="mt-1 text-sm text-muted-foreground">
            {{ receiptBadgeText }}
          </p>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in items"
            :key="item.id"
            class="flex gap-3"
          >
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.name"
              width="48"
              height="48"
              class="h-12 w-12 shrink-0 rounded-md object-cover"
            />
            <div v-else class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
              <package
                class="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
                :focusable="false"
              />
            </div>
            <div class="flex min-w-0 flex-1 items-center justify-between">
              <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                <div class="flex items-center justify-between">
                  <span class="truncate text-sm font-medium">{{ item.name }}</span>
                  <span class="truncate text-sm tabular-nums">{{ formatCurrency(getItemTotal(item), pricing.currency) }}</span>
                </div>
                <div v-if="item.description || formatQuantity(item.quantity ?? 1)" class="truncate text-sm text-muted-foreground">
                  {{ [item.description, formatQuantity(item.quantity ?? 1)].filter(Boolean).join(' · ') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr class="shrink-0 border-t border-border" />

        <!-- Pricing -->
        <dl class="flex flex-col gap-2 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Subtotal</dt>
            <dd class="tabular-nums">{{ formatCurrency(pricing.subtotal, pricing.currency) }}</dd>
          </div>

          <div v-if="pricing.discount !== undefined && pricing.discount > 0" class="flex justify-between gap-4 text-green-600 dark:text-green-500">
            <dt>{{ pricing.discountLabel || "Discount" }}</dt>
            <dd class="tabular-nums">-{{ formatCurrency(pricing.discount, pricing.currency) }}</dd>
          </div>

          <div v-if="pricing.shipping !== undefined" class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Shipping</dt>
            <dd class="tabular-nums">
              {{ pricing.shipping === 0 ? 'Free' : formatCurrency(pricing.shipping, pricing.currency) }}
            </dd>
          </div>

          <div v-if="pricing.tax !== undefined" class="flex justify-between gap-4">
            <dt class="text-muted-foreground">{{ pricing.taxLabel || "Tax" }}</dt>
            <dd class="tabular-nums">{{ formatCurrency(pricing.tax, pricing.currency) }}</dd>
          </div>

          <div class="flex justify-between gap-4">
            <dt class="font-medium">Total</dt>
            <dd class="font-semibold tabular-nums">{{ formatCurrency(pricing.total, pricing.currency) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </article>

  <!-- Interactive State (Summary) -->
  <article
    v-else
    :class="cn(
      'flex max-w-md min-w-80 flex-col gap-3',
      'text-foreground',
      className
    )"
    data-slot="order-summary"
    :data-tool-ui-id="id"
    :aria-labelledby="`${id}-title`"
  >
    <div class="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div class="space-y-4 p-4">
        <div>
          <h2 :id="`${id}-title`" class="text-base font-semibold">{{ title || "Order Summary" }}</h2>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in items"
            :key="item.id"
            class="flex gap-3"
          >
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.name"
              width="48"
              height="48"
              class="h-12 w-12 shrink-0 rounded-md object-cover"
            />
            <div v-else class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
              <package
                class="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
                :focusable="false"
              />
            </div>
            <div class="flex min-w-0 flex-1 items-center justify-between">
              <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                <div class="flex items-center justify-between">
                  <span class="truncate text-sm font-medium">{{ item.name }}</span>
                  <span class="truncate text-sm tabular-nums">{{ formatCurrency(getItemTotal(item), pricing.currency) }}</span>
                </div>
                <div v-if="item.description || formatQuantity(item.quantity ?? 1)" class="truncate text-sm text-muted-foreground">
                  {{ [item.description, formatQuantity(item.quantity ?? 1)].filter(Boolean).join(' · ') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr class="shrink-0 border-t border-border" />

        <!-- Pricing -->
        <dl class="flex flex-col gap-2 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Subtotal</dt>
            <dd class="tabular-nums">{{ formatCurrency(pricing.subtotal, pricing.currency) }}</dd>
          </div>

          <div v-if="pricing.discount !== undefined && pricing.discount > 0" class="flex justify-between gap-4 text-green-600 dark:text-green-500">
            <dt>{{ pricing.discountLabel || "Discount" }}</dt>
            <dd class="tabular-nums">-{{ formatCurrency(pricing.discount, pricing.currency) }}</dd>
          </div>

          <div v-if="pricing.shipping !== undefined" class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Shipping</dt>
            <dd class="tabular-nums">
              {{ pricing.shipping === 0 ? 'Free' : formatCurrency(pricing.shipping, pricing.currency) }}
            </dd>
          </div>

          <div v-if="pricing.tax !== undefined" class="flex justify-between gap-4">
            <dt class="text-muted-foreground">{{ pricing.taxLabel || "Tax" }}</dt>
            <dd class="tabular-nums">{{ formatCurrency(pricing.tax, pricing.currency) }}</dd>
          </div>

          <div class="flex justify-between gap-4">
            <dt class="font-medium">Total</dt>
            <dd class="font-semibold tabular-nums">{{ formatCurrency(pricing.total, pricing.currency) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </article>
</template>
