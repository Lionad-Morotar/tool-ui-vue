import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import CodeBlock from '../index.vue';

// props 响应式契约：父层以新字符串引用更新 code 时（增量渲染场景
// 每帧灌入新引用），组件必须跟随重渲染。states 工厂若以值传参，computed/watch
// 在 setup 同步作用域拿到的只是挂载首帧快照，高亮内容会停在初始值不再变化。

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-code-block-reactive',
    code: 'first code',
    language: 'text',
    ...overrides,
  };
}

async function waitForHighlight() {
  // Shiki 高亮是异步的，给足微任务与少量宏任务时间让 fallback 或高亮完成
  await new Promise((resolve) => setTimeout(resolve, 150));
}

describe('CodeBlock props 响应式', () => {
  test('code 以新引用更新时高亮渲染跟随变化', async () => {
    const wrapper = mount(CodeBlock, { props: createProps() });
    await waitForHighlight();
    expect(wrapper.text()).toContain('first code');

    await wrapper.setProps({ code: 'second code' });
    await waitForHighlight();
    expect(wrapper.text()).toContain('second code');
    expect(wrapper.text()).not.toContain('first code');
  });
});
