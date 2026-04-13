<script setup lang="ts">

import { OrderSummary } from '@lionad/vtu-components';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n';

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const OrderSummaryProps = useStoryLocale('content.orderSummaryProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = OrderSummaryProps

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'title', type: 'string', description: { zh: '面板标题', en: 'Title displayed at the top' } },
  { name: 'variant', type: "'summary' | 'receipt'", description: { zh: '显示变体（提供 choice 时自动为 receipt）', en: 'Display variant (auto-resolves to receipt when choice is provided)' } },
  { name: 'items', type: 'OrderItem[]', required: true, description: { zh: '订单项目数组', en: 'Array of order line items' } },
  { name: 'pricing', type: 'Pricing', required: true, description: { zh: '价格明细对象', en: 'Pricing breakdown object' } },
  { name: 'choice', type: 'OrderDecision', description: { zh: '回执状态数据', en: 'Receipt state data' } },
  { name: 'css', type: '{ root?: string; header?: string; items?: string; pricing?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

const summary = useStoryLocale('content.summary', messages)
const withDiscount = useStoryLocale('content.withDiscount', messages)
const receipt = useStoryLocale('content.receipt', messages)
const receiptWithoutImages = useStoryLocale('content.receiptWithoutImages', messages)
const singleItem = useStoryLocale('data.singleItem', messages)
const manyItems = useStoryLocale('data.manyItems', messages)
const differentCurrencyEUR = useStoryLocale('content.differentCurrencyEUR', messages)
const malformedPayloadEmptyItems = useStoryLocale('content.malformedPayloadEmptyItems', messages)
const orderSummaryTitle = useStoryLocale('content.orderSummaryTitle', messages)
const premiumCoffeeName = useStoryLocale('content.premiumCoffeeName', messages)
const premiumCoffeeDesc = useStoryLocale('content.premiumCoffeeDesc', messages)
const ceramicSetName = useStoryLocale('content.ceramicSetName', messages)
const ceramicSetDesc = useStoryLocale('content.ceramicSetDesc', messages)
const wirelessHeadphonesName = useStoryLocale('content.wirelessHeadphonesName', messages)
const welcomeCode = useStoryLocale('content.welcomeCode', messages)
const orderConfirmedTitle = useStoryLocale('content.orderConfirmedTitle', messages)
const ebookName = useStoryLocale('content.ebookName', messages)
const courseAccessName = useStoryLocale('content.courseAccessName', messages)
const yourOrderTitle = useStoryLocale('content.yourOrderTitle', messages)
const annualSubName = useStoryLocale('content.annualSubName', messages)
const annualSubDesc = useStoryLocale('content.annualSubDesc', messages)
const shoppingCartTitle = useStoryLocale('content.shoppingCartTitle', messages)
const genericItem = useStoryLocale('data.genericItem', messages)
const eurOrderTitle = useStoryLocale('content.eurOrderTitle', messages)
const eurCoffeeName = useStoryLocale('content.eurCoffeeName', messages)

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

// Basic variant

// Discount variant

// Receipt variant

// Receipt without images variant

// Single item variant

// Many items variant

// EUR variant

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
    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ componentPropsTitle }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ (prop as any).default || ((prop as any).required ? 'required' : '-') }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
