import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import { parseSerializableDataTable } from '../schema';
import DataTable from '../index.vue';

// DataTable 多选核心行为测试（S1: 仅 table 视图）。
// 行键统一走 useLayout.getRowId 链：显式 rowIdKey → 探测 → row-${index} 兜底，
// 测试数据用 rowIdKey: 'id' + 简单 id（a1/a2）保证 data-testid 稳定可查。

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-table-selectable',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'value', label: 'Value' },
    ],
    data: [
      { id: 'a1', name: 'Alpha', value: 100 },
      { id: 'a2', name: 'Beta', value: 200 },
    ],
    rowIdKey: 'id',
    ...overrides,
  };
}

describe('勾选列渲染', () => {
  test('selectable=true 时表头出现全选勾选框且每行有行勾选框', () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    expect(wrapper.find('[data-testid="select-all"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="row-select-a1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="row-select-a2"]').exists()).toBe(true);
  });

  test('缺省 selectable 时 DOM 完全无勾选列（表头/表体/colgroup 均无残留）', () => {
    const wrapper = mount(DataTable, { props: createProps() });
    expect(wrapper.find('[data-testid="select-all"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid^="row-select-"]').exists()).toBe(false);
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false);
    // colgroup 不错位：勾选列缺省不占位
    expect(wrapper.findAll('colgroup col')).toHaveLength(2);
    expect(wrapper.findAll('thead th')).toHaveLength(2);
  });

  test('显式 selectable=false 与缺省一致', () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: false }) });
    expect(wrapper.find('[data-testid="select-all"]').exists()).toBe(false);
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false);
  });

  test('selectable=true 时 colgroup/表头多出勾选列占位', () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    expect(wrapper.findAll('colgroup col')).toHaveLength(3);
    expect(wrapper.findAll('thead th')).toHaveLength(3);
  });
});

describe('行选择交互', () => {
  test('勾选单行：input checked 且 emit selectionChange 携带该行 rowId', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    const checkbox = wrapper.find('[data-testid="row-select-a1"]');
    await checkbox.setValue(true);
    expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    const events = wrapper.emitted('selectionChange');
    expect(events).toBeTruthy();
    expect(events![0]).toEqual([['a1']]);
  });

  test('再次点击取消勾选：emit 空数组', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    const checkbox = wrapper.find('[data-testid="row-select-a1"]');
    await checkbox.setValue(true);
    await checkbox.setValue(false);
    expect((checkbox.element as HTMLInputElement).checked).toBe(false);
    expect(wrapper.emitted('selectionChange')![1]).toEqual([[]]);
  });

  test('行勾选互不影响（a1 选中不带动 a2）', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    await wrapper.find('[data-testid="row-select-a1"]').setValue(true);
    expect((wrapper.find('[data-testid="row-select-a2"]').element as HTMLInputElement).checked).toBe(false);
  });

  test('点击行内单元格文本不触发选中', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    await wrapper.find('[data-testid="cell-text-0-name"]').trigger('click');
    expect(wrapper.emitted('selectionChange')).toBeFalsy();
    expect((wrapper.find('[data-testid="row-select-a1"]').element as HTMLInputElement).checked).toBe(false);
  });
});

describe('全选/半选', () => {
  test('表头全选：全部行勾选并 emit 全部 rowId，全选 input 本身 checked', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    const selectAll = wrapper.find('[data-testid="select-all"]');
    await selectAll.setValue(true);
    expect((selectAll.element as HTMLInputElement).checked).toBe(true);
    expect((wrapper.find('[data-testid="row-select-a1"]').element as HTMLInputElement).checked).toBe(true);
    expect((wrapper.find('[data-testid="row-select-a2"]').element as HTMLInputElement).checked).toBe(true);
    expect(wrapper.emitted('selectionChange')![0]).toEqual([['a1', 'a2']]);
  });

  test('已全选时再点全选：全部取消并 emit 空数组', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    const selectAll = wrapper.find('[data-testid="select-all"]');
    await selectAll.setValue(true);
    await selectAll.setValue(false);
    expect((wrapper.find('[data-testid="row-select-a1"]').element as HTMLInputElement).checked).toBe(false);
    expect(wrapper.emitted('selectionChange')![1]).toEqual([[]]);
  });

  test('部分选中时全选 input 呈 indeterminate（.indeterminate 属性 + aria-checked=mixed）', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    await wrapper.find('[data-testid="row-select-a1"]').setValue(true);
    const selectAll = wrapper.find('[data-testid="select-all"]');
    expect((selectAll.element as HTMLInputElement).indeterminate).toBe(true);
    expect((selectAll.element as HTMLInputElement).checked).toBe(false);
    expect(selectAll.attributes('aria-checked')).toBe('mixed');
  });

  test('全选后取消单行 → 回到 indeterminate；全部取消 → 回未选中', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    const selectAll = wrapper.find('[data-testid="select-all"]');
    await selectAll.setValue(true);
    await wrapper.find('[data-testid="row-select-a1"]').setValue(false);
    expect((selectAll.element as HTMLInputElement).indeterminate).toBe(true);
    expect(selectAll.attributes('aria-checked')).toBe('mixed');
    await wrapper.find('[data-testid="row-select-a2"]').setValue(false);
    expect((selectAll.element as HTMLInputElement).indeterminate).toBe(false);
    expect(selectAll.attributes('aria-checked')).toBe('false');
  });
});

