import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { defineComponent, ref } from 'vue';
import Textarea from '../index.vue';

enableAutoUnmount(afterEach);

describe('ui/textarea', () => {
  describe('rendering', () => {
    test('renders a native textarea with 3 rows by default', () => {
      const wrapper = mount(Textarea);
      const root = wrapper.find('textarea');
      expect(root.exists()).toBe(true);
      expect(root.attributes('rows')).toBe('3');
    });

    test('forwards placeholder and rows to the native element', () => {
      const wrapper = mount(Textarea, {
        props: { placeholder: 'Tell us more', rows: 6 },
      });
      const root = wrapper.find('textarea');
      expect(root.attributes('placeholder')).toBe('Tell us more');
      expect(root.attributes('rows')).toBe('6');
    });

    test('merges custom class with default classes on the root', () => {
      const wrapper = mount(Textarea, { props: { class: 'my-textarea' } });
      const classes = wrapper.find('textarea').classes();
      expect(classes).toContain('my-textarea');
      expect(classes).toContain('resize-y');
      expect(classes).toContain('border-input');
    });
  });

  describe('attribute fallthrough', () => {
    // 消费方靠 id 透传建立 label[for] 程序关联,断裂会静默破坏可访问性
    test('falls through undeclared attributes to the native textarea', () => {
      const wrapper = mount(Textarea, {
        attrs: { id: 'preference-bio', 'data-testid': 'bio-field' },
      });
      const root = wrapper.find('textarea');
      expect(root.attributes('id')).toBe('preference-bio');
      expect(root.attributes('data-testid')).toBe('bio-field');
    });
  });

  describe('v-model', () => {
    test('emits update:modelValue on input', async () => {
      const wrapper = mount(Textarea, { props: { modelValue: '' } });
      await wrapper.find('textarea').setValue('multi\nline');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['multi\nline']);
    });

    test('round-trips with parent v-model in both directions', async () => {
      const Harness = defineComponent({
        components: { Textarea },
        setup() {
          const text = ref('init');
          return { text };
        },
        template: '<Textarea v-model="text" />',
      });
      const wrapper = mount(Harness);
      const root = wrapper.find('textarea');
      const vm = wrapper.vm as unknown as { text: string; $nextTick: () => Promise<void> };
      expect((root.element as HTMLTextAreaElement).value).toBe('init');

      await root.setValue('typed');
      expect(vm.text).toBe('typed');

      vm.text = 'from-parent';
      await vm.$nextTick();
      expect((root.element as HTMLTextAreaElement).value).toBe('from-parent');
    });
  });
});
