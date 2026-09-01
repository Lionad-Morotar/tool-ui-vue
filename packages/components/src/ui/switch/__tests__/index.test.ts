import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { defineComponent, ref } from 'vue';
import Switch from '../index.vue';

enableAutoUnmount(afterEach);

describe('ui/switch', () => {
  describe('rendering', () => {
    test('renders an unchecked switch button by default', () => {
      const wrapper = mount(Switch);
      const root = wrapper.find('[data-slot="switch"]');
      expect(root.exists()).toBe(true);
      expect(root.element.tagName).toBe('BUTTON');
      expect(root.attributes('role')).toBe('switch');
      expect(root.attributes('aria-checked')).toBe('false');
    });

    test('renders checked state from modelValue', () => {
      const wrapper = mount(Switch, { props: { modelValue: true } });
      expect(wrapper.find('[data-slot="switch"]').attributes('aria-checked')).toBe('true');
    });

    test('merges custom class onto the root element', () => {
      const wrapper = mount(Switch, { props: { class: 'my-switch' } });
      const classes = wrapper.find('[data-slot="switch"]').classes();
      expect(classes).toContain('my-switch');
      expect(classes).toContain('rounded-full');
    });
  });

  describe('v-model', () => {
    test('emits update:modelValue on click', async () => {
      const wrapper = mount(Switch, { props: { modelValue: false } });
      await wrapper.find('[data-slot="switch"]').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
    });

    test('round-trips with parent v-model in both directions', async () => {
      const Harness = defineComponent({
        components: { Switch },
        setup() {
          const checked = ref(false);
          return { checked };
        },
        template: '<Switch v-model="checked" />',
      });
      const wrapper = mount(Harness);
      const root = wrapper.find('[data-slot="switch"]');
      const vm = wrapper.vm as unknown as { checked: boolean; $nextTick: () => Promise<void> };

      await root.trigger('click');
      expect(vm.checked).toBe(true);
      expect(root.attributes('aria-checked')).toBe('true');

      // 父级回写须经一次渲染节拍传播到 reka-ui 内部受控态,再驱动下一次点击
      vm.checked = false;
      await vm.$nextTick();
      expect(root.attributes('aria-checked')).toBe('false');

      await root.trigger('click');
      expect(vm.checked).toBe(true);
    });
  });

  describe('keyboard', () => {
    // jsdom 不实现原生 button 的空格激活行为(keyup 派生 click),
    // 空格可激活性由 type="button" 语义保证;reka-ui 显式处理的 enter 是
    // jsdom 中唯一可真实驱动的键盘路径
    test('is a native button so space activation works in browsers', () => {
      const wrapper = mount(Switch);
      expect(wrapper.find('[data-slot="switch"]').attributes('type')).toBe('button');
    });

    test('toggles on enter keydown', async () => {
      const wrapper = mount(Switch, { props: { modelValue: false } });
      const root = wrapper.find('[data-slot="switch"]');
      await root.trigger('keydown.enter');
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
    });
  });

  describe('disabled', () => {
    test('exposes disabled attribute and does not toggle on click', async () => {
      const wrapper = mount(Switch, { props: { modelValue: false, disabled: true } });
      const root = wrapper.find('[data-slot="switch"]');
      expect(root.attributes('disabled')).toBeDefined();
      await root.trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(root.attributes('aria-checked')).toBe('false');
    });
  });
});
