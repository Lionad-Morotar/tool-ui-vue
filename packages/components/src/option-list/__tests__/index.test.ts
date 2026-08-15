import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';

const currentLocale = ref('en');
const messagesByLocale: Record<string, Record<string, string>> = {
  en: { 'optionList.selected': 'Confirmed selection', 'optionList.select': 'Select', 'optionList.noOptions': 'No options', 'optionList.search': 'Search options...', 'optionList.clear': 'Clear', 'optionList.all': 'All' },
  'zh-CN': { 'optionList.selected': '已选', 'optionList.select': '选择', 'optionList.noOptions': '无选项', 'optionList.search': '搜索选项...', 'optionList.clear': '清除', 'optionList.all': '全部' },
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

import OptionList from '../index.vue';

const OPTIONS = [
  { id: 'a', label: 'Alice', description: 'First option' },
  { id: 'b', label: 'Bob', description: 'Second option' },
  { id: 'c', label: 'Carol' },
];

describe('rendering', () => {
  test('renders all options', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    expect(wrapper.text()).toContain('Alice');
    expect(wrapper.text()).toContain('Bob');
    expect(wrapper.text()).toContain('Carol');
  });

  test('renders option descriptions', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    expect(wrapper.text()).toContain('First option');
    expect(wrapper.text()).toContain('Second option');
  });

  test('renders default actions', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    expect(wrapper.text()).toContain('Clear');
    expect(wrapper.text()).toContain('Confirm');
  });

  test('has correct data attributes', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    expect(wrapper.find('[data-slot="option-list"]').exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="ol-1"]').exists()).toBe(true);
  });

  test('has correct role attributes', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    expect(wrapper.find("[role='group']").exists()).toBe(true);
    expect(wrapper.find("[role='listbox']").exists()).toBe(true);
  });
});

describe('selection - single', () => {
  test('selects option on click', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    const selected = wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true');
    expect(selected?.text()).toContain('Alice');
  });

  test('emits change on selection', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[1]?.trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual(['b']);
  });

  test('emits update:modelValue on selection', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, modelValue: null },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a']);
  });

  test('allows deselecting in single mode', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    await optionButtons[0]?.trigger('click');
    const selected = wrapper.findAll("[role='option']").filter((b) => b.attributes('aria-selected') === 'true');
    expect(selected.length).toBe(0);
  });

  test('confirms disabled when nothing selected', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const confirmBtn = wrapper.findAll('button').find((b) => b.text() === 'Confirm');
    expect(confirmBtn?.attributes('disabled')).toBeDefined();
  });

  test('emits action confirm on confirm click', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    const confirmBtn = wrapper.findAll('button').find((b) => b.text().includes('Confirm'));
    await confirmBtn?.trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['confirm', 'a']);
  });

  test('shows checkmark for selected option in single mode', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    // Check for the dot indicator in single mode
    const selectedOption = wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true');
    expect(selectedOption?.find('.rounded-full').exists()).toBe(true);
  });
});

describe('selection - multi', () => {
  test('selects multiple options', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, selectionMode: 'multi' as const },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    await optionButtons[1]?.trigger('click');
    const selected = wrapper.findAll("[role='option']").filter((b) => b.attributes('aria-selected') === 'true');
    expect(selected.length).toBe(2);
    expect(wrapper.emitted('change')?.[wrapper.emitted('change')!.length - 1]).toEqual([['a', 'b']]);
  });

  test('maxSelections limits selections', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, selectionMode: 'multi' as const, maxSelections: 2 },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    await optionButtons[1]?.trigger('click');
    await optionButtons[2]?.trigger('click');
    const selected = wrapper.findAll("[role='option']").filter((b) => b.attributes('aria-selected') === 'true');
    expect(selected.length).toBe(2);
  });

  test('shows checkbox for selected options in multi mode', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, selectionMode: 'multi' as const },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    // Check for the checkmark in multi mode (rounded checkbox)
    const selectedOption = wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true');
    expect(selectedOption?.find('.rounded').exists()).toBe(true);
  });

  test('confirm button shows count in multi mode', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, selectionMode: 'multi' as const },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    await optionButtons[1]?.trigger('click');
    const confirmBtn = wrapper.findAll('button').find((b) => b.text().includes('Confirm'));
    expect(confirmBtn?.text()).toContain('(2)');
  });

  test('has aria-multiselectable in multi mode', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, selectionMode: 'multi' as const },
    });
    const listbox = wrapper.find("[role='listbox']");
    expect(listbox.attributes('aria-multiselectable')).toBe('true');
  });
});

describe('receipt mode', () => {
  test('renders receipt view with choice', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, choice: 'a' },
    });
    expect(wrapper.find("[data-receipt='true']").exists()).toBe(true);
    expect(wrapper.text()).toContain('Alice');
  });

  test('renders receipt view with multi choice', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, choice: ['a', 'b'] },
    });
    expect(wrapper.find("[data-receipt='true']").exists()).toBe(true);
    expect(wrapper.text()).toContain('Alice');
    expect(wrapper.text()).toContain('Bob');
  });

  test('does not render actions or options in receipt mode', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, choice: 'a' },
    });
    expect(wrapper.find("[role='listbox']").exists()).toBe(false);
    expect(wrapper.text()).not.toContain('Confirm');
  });

  test('receipt has correct role and aria attributes', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, choice: 'a' },
    });
    const receipt = wrapper.find("[data-receipt='true']");
    expect(receipt.attributes('role')).toBe('status');
    expect(receipt.attributes('aria-label')).toBe('Confirmed selection');
  });
});

