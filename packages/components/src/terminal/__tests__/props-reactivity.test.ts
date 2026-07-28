import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Terminal from '../index.vue';

// props 响应式契约：父层以新字符串引用更新 stdout 时（增量渲染场景
// 每帧灌入新引用），组件必须跟随重渲染。states 工厂若以值传参，computed
// 在 setup 同步作用域拿到的只是挂载首帧快照，终端输出会停在初始值不再变化。

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-terminal-reactive',
    command: 'echo hello',
    exitCode: 0,
    ...overrides,
  };
}

describe('Terminal props 响应式', () => {
  test('stdout 以新引用更新时输出区域跟随变化', async () => {
    const wrapper = mount(Terminal, { props: createProps() });
    // 初始无输出，应展示空状态而非输出区
    expect(wrapper.find('[data-slot="terminal"] .whitespace-pre.text-foreground').exists()).toBe(false);

    await wrapper.setProps({ stdout: 'updated output' });
    expect(wrapper.text()).toContain('updated output');
  });
});
