import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { ALLOWED_PATTERNS } from '../../../../../src/test/console-guard';
import OrderSummary from '../index.vue';

// props 响应式契约：父层以新引用更新 items/pricing 后，isMalformedPayload 必须重新求值，
// 正常 UI 与报错 UI 能正确切换。

ALLOWED_PATTERNS.push(
  // OrderSummary 测试过程中不产生额外非预期警告；保留扩展入口。
);

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-order-reactive',
    title: 'Order #123',
    items: [
      { id: '1', name: 'Widget', quantity: 2, unitPrice: 29.99 },
    ],
    pricing: {
      subtotal: 59.98,
      tax: 4.8,
      shipping: 5,
      discount: 0,
      total: 69.78,
      currency: 'USD',
    },
    ...overrides,
  };
}

describe('OrderSummary props 响应式', () => {
  test('正常挂载后 setProps 切到 malformed payload，报错 UI 出现', async () => {
    const wrapper = mount(OrderSummary, {
      props: createProps(),
    });

    expect(wrapper.text()).toContain('Widget');
    expect(wrapper.text()).not.toContain('Unable to render order summary');

    await wrapper.setProps({ items: [] });

    expect(wrapper.text()).toContain('Unable to render order summary');
    expect(wrapper.text()).not.toContain('Widget');
  });
});
