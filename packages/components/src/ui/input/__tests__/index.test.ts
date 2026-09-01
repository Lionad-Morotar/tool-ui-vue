import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { defineComponent, ref } from 'vue';
import Input from '../index.vue';

enableAutoUnmount(afterEach);

describe('ui/input', () => {
  describe('rendering', () => {
    test('renders a native input with type text by default', () => {
      const wrapper = mount(Input);
      const root = wrapper.find('input');
      expect(root.exists()).toBe(true);
      expect(root.attributes('type')).toBe('text');
    });

    test('forwards type and placeholder to the native element', () => {
      const wrapper = mount(Input, {
        props: { type: 'email', placeholder: 'you@example.com' },
      });
      const root = wrapper.find('input');
      expect(root.attributes('type')).toBe('email');
      expect(root.attributes('placeholder')).toBe('you@example.com');
    });

    test('merges custom class with default classes on the root', () => {
      const wrapper = mount(Input, { props: { class: 'my-input' } });
      const classes = wrapper.find('input').classes();
      expect(classes).toContain('my-input');
      expect(classes).toContain('rounded-md');
      expect(classes).toContain('border-input');
    });
  });

  describe('v-model', () => {
    test('emits update:modelValue on input', async () => {
      const wrapper = mount(Input, { props: { modelValue: '' } });
      await wrapper.find('input').setValue('hello');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['hello']);
    });

    test('round-trips with parent v-model in both directions', async () => {
      const Harness = defineComponent({
        components: { Input },
        setup() {
          const text = ref('init');
          return { text };
        },
        template: '<Input v-model="text" />',
      });
      const wrapper = mount(Harness);
      const root = wrapper.find('input');
      const vm = wrapper.vm as unknown as { text: string; $nextTick: () => Promise<void> };
      expect((root.element as HTMLInputElement).value).toBe('init');

      await root.setValue('typed');
      expect(vm.text).toBe('typed');

      vm.text = 'from-parent';
      await vm.$nextTick();
      expect((root.element as HTMLInputElement).value).toBe('from-parent');
    });
  });
});
