import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { defineComponent, ref } from 'vue';
import { pointerPress, settle } from '../../__tests__/reka-test-utils';
import NumberField from '../index.vue';

enableAutoUnmount(afterEach);

describe('ui/number-field', () => {
  describe('rendering', () => {
    test('renders a numeric input with increment and decrement buttons', () => {
      const wrapper = mount(NumberField);
      expect(wrapper.find('[data-testid="number-field-input"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="number-field-increment"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="number-field-decrement"]').exists()).toBe(true);
    });

    test('input shows current modelValue and merges custom class on root', () => {
      const wrapper = mount(NumberField, { props: { modelValue: 7, class: 'my-number' } });
      const input = wrapper.find<HTMLInputElement>('[data-testid="number-field-input"]');
      expect(input.element.value).toBe('7');
      expect(wrapper.find('[data-testid="number-field-root"]').classes()).toContain('my-number');
    });
  });

  describe('v-model', () => {
    // reka NumberField 只在 Enter/blur 提交解析值(input 只更新内部文本,change 仅 rAF 回同步)
    test('emits number payload when typing then committing via enter', async () => {
      const wrapper = mount(NumberField);
      const input = wrapper.find('[data-testid="number-field-input"]');
      await input.setValue('42');
      await input.trigger('keydown', { key: 'Enter' });
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toBeTruthy();
      const last = emitted!.at(-1)![0];
      expect(last).toBe(42);
      expect(typeof last).toBe('number');
    });

    // 步进按钮的增减读的是输入框文本而非 modelValue;空文本(NaN)回退 min ?? 0
    test('round-trips with parent v-model; empty increments to zero baseline', async () => {
      const Harness = defineComponent({
        components: { NumberField },
        setup: () => ({ value: ref<number | null>(null) }),
        template: '<NumberField v-model="value" />',
      });
      const wrapper = mount(Harness, { attachTo: document.body });
      const vm = wrapper.vm as unknown as { value: number | null; $nextTick: () => Promise<void> };

      // 步进按钮监听经 vueuse flush:post 注册,mount 后先 settle 等注册
      await settle();
      pointerPress(wrapper.find('[data-testid="number-field-increment"]').element);
      await vm.$nextTick();
      expect(vm.value).toBe(0);

      vm.value = 10;
      await vm.$nextTick();
      expect(
        wrapper.find<HTMLInputElement>('[data-testid="number-field-input"]').element.value
      ).toBe('10');
    });
  });

  describe('step and bounds', () => {
    test('increments by step and clamps at max', async () => {
      const wrapper = mount(NumberField, {
        props: { modelValue: 8, min: 0, max: 10, step: 2 },
        attachTo: document.body,
      });
      const increment = wrapper.find('[data-testid="number-field-increment"]');
      await settle();
      pointerPress(increment.element);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([10]);
      // 已在 max:再按不产生新值(reka 钳制,同值无 emit)
      pointerPress(increment.element);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    });

    // 键盘步进是「吸附到 step 网格后再进位」:4 在网格上,ArrowUp → 6
    test('arrow keys on input step the value', async () => {
      const wrapper = mount(NumberField, { props: { modelValue: 4, step: 2 } });
      const input = wrapper.find('[data-testid="number-field-input"]');
      await input.trigger('keydown', { key: 'ArrowUp' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([6]);
    });

    test('decrement button is disabled at min', () => {
      const wrapper = mount(NumberField, { props: { modelValue: 0, min: 0 } });
      expect(
        wrapper.find('[data-testid="number-field-decrement"]').attributes('disabled')
      ).toBeDefined();
    });
  });

  describe('disabled', () => {
    // reka 按钮不响应 click,disabled 验证必须走真实激活路径 pointerdown
    test('buttons and input expose disabled and do not emit', async () => {
      const wrapper = mount(NumberField, {
        props: { modelValue: 3, disabled: true },
        attachTo: document.body,
      });
      await settle();
      pointerPress(wrapper.find('[data-testid="number-field-increment"]').element);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });
});