describe('disabled options', () => {
  test('disabled options cannot be selected', async () => {
    const optionsWithDisabled = [
      { id: 'a', label: 'Alice' },
      { id: 'b', label: 'Bob', disabled: true },
    ];
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: optionsWithDisabled },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    expect(optionButtons[1]?.attributes('disabled')).toBeDefined();
    await optionButtons[1]?.trigger('click');
    expect(wrapper.emitted('change')).toBeFalsy();
  });

  test('disabled options have reduced opacity', async () => {
    const optionsWithDisabled = [
      { id: 'a', label: 'Alice' },
      { id: 'b', label: 'Bob', disabled: true },
    ];
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: optionsWithDisabled },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    // Check that the selection indicator has opacity class
    expect(optionButtons[1]?.html()).toContain('opacity-50');
  });
});

describe('clear action', () => {
  test('clear button disabled when nothing selected', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const clearBtn = wrapper.findAll('button').find((b) => b.text() === 'Clear');
    expect(clearBtn?.attributes('disabled')).toBeDefined();
  });

  test('emits action cancel on clear click', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    const clearBtn = wrapper.findAll('button').find((b) => b.text() === 'Clear');
    await clearBtn?.trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['cancel', null]);
  });

  test('clears selection on clear click', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    const clearBtn = wrapper.findAll('button').find((b) => b.text() === 'Clear');
    await clearBtn?.trigger('click');
    const selected = wrapper.findAll("[role='option']").filter((b) => b.attributes('aria-selected') === 'true');
    expect(selected.length).toBe(0);
  });
});

describe('keyboard navigation', () => {
  test('navigates with arrow keys', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const listbox = wrapper.find("[role='listbox']");
    let options = wrapper.findAll("[role='option']");
    expect(options[0]?.attributes('tabindex')).toBe('0');
    await listbox.trigger('keydown', { key: 'ArrowDown' });
    options = wrapper.findAll("[role='option']");
    expect(options[1]?.attributes('tabindex')).toBe('0');
    expect(options[0]?.attributes('tabindex')).toBe('-1');
  });

  test('selects with Enter on focused option', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger('keydown', { key: 'Enter' });
    const selected = wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true');
    expect(selected?.text()).toContain('Alice');
  });

  test('selects with Space on focused option', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const listbox = wrapper.find("[role='listbox']");
    await listbox.trigger('keydown', { key: ' ' });
    const selected = wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true');
    expect(selected?.text()).toContain('Alice');
  });

  test('navigates to first with Home key', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const listbox = wrapper.find("[role='listbox']");
    await listbox.trigger('keydown', { key: 'ArrowDown' });
    await listbox.trigger('keydown', { key: 'ArrowDown' });
    await listbox.trigger('keydown', { key: 'Home' });
    const options = wrapper.findAll("[role='option']");
    expect(options[0]?.attributes('tabindex')).toBe('0');
  });

  test('navigates to last with End key', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const listbox = wrapper.find("[role='listbox']");
    await listbox.trigger('keydown', { key: 'End' });
    const options = wrapper.findAll("[role='option']");
    expect(options[options.length - 1]?.attributes('tabindex')).toBe('0');
  });

  test('clears with Escape key', async () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    const listbox = wrapper.find("[role='listbox']");
    await listbox.trigger('keydown', { key: 'Escape' });
    expect(wrapper.emitted('action')?.[0]).toEqual(['cancel', null]);
  });
});

describe('custom actions', () => {
  test('renders custom actions', () => {
    const wrapper = mount(OptionList, {
      props: {
        id: 'ol-1',
        options: OPTIONS,
        actions: [
          { id: 'reset', label: 'Reset', variant: 'ghost' },
          { id: 'save', label: 'Save', variant: 'default' },
        ],
      },
    });
    expect(wrapper.text()).toContain('Reset');
    expect(wrapper.text()).toContain('Save');
    expect(wrapper.text()).not.toContain('Clear');
    expect(wrapper.text()).not.toContain('Confirm');
  });

  test('emits custom action on click', async () => {
    const wrapper = mount(OptionList, {
      props: {
        id: 'ol-1',
        options: OPTIONS,
        actions: [
          { id: 'reset', label: 'Reset', variant: 'ghost' },
          { id: 'save', label: 'Save', variant: 'default' },
        ],
      },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    const saveBtn = wrapper.findAll('button').find((b) => b.text() === 'Save');
    await saveBtn?.trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['save', 'a']);
  });
});

describe('accessibility', () => {
  test('has listbox role', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    expect(wrapper.find("[role='listbox']").exists()).toBe(true);
  });

  test('options have role option', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    expect(wrapper.findAll("[role='option']").length).toBe(3);
  });

  test('has aria-label on group', () => {
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS },
    });
    const group = wrapper.find("[role='group']");
    expect(group.attributes('aria-label')).toBe('Option list');
  });
});

describe('i18n', () => {
  beforeEach(() => { currentLocale.value = 'en'; });

  test('uses zh-CN aria-label in receipt mode', () => {
    currentLocale.value = 'zh-CN';
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, choice: 'a' },
    });
    const receipt = wrapper.find("[data-receipt='true']");
    expect(receipt.attributes('aria-label')).toBe('已选');
  });

  test('uses English aria-label in receipt mode', () => {
    currentLocale.value = 'en';
    const wrapper = mount(OptionList, {
      props: { id: 'ol-1', options: OPTIONS, choice: 'a' },
    });
    const receipt = wrapper.find("[data-receipt='true']");
    expect(receipt.attributes('aria-label')).toBe('Confirmed selection');
  });
});

describe('数组 props 缺省防御(LLM 产出宽容)', () => {
  test('omitting options renders without crashing', () => {
    const wrapper = mount(OptionList, { props: { id: 'ol-guard' } as any });
    expect(wrapper.exists()).toBe(true);
  });
});
