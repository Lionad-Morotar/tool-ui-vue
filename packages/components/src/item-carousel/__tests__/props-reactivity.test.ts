import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { ALLOWED_PATTERNS } from '../../../../../src/test/console-guard';
import ItemCarousel from '../index.vue';

// props 响应式契约：父层以新数组引用更新 items 时，空态显示与列表渲染必须跟随变化。

ALLOWED_PATTERNS.push(
  // ItemCarousel 在测试空态切换时不会触发其他非预期警告；保留扩展入口。
);

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'ic-reactive',
    items: [],
    ...overrides,
  };
}

describe('ItemCarousel props 响应式', () => {
  test('初始空态显示，setProps 新 items 后空态消失且列表项渲染', async () => {
    const wrapper = mount(ItemCarousel, {
      props: createProps(),
    });

    expect(wrapper.text()).toContain('No items to display');
    expect(wrapper.findAll('[role="listitem"]').length).toBe(0);

    await wrapper.setProps({
      items: [
        { id: 'a', name: 'Product A', subtitle: 'First', image: 'https://example.com/a.jpg' },
        { id: 'b', name: 'Product B', subtitle: 'Second', image: 'https://example.com/b.jpg' },
      ],
    });

    expect(wrapper.text()).not.toContain('No items to display');
    expect(wrapper.findAll('[role="listitem"]').length).toBe(2);
    expect(wrapper.text()).toContain('Product A');
    expect(wrapper.text()).toContain('Product B');
  });
});
