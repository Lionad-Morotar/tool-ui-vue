import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import DataTable from '../index.vue';

// props 响应式契约：父层以新数组引用更新 data/columns 时（增量渲染场景
// 每帧灌入新引用），组件必须跟随重渲染。聚合层若以值传参，子 composable
// 在 setup 同步作用域拿到的只是挂载首帧快照，行数会停在初始值不再增长。

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-table-reactive',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'value', label: 'Value' },
    ],
    data: [{ name: 'Alpha', value: 100 }],
    rowIdKey: 'name',
    ...overrides,
  };
}

describe('DataTable props 响应式', () => {
  test('data 以新引用增长时行数跟随更新', async () => {
    const wrapper = mount(DataTable, { props: createProps() });
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);

    await wrapper.setProps({
      data: [
        { name: 'Alpha', value: 100 },
        { name: 'Beta', value: 200 },
      ],
    });
    expect(wrapper.findAll('tbody tr')).toHaveLength(2);

    await wrapper.setProps({
      data: [
        { name: 'Alpha', value: 100 },
        { name: 'Beta', value: 200 },
        { name: 'Gamma', value: 300 },
      ],
    });
    expect(wrapper.findAll('tbody tr')).toHaveLength(3);
  });

  test('columns 以新引用增长时表头跟随更新', async () => {
    const wrapper = mount(DataTable, { props: createProps() });
    await wrapper.setProps({
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'value', label: 'Value' },
        { key: 'extra', label: 'Extra' },
      ],
      data: [{ name: 'Alpha', value: 100, extra: 'x' }],
    });
    expect(wrapper.text()).toContain('Extra');
  });
});
