import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import type { DOMWrapper, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { defineComponent, ref } from 'vue';
import Select from '../index.vue';

enableAutoUnmount(afterEach);

// jsdom 未实现 Pointer Capture API,而 reka-ui trigger 的 pointerdown 分支直接调用,
// 不补空实现时打开下拉的交互路径在测试环境抛 TypeError
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
    Element.prototype.releasePointerCapture = () => undefined;
  }
});

const options = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
];

// 必须 attachTo document:reka 在 document 上挂 pointerup 监听做打开手势的收尾,
// 悬空的 wrapper 里 trigger 事件冒泡不到 document,该监听会残留并把后续选项的
// pointerup preventDefault,选中静默失效
function mountSelect(options_: {
  props?: Record<string, unknown>;
  attrs?: Record<string, string>;
}) {
  return mount(Select, {
    props: { options, ...options_.props },
    attrs: options_.attrs,
    attachTo: document.body,
  } as Parameters<typeof mount>[1]);
}

function getTrigger(wrapper: VueWrapper): DOMWrapper<Element> {
  return wrapper.find('[data-testid="select-trigger"]');
}

// SelectContent 经 Portal 落到 document.body,VTU wrapper 的子树查询够不到浮层
function queryContent() {
  return document.body.querySelector('[data-testid="select-content"]');
}

function queryItems() {
  return Array.from(document.body.querySelectorAll('[data-testid="select-item"]'));
}

// 浮层开关闭跨 nextTick、Promise(floating-ui 定位)与 setTimeout(Presence 退场)三级调度
async function settle() {
  await flushPromises();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await flushPromises();
}

// 完整点击序列:按下后先等浮层挂载(reka 才武装 document 级 once pointerup 监听),
// 随后这次松开用于消耗该监听
async function openSelect(wrapper: VueWrapper) {
  await getTrigger(wrapper).trigger('pointerdown');
  await settle();
  await getTrigger(wrapper).trigger('pointerup');
  await settle();
}

describe('ui/select', () => {
  describe('rendering', () => {
    test('renders a combobox trigger showing the selected option label', async () => {
      const wrapper = mountSelect({ props: { modelValue: 'en' } });
      await flushPromises();
      const trigger = getTrigger(wrapper);
      expect(trigger.exists()).toBe(true);
      expect(trigger.attributes('role')).toBe('combobox');
      expect(trigger.text()).toContain('English');
    });

    test('shows the placeholder when no value is selected', async () => {
      const wrapper = mountSelect({ props: { placeholder: 'Pick a language' } });
      await flushPromises();
      const trigger = getTrigger(wrapper);
      expect(trigger.text()).toContain('Pick a language');
      expect(trigger.attributes('data-placeholder')).toBeDefined();
    });

    test('keeps option elements out of the document while closed', () => {
      mountSelect({ props: { modelValue: 'en' } });
      expect(queryContent()).toBeNull();
      expect(queryItems()).toHaveLength(0);
    });

    test('merges custom class onto the trigger', () => {
      const wrapper = mountSelect({ props: { modelValue: 'en', class: 'my-select' } });
      const classes = getTrigger(wrapper).classes();
      expect(classes).toContain('my-select');
      expect(classes).toContain('rounded-md');
      expect(classes).toContain('border-input');
    });
  });

  describe('attribute fallthrough', () => {
    // trigger 渲染为 button,label[for] 只能给 id 一个落点,无障碍命名靠 aria-labelledby,
    // 两者都必须透传到 trigger 元素上,断裂会静默破坏偏好面板的程序关联
    test('forwards id and aria-labelledby to the trigger element', () => {
      const wrapper = mountSelect({
        props: { modelValue: 'en' },
        attrs: { id: 'preference-language', 'aria-labelledby': 'preference-language-label' },
      });
      const trigger = getTrigger(wrapper);
      expect(trigger.attributes('id')).toBe('preference-language');
      expect(trigger.attributes('aria-labelledby')).toBe('preference-language-label');
    });
  });

  describe('pointer interaction', () => {
    test('opens the dropdown content on trigger click', async () => {
      const wrapper = mountSelect({ props: { modelValue: 'en' } });
      await openSelect(wrapper);
      expect(queryContent()).not.toBeNull();
      const items = queryItems();
      expect(items).toHaveLength(options.length);
      expect(items.map((i) => i.textContent)).toEqual(options.map((o) => o.label));
    });

    test('selects an option on pointerup, emits the value and closes', async () => {
      const wrapper = mountSelect({ props: { modelValue: 'en' } });
      await openSelect(wrapper);
      const target = queryItems().find((i) => i.textContent === 'Spanish');
      expect(target).toBeTruthy();
      target!.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
      await settle();
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['es']);
      expect(queryContent()).toBeNull();
    });

    test('marks the selected option with a checked state and indicator', async () => {
      const wrapper = mountSelect({ props: { modelValue: 'es' } });
      await openSelect(wrapper);
      const items = queryItems();
      const selected = items.find((i) => i.textContent === 'Spanish');
      const unselected = items.find((i) => i.textContent === 'English');
      expect(selected?.getAttribute('data-state')).toBe('checked');
      expect(selected?.getAttribute('aria-selected')).toBe('true');
      expect(unselected?.getAttribute('data-state')).toBe('unchecked');
      expect(unselected?.getAttribute('aria-selected')).toBe('false');
    });
  });

  describe('keyboard interaction', () => {
    // 键位契约来自 reka-ui 内建行为:Enter/空格/方向键开菜单,方向键移动高亮,Enter 选中
    test('Enter on the trigger opens the dropdown and focuses the selected item', async () => {
      const wrapper = mountSelect({ props: { modelValue: 'es' } });
      await getTrigger(wrapper).trigger('keydown', { key: 'Enter' });
      await settle();
      expect(queryContent()).not.toBeNull();
      const selected = queryItems().find((i) => i.textContent === 'Spanish');
      expect(document.activeElement).toBe(selected);
    });

    test('ArrowDown moves highlight and Enter selects the highlighted option', async () => {
      const wrapper = mountSelect({ props: { modelValue: 'en' } });
      await getTrigger(wrapper).trigger('keydown', { key: 'Enter' });
      await settle();
      const items = queryItems();
      items[0].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
      );
      await settle();
      expect(document.activeElement).toBe(items[1]);
      items[1].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      );
      await settle();
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['es']);
      expect(queryContent()).toBeNull();
    });
  });

  describe('v-model', () => {
    test('round-trips with parent v-model in both directions', async () => {
      const Harness = defineComponent({
        components: { Select },
        setup() {
          const value = ref('en');
          return { value, options };
        },
        template: '<Select v-model="value" :options="options" />',
      });
      const wrapper = mount(Harness, { attachTo: document.body });
      const vm = wrapper.vm as unknown as { value: string; $nextTick: () => Promise<void> };

      await openSelect(wrapper);
      const target = queryItems().find((i) => i.textContent === 'French');
      target!.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
      await settle();
      expect(vm.value).toBe('fr');

      // 父级回写须经渲染节拍传播到 reka-ui 受控态,trigger 文案跟随选中项
      vm.value = 'de';
      await vm.$nextTick();
      await flushPromises();
      expect(getTrigger(wrapper).text()).toContain('German');
    });
  });
});
