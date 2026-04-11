import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { ref } from 'vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-plan',
    title: 'Project Plan',
    description: 'Step by step',
    todos: [
      { id: '1', label: 'Setup', status: 'completed' },
      { id: '2', label: 'Build', status: 'in_progress' },
      { id: '3', label: 'Test', status: 'pending' },
      { id: '4', label: 'Deploy', status: 'cancelled' },
      { id: '5', label: 'Monitor', status: 'pending', description: 'Keep an eye on metrics' },
    ],
    maxVisibleTodos: 4,
    ...overrides,
  };
}

// Shared locale state for i18n switching
const currentLocale = ref('en');

// Mock useI18n before any component imports it
vi.mock('@lionad/vtu-core/i18n', async (importOriginal) => {
  const { computed } = await import('vue');
  const actual = await importOriginal<Record<string, unknown>>();
  const messagesByLocale: Record<string, Record<string, string>> = {
    en: { 'plan.complete': 'complete', 'plan.more': '{count} more' },
    'zh-CN': { 'plan.complete': '已完成', 'plan.more': '还有 {count} 项' },
  };
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        const msgs = messagesByLocale[currentLocale.value] ?? {};
        let text = msgs[key] ?? key;
        if (params && params.count !== undefined) {
          text = text.replace('{count}', String(params.count));
        }
        return computed(() => text);
      },
      locale: computed(() => currentLocale.value),
      setLocale: (locale: string) => { currentLocale.value = locale; },
    }),
  };
});

import Plan from '../index.vue';

function mountPlan(props: Record<string, unknown> = {}) {
  return mount(Plan, { props: createProps(props) });
}

