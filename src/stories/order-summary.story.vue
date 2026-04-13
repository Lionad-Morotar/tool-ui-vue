<script setup lang="ts">

import { OrderSummary } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale';

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

const summary = useStoryLocale({ zh: '订单摘要', en: 'Summary' })
const withDiscount = useStoryLocale({ zh: '含折扣', en: 'With Discount' })
const receipt = useStoryLocale({ zh: '收据', en: 'Receipt' })
const receiptWithoutImages = useStoryLocale({ zh: '无图收据', en: 'Receipt Without Images' })
const singleItem = useStoryLocale({ zh: '单项', en: 'Single Item' })
const manyItems = useStoryLocale({ zh: '多项', en: 'Many Items' })
const differentCurrencyEUR = useStoryLocale({ zh: '不同货币（欧元）', en: 'Different Currency (EUR)' })
const malformedPayloadEmptyItems = useStoryLocale({ zh: '异常数据（空项目）', en: 'Malformed Payload (Empty Items)' })

// Basic variant
const orderSummaryTitle = useStoryLocale({ zh: '订单摘要', en: 'Order Summary' })
const premiumCoffeeName = useStoryLocale({ zh: '精选咖啡豆', en: 'Premium Coffee Beans' })
const premiumCoffeeDesc = useStoryLocale({ zh: '单一产地，中度烘焙', en: 'Single origin, medium roast' })
const ceramicSetName = useStoryLocale({ zh: '陶瓷手冲套装', en: 'Ceramic Pour-Over Set' })
const ceramicSetDesc = useStoryLocale({ zh: '含滤杯和分享壶', en: 'Includes dripper and carafe' })

// Discount variant
const wirelessHeadphonesName = useStoryLocale({ zh: '无线耳机', en: 'Wireless Headphones' })
const welcomeCode = useStoryLocale({ zh: 'WELCOME20', en: 'WELCOME20' })

// Receipt variant
const orderConfirmedTitle = useStoryLocale({ zh: '订单已确认', en: 'Order Confirmed' })

// Receipt without images variant
const ebookName = useStoryLocale({ zh: '电子书籍下载', en: 'Digital Download - eBook' })
const courseAccessName = useStoryLocale({ zh: '在线课程访问', en: 'Online Course Access' })

// Single item variant
const yourOrderTitle = useStoryLocale({ zh: '你的订单', en: 'Your Order' })
const annualSubName = useStoryLocale({ zh: '年度订阅', en: 'Annual Subscription' })
const annualSubDesc = useStoryLocale({ zh: '专业方案 - 按年计费', en: 'Pro Plan - Billed yearly' })

// Many items variant
const shoppingCartTitle = useStoryLocale({ zh: '购物车', en: 'Shopping Cart' })
const genericItem = useStoryLocale({ zh: '商品', en: 'Item' })

// EUR variant
const eurOrderTitle = useStoryLocale({ zh: '订单概览', en: 'Order Overview' })
const eurCoffeeName = useStoryLocale({ zh: '优质咖啡豆', en: 'Premium Coffee Beans' })
</script>

<template>
  <Story title="OrderSummary/All Variants">
    <Variant :title="summary">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-basic"
          :title="orderSummaryTitle"
          variant="summary"
          :items="[
            {
              id: 'item-1',
              name: premiumCoffeeName,
              description: premiumCoffeeDesc,
              imageUrl: 'https://picsum.photos/100/100?random=140',
              quantity: 2,
              unitPrice: 24.0,
            },
            {
              id: 'item-2',
              name: ceramicSetName,
              description: ceramicSetDesc,
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

    <Variant :title="withDiscount">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-discount"
          :title="orderSummaryTitle"
          variant="summary"
          :items="[
            {
              id: 'item-1',
              name: wirelessHeadphonesName,
              quantity: 1,
              unitPrice: 199.0,
            },
          ]"
          :pricing="{
            subtotal: 199.0,
            discount: 20.0,
            discountLabel: welcomeCode,
            tax: 14.32,
            shipping: 0,
            total: 193.32,
            currency: 'USD',
          }"
        />
      </div>
    </Variant>

    <Variant :title="receipt">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-receipt"
          :title="orderConfirmedTitle"
          variant="receipt"
          :items="[
            {
              id: 'item-1',
              name: premiumCoffeeName,
              quantity: 2,
              unitPrice: 24.0,
            },
            {
              id: 'item-2',
              name: ceramicSetName,
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

    <Variant :title="receiptWithoutImages">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-receipt-no-images"
          :title="orderConfirmedTitle"
          variant="receipt"
          :items="[
            {
              id: 'item-1',
              name: ebookName,
              quantity: 1,
              unitPrice: 19.99,
            },
            {
              id: 'item-2',
              name: courseAccessName,
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

    <Variant :title="singleItem">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-single"
          :title="yourOrderTitle"
          variant="summary"
          :items="[
            {
              id: 'item-1',
              name: annualSubName,
              description: annualSubDesc,
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

    <Variant :title="manyItems">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-many"
          :title="shoppingCartTitle"
          variant="summary"
          :items="[
            { id: '1', name: `${genericItem} 1`, quantity: 1, unitPrice: 10.0 },
            { id: '2', name: `${genericItem} 2`, quantity: 2, unitPrice: 15.0 },
            { id: '3', name: `${genericItem} 3`, quantity: 1, unitPrice: 25.0 },
            { id: '4', name: `${genericItem} 4`, quantity: 3, unitPrice: 5.0 },
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

    <Variant :title="differentCurrencyEUR">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-eur"
          :title="eurOrderTitle"
          variant="summary"
          :items="[
            {
              id: 'item-1',
              name: eurCoffeeName,
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

    <Variant :title="malformedPayloadEmptyItems">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <order-summary
          id="order-summary-error"
          :title="orderSummaryTitle"
          :items="[]"
          :pricing="{ subtotal: 0, total: 0 }"
        />
      </div>
    </Variant>
  </Story>
</template>
