import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import CodeDiff from '../index.vue';

// props 响应式契约：父层以新字符串引用更新 oldCode/newCode 时（增量渲染场景
// 每帧灌入新引用），组件必须跟随重渲染。states 工厂若以值传参，computed
// 在 setup 同步作用域拿到的只是挂载首帧快照，diff 内容会停在初始值不再变化。

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-code-diff-reactive',
    oldCode: 'alpha',
    newCode: 'beta',
    ...overrides,
  };
}

describe('CodeDiff props 响应式', () => {
  test('oldCode/newCode 以新引用更新时 diff 渲染跟随变化', async () => {
    const wrapper = mount(CodeDiff, { props: createProps() });
    expect(wrapper.text()).toContain('beta');
    expect(wrapper.text()).not.toContain('gamma');

    await wrapper.setProps({
      oldCode: 'beta',
      newCode: 'gamma',
    });
    expect(wrapper.text()).toContain('gamma');
    expect(wrapper.text()).not.toContain('alpha');
  });
});
