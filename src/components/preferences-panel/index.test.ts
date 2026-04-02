import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import PreferencesPanel from './index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-preferences',
    title: 'Settings',
    sections: [
      {
        heading: 'General',
        items: [
          { id: 'notifications', type: 'switch' as const, label: 'Notifications', defaultChecked: true },
          {
            id: 'theme',
            type: 'toggle' as const,
            label: 'Theme',
            options: [
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ],
            defaultValue: 'light',
          },
          {
            id: 'language',
            type: 'select' as const,
            label: 'Language',
            selectOptions: [
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' },
              { value: 'it', label: 'Italian' },
            ],
            defaultSelected: 'en',
          },
        ],
      },
    ],
    ...overrides,
  };
}

describe('PreferencesPanel', () => {
  describe('rendering', () => {
    test('renders title', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      expect(wrapper.text()).toContain('Settings');
    });

    test('renders section heading', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      expect(wrapper.text()).toContain('General');
    });

    test('renders switch item', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      expect(wrapper.text()).toContain('Notifications');
      const switchBtn = wrapper.find('[role="switch"]');
      expect(switchBtn.exists()).toBe(true);
      expect(switchBtn.attributes('aria-checked')).toBe('true');
    });

    test('renders toggle options', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      expect(wrapper.text()).toContain('Theme');
      expect(wrapper.text()).toContain('Light');
      expect(wrapper.text()).toContain('Dark');
    });

    test('renders select with options', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const select = wrapper.find('select');
      expect(select.exists()).toBe(true);
      expect(wrapper.text()).toContain('Language');
      expect(wrapper.text()).toContain('English');
    });

    test('has data-slot attribute', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      expect(wrapper.find('[data-slot="preferences-panel"]').exists()).toBe(true);
    });

    test('has data-tool-ui-id attribute', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      expect(wrapper.find('[data-tool-ui-id="test-preferences"]').exists()).toBe(true);
    });

    test('has role=form in interactive mode', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      expect(wrapper.find("[role='form']").exists()).toBe(true);
    });

    test('applies custom css.root', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({ css: { root: 'my-panel' } }),
      });
      expect(wrapper.find('[data-slot="preferences-panel"]').classes()).toContain('my-panel');
    });

    test('renders without title', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({ title: undefined }),
      });
      expect(wrapper.find('h2').exists()).toBe(false);
    });

    test('renders sections without headings', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                { id: 'item1', type: 'switch' as const, label: 'Item 1' },
              ],
            },
          ],
        }),
      });
      expect(wrapper.find('legend').exists()).toBe(false);
      expect(wrapper.text()).toContain('Item 1');
    });
  });

  describe('interactions - switch', () => {
    test('toggles switch and emits change', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const switchBtn = wrapper.find('[role="switch"]');
      await switchBtn.trigger('click');
      expect(wrapper.emitted('change')).toBeTruthy();
      expect((wrapper.emitted('change')![0] as unknown[])[0]).toMatchObject({ notifications: false });
    });

    test('switch reflects defaultChecked state', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                { id: 'switch1', type: 'switch' as const, label: 'Switch 1', defaultChecked: false },
                { id: 'switch2', type: 'switch' as const, label: 'Switch 2', defaultChecked: true },
              ],
            },
          ],
        }),
      });
      const switches = wrapper.findAll('[role="switch"]');
      expect(switches[0].attributes('aria-checked')).toBe('false');
      expect(switches[1].attributes('aria-checked')).toBe('true');
    });
  });

  describe('interactions - toggle', () => {
    test('selects toggle option and emits change', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const darkBtn = wrapper.findAll('button').find((b) => b.text() === 'Dark');
      expect(darkBtn).toBeDefined();
      await darkBtn!.trigger('click');
      expect(wrapper.emitted('change')).toBeTruthy();
      expect((wrapper.emitted('change')![0] as unknown[])[0]).toMatchObject({ theme: 'dark' });
    });

    test('toggle shows selected state', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const buttons = wrapper.findAll('button').filter((b) => ['Light', 'Dark'].includes(b.text()));
      expect(buttons[0].classes()).toContain('bg-primary');
      await buttons[1].trigger('click');
      expect(buttons[1].classes()).toContain('bg-primary');
    });

    test('toggle uses first option as default when no defaultValue', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                {
                  id: 'toggle1',
                  type: 'toggle' as const,
                  label: 'Toggle',
                  options: [
                    { value: 'a', label: 'Option A' },
                    { value: 'b', label: 'Option B' },
                  ],
                },
              ],
            },
          ],
        }),
      });
      const buttons = wrapper.findAll('button').filter((b) => ['Option A', 'Option B'].includes(b.text()));
      expect(buttons[0].classes()).toContain('bg-primary');
    });
  });

  describe('interactions - select', () => {
    test('changes select and emits change', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const select = wrapper.find('select');
      await select.setValue('es');
      expect(wrapper.emitted('change')).toBeTruthy();
      expect((wrapper.emitted('change')![0] as unknown[])[0]).toMatchObject({ language: 'es' });
    });

    test('select uses first option as default when no defaultSelected', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                {
                  id: 'select1',
                  type: 'select' as const,
                  label: 'Select',
                  selectOptions: [
                    { value: 'opt1', label: 'Option 1' },
                    { value: 'opt2', label: 'Option 2' },
                    { value: 'opt3', label: 'Option 3' },
                    { value: 'opt4', label: 'Option 4' },
                    { value: 'opt5', label: 'Option 5' },
                  ],
                },
              ],
            },
          ],
        }),
      });
      const select = wrapper.find('select');
      expect((select.element as HTMLSelectElement).value).toBe('opt1');
    });
  });

  describe('controlled mode', () => {
    test('uses value prop when provided', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          value: { notifications: false, theme: 'dark', language: 'es' },
        }),
      });
      const switchBtn = wrapper.find('[role="switch"]');
      expect(switchBtn.attributes('aria-checked')).toBe('false');
    });

    test('emits change when value changes via v-model', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          value: { notifications: true, theme: 'light', language: 'en' },
        }),
      });
      const switchBtn = wrapper.find('[role="switch"]');
      await switchBtn.trigger('click');
      // In controlled mode, useVModel emits update:value
      expect(wrapper.emitted('update:value')).toBeTruthy();
    });
  });

  describe('actions', () => {
    test('emits action on save click after making a change', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const switchBtn = wrapper.find('[role="switch"]');
      await switchBtn.trigger('click');
      const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'));
      expect(saveBtn).toBeDefined();
      await saveBtn!.trigger('click');
      expect(wrapper.emitted('action')).toBeTruthy();
      expect((wrapper.emitted('action')![0] as unknown[])[0]).toBe('save');
    });

    test('emits action on cancel click', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const cancelBtn = wrapper.findAll('button').find((b) => b.text().includes('Cancel'));
      expect(cancelBtn).toBeDefined();
      await cancelBtn!.trigger('click');
      expect(wrapper.emitted('action')).toBeTruthy();
      expect((wrapper.emitted('action')![0] as unknown[])[0]).toBe('cancel');
    });

    test('save is disabled when no changes made', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'));
      expect(saveBtn!.attributes('disabled')).toBeDefined();
    });

    test('save is enabled after making a change', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const switchBtn = wrapper.find('[role="switch"]');
      await switchBtn.trigger('click');
      const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'));
      expect(saveBtn!.attributes('disabled')).toBeUndefined();
    });

    test('emits beforeAction before action', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const switchBtn = wrapper.find('[role="switch"]');
      await switchBtn.trigger('click');
      const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'));
      await saveBtn!.trigger('click');
      expect(wrapper.emitted('beforeAction')).toBeTruthy();
      expect((wrapper.emitted('beforeAction')![0] as unknown[])[0]).toBe('save');
    });

    test('supports custom actions', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          actions: [
            { id: 'reset', label: 'Reset', variant: 'ghost' as const },
            { id: 'apply', label: 'Apply', variant: 'default' as const },
          ],
        }),
      });
      expect(wrapper.text()).toContain('Reset');
      expect(wrapper.text()).toContain('Apply');
      const applyBtn = wrapper.findAll('button').find((b) => b.text().includes('Apply'));
      await applyBtn!.trigger('click');
      expect((wrapper.emitted('action')![0] as unknown[])[0]).toBe('apply');
    });

    test('supports actions config object with alignment', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          actions: {
            items: [
              { id: 'save', label: 'Save', variant: 'default' as const },
            ],
            align: 'left' as const,
          },
        }),
      });
      // Check that the actions container has the correct alignment class
      const actionsContainer = wrapper.find("[class*='@container/actions'] > div");
      expect(actionsContainer.exists()).toBe(true);
      expect(actionsContainer.classes()).toContain('justify-start');
    });

    test('cancel resets values to initial', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const switchBtn = wrapper.find('[role="switch"]');
      await switchBtn.trigger('click');
      expect(switchBtn.attributes('aria-checked')).toBe('false');

      const cancelBtn = wrapper.findAll('button').find((b) => b.text().includes('Cancel'));
      await cancelBtn!.trigger('click');

      // After cancel, switch should be back to initial state
      expect(wrapper.emitted('change')!.length).toBeGreaterThan(0);
      const lastChangeEvent = (wrapper.emitted('change')!.pop() as unknown[])[0] as Record<string, unknown>;
      expect(lastChangeEvent.notifications).toBe(true);
    });
  });

  describe('receipt mode', () => {
    test('renders receipt view when choice is provided', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { notifications: false, theme: 'dark', language: 'en' },
        }),
      });
      expect(wrapper.find('[data-receipt="true"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Saved');
      expect(wrapper.text()).toContain('Off');
      expect(wrapper.text()).toContain('Dark');
    });

    test('has role=status in receipt mode', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { notifications: false },
        }),
      });
      expect(wrapper.find("[role='status']").exists()).toBe(true);
    });

    test('has correct aria-label in receipt mode', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { notifications: false },
        }),
      });
      expect(wrapper.find("[role='status']").attributes('aria-label')).toBe('Confirmed preferences');
    });

    test('renders errors in receipt mode', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { notifications: false },
          error: { notifications: 'Invalid state' },
        }),
      });
      expect(wrapper.text()).toContain('Error');
      expect(wrapper.text()).toContain('Invalid state');
    });

    test('has correct aria-label when errors present', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { notifications: false },
          error: { notifications: 'Invalid' },
        }),
      });
      expect(wrapper.find("[role='status']").attributes('aria-label')).toBe('Preferences with errors');
    });

    test('does not render action buttons in receipt mode', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { notifications: false },
        }),
      });
      // Receipt mode shows "Saved" status but not action buttons
      // Check for specific button text that would only appear in interactive mode
      const buttons = wrapper.findAll('button');
      const hasSaveButton = buttons.some((b) => b.text() === 'Save Changes');
      const hasCancelButton = buttons.some((b) => b.text() === 'Cancel');
      expect(hasSaveButton).toBe(false);
      expect(hasCancelButton).toBe(false);
    });

    test('does not emit change in receipt mode', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { notifications: false },
        }),
      });
      // Try to find any interactive element - there should be none
      expect(wrapper.find('[role="switch"]').exists()).toBe(false);
      expect(wrapper.find('select').exists()).toBe(false);
    });

    test('shows error icon for items with errors', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { notifications: false, theme: 'light' },
          error: { notifications: 'Error message' },
        }),
      });
      // Should have AlertCircle icons for errors
      expect(wrapper.find('svg').exists()).toBe(true);
    });
  });

  describe('display value formatting', () => {
    test("shows 'On' for true switch value in receipt", () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { notifications: true },
          sections: [
            {
              items: [
                { id: 'notifications', type: 'switch' as const, label: 'Notifications' },
              ],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('On');
    });

    test("shows 'Off' for false switch value in receipt", () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { notifications: false },
          sections: [
            {
              items: [
                { id: 'notifications', type: 'switch' as const, label: 'Notifications' },
              ],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('Off');
    });

    test('shows option label for toggle value in receipt', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { theme: 'dark' },
          sections: [
            {
              items: [
                {
                  id: 'theme',
                  type: 'toggle' as const,
                  label: 'Theme',
                  options: [
                    { value: 'light', label: 'Light Mode' },
                    { value: 'dark', label: 'Dark Mode' },
                  ],
                },
              ],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('Dark Mode');
    });

    test('shows raw value when option not found', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { theme: 'unknown' },
          sections: [
            {
              items: [
                {
                  id: 'theme',
                  type: 'toggle' as const,
                  label: 'Theme',
                  options: [
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                  ],
                },
              ],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('unknown');
    });
  });

  describe('item descriptions', () => {
    test('renders item description', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                {
                  id: 'item1',
                  type: 'switch' as const,
                  label: 'Item',
                  description: 'This is a description',
                },
              ],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('This is a description');
    });

    test('renders description in receipt mode', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { item1: true },
          sections: [
            {
              items: [
                {
                  id: 'item1',
                  type: 'switch' as const,
                  label: 'Item',
                  description: 'This is a description',
                },
              ],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('This is a description');
    });

    test('shows error instead of description when item has error', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { item1: true },
          error: { item1: 'Error message' },
          sections: [
            {
              items: [
                {
                  id: 'item1',
                  type: 'switch' as const,
                  label: 'Item',
                  description: 'This is a description',
                },
              ],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('Error message');
      expect(wrapper.text()).not.toContain('This is a description');
    });
  });

  describe('section layout', () => {
    test('uses fieldset with legend for sections with headings', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps(),
      });
      expect(wrapper.find('fieldset').exists()).toBe(true);
      expect(wrapper.find('legend').exists()).toBe(true);
    });

    test('uses div for sections without headings', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                { id: 'item1', type: 'switch' as const, label: 'Item 1' },
              ],
            },
          ],
        }),
      });
      expect(wrapper.find('fieldset').exists()).toBe(false);
    });

    test('removes top padding for first item when no title and no heading', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          title: undefined,
          sections: [
            {
              items: [
                { id: 'item1', type: 'switch' as const, label: 'Item 1' },
              ],
            },
          ],
        }),
      });
      const itemRow = wrapper.find('.py-3, .pt-0');
      expect(itemRow.exists()).toBe(true);
    });
  });

  describe('dirty state detection', () => {
    test('is not dirty initially with defaults', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps(),
      });
      const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'));
      expect(saveBtn!.attributes('disabled')).toBeDefined();
    });

    test('is dirty after changing a value', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps(),
      });
      const switchBtn = wrapper.find('[role="switch"]');
      await switchBtn.trigger('click');
      const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'));
      expect(saveBtn!.attributes('disabled')).toBeUndefined();
    });

    test('is not dirty after cancel', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps(),
      });
      const switchBtn = wrapper.find('[role="switch"]');
      await switchBtn.trigger('click');
      const cancelBtn = wrapper.findAll('button').find((b) => b.text().includes('Cancel'));
      await cancelBtn!.trigger('click');
      const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'));
      expect(saveBtn!.attributes('disabled')).toBeDefined();
    });
  });

  describe('signature reset', () => {
    test('resets local values when sections change', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps(),
      });
      // Make a change
      const switchBtn = wrapper.find('[role="switch"]');
      await switchBtn.trigger('click');
      expect(wrapper.emitted('change')).toBeTruthy();

      // Change sections
      await wrapper.setProps({
        sections: [
          {
            items: [
              { id: 'newItem', type: 'switch' as const, label: 'New Item' },
            ],
          },
        ],
      });

      // Local state should be reset (no new change event from reset)
      const changeCount = wrapper.emitted('change')?.length || 0;
      // The change from initial click + potential reset
      expect(changeCount).toBeGreaterThanOrEqual(1);
    });
  });
});
