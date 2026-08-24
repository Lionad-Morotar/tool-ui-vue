import { mount } from '@vue/test-utils';
import { describe, expect, test, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { nextTick } from 'vue';
import { ALLOWED_PATTERNS } from '../../../../../src/test/console-guard';
import DataTable from '../index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-table',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'value', label: 'Value' },
    ],
    data: [
      { name: 'Alpha', value: 100 },
      { name: 'Beta', value: 200 },
    ],
    rowIdKey: 'name',
    ...overrides,
  };
}

describe('DataTable', () => {
  const addedPatterns: RegExp[] = [];

  beforeAll(() => {
    const patterns = [new RegExp('\\[DataTable\\] Missing `rowIdKey`')];
    patterns.forEach((p) => {
      ALLOWED_PATTERNS.push(p);
      addedPatterns.push(p);
    });
  });

  afterAll(() => {
    addedPatterns.forEach((p) => {
      const idx = ALLOWED_PATTERNS.indexOf(p);
      if (idx !== -1) ALLOWED_PATTERNS.splice(idx, 1);
    });
  });

  describe('rendering', () => {
    test('renders column headers', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      expect(wrapper.text()).toContain('Name');
      expect(wrapper.text()).toContain('Value');
    });

    test('renders row data', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      expect(wrapper.text()).toContain('Alpha');
      expect(wrapper.text()).toContain('Beta');
      expect(wrapper.text()).toContain('100');
      expect(wrapper.text()).toContain('200');
    });

    test('renders empty message when no data', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ data: [], emptyMessage: 'Nothing here' }),
      });
      expect(wrapper.text()).toContain('Nothing here');
    });

    test('has data-slot attribute', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      expect(wrapper.find('[data-slot="data-table"]').exists()).toBe(true);
    });

    test('applies custom css.root', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ css: { root: 'my-table' } }),
      });
      expect(wrapper.find('[data-slot="data-table"]').classes()).toContain('my-table');
    });

    test('has data-layout attribute defaulting to table', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      expect(wrapper.find('[data-slot="data-table"]').attributes('data-layout')).toBe('table');
    });
  });

  describe('layout modes', () => {
    test('supports layout=table mode', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ layout: 'table' }),
      });
      expect(wrapper.find('[data-layout="table"]').exists()).toBe(true);
    });

    test('supports layout=cards mode', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ layout: 'cards' }),
      });
      expect(wrapper.find('[data-layout="cards"]').exists()).toBe(true);
    });

    test('supports layout=auto mode', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ layout: 'auto' }),
      });
      expect(wrapper.find('[data-layout="auto"]').exists()).toBe(true);
    });

    test('table view container has correct classes in table mode', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ layout: 'table' }),
      });
      const tableContainer = wrapper.find('[data-slot="data-table"] > div.block');
      expect(tableContainer.exists()).toBe(true);
    });

    test('cards view container is visible in cards mode', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ layout: 'cards' }),
      });
      const cardsContainer = wrapper.find('[role="list"]');
      expect(cardsContainer.exists()).toBe(true);
    });
  });

  describe('mobile card view', () => {
    test('renders mobile cards container with role=list', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      expect(wrapper.find('[role="list"]').exists()).toBe(true);
    });

    test('mobile container has aria-label', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      const list = wrapper.find('[role="list"]');
      expect(list.attributes('aria-label')).toBe('Data table (mobile card view)');
    });

    test('mobile container has aria-describedby pointing to description', () => {
      const wrapper = mount(DataTable, { props: createProps({ id: 'my-table' }) });
      const list = wrapper.find('[role="list"]');
      expect(list.attributes('aria-describedby')).toBe('my-table-mobile-table-description');
    });

    test('has sr-only mobile description', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ columns: [{ key: 'name', label: 'Name' }] }),
      });
      const description = wrapper.find('.sr-only');
      expect(description.exists()).toBe(true);
      expect(description.text()).toContain('Table data shown as expandable cards');
    });

    test('renders cards for each row in cards layout', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ layout: 'cards' }),
      });
      const listItems = wrapper.findAll('[role="listitem"]');
      expect(listItems.length).toBe(2);
    });

    test('card displays primary column value', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          layout: 'cards',
          columns: [
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'value', label: 'Value', priority: 'secondary' },
          ],
        }),
      });
      expect(wrapper.text()).toContain('Alpha');
      expect(wrapper.text()).toContain('Beta');
    });

    test('card has expand button when secondary columns exist', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          layout: 'cards',
          columns: [
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'value', label: 'Value', priority: 'secondary' },
          ],
        }),
      });
      const expandButton = wrapper.find('[aria-expanded]');
      expect(expandButton.exists()).toBe(true);
    });

    test('expand button toggles aria-expanded on click', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          layout: 'cards',
          columns: [
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'value', label: 'Value', priority: 'secondary' },
          ],
        }),
      });
      const expandButton = wrapper.find('[aria-expanded]');
      expect(expandButton.attributes('aria-expanded')).toBe('false');
      await expandButton.trigger('click');
      expect(expandButton.attributes('aria-expanded')).toBe('true');
    });

    test('expanded content shows secondary columns', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          layout: 'cards',
          columns: [
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'value', label: 'Value', priority: 'secondary' },
          ],
        }),
      });
      const expandButton = wrapper.find('[aria-expanded]');
      await expandButton.trigger('click');
      // Secondary column label should be visible in expanded content
      const expandedContent = wrapper.find('[role="region"]');
      expect(expandedContent.exists()).toBe(true);
    });

    test('simple card rendered when no secondary columns', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          layout: 'cards',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'value', label: 'Value' },
          ],
        }),
      });
      // No expand button when all columns are primary
      //（选择器收窄到行卡片容器内，排除工具条按钮的 aria-expanded）
      const expandButton = wrapper.find('[role="list"] [aria-expanded]');
      expect(expandButton.exists()).toBe(false);
    });
  });

  describe('column priority', () => {
    test('primary columns are shown in card header', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          layout: 'cards',
          columns: [
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'value', label: 'Value', priority: 'secondary' },
            { key: 'status', label: 'Status', priority: 'tertiary' },
          ],
          data: [{ name: 'Test', value: 100, status: 'active' }],
        }),
      });
      expect(wrapper.text()).toContain('Test');
    });

    test('hideOnMobile columns are hidden in card view', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          layout: 'cards',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'hidden', label: 'Hidden', hideOnMobile: true },
          ],
          data: [{ name: 'Test', hidden: 'secret' }],
        }),
      });
      // Card should only show name, not hidden
      const listItem = wrapper.find('[role="listitem"]');
      expect(listItem.text()).toContain('Test');
    });

    test('first two columns default to primary when no priority specified', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          layout: 'cards',
          columns: [
            { key: 'col1', label: 'Col1' },
            { key: 'col2', label: 'Col2' },
            { key: 'col3', label: 'Col3' },
          ],
          data: [{ col1: 'A', col2: 'B', col3: 'C' }],
        }),
      });
      // Third column should be in secondary
      const expandButton = wrapper.find('[aria-expanded]');
      expect(expandButton.exists()).toBe(true);
    });
  });

  describe('sorting', () => {
    test('emits sortChange on header click', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      const headers = wrapper.findAll('th');
      await headers[0].find('button').trigger('click');
      expect(wrapper.emitted('sortChange')).toBeTruthy();
      expect(wrapper.emitted('sortChange')![0]).toEqual([{ by: 'name', direction: 'asc' }]);
    });

    test('toggles sort direction on repeated clicks', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      const nameHeader = wrapper.findAll('th')[0].find('button');
      await nameHeader.trigger('click');
      await nameHeader.trigger('click');
      expect(wrapper.emitted('sortChange')![1]).toEqual([{ by: 'name', direction: 'desc' }]);
      await nameHeader.trigger('click');
      expect(wrapper.emitted('sortChange')![2]).toEqual([{}]);
    });

    test('does not sort when column has sortable false', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [
            { key: 'name', label: 'Name', sortable: false },
            { key: 'value', label: 'Value' },
          ],
        }),
      });
      const nameHeader = wrapper.findAll('th')[0].find('button');
      await nameHeader.trigger('click');
      const sortEvents = wrapper.emitted('sortChange') || [];
      const nameSort = sortEvents.find((e) => (e[0] as Record<string, unknown>).by === 'name');
      expect(nameSort).toBeUndefined();
    });

    test('sorts numerically when values are numbers', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          data: [
            { name: 'A', value: 10 },
            { name: 'B', value: 2 },
          ],
          sort: { by: 'value', direction: 'asc' },
        }),
      });
      const cells = wrapper.findAll('td');
      expect(cells[1].find('span span').text()).toBe('2');
      expect(cells[3].find('span span').text()).toBe('10');
    });

    test('has aria-sort attribute on sorted column', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          sort: { by: 'name', direction: 'asc' },
        }),
      });
      const nameHeader = wrapper.findAll('th')[0];
      expect(nameHeader.attributes('aria-sort')).toBe('ascending');
    });

    test('sort announcement is shown for screen readers', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          sort: { by: 'name', direction: 'asc' },
        }),
      });
      const announcement = wrapper.find('[aria-live="polite"]');
      expect(announcement.exists()).toBe(true);
      expect(announcement.text()).toContain('Sorted by Name');
      expect(announcement.text()).toContain('ascending');
    });
  });

  describe('formatting', () => {
    test('formats currency', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [{ key: 'price', label: 'Price', format: { kind: 'currency', currency: 'USD' } }],
          data: [{ price: 1234.5 }],
        }),
      });
      expect(wrapper.text()).toContain('$1,234.50');
    });

    test('formats percent', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [{ key: 'rate', label: 'Rate', format: { kind: 'percent' } }],
          data: [{ rate: 0.15 }],
        }),
      });
      expect(wrapper.text()).toContain('15%');
    });

    test('formats delta with arrow', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [{ key: 'change', label: 'Change', format: { kind: 'delta' } }],
          data: [{ change: 5 }],
        }),
      });
      expect(wrapper.text()).toContain('+5.00');
      expect(wrapper.text()).toContain('↑');
    });

    test('renders status badge', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [
            {
              key: 'status',
              label: 'Status',
              format: { kind: 'status', statusMap: { active: { tone: 'success', label: 'Active' } } },
            },
          ],
          data: [{ status: 'active' }],
        }),
      });
      expect(wrapper.text()).toContain('Active');
    });

    test('renders boolean label', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [{ key: 'flag', label: 'Flag', format: { kind: 'boolean', labels: { true: 'Yes', false: 'No' } } }],
          data: [{ flag: true }],
        }),
      });
      expect(wrapper.text()).toContain('Yes');
    });

    test('renders array with remaining count', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [{ key: 'tags', label: 'Tags', format: { kind: 'array', maxVisible: 2 } }],
          data: [{ tags: ['a', 'b', 'c'] }],
        }),
      });
      expect(wrapper.text()).toContain('a');
      expect(wrapper.text()).toContain('b');
      expect(wrapper.text()).toContain('+1');
    });

    test('renders link with external indicator', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [{ key: 'url', label: 'URL', format: { kind: 'link', external: true } }],
          data: [{ url: 'https://example.com' }],
        }),
      });
      const link = wrapper.find('a');
      expect(link.exists()).toBe(true);
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
      expect(wrapper.text()).toContain('↗');
    });

    test('formats date with relative format', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];

      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [{ key: 'date', label: 'Date', format: { kind: 'date', dateFormat: 'relative' } }],
          data: [{ date: dateStr }],
        }),
      });
      // Relative time format varies by locale, just check the component renders
      // The date should be formatted (not showing the raw ISO string)
      const text = wrapper.text();
      expect(text).not.toContain(dateStr);
    });

    test('formats number with compact notation', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [{ key: 'count', label: 'Count', format: { kind: 'number', compact: true } }],
          data: [{ count: 1500000 }],
        }),
      });
      // Compact notation varies by locale, check it contains digits
      const text = wrapper.text();
      expect(/\d/.test(text)).toBe(true);
    });
  });

  describe('accessibility', () => {
    test('table headers have scope=col', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      const headers = wrapper.findAll('th');
      headers.forEach((header) => {
        expect(header.attributes('scope')).toBe('col');
      });
    });

    test('sort buttons have aria-label', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      const sortButton = wrapper.find('th button');
      expect(sortButton.attributes('aria-label')).toContain('Sort by');
    });

    test('empty state has role=status', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ data: [] }),
      });
      const status = wrapper.find('[role="status"]');
      expect(status.exists()).toBe(true);
    });

    test('mobile cards have role=listitem', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ layout: 'cards' }),
      });
      const listItems = wrapper.findAll('[role="listitem"]');
      expect(listItems.length).toBeGreaterThan(0);
    });

    test('expanded region has role=region', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          layout: 'cards',
          columns: [
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'value', label: 'Value', priority: 'secondary' },
          ],
        }),
      });
      const expandButton = wrapper.find('[aria-expanded]');
      await expandButton.trigger('click');
      const region = wrapper.find('[role="region"]');
      expect(region.exists()).toBe(true);
    });
  });

  describe('row identification', () => {
    test('renders rows with unique identifiers when rowIdKey provided', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          rowIdKey: 'name',
          data: [{ name: 'unique-id', value: 100 }],
        }),
      });
      // Should render without errors and have table rows
      expect(wrapper.find('tbody tr').exists()).toBe(true);
    });

    test('falls back to index when rowIdKey not provided', () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          rowIdKey: undefined,
          data: [{ name: 'test', value: 100 }],
        }),
      });
      // Should render without errors
      expect(wrapper.find('tbody tr').exists()).toBe(true);
    });
  });

  describe('column visibility', () => {
    test('toggle button hides a column from both table and mobile card views', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({ features: undefined }),
      });
      const toggle = wrapper.find('[data-testid="column-visibility-toggle"]');
      expect(toggle.exists()).toBe(true);
      await toggle.trigger('click');
      const item = wrapper.find('[data-testid="column-toggle-value"]');
      expect(item.exists()).toBe(true);
      await item.trigger('click');
      // table 视图表头不再有 Value
      const headers = wrapper.findAll('thead th');
      expect(headers.map((h) => h.text())).not.toContain('Value');
      // mobile cards 视图（auto 布局默认渲染）也不再有 Value 标签
      expect(wrapper.find('[role="list"]').text()).not.toContain('Value:');
    });

    test('features.visibility=false removes the visibility menu entirely', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ features: { visibility: false } }),
      });
      expect(wrapper.find('[data-testid="column-visibility-toggle"]').exists()).toBe(false);
    });

    test('hiding a column emits columnsVisibilityChange with hidden keys', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      await wrapper.find('[data-testid="column-visibility-toggle"]').trigger('click');
      await wrapper.find('[data-testid="column-toggle-value"]').trigger('click');
      const events = wrapper.emitted('columnsVisibilityChange');
      expect(events).toBeTruthy();
      expect(events![0]).toEqual([['value']]);
    });

    test('interaction state survives LLM re-emitting props with a new columns array reference', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      await wrapper.find('[data-testid="column-visibility-toggle"]').trigger('click');
      await wrapper.find('[data-testid="column-toggle-value"]').trigger('click');
      expect(wrapper.findAll('thead th').map((h) => h.text())).not.toContain('Value');
      // LLM 重发：同 key 集合但全新数组引用
      await wrapper.setProps({
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'value', label: 'Value' },
        ],
      });
      expect(wrapper.findAll('thead th').map((h) => h.text())).not.toContain('Value');
    });

    test('hidden column is excluded from mobile card view in cards layout', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({ layout: 'cards' }),
      });
      await wrapper.find('[data-testid="column-visibility-toggle"]').trigger('click');
      await wrapper.find('[data-testid="column-toggle-value"]').trigger('click');
      const list = wrapper.find('[role="list"]');
      expect(list.text()).toContain('Alpha');
      expect(list.text()).not.toContain('200');
    });
  });

  describe('column reorder', () => {
    function dragHandle(wrapper: ReturnType<typeof mount>, key: string) {
      return wrapper.find(`[data-testid="drag-handle-${key}"]`);
    }
    function headerTexts(wrapper: ReturnType<typeof mount>) {
      return wrapper.findAll('thead th').map((th) => th.text());
    }
    // VTU trigger() 对 pointer 事件走 MouseEvent 构造且 clientX 只读，
    // 必须用原生 PointerEvent 派发（jsdom 已支持 PointerEvent 构造器）。
    // 真实浏览器 setPointerCapture 会把事件重定向到手柄，落点探测走
    // document.elementFromPoint——jsdom 默认不实现该方法，测试需 stub。
    function dispatchPointer(el: Element, type: string, init: PointerEventInit = {}) {
      el.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
    }
    async function dragColumnTo(wrapper: ReturnType<typeof mount>, fromKey: string, toKey: string) {
      const from = dragHandle(wrapper, fromKey).element;
      const to = wrapper.find(`th[data-column-key="${toKey}"]`).element;
      const origElementFromPoint = document.elementFromPoint;
      document.elementFromPoint = () => to;
      try {
        dispatchPointer(from, 'pointerdown', { pointerId: 1, clientX: 0, clientY: 0 });
        await nextTick();
        dispatchPointer(from, 'pointermove', { pointerId: 1, clientX: 50, clientY: 10 });
        await nextTick();
        dispatchPointer(from, 'pointerup', { pointerId: 1 });
        await nextTick();
      } finally {
        document.elementFromPoint = origElementFromPoint;
      }
    }

    test('drag handle renders per column when reorder enabled (default)', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      expect(dragHandle(wrapper, 'name').exists()).toBe(true);
      expect(dragHandle(wrapper, 'value').exists()).toBe(true);
    });

    test('features.reorder=false removes drag handles', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ features: { reorder: false } }),
      });
      expect(wrapper.find('[data-testid^="drag-handle-"]').exists()).toBe(false);
    });

    test('dragging handle onto another header swaps column order in table view', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      await dragColumnTo(wrapper, 'value', 'name');
      const headers = headerTexts(wrapper);
      expect(headers[0]).toContain('Value');
      expect(headers[1]).toContain('Name');
    });

    test('reordered columns reflect in mobile card view', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          layout: 'cards',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'value', label: 'Value' },
          ],
        }),
      });
      await dragColumnTo(wrapper, 'value', 'name');
      // simple card（无 secondary 列）：重排后首行主标题应为 Value 列的值
      const firstCard = wrapper.find('[role="listitem"]');
      expect(firstCard.find('.font-medium').text()).toBe('100');
    });

    test('reorder emits columnsReorder with new key order', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      await dragColumnTo(wrapper, 'value', 'name');
      const events = wrapper.emitted('columnsReorder');
      expect(events).toBeTruthy();
      expect(events![0]).toEqual([['value', 'name']]);
    });

    test('unsortable column can still be reordered via drag handle', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [
            { key: 'name', label: 'Name', sortable: false },
            { key: 'value', label: 'Value' },
          ],
        }),
      });
      await dragColumnTo(wrapper, 'name', 'value');
      const headers = headerTexts(wrapper);
      expect(headers[0]).toContain('Value');
    });

    test('sorting still works after drag handles introduced (click does not start drag)', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      const sortBtn = wrapper.find('thead th[data-column-key="name"] button');
      await sortBtn.trigger('click');
      const rows = wrapper.findAll('tbody tr');
      expect(rows[0].text()).toContain('Alpha');
      // 且未触发重排
      expect(wrapper.emitted('columnsReorder')).toBeFalsy();
    });
  });

  describe('column resize', () => {
    function resizeHandle(wrapper: ReturnType<typeof mount>, key: string) {
      return wrapper.find(`[data-testid="resize-handle-${key}"]`);
    }
    function colStyle(wrapper: ReturnType<typeof mount>, index: number) {
      return wrapper.findAll('colgroup col')[index].attributes('style') || '';
    }
    function dispatchPointer(el: Element, type: string, init: PointerEventInit = {}) {
      el.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
    }
    async function dragResize(wrapper: ReturnType<typeof mount>, key: string, deltaX: number) {
      const handle = resizeHandle(wrapper, key).element;
      dispatchPointer(handle, 'pointerdown', { pointerId: 1, clientX: 100 });
      await nextTick();
      dispatchPointer(handle, 'pointermove', { pointerId: 1, clientX: 100 + deltaX });
      await nextTick();
      dispatchPointer(handle, 'pointerup', { pointerId: 1 });
      await nextTick();
    }

    test('resize handle renders per column by default', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      expect(resizeHandle(wrapper, 'name').exists()).toBe(true);
    });

    test('features.resize=false removes resize handles', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ features: { resize: false } }),
      });
      expect(wrapper.find('[data-testid^="resize-handle-"]').exists()).toBe(false);
    });

    test('dragging resize handle updates colgroup width in px', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      await dragResize(wrapper, 'name', 40);
      expect(colStyle(wrapper, 0)).toMatch(/width:\s*\d+px/);
    });

    test('unadjusted column keeps its original width string', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [
            { key: 'name', label: 'Name', width: '30%' },
            { key: 'value', label: 'Value' },
          ],
        }),
      });
      await dragResize(wrapper, 'value', 25);
      expect(colStyle(wrapper, 0)).toContain('30%');
      expect(colStyle(wrapper, 1)).toMatch(/width:\s*\d+px/);
    });

    test('resize emits columnResize with px overrides', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      await dragResize(wrapper, 'name', 40);
      const events = wrapper.emitted('columnResize');
      expect(events).toBeTruthy();
      const payload = events![events!.length - 1][0] as Record<string, number>;
      expect(typeof payload.name).toBe('number');
      expect(payload.name).toBeGreaterThan(0);
    });

    test('resized width survives column reorder (key-based)', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      await dragResize(wrapper, 'name', 40);
      const widthAfter = colStyle(wrapper, 0);
      // 重排 value 到首位后，name 列的 px 宽度跟随到第二位
      //（与 dragColumnTo 同路：capture 后 elementFromPoint 命中目标 th）
      const dragFrom = wrapper.find('[data-testid="drag-handle-value"]').element;
      const to = wrapper.find('th[data-column-key="name"]').element;
      const origElementFromPoint = document.elementFromPoint;
      document.elementFromPoint = () => to;
      try {
        dragFrom.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 2, clientX: 0, clientY: 0 }));
        await nextTick();
        dragFrom.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 2, clientX: 50, clientY: 10 }));
        await nextTick();
        dragFrom.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 2 }));
        await nextTick();
      } finally {
        document.elementFromPoint = origElementFromPoint;
      }
      expect(colStyle(wrapper, 1)).toBe(widthAfter);
    });
  });

  describe('CSV export', () => {
    let createObjectURLCalls: Blob[];
    let anchorClicks: string[];
    beforeAll(() => {
      createObjectURLCalls = [];
      anchorClicks = [];
      URL.createObjectURL = (blob: Blob) => {
        createObjectURLCalls.push(blob);
        return `blob:mock-${createObjectURLCalls.length}`;
      };
      URL.revokeObjectURL = () => {};
      const origCreate = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation(((tag: string, ...rest: unknown[]) => {
        const el = origCreate(tag, ...(rest as []));
        if (tag === 'a') {
          (el as HTMLAnchorElement).click = () => {
            anchorClicks.push((el as HTMLAnchorElement).download);
          };
        }
        return el;
      }) as typeof document.createElement);
    });

    test('export button renders by default', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      expect(wrapper.find('[data-testid="export-csv"]').exists()).toBe(true);
    });

    test('features.export=false removes export button', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ features: { export: false } }),
      });
      expect(wrapper.find('[data-testid="export-csv"]').exists()).toBe(false);
    });

    test('export downloads CSV of current visible columns and formatted values', async () => {
      createObjectURLCalls = [];
      anchorClicks = [];
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'value', label: 'Value', format: { kind: 'number' } },
          ],
          data: [
            { name: 'Alpha', value: 1000 },
            { name: 'Beta, Inc', value: 2000 },
          ],
        }),
      });
      await wrapper.find('[data-testid="export-csv"]').trigger('click');
      expect(anchorClicks.length).toBe(1);
      expect(anchorClicks[0]).toMatch(/\.csv$/);
      const text = await createObjectURLCalls[0].text();
      const lines = text.split('\n');
      expect(lines[0]).toBe('Name,Value');
      // en-US 千分位格式化含逗号，按 RFC4180 引号包裹
      expect(lines[1]).toBe('Alpha,"1,000"');
      // 含逗号的值须被引号包裹转义
      expect(lines[2]).toBe('"Beta, Inc","2,000"');
    });

    test('export reflects sorted and visibility-filtered view', async () => {
      createObjectURLCalls = [];
      const wrapper = mount(DataTable, { props: createProps() });
      // 隐藏 name 列
      await wrapper.find('[data-testid="column-visibility-toggle"]').trigger('click');
      await wrapper.find('[data-testid="column-toggle-name"]').trigger('click');
      // 按 value 降序
      const sortBtn = wrapper.find('th[data-column-key="value"] button');
      await sortBtn.trigger('click');
      await sortBtn.trigger('click');
      await wrapper.find('[data-testid="export-csv"]').trigger('click');
      const text = await createObjectURLCalls[0].text();
      const lines = text.split('\n');
      expect(lines[0]).toBe('Value');
      expect(lines[1]).toBe('200');
      expect(lines[2]).toBe('100');
    });
  });

  describe('sticky header', () => {
    test('thead is sticky so it stays visible while scrolling within maxHeight container', () => {
      const wrapper = mount(DataTable, { props: createProps({ maxHeight: '200px' }) });
      const thead = wrapper.find('thead');
      expect(thead.classes()).toContain('sticky');
      expect(thead.classes()).toContain('top-0');
      // 不透明背景防滚动时表体文字透叠
      expect(thead.classes()).toContain('bg-card');
    });

    test('sort header buttons show pointer cursor to signal clickability', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      const sortButton = wrapper.find('thead button');
      expect(sortButton.classes()).toContain('cursor-pointer');
    });
  });

  describe('maxHeight', () => {
    test('applies max-height style when provided', () => {
      const wrapper = mount(DataTable, {
        props: createProps({ maxHeight: '200px' }),
      });
      const container = wrapper.find('[style*="--max-height"]');
      expect(container.exists()).toBe(true);
    });

    test('does not apply max-height when not provided', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      const container = wrapper.find('.max-h-\\[var\\(--max-height\\)\\]');
      expect(container.exists()).toBe(false);
    });
  });

  describe('cell tooltip', () => {
    // jsdom 无布局：scrollWidth/clientWidth 恒 0，stub prototype getter 模拟文本溢出
    function stubElementWidths(scrollWidth: number, clientWidth: number) {
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        get() { return scrollWidth; },
      });
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        get() { return clientWidth; },
      });
    }

    afterEach(() => {
      stubElementWidths(0, 0);
      document.body.querySelectorAll('[role="tooltip"]').forEach((el) => el.remove());
    });

    test('overflowed cell renders tooltip into document.body on hover', async () => {
      stubElementWidths(500, 100);
      const longText = 'A very long cell value '.repeat(20).trim();
      const wrapper = mount(DataTable, {
        props: createProps({ data: [{ name: longText, value: 1 }] }),
      });
      const trigger = wrapper.find('[data-testid="cell-text-0-name"]');
      expect(trigger.exists()).toBe(true);

      await trigger.trigger('mouseenter');
      const tooltip = document.body.querySelector('[role="tooltip"]');
      expect(tooltip).not.toBeNull();
      expect(tooltip!.textContent).toBe(longText);
      // tooltip 必须脱离表格容器，才能逃出滚动容器的 overflow 裁剪
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);

      await trigger.trigger('mouseleave');
      expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
      wrapper.unmount();
    });

    test('overflow state is measured at hover time, not at mount', async () => {
      // 流式布局与字体晚载都会让 mount 后宽度才变化；溢出判定必须以 hover 时刻为准
      stubElementWidths(0, 0);
      const longText = 'A very long cell value '.repeat(20).trim();
      const wrapper = mount(DataTable, {
        props: createProps({ data: [{ name: longText, value: 1 }] }),
      });
      const trigger = wrapper.find('[data-testid="cell-text-0-name"]');

      // mount 后才变为溢出（模拟布局后至/字体替换导致的字宽变化）
      stubElementWidths(500, 100);
      await trigger.trigger('mouseenter');
      expect(document.body.querySelector('[role="tooltip"]')).not.toBeNull();

      await trigger.trigger('mouseleave');
      wrapper.unmount();
    });

    test('non-overflowed cell does not show tooltip on hover', async () => {
      const wrapper = mount(DataTable, { props: createProps() });
      const trigger = wrapper.find('[data-testid="cell-text-0-name"]');
      await trigger.trigger('mouseenter');
      expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
      wrapper.unmount();
    });

    test('array more badge renders hidden items tooltip into document.body', async () => {
      const wrapper = mount(DataTable, {
        props: createProps({
          columns: [{ key: 'tags', label: 'Tags', format: { kind: 'array', maxVisible: 1 } }],
          data: [{ tags: ['alpha', 'beta', 'gamma'] }],
        }),
      });
      const trigger = wrapper.find('[data-testid="array-more-0-tags"]');
      expect(trigger.exists()).toBe(true);

      await trigger.trigger('mouseenter');
      const tooltip = document.body.querySelector('[role="tooltip"]');
      expect(tooltip).not.toBeNull();
      expect(tooltip!.textContent).toBe('beta, gamma');
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);

      await trigger.trigger('mouseleave');
      expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
      wrapper.unmount();
    });
  });
});

describe('数组 props 缺省防御(LLM 产出宽容)', () => {
  test('omitting columns/data renders empty state without crashing', () => {
    const wrapper = mount(DataTable, { props: { id: 'dt-guard' } as any });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('No data available');
  });
});
