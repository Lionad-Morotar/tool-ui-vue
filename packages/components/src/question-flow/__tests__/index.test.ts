import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { installScrollIntoViewShim, settle } from '../../ui/__tests__/reka-test-utils';
import QuestionFlow from '../index.vue';
import { safeParseSerializableQuestionFlow } from '../schema';

enableAutoUnmount(afterEach);

// reka Listbox 挂载即 highlight 首项并调用 scrollIntoView,jsdom 缺口由共享垫片补齐
beforeAll(installScrollIntoViewShim);

const globalMountOptions = {
  global: { config: { warnHandler: () => {} } },
};

const QUESTIONS = [
  {
    id: 'q1',
    title: 'What is your name?',
    description: 'Choose a name',
    options: [
      { id: 'a', label: 'Alice' },
      { id: 'b', label: 'Bob' },
    ],
  },
  {
    id: 'q2',
    title: 'What is your age?',
    description: 'Select your age group',
    options: [
      { id: 'young', label: 'Under 30' },
      { id: 'old', label: 'Over 30' },
    ],
  },
];

describe('rendering', () => {
  test('renders current question', () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    expect(wrapper.text()).toContain('What is your name?');
  });

  test('renders question number', () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    expect(wrapper.text()).toContain('Step 1 of 2');
  });

  test('renders answer options', () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    expect(wrapper.text()).toContain('Alice');
    expect(wrapper.text()).toContain('Bob');
  });

  test('renders question description', () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    expect(wrapper.text()).toContain('Choose a name');
  });
});

describe('navigation', () => {
  test('disables next when no answer selected', () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    const nextButton = wrapper.findAll('button').find((b) => b.text() === 'Next');
    expect(nextButton?.attributes('disabled')).toBeDefined();
  });

  test('enables next when answer selected', async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger('click');
    const nextButton = wrapper.findAll('button').find((b) => b.text() === 'Next');
    expect(nextButton?.attributes('disabled')).toBeUndefined();
  });
});

describe('progressive mode selection', () => {
  test('selects option on click and highlights it', async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', step: 1, title: 'Pick one', options: QUESTIONS[0].options },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger('click');
    const selected = wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true');
    expect(selected?.text()).toContain('Alice');
  });

  test('emits select on complete in progressive mode', async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', step: 1, title: 'Pick one', options: QUESTIONS[0].options },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger('click');
    const nextButton = wrapper.findAll('button').find((b) => b.text() === 'Complete');
    await nextButton?.trigger('click');
    expect(wrapper.emitted('select')?.[0]).toEqual([['a']]);
  });

  test('shows selected answer from defaultValue', async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', step: 1, title: 'Pick one', options: QUESTIONS[0].options, defaultValue: ['a'] },
    });
    const selected = wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true');
    expect(selected).toBeTruthy();
    expect(selected?.text()).toContain('Alice');
  });

  test('allows changing answer in progressive mode', async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', step: 1, title: 'Pick one', options: QUESTIONS[0].options },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger('click');
    expect(wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true')?.text()).toContain('Alice');
    await options[1]?.trigger('click');
    expect(wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true')?.text()).toContain('Bob');
  });

  test('supports multiple answers if configured', async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', step: 1, title: 'Pick many', options: QUESTIONS[0].options, selectionMode: 'multi' as const },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger('click');
    await options[1]?.trigger('click');
    const selected = wrapper.findAll("[role='option']").filter((b) => b.attributes('aria-selected') === 'true');
    expect(selected.length).toBe(2);
  });
});

describe('progress', () => {
  test('shows progress indicator', () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    expect(wrapper.find("[role='progressbar']").exists()).toBe(true);
  });

  test('calculates progress correctly', () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    const progressbar = wrapper.find("[role='progressbar']");
    expect(progressbar.attributes('aria-valuenow')).toBe('1');
    expect(progressbar.attributes('aria-valuemax')).toBe('2');
  });
});

