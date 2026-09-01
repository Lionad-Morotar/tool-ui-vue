import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import OptionIndicator from '../index.vue';

enableAutoUnmount(afterEach);

function getIndicator(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('[data-testid="option-indicator"]');
}

describe('ui/option-indicator', () => {
  describe('shape', () => {
    test('radio 形态渲染为全圆角', () => {
      const wrapper = mount(OptionIndicator, { props: { selected: false, shape: 'radio' } });
      const indicator = getIndicator(wrapper);
      expect(indicator.classes()).toContain('rounded-full');
      expect(indicator.classes()).not.toContain('rounded');
    });

    test('checkbox 形态渲染为常规圆角', () => {
      const wrapper = mount(OptionIndicator, { props: { selected: false, shape: 'checkbox' } });
      const indicator = getIndicator(wrapper);
      expect(indicator.classes()).toContain('rounded');
      expect(indicator.classes()).not.toContain('rounded-full');
    });
  });

  describe('selection style contract', () => {
    // 选中态视觉由这组 class 字面量交付,删改任一即破坏 QuestionFlow 选项反馈,须锁定
    test('选中态锁定 primary 填充与 motion-safe 动画类', () => {
      const wrapper = mount(OptionIndicator, { props: { selected: true, shape: 'checkbox' } });
      const classes = getIndicator(wrapper).classes();
      expect(classes).toContain('border-primary');
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
      expect(classes).toContain('motion-safe:animate-in');
      expect(classes).toContain('motion-safe:fade-in');
      expect(classes).toContain('motion-safe:zoom-in-75');
    });

    test('未选中态仅描边,无填充', () => {
      const wrapper = mount(OptionIndicator, { props: { selected: false, shape: 'checkbox' } });
      const classes = getIndicator(wrapper).classes();
      expect(classes).toContain('border-muted-foreground/50');
      expect(classes).not.toContain('bg-primary');
      expect(classes).not.toContain('motion-safe:animate-in');
    });

    test('checkbox 选中渲染勾形 svg,未选中无内嵌图形', () => {
      const selected = mount(OptionIndicator, { props: { selected: true, shape: 'checkbox' } });
      expect(selected.find('svg').exists()).toBe(true);
      const unselected = mount(OptionIndicator, { props: { selected: false, shape: 'checkbox' } });
      expect(unselected.find('svg').exists()).toBe(false);
    });

    test('radio 选中渲染实心圆点,未选中无内嵌图形', () => {
      const selected = mount(OptionIndicator, { props: { selected: true, shape: 'radio' } });
      const dot = selected.find('[data-testid="option-indicator"] span');
      expect(dot.exists()).toBe(true);
      expect(dot.classes()).toContain('size-2');
      expect(dot.classes()).toContain('rounded-full');
      expect(dot.classes()).toContain('bg-current');
      const unselected = mount(OptionIndicator, { props: { selected: false, shape: 'radio' } });
      expect(unselected.find('[data-testid="option-indicator"] span').exists()).toBe(false);
    });
  });

  describe('disabled', () => {
    test('禁用态降低透明度', () => {
      const wrapper = mount(OptionIndicator, {
        props: { selected: false, shape: 'radio', disabled: true },
      });
      expect(getIndicator(wrapper).classes()).toContain('opacity-50');
    });

    test('非禁用态不带透明度衰减', () => {
      const wrapper = mount(OptionIndicator, { props: { selected: false, shape: 'radio' } });
      expect(getIndicator(wrapper).classes()).not.toContain('opacity-50');
    });
  });

  test('透传自定义 class', () => {
    const wrapper = mount(OptionIndicator, {
      props: { selected: false, shape: 'radio', class: 'my-indicator' },
    });
    expect(getIndicator(wrapper).classes()).toContain('my-indicator');
  });
});
