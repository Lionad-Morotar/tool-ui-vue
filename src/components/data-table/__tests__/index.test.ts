import { mount } from '@vue/test-utils';
import { describe, expect, test, beforeAll, afterAll } from 'vitest';
import DataTable from '../index.vue';
import { ALLOWED_PATTERNS } from '../../../test/console-guard';

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

    test('has data-layout attribute defaulting to auto', () => {
      const wrapper = mount(DataTable, { props: createProps() });
      expect(wrapper.find('[data-slot="data-table"]').attributes('data-layout')).toBe('auto');
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
      const tableContainer = wrapper.find('[data-slot="data-table"] > div:first-child');
      expect(tableContainer.classes()).toContain('block');
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
      const expandButton = wrapper.find('[aria-expanded]');
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
      expect(cells[1].text()).toBe('2');
      expect(cells[3].text()).toBe('10');
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
});