describe('Plan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders title and description', () => {
      const wrapper = mountPlan();
      expect(wrapper.text()).toContain('Project Plan');
      expect(wrapper.text()).toContain('Step by step');
    });

    test('renders progress text with i18n', () => {
      const wrapper = mountPlan();
      // With mocked t(), should see translated text
      expect(wrapper.text()).toContain('complete');
    });

    test('renders todo labels', () => {
      const wrapper = mountPlan();
      expect(wrapper.text()).toContain('Setup');
      expect(wrapper.text()).toContain('Build');
      expect(wrapper.text()).toContain('Test');
      expect(wrapper.text()).toContain('Deploy');
    });

    test('shows completion icon when all todos are completed', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'completed' },
          { id: '2', label: 'Build', status: 'completed' },
        ],
      });
      const svg = wrapper.find('svg.text-emerald-500');
      expect(svg.exists()).toBe(true);
    });

    test('has data-slot attribute', () => {
      const wrapper = mountPlan();
      expect(wrapper.find('[data-slot="plan"]').exists()).toBe(true);
    });

    test('applies custom css.root', () => {
      const wrapper = mountPlan({ css: { root: 'my-plan' } });
      expect(wrapper.find('[data-slot="plan"]').classes()).toContain('my-plan');
    });

    test('has correct data-tool-ui-id', () => {
      const wrapper = mountPlan();
      expect(wrapper.find('[data-tool-ui-id="test-plan"]').exists()).toBe(true);
    });

    test('renders without description', () => {
      const wrapper = mountPlan({ description: undefined });
      expect(wrapper.text()).toContain('Project Plan');
      expect(wrapper.text()).not.toContain('Step by step');
    });
  });

  describe('progress bar', () => {
    test('sets progressbar attributes', () => {
      const wrapper = mountPlan();
      const bar = wrapper.find('[role="progressbar"]');
      expect(bar.exists()).toBe(true);
      expect(bar.attributes('aria-valuenow')).toBe('20');
    });

    test('shows 100% styling when all complete', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'completed' },
        ],
      });
      const fill = wrapper.find('[role="progressbar"] > div');
      expect(fill.classes()).toContain('bg-gradient-to-r');
    });

    test('calculates progress correctly', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'completed' },
          { id: '2', label: 'Build', status: 'completed' },
          { id: '3', label: 'Test', status: 'pending' },
          { id: '4', label: 'Deploy', status: 'pending' },
        ],
      });
      const bar = wrapper.find('[role="progressbar"]');
      expect(bar.attributes('aria-valuenow')).toBe('50');
    });

    test('shows 0% when no todos completed', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'pending' },
          { id: '2', label: 'Build', status: 'in_progress' },
        ],
      });
      const bar = wrapper.find('[role="progressbar"]');
      expect(bar.attributes('aria-valuenow')).toBe('0');
    });
  });

  describe('todo statuses', () => {
    test('shows pending status styling', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'pending' },
        ],
      });
      expect(wrapper.html()).toContain('text-muted-foreground');
    });

    test('shows in_progress status styling', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'in_progress' },
        ],
      });
      expect(wrapper.html()).toContain('shimmer');
    });

    test('shows completed status styling', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'completed' },
        ],
      });
      const html = wrapper.html();
      expect(html).toContain('border-primary');
      expect(html).toContain('bg-primary');
    });

    test('shows cancelled status styling', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'cancelled' },
        ],
      });
      const cancelled = wrapper.findAll('span').filter((span) =>
        span.classes().includes('bg-destructive')
      );
      expect(cancelled.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('show more', () => {
    test('shows hidden todos when clicking show more', async () => {
      const wrapper = mountPlan();
      expect(wrapper.text()).not.toContain('Monitor');
      const showMore = wrapper.findAll('button').find((b) => b.text().includes('more'));
      expect(showMore).toBeDefined();
      await showMore!.trigger('click');
      expect(wrapper.text()).toContain('Monitor');
    });

    test('shows correct hidden count text', () => {
      const wrapper = mountPlan();
      // t() returns translated text like "1 more" (en) or "还有 1 项" (zh-CN)
      expect(wrapper.text()).toMatch(/\d+ more/);
    });

    test('hides show more when all todos visible', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'completed' },
          { id: '2', label: 'Build', status: 'pending' },
        ],
        maxVisibleTodos: 4,
      });
      expect(wrapper.text()).not.toContain('plan.more');
    });
  });

  describe('todo descriptions', () => {
    test('toggles description expand', async () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'completed', description: 'Initial setup steps' },
          { id: '2', label: 'Build', status: 'in_progress' },
          { id: '3', label: 'Test', status: 'pending' },
        ],
        maxVisibleTodos: 4,
      });
      const setupLi = wrapper.findAll('li').find((li) => li.text().includes('Setup'));
      expect(setupLi).toBeDefined();
      const expandBtn = setupLi!.find('button');
      expect(expandBtn.exists()).toBe(true);
      await expandBtn.trigger('click');
      expect(wrapper.text()).toContain('Initial setup steps');
    });

    test('does not show expand button for todos without description', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'completed' },
        ],
      });
      const setupLi = wrapper.findAll('li').find((li) => li.text().includes('Setup'));
      expect(setupLi).toBeDefined();
      const buttons = setupLi!.findAll('button');
      const expandButtons = buttons.filter((b) => !b.text().includes('more'));
      expect(expandButtons.length).toBe(0);
    });
  });

  describe('interactions', () => {
    test('emits todoClick on todo click', async () => {
      const wrapper = mountPlan();
      const todo = wrapper.findAll('li').find((li) => li.text().includes('Build'));
      expect(todo).toBeDefined();
      await todo!.trigger('click');
      expect(wrapper.emitted('todoClick')).toBeTruthy();
      expect(wrapper.emitted('todoClick')![0]).toEqual(['2', 1]);
    });

    test('emits correct index for hidden todos', async () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'completed' },
          { id: '2', label: 'Build', status: 'in_progress' },
          { id: '3', label: 'Test', status: 'pending' },
          { id: '4', label: 'Deploy', status: 'cancelled' },
          { id: '5', label: 'Monitor', status: 'pending' },
        ],
      });
      const showMore = wrapper.findAll('button').find((b) => b.text().includes('more'));
      await showMore!.trigger('click');
      await wrapper.vm.$nextTick();
      const allUls = wrapper.findAll('ul');
      const hiddenUl = allUls[allUls.length - 1];
      const hiddenLis = hiddenUl.findAll('li');
      const monitorLi = hiddenLis.find((li) => li.text().includes('Monitor'));
      expect(monitorLi).toBeDefined();
      await monitorLi!.trigger('click');
      expect(wrapper.emitted('todoClick')).toBeTruthy();
      expect(wrapper.emitted('todoClick')![0]).toEqual(['5', 4]);
    });
  });

  describe('connector lines', () => {
    test('renders connector lines between todos', () => {
      const wrapper = mountPlan({
        todos: [
          { id: '1', label: 'Setup', status: 'completed' },
          { id: '2', label: 'Build', status: 'pending' },
          { id: '3', label: 'Test', status: 'pending' },
        ],
      });
      const connectors = wrapper.findAll('.bg-border');
      expect(connectors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('i18n integration', () => {
    test('imports useI18n from core package', async () => {
      const source = await import('fs');
      const path = await import('path');
      const code = source.readFileSync(
        path.join(__dirname, '../index.vue'),
        'utf-8'
      );
      expect(code).toContain("import { useI18n } from '@lionad/vtu-core/i18n'");
    });

    test('uses t() for progress text instead of hardcoded string', async () => {
      const source = await import('fs');
      const path = await import('path');
      const code = source.readFileSync(
        path.join(__dirname, '../index.vue'),
        'utf-8'
      );
      expect(code).toContain("t('plan.complete')");
      expect(code).not.toContain("complete</");
    });

    test('uses t() for hidden count with params', async () => {
      const source = await import('fs');
      const path = await import('path');
      const code = source.readFileSync(
        path.join(__dirname, '../index.vue'),
        'utf-8'
      );
      expect(code).toContain("t('plan.more'");
      expect(code).not.toContain("more</");
    });
  });

  describe('i18n', () => {
    beforeEach(() => { currentLocale.value = 'en'; });

    test('renders zh-CN text when locale is zh-CN', () => {
      currentLocale.value = 'zh-CN';
      const wrapper = mountPlan();
      expect(wrapper.text()).toContain('已完成');
    });

    test('renders English text when locale is en', () => {
      currentLocale.value = 'en';
      const wrapper = mountPlan();
      expect(wrapper.text()).toContain('complete');
    });
  });
});