describe('排序与选中', () => {
  test('排序切换后选中按 rowId 保持：勾选 → 降序排序 → 不丢不串行', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    await wrapper.find('[data-testid="row-select-a1"]').setValue(true);
    // value 降序：a2(200) 上浮到首行，a1(100) 下沉
    const sortBtn = wrapper.find('th[data-column-key="value"] button');
    await sortBtn.trigger('click');
    await sortBtn.trigger('click');
    expect((wrapper.find('[data-testid="row-select-a1"]').element as HTMLInputElement).checked).toBe(true);
    expect((wrapper.find('[data-testid="row-select-a2"]').element as HTMLInputElement).checked).toBe(false);
  });

  test('全选作用于排序后视图：emit 的 rowId 顺序即当前视图顺序', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    const sortBtn = wrapper.find('th[data-column-key="value"] button');
    await sortBtn.trigger('click');
    await sortBtn.trigger('click');
    await wrapper.find('[data-testid="select-all"]').setValue(true);
    expect(wrapper.emitted('selectionChange')![0]).toEqual([['a2', 'a1']]);
  });

  test('排序后全选再取消全选：选中集清空', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    const sortBtn = wrapper.find('th[data-column-key="value"] button');
    await sortBtn.trigger('click');
    await sortBtn.trigger('click');
    const selectAll = wrapper.find('[data-testid="select-all"]');
    await selectAll.setValue(true);
    await selectAll.setValue(false);
    expect(wrapper.emitted('selectionChange')![1]).toEqual([[]]);
  });
});

describe('空态与导出', () => {
  test('selectable 时空态 colspan 加 1 适配勾选列', () => {
    const wrapper = mount(DataTable, { props: createProps({ data: [], selectable: true }) });
    expect(wrapper.find('[role="status"]').attributes('colspan')).toBe('3');
  });

  test('不 selectable 时空态 colspan 保持列数', () => {
    const wrapper = mount(DataTable, { props: createProps({ data: [] }) });
    expect(wrapper.find('[role="status"]').attributes('colspan')).toBe('2');
  });

  test('CSV 导出不受勾选列影响：表头仍为可见列', async () => {
    const clicks: string[] = [];
    URL.createObjectURL = () => 'blob:mock';
    URL.revokeObjectURL = () => {};
    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(((tag: string, ...rest: unknown[]) => {
      const el = origCreate(tag, ...(rest as []));
      if (tag === 'a') {
        (el as HTMLAnchorElement).click = () => {
          clicks.push((el as HTMLAnchorElement).download);
        };
      }
      return el;
    }) as typeof document.createElement);

    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    await wrapper.find('[data-testid="export-csv"]').trigger('click');
    expect(clicks).toHaveLength(1);
    expect(wrapper.emitted('selectionChange')).toBeFalsy();
  });
});

describe('可访问性', () => {
  test('全选 input 与行勾选 input 均有 aria-label', () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    expect(wrapper.find('[data-testid="select-all"]').attributes('aria-label')).toBe('Select all');
    expect(wrapper.find('[data-testid="row-select-a1"]').attributes('aria-label')).toBe('Select row a1');
  });

  test('行勾选 input 的 aria-checked 随状态更新', async () => {
    const wrapper = mount(DataTable, { props: createProps({ selectable: true }) });
    const checkbox = wrapper.find('[data-testid="row-select-a1"]');
    expect(checkbox.attributes('aria-checked')).toBe('false');
    await checkbox.setValue(true);
    expect(checkbox.attributes('aria-checked')).toBe('true');
  });
});

describe('schema 契约', () => {
  test('parseSerializableDataTable 接受 selectable 布尔值', () => {
    const parsed = parseSerializableDataTable({
      id: 't1',
      columns: [{ key: 'a', label: 'A' }],
      data: [{ a: 1 }],
      selectable: true,
    });
    expect(parsed.selectable).toBe(true);
  });

  test('缺省 selectable 解析为 undefined（默认不显示勾选列）', () => {
    const parsed = parseSerializableDataTable({
      id: 't1',
      columns: [{ key: 'a', label: 'A' }],
      data: [{ a: 1 }],
    });
    expect(parsed.selectable).toBeUndefined();
  });
});
