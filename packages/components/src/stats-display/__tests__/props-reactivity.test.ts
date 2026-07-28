import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import StatsDisplay from '../index.vue';

// props 响应式契约：stats 增长时，列表与单列布局标记（isSingle）都要跟随更新。
// states 层若以 .value 快照返回 setup 首帧的计算结果，布局标记会固化。

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'stats-reactive',
    stats: [{ key: 'users', label: 'Users', value: 1000 }],
    ...overrides,
  };
}

describe('StatsDisplay props 响应式', () => {
  test('stats 增长时列表与单列布局标记跟随更新', async () => {
    const wrapper = mount(StatsDisplay, { props: createProps() });
    expect(wrapper.text()).toContain('Users');
    expect(wrapper.classes()).toContain('max-w-sm');

    await wrapper.setProps({
      stats: [
        { key: 'users', label: 'Users', value: 1000 },
        { key: 'orders', label: 'Orders', value: 320 },
      ],
    });
    expect(wrapper.text()).toContain('Orders');
    expect(wrapper.classes()).not.toContain('max-w-sm');
  });
});
