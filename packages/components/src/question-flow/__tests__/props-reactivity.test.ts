import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { ALLOWED_PATTERNS } from '../../../../../src/test/console-guard';
import QuestionFlow from '../index.vue';

// props 响应式契约：父层以新 steps 引用切换当前 step key 后，aria-labelledby 必须跟随新 step。

ALLOWED_PATTERNS.push(
  // QuestionFlow union props 运行时校验警告已在全局放行；测试期间无额外非预期警告。
);

function createSteps(overrides: Record<string, unknown> = {}) {
  return [
    {
      id: 'q1',
      title: 'What is your name?',
      description: 'Choose a name',
      options: [
        { id: 'a', label: 'Alice' },
        { id: 'b', label: 'Bob' },
      ],
      ...overrides,
    },
  ];
}

describe('QuestionFlow props 响应式', () => {
  test('setProps 切 steps 后 aria-labelledby 跟随新 step key', async () => {
    const wrapper = mount(QuestionFlow, {
      props: { id: 'qf-reactive', steps: createSteps() },
    });

    const root = wrapper.find('[data-slot="question-flow"]');
    expect(root.attributes('aria-labelledby')).toBe('qf-reactive-q1-title');

    await wrapper.setProps({
      steps: [
        {
          id: 'q2',
          title: 'What is your age?',
          description: 'Select your age group',
          options: [
            { id: 'young', label: 'Under 30' },
            { id: 'old', label: 'Over 30' },
          ],
        },
      ],
    });

    expect(root.attributes('aria-labelledby')).toBe('qf-reactive-q2-title');
    expect(wrapper.text()).toContain('What is your age?');
  });
});
