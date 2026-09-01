import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { defineComponent, ref } from 'vue';
import { settle } from '../../__tests__/reka-test-utils';
import Rating from '../index.vue';

enableAutoUnmount(afterEach);

describe('ui/rating', () => {
  describe('rendering', () => {
    test('renders 5 star slots by default', () => {
      const wrapper = mount(Rating);
      expect(wrapper.findAll('[data-testid="rating-item"]')).toHaveLength(5);
    });

    test('renders max star slots when max=10', () => {
      const wrapper = mount(Rating, { props: { max: 10 } });
      expect(wrapper.findAll('[data-testid="rating-item"]')).toHaveLength(10);
    });

    // reka Rating 覆写 data-state:填充态为 active(radio 原生 checked 只能单选,不适用)
    test('renders filled state from modelValue', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3 } });
      expect(wrapper.findAll('[data-state="active"]')).toHaveLength(3);
    });
  });

  describe('interaction', () => {
    test('emits update:modelValue with star number on click', async () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } });
      await wrapper.findAll('[data-testid="rating-indicator"]')[3].trigger('click');
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([4]);
    });

    test('clicking the current value resets to 0 when clearable', async () => {
      const wrapper = mount(Rating, { props: { modelValue: 3 } });
      await wrapper.findAll('[data-testid="rating-indicator"]')[2].trigger('click');
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([0]);
    });

    // clearable=false 时点当前值仍设同值,v-model 数值不变 → 无 emit(reka 原生语义)
    test('does not reset on clicking current value when clearable=false', async () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, clearable: false } });
      await wrapper.findAll('[data-testid="rating-indicator"]')[2].trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    test('round-trips with parent v-model', async () => {
      const Harness = defineComponent({
        components: { Rating },
        setup: () => ({ value: ref(0) }),
        template: '<Rating v-model="value" />',
      });
      const wrapper = mount(Harness);
      const vm = wrapper.vm as unknown as { value: number; $nextTick: () => Promise<void> };

      await wrapper.findAll('[data-testid="rating-indicator"]')[4].trigger('click');
      expect(vm.value).toBe(5);
      expect(wrapper.findAll('[data-state="active"]')).toHaveLength(5);

      vm.value = 2;
      await vm.$nextTick();
      expect(wrapper.findAll('[data-state="active"]')).toHaveLength(2);
    });
  });

  describe('keyboard', () => {
    // RadioGroup 派生的方向键导航:keydown 置标志 → RovingFocus 移焦 → 目标项 focus 后
    // setTimeout(0) 自点击选中;断言前须 settle 等完整宏任务链
    test('arrow keys move the rating value', async () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 2 },
        attachTo: document.body,
      });
      const third = wrapper.findAll('[data-testid="rating-indicator"]')[2];
      (third.element as HTMLElement).focus();
      await third.trigger('keydown', { key: 'ArrowRight' });
      await settle();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3]);
    });
  });

  describe('disabled', () => {
    test('does not emit on click when disabled', async () => {
      const wrapper = mount(Rating, { props: { modelValue: 1, disabled: true } });
      await wrapper.findAll('[data-testid="rating-indicator"]')[3].trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });

  describe('attribute fallthrough', () => {
    test('merges custom class onto the root element', () => {
      const wrapper = mount(Rating, { props: { class: 'my-rating' } });
      const root = wrapper.find('[data-testid="rating-root"]');
      expect(root.classes()).toContain('my-rating');
    });
  });
});
