import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Plan from '../index.vue';

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

describe('Plan', () => {
  describe('rendering', () => {
    test('renders title and description', () => {
      const wrapper = mount(Plan, { props: createProps() });
      expect(wrapper.text()).toContain('Project Plan');
      expect(wrapper.text()).toContain('Step by step');
    });

    test('renders progress text', () => {
      const wrapper = mount(Plan, { props: createProps() });
      expect(wrapper.text()).toContain('1 of 5 complete');
    });

    test('renders todo labels', () => {
      const wrapper = mount(Plan, { props: createProps() });
      expect(wrapper.text()).toContain('Setup');
      expect(wrapper.text()).toContain('Build');
      expect(wrapper.text()).toContain('Test');
      expect(wrapper.text()).toContain('Deploy');
    });

    test('shows completion icon when all todos are completed', () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'completed' },
            { id: '2', label: 'Build', status: 'completed' },
          ],
        }),
      });
      const svg = wrapper.find('svg.text-emerald-500');
      expect(svg.exists()).toBe(true);
    });

    test('has data-slot attribute', () => {
      const wrapper = mount(Plan, { props: createProps() });
      expect(wrapper.find('[data-slot="plan"]').exists()).toBe(true);
    });

    test('applies custom css.root', () => {
      const wrapper = mount(Plan, {
        props: createProps({ css: { root: 'my-plan' } }),
      });
      expect(wrapper.find('[data-slot="plan"]').classes()).toContain('my-plan');
    });

    test('has correct data-tool-ui-id', () => {
      const wrapper = mount(Plan, { props: createProps() });
      expect(wrapper.find('[data-tool-ui-id="test-plan"]').exists()).toBe(true);
    });

    test('renders without description', () => {
      const wrapper = mount(Plan, {
        props: createProps({ description: undefined }),
      });
      expect(wrapper.text()).toContain('Project Plan');
      expect(wrapper.text()).not.toContain('Step by step');
    });
  });

  describe('progress bar', () => {
    test('sets progressbar attributes', () => {
      const wrapper = mount(Plan, { props: createProps() });
      const bar = wrapper.find('[role="progressbar"]');
      expect(bar.exists()).toBe(true);
      expect(bar.attributes('aria-valuenow')).toBe('20');
    });

    test('shows 100% styling when all complete', () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'completed' },
          ],
        }),
      });
      const fill = wrapper.find('[role="progressbar"] > div');
      expect(fill.classes()).toContain('bg-gradient-to-r');
    });

    test('calculates progress correctly', () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'completed' },
            { id: '2', label: 'Build', status: 'completed' },
            { id: '3', label: 'Test', status: 'pending' },
            { id: '4', label: 'Deploy', status: 'pending' },
          ],
        }),
      });
      const bar = wrapper.find('[role="progressbar"]');
      expect(bar.attributes('aria-valuenow')).toBe('50');
      expect(wrapper.text()).toContain('2 of 4 complete');
    });

    test('shows 0% when no todos completed', () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'pending' },
            { id: '2', label: 'Build', status: 'in_progress' },
          ],
        }),
      });
      const bar = wrapper.find('[role="progressbar"]');
      expect(bar.attributes('aria-valuenow')).toBe('0');
    });
  });

  describe('todo statuses', () => {
    test('shows pending status styling', () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'pending' },
          ],
        }),
      });
      // Pending should have muted text
      expect(wrapper.html()).toContain('text-muted-foreground');
    });

    test('shows in_progress status styling', () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'in_progress' },
          ],
        }),
      });
      // In progress should have shimmer effect
      expect(wrapper.html()).toContain('shimmer');
    });

    test('shows completed status styling', () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'completed' },
          ],
        }),
      });
      // Completed should have border-primary and bg-primary classes on the icon span
      const html = wrapper.html();
      expect(html).toContain('border-primary');
      expect(html).toContain('bg-primary');
    });

    test('shows cancelled status styling', () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'cancelled' },
          ],
        }),
      });
      // Cancelled should have destructive background
      const cancelled = wrapper.findAll('span').filter((span) =>
        span.classes().includes('bg-destructive')
      );
      expect(cancelled.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('show more', () => {
    test('shows hidden todos when clicking show more', async () => {
      const wrapper = mount(Plan, { props: createProps() });
      expect(wrapper.text()).not.toContain('Monitor');
      const showMore = wrapper.findAll('button').find((b) => b.text().includes('more'));
      expect(showMore).toBeDefined();
      await showMore!.trigger('click');
      expect(wrapper.text()).toContain('Monitor');
    });

    test('shows correct hidden count', () => {
      const wrapper = mount(Plan, { props: createProps() });
      expect(wrapper.text()).toContain('1 more');
    });

    test('hides show more when all todos visible', () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'completed' },
            { id: '2', label: 'Build', status: 'pending' },
          ],
          maxVisibleTodos: 4,
        }),
      });
      expect(wrapper.text()).not.toContain('more');
    });
  });

  describe('todo descriptions', () => {
    test('toggles description expand', async () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'completed', description: 'Initial setup steps' },
            { id: '2', label: 'Build', status: 'in_progress' },
            { id: '3', label: 'Test', status: 'pending' },
          ],
          maxVisibleTodos: 4,
        }),
      });
      const setupLi = wrapper.findAll('li').find((li) => li.text().includes('Setup'));
      expect(setupLi).toBeDefined();
      const expandBtn = setupLi!.find('button');
      expect(expandBtn.exists()).toBe(true);
      await expandBtn.trigger('click');
      expect(wrapper.text()).toContain('Initial setup steps');
    });

    test('does not show expand button for todos without description', () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'completed' },
          ],
        }),
      });
      const setupLi = wrapper.findAll('li').find((li) => li.text().includes('Setup'));
      expect(setupLi).toBeDefined();
      // Should not have a button for expanding
      const buttons = setupLi!.findAll('button');
      // Only looking at buttons inside the li, not the show more button
      const expandButtons = buttons.filter((b) => !b.text().includes('more'));
      expect(expandButtons.length).toBe(0);
    });
  });

  describe('interactions', () => {
    test('emits todoClick on todo click', async () => {
      const wrapper = mount(Plan, { props: createProps() });
      const todo = wrapper.findAll('li').find((li) => li.text().includes('Build'));
      expect(todo).toBeDefined();
      await todo!.trigger('click');
      expect(wrapper.emitted('todoClick')).toBeTruthy();
      expect(wrapper.emitted('todoClick')![0]).toEqual(['2', 1]);
    });

    test('emits correct index for hidden todos', async () => {
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'completed' },
            { id: '2', label: 'Build', status: 'in_progress' },
            { id: '3', label: 'Test', status: 'pending' },
            { id: '4', label: 'Deploy', status: 'cancelled' },
            { id: '5', label: 'Monitor', status: 'pending' },
          ],
        }),
      });
      const showMore = wrapper.findAll('button').find((b) => b.text().includes('more'));
      await showMore!.trigger('click');
      // Wait for the DOM to update
      await wrapper.vm.$nextTick();
      // After expanding, find all li elements and look for Monitor in the hidden section
      // The hidden todos are rendered in a nested ul, so we need to find the specific todo li
      const allUls = wrapper.findAll('ul');
      // The hidden todos are in the second ul (index 1) after clicking show more
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
      const wrapper = mount(Plan, {
        props: createProps({
          todos: [
            { id: '1', label: 'Setup', status: 'completed' },
            { id: '2', label: 'Build', status: 'pending' },
            { id: '3', label: 'Test', status: 'pending' },
          ],
        }),
      });
      // Should have connector lines (bg-border elements)
      const connectors = wrapper.findAll('.bg-border');
      expect(connectors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
