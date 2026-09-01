import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { defineComponent, ref } from 'vue';
import { settle } from '../../__tests__/reka-test-utils';
import DatePicker from '../index.vue';

enableAutoUnmount(afterEach);

/** 浮层经 Popover teleport 到 body,查询与点击都走 document */
function contentEl(): HTMLElement {
  return document.body.querySelector('[data-testid="date-content"]') as HTMLElement;
}

/** 点选当前视图内某一日(排除上月/下月补齐的 outside 格,避免同号歧义) */
async function clickDay(day: string) {
  const triggers = Array.from(
    contentEl().querySelectorAll<HTMLElement>('[data-reka-calendar-cell-trigger]')
  ).filter((el) => !el.hasAttribute('data-outside-view') && el.textContent?.trim() === day);
  expect(triggers.length, `day ${day} should exist exactly once in current view`).toBe(1);
  triggers[0].click();
  await settle();
}

describe('ui/date', () => {
  describe('mode=date rendering', () => {
    test('shows placeholder text when empty', () => {
      const wrapper = mount(DatePicker, { props: { placeholder: 'Pick a date' } });
      expect(wrapper.find('[data-testid="date-trigger"]').text()).toContain('Pick a date');
    });

    test('shows formatted value from modelValue', () => {
      const wrapper = mount(DatePicker, { props: { modelValue: '2026-03-10' } });
      expect(wrapper.find('[data-testid="date-trigger"]').text()).toContain('2026-03-10');
    });

    // 非法串归空:脏数据落到「未选择」态而不是抛错或原样回显
    test('falls back to placeholder for invalid modelValue', () => {
      const wrapper = mount(DatePicker, {
        props: { modelValue: '2026-13-45', placeholder: 'Pick a date' },
      });
      expect(wrapper.find('[data-testid="date-trigger"]').text()).toContain('Pick a date');
    });

    test('merges custom class onto the trigger', () => {
      const wrapper = mount(DatePicker, { props: { class: 'my-date' } });
      expect(wrapper.find('[data-testid="date-trigger"]').classes()).toContain('my-date');
    });
  });

  describe('mode=date interaction', () => {
    test('emits YYYY-MM-DD when a day is picked', async () => {
      const wrapper = mount(DatePicker, {
        props: { modelValue: '2026-03-10' },
        attachTo: document.body,
      });
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await clickDay('15');
      expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['2026-03-15']);
    });

    // reka 默认 preventDeselect=false:再点已选日期即反选,桥接为空串(表单未填态)
    test('emits empty string when the selected day is clicked again', async () => {
      const wrapper = mount(DatePicker, {
        props: { modelValue: '2026-03-10' },
        attachTo: document.body,
      });
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await clickDay('10');
      expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['']);
    });

    test('round-trips with parent v-model', async () => {
      const Harness = defineComponent({
        components: { DatePicker },
        setup: () => ({ value: ref('2026-03-10') }),
        template: '<DatePicker v-model="value" />',
      });
      const wrapper = mount(Harness, { attachTo: document.body });
      const vm = wrapper.vm as unknown as { value: string };
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await clickDay('20');
      expect(vm.value).toBe('2026-03-20');
      expect(wrapper.find('[data-testid="date-trigger"]').text()).toContain('2026-03-20');
    });
  });

  describe('mode=date disabled', () => {
    test('trigger is disabled and does not open the popover', async () => {
      const wrapper = mount(DatePicker, {
        props: { disabled: true },
        attachTo: document.body,
      });
      const trigger = wrapper.find('[data-testid="date-trigger"]');
      expect(trigger.attributes('disabled')).toBeDefined();
      await trigger.trigger('click');
      await settle();
      expect(document.body.querySelector('[data-testid="date-content"]')).toBeNull();
    });
  });

  describe('mode=datetime', () => {
    test('shows formatted datetime value from modelValue', () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'datetime', modelValue: '2026-03-10T08:30' },
      });
      expect(wrapper.find('[data-testid="date-trigger"]').text()).toContain('2026-03-10 08:30');
    });

    // datetime 交互是确认式:选日期不关浮层(closeOnSelect=false),确认位才合并外发;
    // 空值(新建场景)未碰时间时默认 T00:00
    test('stays open after picking a day and emits with default T00:00 on confirm', async () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'datetime' },
        attachTo: document.body,
      });
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await clickDay('15');
      expect(
        document.body.querySelector('[data-testid="date-content"]'),
        'picking a day must not close the popover in datetime mode'
      ).not.toBeNull();
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      (document.body.querySelector('[data-testid="date-confirm"]') as HTMLElement).click();
      await settle();
      // 空 model 打开时日历定位当月,15 日恒存在
      const now = new Date();
      const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-15T00:00`;
      expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([expected]);
    });

    test('merges the picked day with the time field on confirm', async () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'datetime', modelValue: '2026-03-10T08:30' },
        attachTo: document.body,
      });
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await clickDay('15');
      // TimeField 段是 contenteditable spinbutton,键盘 ArrowUp 步进
      const hour = contentEl().querySelector<HTMLElement>('[data-reka-time-field-segment="hour"]')!;
      hour.focus();
      await settle();
      hour.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await settle();
      (document.body.querySelector('[data-testid="date-confirm"]') as HTMLElement).click();
      await settle();
      expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['2026-03-15T09:30']);
    });

    test('discards unconfirmed changes when the popover closes', async () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'datetime', modelValue: '2026-03-10T08:30' },
        attachTo: document.body,
      });
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await clickDay('20');
      // 未经确认直接 Esc 关浮层:改动丢弃,不 emit,重开回到原值
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
      await settle();
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await clickDay('12');
      (document.body.querySelector('[data-testid="date-confirm"]') as HTMLElement).click();
      await settle();
      expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['2026-03-12T08:30']);
    });

    // 点外关闭与 Esc 同属非确认关闭:草稿一并丢弃
    test('discards unconfirmed changes on outside click', async () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'datetime', modelValue: '2026-03-10T08:30' },
        attachTo: document.body,
      });
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await clickDay('20');
      // DismissableLayer 监听 document 的 pointerdown 判定点外
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await settle();
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(document.body.querySelector('[data-testid="date-content"]')).toBeNull();
    });

    // 空值场景未选日期时确认位禁用:只调了时间就点确认,草稿无日期可合并,
    // 可点击会造成「已填 09:30」的错觉而实际静默丢弃
    test('confirm is disabled until a day is picked', async () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'datetime' },
        attachTo: document.body,
      });
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      const confirm = document.body.querySelector('[data-testid="date-confirm"]') as HTMLElement;
      expect(confirm.getAttribute('disabled')).not.toBeNull();
      await clickDay('15');
      expect(
        (document.body.querySelector('[data-testid="date-confirm"]') as HTMLElement).getAttribute(
          'disabled'
        )
      ).toBeNull();
    });

    // 外部 model 是权威源:浮层开期间外部更新同步进草稿,
    // 未做改动时确认不得以打开时的旧快照回写覆盖外部新值
    test('syncs external modelValue updates into the draft while open', async () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'datetime', modelValue: '2026-03-10T08:30' },
        attachTo: document.body,
      });
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await wrapper.setProps({ modelValue: '2026-04-01T10:00' });
      await settle();
      (document.body.querySelector('[data-testid="date-confirm"]') as HTMLElement).click();
      await settle();
      const emitted = wrapper.emitted('update:modelValue') ?? [];
      expect(
        emitted.flat(),
        'confirm must not overwrite the external update with the stale snapshot'
      ).not.toContain('2026-03-10T08:30');
    });
  });

  describe('mode switching', () => {
    // mode 切换时 model 类型随之变化(string ↔ string[]):
    // date 本地态被外部数组清空属正常同步,不得反向把 '' emit 回父级污染 string[] 契约
    test('switching from date to range never emits a string into the array contract', async () => {
      const Harness = defineComponent({
        components: { DatePicker },
        setup: () => ({
          mode: ref<'date' | 'range'>('date'),
          value: ref<string | string[]>('2026-03-10'),
        }),
        template: '<DatePicker v-model="value" :mode="mode" placeholder="Pick" />',
      });
      const wrapper = mount(Harness, { attachTo: document.body });
      const vm = wrapper.vm as unknown as {
        mode: 'date' | 'range';
        value: string | string[];
      };
      vm.mode = 'range';
      vm.value = ['2026-03-10', '2026-03-20'];
      await wrapper.vm.$nextTick();
      await settle();
      const emitted = wrapper.findComponent(DatePicker).emitted('update:modelValue') ?? [];
      expect(emitted.flat()).not.toContain('');
      expect(vm.value).toEqual(['2026-03-10', '2026-03-20']);
    });
  });

  describe('mode=range', () => {
    test('shows placeholder when empty and start ~ end when set', () => {
      const empty = mount(DatePicker, {
        props: { mode: 'range', modelValue: [], placeholder: 'Pick a range' },
      });
      expect(empty.find('[data-testid="date-trigger"]').text()).toContain('Pick a range');
      const filled = mount(DatePicker, {
        props: { mode: 'range', modelValue: ['2026-03-10', '2026-03-20'] },
      });
      expect(filled.find('[data-testid="date-trigger"]').text()).toContain('2026-03-10 ~ 2026-03-20');
    });

    // 非法端点归空:脏数据落到「未选择」态
    test('falls back to placeholder for invalid range entries', () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'range', modelValue: ['2026-13-45', 'x'], placeholder: 'Pick a range' },
      });
      expect(wrapper.find('[data-testid="date-trigger"]').text()).toContain('Pick a range');
    });

    // 中间态契约:只选一端不 emit,双端齐才外发 [start, end]
    test('emits [start, end] only after both ends are picked', async () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'range', modelValue: ['2026-03-10', '2026-03-20'] },
        attachTo: document.body,
      });
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await clickDay('12');
      expect(wrapper.emitted('update:modelValue'), 'single end picked must not emit').toBeFalsy();
      await clickDay('18');
      expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([
        ['2026-03-12', '2026-03-18'],
      ]);
    });

    test('round-trips with parent v-model', async () => {
      const Harness = defineComponent({
        components: { DatePicker },
        setup: () => ({ value: ref<string[]>([]) }),
        template: '<DatePicker v-model="value" mode="range" placeholder="Pick a range" />',
      });
      const wrapper = mount(Harness, { attachTo: document.body });
      const vm = wrapper.vm as unknown as { value: string[] };
      await wrapper.find('[data-testid="date-trigger"]').trigger('click');
      await settle();
      await clickDay('10');
      await clickDay('20');
      expect(vm.value).toHaveLength(2);
      expect(wrapper.find('[data-testid="date-trigger"]').text()).toContain('~');
    });
  });
});
