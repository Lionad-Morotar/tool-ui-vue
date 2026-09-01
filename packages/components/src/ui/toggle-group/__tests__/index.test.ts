import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { defineComponent, ref } from 'vue';
import ToggleGroup from '../index.vue';

enableAutoUnmount(afterEach);

const options = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

function getItems(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[data-testid="toggle-group-item"]');
}

describe('ui/toggle-group', () => {
  describe('rendering', () => {
    test('renders a group with one native button per option', () => {
      const wrapper = mount(ToggleGroup, { props: { options, modelValue: 'light' } });
      const root = wrapper.find('[data-testid="toggle-group"]');
      expect(root.exists()).toBe(true);
      expect(root.attributes('role')).toBe('group');
      const items = getItems(wrapper);
      expect(items).toHaveLength(3);
      expect(items.map((i) => i.text())).toEqual(['Light', 'Dark', 'System']);
      expect(items.every((i) => i.element.tagName === 'BUTTON')).toBe(true);
      expect(items.every((i) => i.attributes('type') === 'button')).toBe(true);
    });

    test('merges custom class onto the root element', () => {
      const wrapper = mount(ToggleGroup, { props: { options, modelValue: 'light', class: 'my-group' } });
      const root = wrapper.find('[data-testid="toggle-group"]');
      expect(root.classes()).toContain('my-group');
      expect(root.classes()).toContain('flex');
    });
  });

  describe('single mode', () => {
    test('marks only the modelValue option as pressed', () => {
      const wrapper = mount(ToggleGroup, { props: { options, modelValue: 'light' } });
      const items = getItems(wrapper);
      expect(items[0].attributes('data-state')).toBe('on');
      expect(items[0].attributes('aria-pressed')).toBe('true');
      expect(items[1].attributes('data-state')).toBe('off');
      expect(items[1].attributes('aria-pressed')).toBe('false');
      expect(items[2].attributes('data-state')).toBe('off');
    });

    test('replaces selection when clicking another option', async () => {
      const wrapper = mount(ToggleGroup, { props: { options, modelValue: 'light' } });
      await getItems(wrapper)[1].trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['dark']);
    });

    // 单选语义是替换而非取消:重复点击已选项不应回吐空值清掉偏好
    test('does not emit when clicking the already selected option', async () => {
      const wrapper = mount(ToggleGroup, { props: { options, modelValue: 'light' } });
      await getItems(wrapper)[0].trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    test('round-trips with parent v-model in both directions', async () => {
      const Harness = defineComponent({
        components: { ToggleGroup },
        setup() {
          const value = ref<string | string[]>('light');
          return { value, options };
        },
        template: '<ToggleGroup v-model="value" :options="options" />',
      });
      const wrapper = mount(Harness);
      const vm = wrapper.vm as unknown as { value: string | string[]; $nextTick: () => Promise<void> };
      const items = getItems(wrapper);

      await items[1].trigger('click');
      expect(vm.value).toBe('dark');

      // 父级回写须经一次渲染节拍传播到 reka-ui 内部受控态
      vm.value = 'system';
      await vm.$nextTick();
      expect(getItems(wrapper)[2].attributes('data-state')).toBe('on');
      expect(getItems(wrapper)[1].attributes('data-state')).toBe('off');
    });
  });

  describe('multiple mode', () => {
    test('marks every array value as pressed', () => {
      const wrapper = mount(ToggleGroup, {
        props: { options, multiple: true, modelValue: ['light', 'system'] },
      });
      const items = getItems(wrapper);
      expect(items[0].attributes('data-state')).toBe('on');
      expect(items[1].attributes('data-state')).toBe('off');
      expect(items[2].attributes('data-state')).toBe('on');
    });

    test('appends an unselected option to the model array', async () => {
      const wrapper = mount(ToggleGroup, {
        props: { options, multiple: true, modelValue: ['light'] },
      });
      await getItems(wrapper)[1].trigger('click');
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['light', 'dark']]);
    });

    test('removes a selected option from the model array', async () => {
      const wrapper = mount(ToggleGroup, {
        props: { options, multiple: true, modelValue: ['light', 'dark'] },
      });
      await getItems(wrapper)[0].trigger('click');
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['dark']]);
    });

    test('round-trips with parent v-model array', async () => {
      const Harness = defineComponent({
        components: { ToggleGroup },
        setup() {
          const value = ref<string | string[]>([]);
          return { value, options };
        },
        template: '<ToggleGroup v-model="value" :options="options" multiple />',
      });
      const wrapper = mount(Harness);
      const vm = wrapper.vm as unknown as { value: string | string[]; $nextTick: () => Promise<void> };

      await getItems(wrapper)[0].trigger('click');
      await getItems(wrapper)[2].trigger('click');
      expect(vm.value).toEqual(['light', 'system']);

      await getItems(wrapper)[0].trigger('click');
      expect(vm.value).toEqual(['system']);
    });
  });
});
