import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import OrderSummary from './index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-order',
    title: 'Order #123',
    items: [
      { id: '1', name: 'Widget', quantity: 2, unitPrice: 29.99 },
      { id: '2', name: 'Gadget', quantity: 1, unitPrice: 49.99 },
    ],
    pricing: {
      subtotal: 109.97,
      tax: 8.8,
      shipping: 10,
      discount: 5,
      total: 123.77,
      currency: 'USD',
    },
    ...overrides,
  };
}

describe('OrderSummary', () => {
  describe('rendering', () => {
    test('renders order title', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('Order #123');
    });

    test('renders line items', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('Widget');
      expect(wrapper.text()).toContain('Gadget');
    });

    test('renders item quantities', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('Qty: 2');
    });

    test('does not show quantity text for single items', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          items: [{ id: '1', name: 'Single Item', quantity: 1, unitPrice: 10 }],
        }),
      });
      expect(wrapper.text()).not.toContain('Qty:');
    });

    test('renders item prices', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('$59.98');
      expect(wrapper.text()).toContain('$49.99');
    });

    test('renders subtotal', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('Subtotal');
      expect(wrapper.text()).toContain('$109.97');
    });

    test('has data-slot attribute', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.find('[data-slot="order-summary"]').exists()).toBe(true);
    });

    test('has data-tool-ui-id attribute', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.find('[data-tool-ui-id="test-order"]').exists()).toBe(true);
    });

    test('has aria-labelledby attribute', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.find('article').attributes('aria-labelledby')).toBe('test-order-title');
    });

    test('applies custom className', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({ className: 'my-class' }),
      });
      expect(wrapper.find('article').classes()).toContain('my-class');
    });
  });

  describe('calculations', () => {
    test('calculates total correctly', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('Total');
      expect(wrapper.text()).toContain('$123.77');
    });

    test('applies tax calculation', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('Tax');
      expect(wrapper.text()).toContain('$8.80');
    });

    test('applies discount', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('Discount');
      // Check for discount amount (format may vary by locale)
      expect(wrapper.text()).toMatch(/5\.00/);
    });

    test('formats currency', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('$');
      expect(wrapper.text()).toMatch(/\$\d+\.\d{2}/);
    });

    test('handles different currencies', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          pricing: {
            subtotal: 100,
            total: 100,
            currency: 'EUR',
          },
        }),
      });
      expect(wrapper.text()).toContain('€');
    });

    test('handles invalid currency gracefully', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          pricing: {
            subtotal: 100,
            total: 100,
            currency: 'INVALID',
          },
        }),
      });
      expect(wrapper.text()).toContain('INVALID');
      expect(wrapper.text()).toContain('100.00');
    });

    test('shows free shipping when shipping is 0', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          pricing: {
            subtotal: 100,
            shipping: 0,
            total: 100,
            currency: 'USD',
          },
        }),
      });
      expect(wrapper.text()).toContain('Shipping');
      expect(wrapper.text()).toContain('Free');
    });

    test('shows custom tax label', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          pricing: {
            subtotal: 100,
            tax: 10,
            taxLabel: 'VAT',
            total: 110,
            currency: 'USD',
          },
        }),
      });
      expect(wrapper.text()).toContain('VAT');
      expect(wrapper.text()).not.toContain('Tax');
    });

    test('shows custom discount label', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          pricing: {
            subtotal: 100,
            discount: 10,
            discountLabel: 'SAVE10',
            total: 90,
            currency: 'USD',
          },
        }),
      });
      expect(wrapper.text()).toContain('SAVE10');
    });
  });

  describe('item images', () => {
    test('renders image when imageUrl is provided', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          items: [
            { id: '1', name: 'Item with Image', imageUrl: 'https://example.com/image.jpg', unitPrice: 10 },
          ],
        }),
      });
      const img = wrapper.find('img');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://example.com/image.jpg');
      expect(img.attributes('alt')).toBe('Item with Image');
    });

    test('renders Package icon when no imageUrl', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          items: [{ id: '1', name: 'Item without Image', unitPrice: 10 }],
        }),
      });
      expect(wrapper.find('img').exists()).toBe(false);
      // Package icon should be rendered (as svg)
      expect(wrapper.find('svg').exists()).toBe(true);
    });
  });

  describe('variant resolution', () => {
    test('auto-resolves to receipt when choice is provided', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          choice: { action: 'confirm' as const, orderId: '123' },
        }),
      });
      expect(wrapper.find('[data-receipt="true"]').exists()).toBe(true);
    });

    test('explicit variant="summary" overrides auto-resolution', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          variant: 'summary',
          choice: { action: 'confirm' as const, orderId: '123' },
        }),
      });
      expect(wrapper.find('[data-receipt="true"]').exists()).toBe(false);
    });

    test('defaults to summary when no choice and no variant', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.find('[data-receipt="true"]').exists()).toBe(false);
    });
  });

  describe('receipt mode', () => {
    test('renders receipt state with CheckCircle icon', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          variant: 'receipt',
          choice: { action: 'confirm' as const, orderId: '123' },
        }),
      });
      expect(wrapper.find('[data-receipt="true"]').exists()).toBe(true);
      expect(wrapper.find('svg').exists()).toBe(true);
    });

    test('renders orderId in receipt badge', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          variant: 'receipt',
          choice: { action: 'confirm' as const, orderId: 'ORD-12345' },
        }),
      });
      expect(wrapper.text()).toContain('#ORD-12345');
    });

    test('renders confirmedAt date in receipt badge', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          variant: 'receipt',
          choice: { action: 'confirm' as const, confirmedAt: '2024-01-15T10:30:00Z' },
        }),
      });
      // Date format varies by locale, check for year and day
      expect(wrapper.text()).toContain('2024');
      expect(wrapper.text()).toContain('15');
    });

    test('handles invalid confirmedAt date gracefully', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          variant: 'receipt',
          choice: { action: 'confirm' as const, confirmedAt: 'invalid-date' },
        }),
      });
      expect(wrapper.find('[data-receipt="true"]').exists()).toBe(true);
      // Should not crash and should still render
      expect(wrapper.text()).toContain('Order');
    });

    test('has role=status in receipt mode', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          variant: 'receipt',
          choice: { action: 'confirm' as const },
        }),
      });
      expect(wrapper.find("[role='status']").exists()).toBe(true);
    });
  });

  describe('malformed payload handling', () => {
    test('renders error state when items is empty array', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({ items: [] }),
      });
      expect(wrapper.text()).toContain('Unable to render order summary');
    });

    test('renders error state when pricing is null', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({ pricing: null as unknown as object }),
      });
      expect(wrapper.text()).toContain('Unable to render order summary');
    });

    test('renders error state when receipt variant without choice', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({ variant: 'receipt' }),
      });
      expect(wrapper.text()).toContain('Unable to render order summary');
    });

    test('error state preserves title', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({ items: [], title: 'Custom Title' }),
      });
      expect(wrapper.text()).toContain('Custom Title');
    });
  });

  describe('item descriptions', () => {
    test('renders item description when provided', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          items: [
            { id: '1', name: 'Item', description: 'A great item', unitPrice: 10 },
          ],
        }),
      });
      expect(wrapper.text()).toContain('A great item');
    });

    test('combines description and quantity with separator', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({
          items: [
            { id: '1', name: 'Item', description: 'A great item', quantity: 3, unitPrice: 10 },
          ],
        }),
      });
      expect(wrapper.text()).toContain('A great item · Qty: 3');
    });
  });

  describe('accessibility', () => {
    test('uses article element for semantic structure', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps(),
      });
      expect(wrapper.find('article').exists()).toBe(true);
    });

    test('title has correct id for aria-labelledby', () => {
      const wrapper = mount(OrderSummary, {
        props: createProps({ id: 'my-order' }),
      });
      expect(wrapper.find('#my-order-title').exists()).toBe(true);
    });
  });
});
