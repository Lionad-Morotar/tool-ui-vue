<script setup lang="ts">
import { OrderSummaryRoot } from '@lionad/components';

/**
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `id` | `string` | required | Unique identifier for the component |
 * | `title` | `string` | `"Order Summary"` | Title displayed at the top |
 * | `variant` | `"summary" \| "receipt"` | auto | Display variant. Auto-resolves to "receipt" when `choice` is provided |
 * | `items` | `OrderItem[]` | required | Array of order line items |
 * | `pricing` | `Pricing` | required | Pricing breakdown object |
 * | `choice` | `OrderDecision` | - | Receipt state data (action, orderId, confirmedAt) |
 * | `css` | `{ root?: string }` | - | CSS classes for component elements |
 *
 * ## Emits
 *
 * None - OrderSummary is a display-only component.
 *
 * ## Slots
 *
 * None - OrderSummary does not use slots.
 *
 * ## OrderItem
 *
 * ```ts
 * interface OrderItem {
 *   id: string;
 *   name: string;
 *   description?: string;
 *   imageUrl?: string;
 *   quantity?: number;
 *   unitPrice: number;
 * }
 * ```
 *
 * ## Pricing
 *
 * ```ts
 * interface Pricing {
 *   subtotal: number;
 *   tax?: number;
 *   taxLabel?: string;
 *   shipping?: number;
 *   discount?: number;
 *   discountLabel?: string;
 *   total: number;
 *   currency?: string;
 * }
 * ```
 *
 * ## OrderDecision
 *
 * ```ts
 * interface OrderDecision {
 *   action: "confirm";
 *   orderId?: string;
 *   confirmedAt?: string; // ISO date string
 * }
 * ```
 */
</script>

<template>
  <Story title="OrderSummary/All Variants">
    <Variant title="Summary">
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-basic"
          title="Order Summary"
          variant="summary"
          :items="[
            {
              id: 'item-1',
              name: 'Premium Coffee Beans',
              description: 'Single origin, medium roast',
              imageUrl: 'https://picsum.photos/100/100?random=140',
              quantity: 2,
              unitPrice: 24.0,
            },
            {
              id: 'item-2',
              name: 'Ceramic Pour-Over Set',
              description: 'Includes dripper and carafe',
              imageUrl: 'https://picsum.photos/100/100?random=141',
              quantity: 1,
              unitPrice: 45.0,
            },
          ]"
          :pricing="{
            subtotal: 93.0,
            tax: 7.44,
            shipping: 5.99,
            total: 106.43,
            currency: 'USD',
          }"
        />
      </div>
    </Variant>

    <Variant title="With Discount">
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-discount"
          title="Order Summary"
          variant="summary"
          :items="[
            {
              id: 'item-1',
              name: 'Wireless Headphones',
              quantity: 1,
              unitPrice: 199.0,
            },
          ]"
          :pricing="{
            subtotal: 199.0,
            discount: 20.0,
            discountLabel: 'WELCOME20',
            tax: 14.32,
            shipping: 0,
            total: 193.32,
            currency: 'USD',
          }"
        />
      </div>
    </Variant>

    <Variant title="Receipt">
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-receipt"
          title="Order Confirmed"
          variant="receipt"
          :items="[
            {
              id: 'item-1',
              name: 'Premium Coffee Beans',
              quantity: 2,
              unitPrice: 24.0,
            },
            {
              id: 'item-2',
              name: 'Ceramic Pour-Over Set',
              quantity: 1,
              unitPrice: 45.0,
            },
          ]"
          :pricing="{
            subtotal: 93.0,
            tax: 7.44,
            shipping: 5.99,
            total: 106.43,
            currency: 'USD',
          }"
          :choice="{
            action: 'confirm',
            orderId: 'ORD-12345',
            confirmedAt: new Date().toISOString(),
          }"
        />
      </div>
    </Variant>

    <Variant title="Receipt Without Images">
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-receipt-no-images"
          title="Order Confirmed"
          variant="receipt"
          :items="[
            {
              id: 'item-1',
              name: 'Digital Download - eBook',
              quantity: 1,
              unitPrice: 19.99,
            },
            {
              id: 'item-2',
              name: 'Online Course Access',
              quantity: 1,
              unitPrice: 99.0,
            },
          ]"
          :pricing="{
            subtotal: 118.99,
            total: 118.99,
            currency: 'USD',
          }"
          :choice="{
            action: 'confirm',
            orderId: 'DIG-789',
            confirmedAt: '2024-03-15T10:30:00Z',
          }"
        />
      </div>
    </Variant>

    <Variant title="Single Item">
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-single"
          title="Your Order"
          variant="summary"
          :items="[
            {
              id: 'item-1',
              name: 'Annual Subscription',
              description: 'Pro Plan - Billed yearly',
              quantity: 1,
              unitPrice: 99.0,
            },
          ]"
          :pricing="{
            subtotal: 99.0,
            total: 99.0,
            currency: 'USD',
          }"
        />
      </div>
    </Variant>

    <Variant title="Many Items">
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-many"
          title="Shopping Cart"
          variant="summary"
          :items="[
            { id: '1', name: 'Item 1', quantity: 1, unitPrice: 10.0 },
            { id: '2', name: 'Item 2', quantity: 2, unitPrice: 15.0 },
            { id: '3', name: 'Item 3', quantity: 1, unitPrice: 25.0 },
            { id: '4', name: 'Item 4', quantity: 3, unitPrice: 5.0 },
          ]"
          :pricing="{
            subtotal: 80.0,
            tax: 6.4,
            total: 86.4,
            currency: 'USD',
          }"
        />
      </div>
    </Variant>

    <Variant title="Different Currency (EUR)">
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-eur"
          title="Bestellübersicht"
          variant="summary"
          :items="[
            {
              id: 'item-1',
              name: 'Premium Kaffeebohnen',
              quantity: 1,
              unitPrice: 24.99,
            },
          ]"
          :pricing="{
            subtotal: 24.99,
            tax: 4.75,
            shipping: 4.99,
            total: 34.73,
            currency: 'EUR',
          }"
        />
      </div>
    </Variant>

    <Variant title="Malformed Payload (Empty Items)">
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-error"
          title="Order Summary"
          :items="[]"
          :pricing="{ subtotal: 0, total: 0 }"
        />
      </div>
    </Variant>
  </Story>
</template>