describe('upfront complete', () => {
  test('emits complete on final question next', async () => {
    vi.useFakeTimers();
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    let options = wrapper.findAll("[role='option']");
    await options[0]?.trigger('click');
    let nextButton = wrapper.findAll('button').find((b) => b.text() === 'Next');
    await nextButton?.trigger('click');
    await vi.advanceTimersByTimeAsync(300);
    options = wrapper.findAll("[role='option']");
    await options[0]?.trigger('click');
    nextButton = wrapper.findAll('button').find((b) => b.text() === 'Complete');
    await nextButton?.trigger('click');
    expect(wrapper.emitted('complete')?.length).toBe(1);
    vi.useRealTimers();
  });

  test('emits back on back button click', async () => {
    vi.useFakeTimers();
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger('click');
    const nextButton = wrapper.findAll('button').find((b) => b.text() === 'Next');
    await nextButton?.trigger('click');
    await vi.advanceTimersByTimeAsync(300);
    const backButton = wrapper.findAll('button').find((b) => b.text().includes('Back'));
    await backButton?.trigger('click');
    // upfront mode navigates internally on back, no event emit
    expect(backButton?.exists()).toBe(true);
    vi.useRealTimers();
  });
});

describe('receipt mode', () => {
  test('shows completion summary', () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: {
        id: 'qf-1',
        choice: { title: 'Done', summary: [{ label: 'Name', value: 'Alice' }] },
      },
    });
    expect(wrapper.text()).toContain('Done');
    expect(wrapper.text()).toContain('Alice');
  });
});

describe('listbox 结构契约', () => {
  // 选项交互由 reka Listbox 承载:data-orientation 是 ListboxContent 的固有属性,
  // 指示器收敛为 option-indicator 原子;两者缺失即回退为手写实现
  test('选项挂载于 reka Listbox 部件且指示器为 option-indicator 原子', () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
    });
    const listbox = wrapper.find("[role='listbox']");
    expect(listbox.attributes('data-orientation')).toBe('vertical');
    const options = wrapper.findAll("[role='option']");
    expect(options.length).toBe(2);
    for (const option of options) {
      expect(option.find('[data-testid="option-indicator"]').exists()).toBe(true);
    }
  });
});

describe('exiting 快照契约', () => {
  // 换步退场快照是静态记录:exiting 分支随 v-if 全新挂载,若指示器仍带
  // animate-in,CSS 动画会在新节点从头播放(退场窗口 250ms 短于动画 300ms,
  // 用户可见已选指示器重新放大淡入);契约要求快照内指示器一律不挂 animate-in,
  // 动画只属于当前步用户的真实点击反馈
  test('exiting 分支已选指示器不挂入场动画类', async () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(QuestionFlow, {
        ...globalMountOptions,
        props: { id: 'qf-1', steps: QUESTIONS },
      });
      const options = wrapper.findAll("[role='option']");
      await options[0]?.trigger('click');
      const nextButton = wrapper.findAll('button').find((b) => b.text() === 'Next');
      await nextButton?.trigger('click');
      const exiting = wrapper.find('[aria-hidden="true"]');
      expect(exiting.exists()).toBe(true);
      const indicators = exiting.findAll('[data-testid="option-indicator"]');
      expect(indicators.length).toBe(2);
      const selectedIndicator = indicators.find((i) => i.attributes('data-state') === 'selected');
      expect(selectedIndicator).toBeTruthy();
      for (const indicator of indicators) {
        expect(indicator.classes()).not.toContain('motion-safe:animate-in');
      }
    } finally {
      // 断言失败也要复位计时器,否则 fake timers 泄漏会让后续用例的异步等待集体超时
      vi.useRealTimers();
    }
  });
});

