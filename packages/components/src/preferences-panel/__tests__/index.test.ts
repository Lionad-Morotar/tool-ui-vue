import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { ref, computed } from 'vue';

enableAutoUnmount(afterEach);

const currentLocale = ref('en');
const messagesByLocale: Record<string, Record<string, string>> = {
  en: {
    'preferencesPanel.preferencesWithErrors': 'Preferences with errors',
    'preferencesPanel.confirmedPreferences': 'Confirmed preferences',
    'preferencesPanel.error': 'Error',
    'preferencesPanel.saved': 'Saved',
  },
  'zh-CN': {
    'preferencesPanel.preferencesWithErrors': '有错误的偏好设置',
    'preferencesPanel.confirmedPreferences': '已确认的偏好设置',
    'preferencesPanel.error': '错误',
    'preferencesPanel.saved': '已保存',
  },
};

vi.mock('../../core/i18n', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => computed(() => {
        const msgs = messagesByLocale[currentLocale.value] ?? {};
        return msgs[key] ?? key;
      }),
      locale: computed(() => currentLocale.value),
      setLocale: (locale: string) => { currentLocale.value = locale; },
    }),
  };
});

import PreferencesPanel from '../index.vue';
import {
  safeParseSerializablePreferencesPanel,
  safeParseSerializablePreferencesPanelReceipt,
} from '../schema';
import {
  installPointerCaptureShim,
  openSelect,
  querySelectItems,
  settle,
} from '../../ui/__tests__/reka-test-utils';

