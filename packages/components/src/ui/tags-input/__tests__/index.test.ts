import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { defineComponent, ref } from 'vue';
import TagsInput from '../index.vue';

enableAutoUnmount(afterEach);

describe('ui/tags-input', () => {
  describe('rendering', () => {
    test('renders an input inside a tag container', () => {
      const wrapper = mount(TagsInput);
      expect(wrapper.find('[data-testid="tags-input-root"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="tags-input-field"]').exists()).toBe(true);
    });

    test('renders existing tags from modelValue with delete triggers', () => {
      const wrapper = mount(TagsInput, { props: { modelValue: ['alpha', 'beta'] } });
      const items = wrapper.findAll('[data-testid="tags-input-item"]');
      expect(items).toHaveLength(2);
      expect(items[0].text()).toContain('alpha');
      expect(wrapper.findAll('[data-testid="tags-input-item-delete"]')).toHaveLength(2);
    });

    test('merges custom class onto the root element', () => {
      const wrapper = mount(TagsInput, { props: { class: 'my-tags' } });
      expect(wrapper.find('[data-testid="tags-input-root"]').classes()).toContain('my-tags');
    });
  });

  describe('v-model', () => {
    test('emits string array when adding a tag via enter', async () => {
      const wrapper = mount(TagsInput);
      const field = wrapper.find('[data-testid="tags-input-field"]');
      await field.setValue('foo');
      await field.trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['foo']]);
    });

    test('accumulates tags in order', async () => {
      const wrapper = mount(TagsInput, { props: { modelValue: ['first'] } });
      const field = wrapper.find('[data-testid="tags-input-field"]');
      await field.setValue('second');
      await field.trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['first', 'second']]);
    });

    test('round-trips with parent v-model', async () => {
      const Harness = defineComponent({
        components: { TagsInput },
        setup: () => ({ tags: ref<string[]>([]) }),
        template: '<TagsInput v-model="tags" />',
      });
      const wrapper = mount(Harness);
      const vm = wrapper.vm as unknown as { tags: string[]; $nextTick: () => Promise<void> };

      const field = wrapper.find('[data-testid="tags-input-field"]');
      await field.setValue('hello');
      await field.trigger('keydown', { key: 'Enter' });
      expect(vm.tags).toEqual(['hello']);
      await vm.$nextTick();
      expect(wrapper.findAll('[data-testid="tags-input-item"]')).toHaveLength(1);
    });
  });

  describe('constraints', () => {
    test('removes a tag via its delete trigger', async () => {
      const wrapper = mount(TagsInput, { props: { modelValue: ['alpha', 'beta'] } });
      await wrapper.findAll('[data-testid="tags-input-item-delete"]')[0].trigger('click');
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['beta']]);
    });

    // reka TagsInput duplicate 默认 false:重复值静默拒绝
    test('dedupes repeated values by default', async () => {
      const wrapper = mount(TagsInput, { props: { modelValue: ['alpha'] } });
      const field = wrapper.find('[data-testid="tags-input-field"]');
      await field.setValue('alpha');
      await field.trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    // reka max 达上限时 addTag 静默拒绝(TagsInputRoot: array.length >= max 直接 return),
    // 输入字段不禁用
    test('rejects input beyond max', async () => {
      const wrapper = mount(TagsInput, { props: { modelValue: ['a', 'b', 'c'], max: 3 } });
      const field = wrapper.find('[data-testid="tags-input-field"]');
      await field.setValue('fourth');
      await field.trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    // reka 的 duplicate 去重只拦 addTag 输入路径,外部绑定(如持久化恢复)可含重复值;
    // v-for 以 tag-index 复合 key 渲染,删除经 reka indexOf 语义移除首个匹配项
    test('renders externally-bound duplicate values and removes the first match', async () => {
      const wrapper = mount(TagsInput, { props: { modelValue: ['a', 'a'] } });
      expect(wrapper.findAll('[data-testid="tags-input-item"]')).toHaveLength(2);
      await wrapper.findAll('[data-testid="tags-input-item-delete"]')[0].trigger('click');
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['a']]);
    });
  });

  describe('disabled', () => {
    // reka disabled 透传到输入框与删除位:输入框原生 disabled,删除点击不产生 emit
    test('disables the input and blocks tag removal', async () => {
      const wrapper = mount(TagsInput, { props: { modelValue: ['a'], disabled: true } });
      expect(
        wrapper.find('[data-testid="tags-input-field"]').attributes('disabled')
      ).toBeDefined();
      await wrapper.find('[data-testid="tags-input-item-delete"]').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });
});

describe('a11y naming', () => {
  // 根容器是无 role 的 generic div,aria-labelledby 落在其上不参与可访问名称计算;
  // 命名必须透传到真实输入框
  test('forwards aria-labelledby onto the input field', () => {
    const wrapper = mount(TagsInput, { attrs: { 'aria-labelledby': 'keywords-label' } });
    expect(wrapper.find('[data-testid="tags-input-field"]').attributes('aria-labelledby')).toBe(
      'keywords-label'
    );
    expect(wrapper.find('[data-testid="tags-input-root"]').attributes('aria-labelledby')).toBeUndefined();
  });
});