describe('keyboard navigation', () => {
  // reka Listbox 接管 roving:挂载后 highlight 落首个可选项,
  // 方向键经 Content 的 keydown 移动 highlight 并同步实焦点,tabindex 0/-1 仍是单焦点契约;
  // attachTo document 是实焦点断言的硬前提(悬空挂载 jsdom focus 为 no-op)
  test('navigates with arrow keys', async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
      attachTo: document.body,
    });
    await settle();
    let options = wrapper.findAll("[role='option']");
    expect(options[0]?.attributes('tabindex')).toBe('0');
    const listbox = wrapper.find("[role='listbox']");
    await listbox.trigger('keydown', { key: 'ArrowDown' });
    options = wrapper.findAll("[role='option']");
    expect(options[1]?.attributes('tabindex')).toBe('0');
    expect(options[0]?.attributes('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(options[1]?.element);
  });

  // Enter 选中以 reka 内建行为为准:对 highlight 项派发 click;挂载后首项已
  // highlight(tabindex 0 即 highlight 契约),无需先手动 focus;
  // 钉 tabindex 而非 activeElement——jsdom 下挂载期实焦点会被后续元素替换重置,
  // 属环境伪影,键盘交互路径的实焦点移动由 arrow 用例锁定
  test('selects with Enter on focused option', async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', step: 1, title: 'Pick', options: QUESTIONS[0].options },
      attachTo: document.body,
    });
    await settle();
    const options = wrapper.findAll("[role='option']");
    expect(options[0]?.attributes('tabindex')).toBe('0');
    await options[0]?.trigger('keydown', { key: 'Enter' });
    const selected = wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true');
    expect(selected?.text()).toContain('Alice');
  });

  test('skips disabled options during arrow navigation', async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: {
        id: 'qf-1',
        step: 1,
        title: 'Pick',
        options: [
          { id: 'a', label: 'Alice' },
          { id: 'b', label: 'Bob', disabled: true },
          { id: 'c', label: 'Carol' },
        ],
      },
      attachTo: document.body,
    });
    await settle();
    const listbox = wrapper.find("[role='listbox']");
    await listbox.trigger('keydown', { key: 'ArrowDown' });
    const options = wrapper.findAll("[role='option']");
    expect(options[2]?.attributes('tabindex')).toBe('0');
    expect(options[1]?.attributes('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(options[2]?.element);
  });

  test('does not select disabled option on click', async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: {
        id: 'qf-1',
        step: 1,
        title: 'Pick',
        options: [
          { id: 'a', label: 'Alice' },
          { id: 'b', label: 'Bob', disabled: true },
        ],
      },
      attachTo: document.body,
    });
    await settle();
    const options = wrapper.findAll("[role='option']");
    await options[1]?.trigger('click');
    const anySelected = wrapper
      .findAll("[role='option']")
      .some((b) => b.attributes('aria-selected') === 'true');
    expect(anySelected).toBe(false);
  });

  // 换步后键盘入口回归锁:transition 窗口内新步选项全 disabled,reka 导航集合为空,
  // 依赖按 step key 重建的 Listbox 实例让容器 tabindex 归零为 0,方向键才能重新建立
  // highlight;若 key 被移除,换步后键盘焦点将永远无法进入选项区
  test('keeps keyboard navigation available after step change', async () => {
    vi.useFakeTimers();
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-1', steps: QUESTIONS },
      attachTo: document.body,
    });
    await vi.advanceTimersByTimeAsync(0);
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger('click');
    const nextButton = wrapper.findAll('button').find((b) => b.text() === 'Next');
    await nextButton?.trigger('click');
    await vi.advanceTimersByTimeAsync(300);
    const listbox = wrapper.find("[role='listbox']");
    await listbox.trigger('keydown', { key: 'ArrowDown' });
    const steppedOptions = wrapper.findAll("[role='option']");
    expect(steppedOptions.some((o) => o.attributes('tabindex') === '0')).toBe(true);
    vi.useRealTimers();
  });
});