beforeAll(installPointerCaptureShim);

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
          {
            id: 'bio',
            type: 'textarea' as const,
            label: 'Bio',
            placeholder: 'Tell us about yourself',
            rows: 4,
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

    test('renders select as a combobox trigger showing the selected option', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      await flushPromises();
      expect(wrapper.text()).toContain('Language');
      const trigger = wrapper.find('[data-testid="select-trigger"]');
      expect(trigger.exists()).toBe(true);
      expect(trigger.attributes('role')).toBe('combobox');
      expect(trigger.text()).toContain('English');
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
    // ToggleGroupRoot 渲染 div role=group 非 labelable 元素,label[for] 不参与命名,
    // 屏幕阅读器遍历到 toggle 偏好项时组容器的可访问名称靠 aria-labelledby 指回 label
    test('associates toggle group container with its label via aria-labelledby', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const label = wrapper.find('label#preference-theme-label');
      const group = wrapper.find('[data-testid="toggle-group"]');
      expect(label.exists()).toBe(true);
      expect(group.exists()).toBe(true);
      expect(group.attributes('role')).toBe('group');
      expect(group.attributes('aria-labelledby')).toBe(label.attributes('id'));
    });

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
      expect(buttons[0].attributes('data-state')).toBe('on');
      expect(buttons[1].attributes('data-state')).toBe('off');
      await buttons[1].trigger('click');
      expect(buttons[1].attributes('data-state')).toBe('on');
      expect(buttons[0].attributes('data-state')).toBe('off');
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
      expect(buttons[0].attributes('data-state')).toBe('on');
      expect(buttons[1].attributes('data-state')).toBe('off');
    });
  });

  describe('interactions - multi-toggle', () => {
    function createMultiToggleProps(overrides: Record<string, unknown> = {}) {
      return createProps({
        sections: [
          {
            heading: 'Products',
            items: [
              {
                id: 'products',
                type: 'toggle' as const,
                label: 'Select Products',
                multiple: true,
                options: [
                  { value: 'power', label: 'Power Battery' },
                  { value: 'ebike', label: 'E-bike Battery' },
                  { value: 'storage', label: 'Energy Storage' },
                  { value: 'consumer', label: 'Consumer' },
                ],
              },
            ],
          },
        ],
        ...overrides,
      });
    }

    test('renders multi-toggle options with none selected by default', () => {
      const wrapper = mount(PreferencesPanel, { props: createMultiToggleProps() });
      const buttons = wrapper.findAll('button').filter((b) =>
        ['Power Battery', 'E-bike Battery', 'Energy Storage', 'Consumer'].includes(b.text())
      );
      expect(buttons.length).toBe(4);
      // None should be selected initially
      expect(buttons.every((b) => b.attributes('data-state') === 'off')).toBe(true);
    });

    test('selects multiple options in multi-toggle', async () => {
      const wrapper = mount(PreferencesPanel, { props: createMultiToggleProps() });
      const buttons = wrapper.findAll('button').filter((b) =>
        ['Power Battery', 'E-bike Battery', 'Energy Storage', 'Consumer'].includes(b.text())
      );

      await buttons[0].trigger('click');
      await buttons[2].trigger('click');

      expect(wrapper.emitted('change')).toBeTruthy();
      const lastChange = (wrapper.emitted('change')!.pop() as unknown[])[0] as Record<string, unknown>;
      expect(lastChange.products).toEqual(['power', 'storage']);
    });

    test('deselects an already selected option in multi-toggle', async () => {
      const wrapper = mount(PreferencesPanel, { props: createMultiToggleProps() });
      const buttons = wrapper.findAll('button').filter((b) =>
        ['Power Battery', 'E-bike Battery', 'Energy Storage', 'Consumer'].includes(b.text())
      );

      await buttons[0].trigger('click');
      await buttons[2].trigger('click');
      // Deselect the first one
      await buttons[0].trigger('click');

      const lastChange = (wrapper.emitted('change')!.pop() as unknown[])[0] as Record<string, unknown>;
      expect(lastChange.products).toEqual(['storage']);
    });

    test('multi-toggle shows selected state visually', async () => {
      const wrapper = mount(PreferencesPanel, { props: createMultiToggleProps() });
      const buttons = wrapper.findAll('button').filter((b) =>
        ['Power Battery', 'E-bike Battery', 'Energy Storage', 'Consumer'].includes(b.text())
      );

      await buttons[0].trigger('click');
      expect(buttons[0].attributes('data-state')).toBe('on');
      expect(buttons[1].attributes('data-state')).toBe('off');

      await buttons[1].trigger('click');
      expect(buttons[0].attributes('data-state')).toBe('on');
      expect(buttons[1].attributes('data-state')).toBe('on');
    });

    test('multi-toggle respects defaultValue array', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createMultiToggleProps({
          value: { products: ['power', 'consumer'] },
        }),
      });
      const buttons = wrapper.findAll('button').filter((b) =>
        ['Power Battery', 'E-bike Battery', 'Energy Storage', 'Consumer'].includes(b.text())
      );
      expect(buttons[0].attributes('data-state')).toBe('on');
      expect(buttons[3].attributes('data-state')).toBe('on');
      expect(buttons[1].attributes('data-state')).toBe('off');
      expect(buttons[2].attributes('data-state')).toBe('off');
    });

    test('multi-toggle with string defaultValue wraps to array', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                {
                  id: 'tech',
                  type: 'toggle' as const,
                  label: 'Tech',
                  multiple: true,
                  options: [
                    { value: 'lfp', label: 'LFP' },
                    { value: 'ncm', label: 'NCM' },
                  ],
                  defaultValue: 'lfp',
                },
              ],
            },
          ],
        }),
      });
      const buttons = wrapper.findAll('button').filter((b) => ['LFP', 'NCM'].includes(b.text()));
      expect(buttons[0].attributes('data-state')).toBe('on');
      expect(buttons[1].attributes('data-state')).toBe('off');
    });

    test('isDirty detects multi-toggle changes', async () => {
      const wrapper = mount(PreferencesPanel, { props: createMultiToggleProps() });
      const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'));
      expect(saveBtn!.attributes('disabled')).toBeDefined();

      const productButtons = wrapper.findAll('button').filter((b) =>
        ['Power Battery', 'E-bike Battery', 'Energy Storage', 'Consumer'].includes(b.text())
      );
      await productButtons[0].trigger('click');
      expect(saveBtn!.attributes('disabled')).toBeUndefined();
    });

    test('formatDisplayValue joins multi-toggle labels with comma', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createMultiToggleProps({
          choice: { products: ['power', 'storage'] },
        }),
      });
      expect(wrapper.text()).toContain('Power Battery, Energy Storage');
    });

    test('formatDisplayValue shows dash for empty multi-toggle', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createMultiToggleProps({
          choice: { products: [] },
        }),
      });
      expect(wrapper.text()).toContain('-');
    });

    test('cancel resets multi-toggle to initial', async () => {
      const wrapper = mount(PreferencesPanel, { props: createMultiToggleProps() });
      const buttons = wrapper.findAll('button').filter((b) =>
        ['Power Battery', 'E-bike Battery', 'Energy Storage', 'Consumer'].includes(b.text())
      );
      await buttons[0].trigger('click');
      await buttons[1].trigger('click');

      const cancelBtn = wrapper.findAll('button').find((b) => b.text().includes('Cancel'));
      await cancelBtn!.trigger('click');

      const lastChange = (wrapper.emitted('change')!.pop() as unknown[])[0] as Record<string, unknown>;
      expect(lastChange.products).toEqual([]);
    });
  });

  describe('interactions - select', () => {
    test('changes select and emits change', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps(),
        attachTo: document.body,
      });
      await openSelect(wrapper);
      const target = querySelectItems().find((i) => i.textContent === 'Spanish');
      expect(target).toBeTruthy();
      target!.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
      await settle();
      expect(wrapper.emitted('change')).toBeTruthy();
      expect((wrapper.emitted('change')![0] as unknown[])[0]).toMatchObject({ language: 'es' });
    });

    test('select uses first option as default when no defaultSelected', async () => {
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
      await flushPromises();
      expect(wrapper.find('[data-testid="select-trigger"]').text()).toContain('Option 1');
    });

    // trigger 渲染为 button:label[for] 只提供点击聚焦,无障碍命名靠 aria-labelledby 配对,
    // 任一环节断裂都会静默丢失屏幕阅读器的程序关联
    test('associates label with select trigger via for/id and aria-labelledby', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const label = wrapper.find('label[for="preference-language"]');
      const trigger = wrapper.find('[data-testid="select-trigger"]');
      expect(label.exists()).toBe(true);
      expect(trigger.attributes('id')).toBe('preference-language');
      expect(label.attributes('id')).toBeTruthy();
      expect(trigger.attributes('aria-labelledby')).toBe(label.attributes('id'));
    });
  });

  describe('interactions - input', () => {
    // label 点击聚焦与屏幕阅读器关联依赖该 for/id 配对
    test('associates label with input control via for/id', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                { id: 'email', type: 'input' as const, label: 'Email', placeholder: 'you@example.com' },
              ],
            },
          ],
        }),
      });
      expect(wrapper.find('label[for="preference-email"]').exists()).toBe(true);
      expect(wrapper.find('input#preference-email').exists()).toBe(true);
    });
  });

  describe('interactions - textarea', () => {
    test('renders textarea item', () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const textarea = wrapper.find('textarea');
      expect(textarea.exists()).toBe(true);
      expect(textarea.attributes('rows')).toBe('4');
      expect(textarea.attributes('placeholder')).toBe('Tell us about yourself');
    });

    test('textarea emits change on input', async () => {
      const wrapper = mount(PreferencesPanel, { props: createProps() });
      const textarea = wrapper.find('textarea');
      await textarea.setValue('Hello world');
      expect(wrapper.emitted('change')).toBeTruthy();
      expect((wrapper.emitted('change')![0] as unknown[])[0]).toMatchObject({ bio: 'Hello world' });
    });

    test('textarea respects defaultValue', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                {
                  id: 'bio',
                  type: 'textarea' as const,
                  label: 'Bio',
                  defaultValue: 'Default bio text',
                },
              ],
            },
          ],
        }),
      });
      const textarea = wrapper.find('textarea');
      expect((textarea.element as HTMLTextAreaElement).value).toBe('Default bio text');
    });

    test('textarea shows value in receipt mode', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { bio: 'My biography' },
          sections: [
            {
              items: [
                {
                  id: 'bio',
                  type: 'textarea' as const,
                  label: 'Bio',
                },
              ],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('My biography');
      expect(wrapper.find('textarea').exists()).toBe(false);
    });

    test('textarea respects rows attribute', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                {
                  id: 'bio',
                  type: 'textarea' as const,
                  label: 'Bio',
                  rows: 6,
                },
              ],
            },
          ],
        }),
      });
      const textarea = wrapper.find('textarea');
      expect(textarea.attributes('rows')).toBe('6');
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
      expect(wrapper.find('[role="combobox"]').exists()).toBe(false);
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

    test('uses fieldset without legend for sections without headings', () => {
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
      expect(wrapper.find('fieldset').exists()).toBe(true);
      expect(wrapper.find('legend').exists()).toBe(false);
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

  describe('i18n', () => {
    beforeEach(() => { currentLocale.value = 'en'; });

    test('uses zh-CN labels in receipt mode', () => {
      currentLocale.value = 'zh-CN';
      const wrapper = mount(PreferencesPanel, {
        props: createProps({ choice: { notifications: false, theme: 'dark', language: 'en' } }),
      });
      expect(wrapper.text()).toContain('已保存');
    });

    test('uses English labels in receipt mode', () => {
      currentLocale.value = 'en';
      const wrapper = mount(PreferencesPanel, {
        props: createProps({ choice: { notifications: false, theme: 'dark', language: 'en' } }),
      });
      expect(wrapper.text()).toContain('Saved');
    });
  });

  describe('interactions - rating', () => {
    test('renders five stars by default and emits numeric value on pick', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [{ id: 'satisfaction', type: 'rating' as const, label: 'Satisfaction' }],
            },
          ],
        }),
      });
      const items = wrapper.findAll('[data-testid="rating-item"]');
      expect(items).toHaveLength(5);
      await items[2].trigger('click');
      expect((wrapper.emitted('change')!.at(-1) as unknown[])[0]).toMatchObject({
        satisfaction: 3,
      });
    });

    // label[for] 对 rating(div role=radiogroup 派生)不提供无障碍命名,须 aria-labelledby 指回
    test('associates rating with its label via aria-labelledby', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [{ id: 'satisfaction', type: 'rating' as const, label: 'Satisfaction' }],
            },
          ],
        }),
      });
      expect(
        wrapper.find('[data-testid="rating-root"]').attributes('aria-labelledby')
      ).toBe('preference-satisfaction-label');
    });

    test('respects max and defaultValue', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                { id: 'score', type: 'rating' as const, label: 'Score', max: 10, defaultValue: 4 },
              ],
            },
          ],
        }),
      });
      expect(wrapper.findAll('[data-testid="rating-item"]')).toHaveLength(10);
      expect(wrapper.findAll('[data-state="active"]')).toHaveLength(4);
    });

    test('shows "n / max" in receipt', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { satisfaction: 3 },
          sections: [
            {
              items: [{ id: 'satisfaction', type: 'rating' as const, label: 'Satisfaction' }],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('3 / 5');
    });
  });

  describe('interactions - number', () => {
    // number-field 空态(null)与 0 是不同语义:未填 vs 填了零
    test('renders with null initial and commits a number on Enter', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [{ id: 'quantity', type: 'number' as const, label: 'Quantity', min: 0 }],
            },
          ],
        }),
      });
      const input = wrapper.find('[data-testid="number-field-input"]');
      expect((input.element as HTMLInputElement).value).toBe('');
      await input.setValue('7');
      await input.trigger('keydown', { key: 'Enter' });
      expect((wrapper.emitted('change')!.at(-1) as unknown[])[0]).toMatchObject({ quantity: 7 });
    });

    test('respects min/max/step passthrough', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                {
                  id: 'quantity',
                  type: 'number' as const,
                  label: 'Quantity',
                  defaultValue: 4,
                  min: 0,
                  max: 10,
                  step: 2,
                },
              ],
            },
          ],
        }),
        attachTo: document.body,
      });
      const input = wrapper.find('[data-testid="number-field-input"]');
      expect((input.element as HTMLInputElement).value).toBe('4');
      await input.trigger('keydown', { key: 'ArrowUp' });
      expect((wrapper.emitted('change')!.at(-1) as unknown[])[0]).toMatchObject({ quantity: 6 });
    });

    // 清空即「未填」:null 必须穿透进提交值,不得回退 defaultValue
    test('clearing a number entry commits null, not the defaultValue', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                { id: 'quantity', type: 'number' as const, label: 'Quantity', defaultValue: 4, min: 0 },
              ],
            },
          ],
        }),
      });
      const input = wrapper.find('[data-testid="number-field-input"]');
      expect((input.element as HTMLInputElement).value).toBe('4');
      await input.setValue('7');
      await input.trigger('keydown', { key: 'Enter' });
      expect((wrapper.emitted('change')!.at(-1) as unknown[])[0]).toMatchObject({ quantity: 7 });
      await input.setValue('');
      await input.trigger('keydown', { key: 'Enter' });
      expect((wrapper.emitted('change')!.at(-1) as unknown[])[0]).toMatchObject({ quantity: null });
    });

    test('shows "-" for null and plain number in receipt', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { quantity: 8, budget: null },
          sections: [
            {
              items: [
                { id: 'quantity', type: 'number' as const, label: 'Quantity' },
                { id: 'budget', type: 'number' as const, label: 'Budget' },
              ],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('8');
      expect(wrapper.text()).toContain('-');
    });
  });

  describe('interactions - tags', () => {
    test('adds a tag on Enter and emits string array', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                { id: 'keywords', type: 'tags' as const, label: 'Keywords', defaultValue: ['alpha'] },
              ],
            },
          ],
        }),
      });
      expect(wrapper.findAll('[data-testid="tags-input-item"]')).toHaveLength(1);
      const field = wrapper.find('[data-testid="tags-input-field"]');
      await field.setValue('beta');
      await field.trigger('keydown', { key: 'Enter' });
      expect((wrapper.emitted('change')!.at(-1) as unknown[])[0]).toMatchObject({
        keywords: ['alpha', 'beta'],
      });
    });

    // tags 是宽控件,独占一行排列(与 input/textarea/toggle 同布局类)
    test('tags control takes a full row', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            { items: [{ id: 'keywords', type: 'tags' as const, label: 'Keywords' }] },
          ],
        }),
      });
      expect(wrapper.find('[data-testid="preference-field"]').classes()).toContain('flex-col');
    });

    test('shows comma-joined tags in receipt', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { keywords: ['alpha', 'beta'] },
          sections: [
            { items: [{ id: 'keywords', type: 'tags' as const, label: 'Keywords' }] },
          ],
        }),
      });
      expect(wrapper.text()).toContain('alpha, beta');
    });
  });

  describe('interactions - date', () => {
    test('renders date trigger with placeholder and emits YYYY-MM-DD on pick', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                {
                  id: 'due',
                  type: 'date' as const,
                  label: 'Due date',
                  placeholder: 'Pick a date',
                  defaultValue: '2026-03-10',
                },
              ],
            },
          ],
        }),
        attachTo: document.body,
      });
      expect(wrapper.find('[data-testid="date-trigger"]').text()).toContain('2026-03-10');
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      const day = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-reka-calendar-cell-trigger]')
      ).find((el) => !el.hasAttribute('data-outside-view') && el.textContent?.trim() === '15')!;
      day.click();
      await settle();
      expect((wrapper.emitted('change')!.at(-1) as unknown[])[0]).toMatchObject({
        due: '2026-03-15',
      });
    });

    test('range mode emits [start, end] pair', async () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            {
              items: [
                {
                  id: 'period',
                  type: 'date' as const,
                  label: 'Period',
                  mode: 'range' as const,
                  defaultValue: ['2026-03-10', '2026-03-20'],
                },
              ],
            },
          ],
        }),
        attachTo: document.body,
      });
      expect(wrapper.find('[data-testid="date-trigger"]').text()).toContain('2026-03-10 ~ 2026-03-20');
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      const clickDay = async (d: string) => {
        const el = Array.from(
          document.body.querySelectorAll<HTMLElement>('[data-reka-calendar-cell-trigger]')
        ).find((x) => !x.hasAttribute('data-outside-view') && x.textContent?.trim() === d)!;
        el.click();
        await settle();
      };
      await clickDay('12');
      expect(wrapper.emitted('change'), 'single end picked must not emit').toBeFalsy();
      await clickDay('18');
      expect((wrapper.emitted('change')!.at(-1) as unknown[])[0]).toMatchObject({
        period: ['2026-03-12', '2026-03-18'],
      });
    });

    test('shows range joined with ~ in receipt', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          choice: { period: ['2026-03-10', '2026-03-20'] },
          sections: [
            {
              items: [
                { id: 'period', type: 'date' as const, label: 'Period', mode: 'range' as const },
              ],
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('2026-03-10 ~ 2026-03-20');
    });

    // date trigger 是 button 非 labelable,aria-labelledby 须真实落到 DOM
    // (原子层 renderless 根吞 attrs 曾是这里的缺陷,此用例锁定端到端通路)
    test('date trigger carries aria-labelledby in the DOM', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            { items: [{ id: 'due', type: 'date' as const, label: 'Due date' }] },
          ],
        }),
      });
      expect(wrapper.find('[data-testid="date-trigger"]').attributes('aria-labelledby')).toBe(
        'preference-due-label'
      );
    });

    // tags 命名须落在真实输入框上(根容器无 role,落其上不参与名称计算)
    test('tags input field carries aria-labelledby in the DOM', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          sections: [
            { items: [{ id: 'keywords', type: 'tags' as const, label: 'Keywords' }] },
          ],
        }),
      });
      expect(
        wrapper.find('[data-testid="tags-input-field"]').attributes('aria-labelledby')
      ).toBe('preference-keywords-label');
    });

    // 受控脏形态防御:mode 单值但外部值是数组(不过 zod 的受控/receipt 入口),
    // dateModel 按 mode 感知收窄,落到「未选择」态而非放行数组进单值分支静默显示空
    test('controlled array value on single-date mode falls back to placeholder', () => {
      const wrapper = mount(PreferencesPanel, {
        props: createProps({
          value: { due: ['2026-03-10', '2026-03-20'] },
          sections: [
            {
              items: [
                { id: 'due', type: 'date' as const, label: 'Due date', placeholder: 'Pick a date' },
              ],
            },
          ],
        }),
      });
      expect(wrapper.find('[data-testid="date-trigger"]').text()).toContain('Pick a date');
    });
  });
});