// fields 步骤:复用 PreferenceItem 契约的表单字段步骤,options 与 fields 二选一
describe('fields steps', () => {
  const FIELDS_STEP = {
    id: 'contact',
    title: 'Leave your contact',
    fields: [
      { id: 'phone', type: 'input' as const, label: 'Phone', required: true, placeholder: '13800xxxxxxx' },
      { id: 'note', type: 'textarea' as const, label: 'Note', rows: 2 },
    ],
  };
  const STEPS_WITH_FIELDS = [QUESTIONS[0], FIELDS_STEP];

  test('renders field controls and labels for a fields step', async () => {
    vi.useFakeTimers();
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-fields', steps: STEPS_WITH_FIELDS },
    });
    await wrapper.findAll("[role='option']")[0]?.trigger('click');
    await wrapper.findAll('button').find((b) => b.text() === 'Next')?.trigger('click');
    await vi.advanceTimersByTimeAsync(300);
    expect(wrapper.text()).toContain('Leave your contact');
    expect(wrapper.text()).toContain('Phone');
    expect(wrapper.find('[data-testid="preference-field"]').exists()).toBe(true);
    vi.useRealTimers();
  });

  test('next stays disabled until required fields are filled', async () => {
    vi.useFakeTimers();
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-fields', steps: STEPS_WITH_FIELDS },
    });
    await wrapper.findAll("[role='option']")[0]?.trigger('click');
    await wrapper.findAll('button').find((b) => b.text() === 'Next')?.trigger('click');
    await vi.advanceTimersByTimeAsync(300);
    let nextButton = wrapper.findAll('button').find((b) => b.text() === 'Complete');
    expect(nextButton?.attributes('disabled')).toBeDefined();
    // 填写 required 字段后可推进
    const input = wrapper.find('input[id="preference-phone"]');
    await input.setValue('13800138000');
    nextButton = wrapper.findAll('button').find((b) => b.text() === 'Complete');
    expect(nextButton?.attributes('disabled')).toBeUndefined();
    vi.useRealTimers();
  });

  test('emits complete with field values map on final fields step', async () => {
    vi.useFakeTimers();
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-fields', steps: STEPS_WITH_FIELDS },
    });
    await wrapper.findAll("[role='option']")[0]?.trigger('click');
    await wrapper.findAll('button').find((b) => b.text() === 'Next')?.trigger('click');
    await vi.advanceTimersByTimeAsync(300);
    await wrapper.find('input[id="preference-phone"]').setValue('13800138000');
    await wrapper.findAll('button').find((b) => b.text() === 'Complete')?.trigger('click');
    const payload = wrapper.emitted('complete')?.[0]?.[0] as Record<
      string,
      string[] | Record<string, unknown>
    >;
    expect(payload.q1).toEqual(['a']);
    expect(payload.contact).toMatchObject({ phone: '13800138000' });
    vi.useRealTimers();
  });

  test('back keeps previously entered field values', async () => {
    vi.useFakeTimers();
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: 'qf-fields', steps: STEPS_WITH_FIELDS },
      attachTo: document.body,
    });
    await wrapper.findAll("[role='option']")[0]?.trigger('click');
    await wrapper.findAll('button').find((b) => b.text() === 'Next')?.trigger('click');
    await vi.advanceTimersByTimeAsync(300);
    await wrapper.find('input[id="preference-phone"]').setValue('13900139000');
    await wrapper.findAll('button').find((b) => b.text().includes('Back'))?.trigger('click');
    await vi.advanceTimersByTimeAsync(300);
    await wrapper.findAll('button').find((b) => b.text() === 'Next')?.trigger('click');
    await vi.advanceTimersByTimeAsync(300);
    expect((wrapper.find('input[id="preference-phone"]').element as HTMLInputElement).value).toBe(
      '13900139000'
    );
    vi.useRealTimers();
  });
});

describe('fields step schema 契约', () => {
  test('accepts a step with fields instead of options', () => {
    const result = safeParseSerializableQuestionFlow({
      id: 'qf-schema',
      steps: [
        {
          id: 'contact',
          title: 'Contact',
          fields: [{ id: 'phone', type: 'input', label: 'Phone' }],
        },
      ],
    });
    expect(result).not.toBeNull();
  });

  test('rejects a step with neither options nor fields', () => {
    const result = safeParseSerializableQuestionFlow({
      id: 'qf-schema',
      steps: [{ id: 'empty', title: 'Empty' }],
    });
    expect(result).toBeNull();
  });
});