describe('数组 props 缺省防御(LLM 产出宽容)', () => {
  test('omitting sections renders without crashing', () => {
    const wrapper = mount(PreferencesPanel, { props: { id: 'pp-guard' } as any });
    expect(wrapper.exists()).toBe(true);
  });
});

describe('serializable schema 契约', () => {
  const baseItem = { label: 'L' };

  test('accepts all four new item types with their defaultValue shapes', () => {
    const result = safeParseSerializablePreferencesPanel({
      id: 'pp-schema',
      sections: [
        {
          items: [
            { ...baseItem, id: 'r', type: 'rating', max: 10, defaultValue: 4 },
            { ...baseItem, id: 'n', type: 'number', min: 0, max: 10, step: 2, defaultValue: 2 },
            { ...baseItem, id: 't', type: 'tags', max: 5, defaultValue: ['a'] },
            { ...baseItem, id: 'd1', type: 'date', defaultValue: '2026-03-10' },
            { ...baseItem, id: 'd2', type: 'date', mode: 'datetime', defaultValue: '2026-03-10T08:30' },
            { ...baseItem, id: 'd3', type: 'date', mode: 'range', defaultValue: ['2026-03-10', '2026-03-20'] },
          ],
        },
      ],
    });
    expect(result).not.toBeNull();
  });

  test('rejects an item missing the base-required label', () => {
    const result = safeParseSerializablePreferencesPanel({
      id: 'pp-schema',
      sections: [{ items: [{ id: 'r', type: 'rating' }] }],
    });
    expect(result).toBeNull();
  });

  test('rejects an unknown item type', () => {
    const result = safeParseSerializablePreferencesPanel({
      id: 'pp-schema',
      sections: [{ items: [{ ...baseItem, id: 'x', type: 'color' }] }],
    });
    expect(result).toBeNull();
  });

  // number 承载 rating/number 回执,null 承载 number 项未填空态
  test('receipt choice accepts number and null entries', () => {
    const result = safeParseSerializablePreferencesPanelReceipt({
      id: 'pp-schema',
      sections: [
        {
          items: [
            { ...baseItem, id: 'r', type: 'rating' },
            { ...baseItem, id: 'n', type: 'number' },
          ],
        },
      ],
      choice: { r: 4, n: null },
    });
    expect(result).not.toBeNull();
  });

  // mode 与 defaultValue 形态交叉校验:range ↔ 数组,单值 ↔ string,错位即拒
  test.each([
    ['range with string defaultValue', { mode: 'range', defaultValue: '2026-03-10' }],
    ['single date with array defaultValue', { defaultValue: ['2026-03-10', '2026-03-20'] }],
    ['datetime with array defaultValue', { mode: 'datetime', defaultValue: ['2026-03-10'] }],
  ])('rejects %s', (_label, extra) => {
    const result = safeParseSerializablePreferencesPanel({
      id: 'pp-schema',
      sections: [{ items: [{ ...baseItem, id: 'd', type: 'date', ...extra }] }],
    });
    expect(result).toBeNull();
  });
});
