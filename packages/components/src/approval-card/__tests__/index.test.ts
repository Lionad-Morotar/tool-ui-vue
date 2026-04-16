import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';

// Shared locale state so i18n tests can switch languages
const currentLocale = ref('en');

const messagesByLocale: Record<string, Record<string, string>> = {
  en: {
    'approvalCard.approve': 'Approve',
    'approvalCard.reject': 'Deny',
  },
  'zh-CN': {
    'approvalCard.approve': '批准',
    'approvalCard.reject': '拒绝',
  },
};

// Mock useI18n to provide locale-aware translations
vi.mock('../../core/i18n', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        return computed(() => {
          const msgs = messagesByLocale[currentLocale.value] ?? {};
          let text = msgs[key] ?? key;
          if (params) {
            Object.entries(params).forEach(([k, v]) => {
              text = text.replace(`{${k}}`, String(v));
            });
          }
          return text;
        });
      },
      locale: computed(() => currentLocale.value),
      setLocale: (locale: string) => { currentLocale.value = locale; },
    }),
  };
});

import ApprovalCard from '../index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-approval',
    title: 'Test Title',
    ...overrides,
  };
}

describe('ApprovalCard', () => {
  describe('rendering', () => {
    test('renders with required props (id, title)', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      expect(wrapper.find('[data-slot="approval-card"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Test Title');
    });

    test('renders description when provided', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ description: 'Test description' }),
      });
      expect(wrapper.text()).toContain('Test description');
    });

    test('renders metadata items', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({
          metadata: [{ key: 'Author', value: 'John' }],
        }),
      });
      expect(wrapper.text()).toContain('Author');
      expect(wrapper.text()).toContain('John');
    });

    test('renders multiple metadata items', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({
          metadata: [
            { key: 'Author', value: 'John' },
            { key: 'Date', value: '2024-01-01' },
            { key: 'Status', value: 'Pending' },
          ],
        }),
      });
      expect(wrapper.text()).toContain('Author');
      expect(wrapper.text()).toContain('John');
      expect(wrapper.text()).toContain('Date');
      expect(wrapper.text()).toContain('2024-01-01');
      expect(wrapper.text()).toContain('Status');
      expect(wrapper.text()).toContain('Pending');
    });

    test('renders icon when provided', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ icon: 'check' }),
      });
      expect(wrapper.find('svg').exists()).toBe(true);
    });

    test('renders trash icon', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ icon: 'trash', variant: 'destructive' }),
      });
      expect(wrapper.find('svg').exists()).toBe(true);
    });

    test('renders file-text icon', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ icon: 'file-text' }),
      });
      expect(wrapper.find('svg').exists()).toBe(true);
    });

    test('does not render icon when not provided', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      // Should only have buttons, no icon svgs in the content area
      const _svgs = wrapper.findAll('svg');
      // There might be icons in buttons, but no icon in the header
      expect(wrapper.find('.size-10').exists()).toBe(false);
    });

    test('has correct aria attributes', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ description: 'Test description' }),
      });
      const article = wrapper.find('article');
      expect(article.attributes('role')).toBe('dialog');
      expect(article.attributes('aria-labelledby')).toBe('test-approval-title');
      expect(article.attributes('aria-describedby')).toBe('test-approval-description');
    });

    test('has correct data-tool-ui-id attribute', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      expect(wrapper.find('[data-tool-ui-id="test-approval"]').exists()).toBe(true);
    });
  });

  describe('events', () => {
    test('emits confirm on approve button click', async () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      const buttons = wrapper.findAll('button');
      await buttons[buttons.length - 1].trigger('click');
      expect(wrapper.emitted('confirm')).toBeTruthy();
      expect(wrapper.emitted('confirm')?.length).toBe(1);
    });

    test('emits cancel on cancel button click', async () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      const buttons = wrapper.findAll('button');
      await buttons[0].trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
      expect(wrapper.emitted('cancel')?.length).toBe(1);
    });

    test('emits cancel on Escape key', async () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      await wrapper.find('article').trigger('keydown', { key: 'Escape' });
      expect(wrapper.emitted('cancel')).toBeTruthy();
      expect(wrapper.emitted('cancel')?.length).toBe(1);
    });

    test('does not emit on other key presses', async () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      await wrapper.find('article').trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('cancel')).toBeFalsy();
      expect(wrapper.emitted('confirm')).toBeFalsy();
    });
  });

  describe('receipt mode', () => {
    test("renders receipt view when choice is 'approved'", () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ choice: 'approved' }),
      });
      expect(wrapper.find('[data-receipt="true"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Approve');
    });

    test("renders denied receipt when choice is 'denied'", () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ choice: 'denied' }),
      });
      expect(wrapper.find('[data-receipt="true"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Deny');
    });

    test('receipt uses custom confirmLabel', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({
          choice: 'approved',
          confirmLabel: 'Deploy',
        }),
      });
      expect(wrapper.text()).toContain('Deploy');
      expect(wrapper.text()).not.toContain('Approve');
    });

    test('receipt uses custom cancelLabel', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({
          choice: 'denied',
          cancelLabel: 'Reject',
        }),
      });
      expect(wrapper.text()).toContain('Reject');
      expect(wrapper.text()).not.toContain('Deny');
    });

    test('receipt has correct aria-label', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({
          choice: 'approved',
          confirmLabel: 'Deploy',
        }),
      });
      const receipt = wrapper.find('[data-receipt="true"]');
      expect(receipt.attributes('aria-label')).toBe('Deploy');
    });

    test('receipt has role status', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ choice: 'approved' }),
      });
      const receipt = wrapper.find('[data-receipt="true"]');
      expect(receipt.attributes('role')).toBe('status');
    });

    test('does not render interactive elements in receipt mode', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ choice: 'approved' }),
      });
      expect(wrapper.find('article').exists()).toBe(false);
      expect(wrapper.findAll('button').length).toBe(0);
    });
  });

  describe('variants', () => {
    test('applies destructive styling', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ variant: 'destructive' }),
      });
      const buttons = wrapper.findAll('button');
      const confirmBtn = buttons[buttons.length - 1];
      expect(confirmBtn.classes()).toContain('bg-destructive');
    });

    test('applies default styling by default', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      const buttons = wrapper.findAll('button');
      const confirmBtn = buttons[buttons.length - 1];
      expect(confirmBtn.classes()).toContain('bg-primary');
    });

    test('destructive variant shows destructive icon background', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ variant: 'destructive', icon: 'trash' }),
      });
      const iconContainer = wrapper.find('.size-10');
      expect(iconContainer.classes()).toContain('bg-destructive/10');
      expect(iconContainer.classes()).toContain('text-destructive');
    });

    test('default variant shows primary icon background', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ variant: 'default', icon: 'check' }),
      });
      const iconContainer = wrapper.find('.size-10');
      expect(iconContainer.classes()).toContain('bg-primary/10');
      expect(iconContainer.classes()).toContain('text-primary');
    });
  });

  describe('custom labels', () => {
    test('uses custom confirm label', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ confirmLabel: 'Deploy' }),
      });
      const buttons = wrapper.findAll('button');
      const confirmBtn = buttons[buttons.length - 1];
      expect(confirmBtn.text()).toBe('Deploy');
    });

    test('uses custom cancel label', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ cancelLabel: 'Abort' }),
      });
      const buttons = wrapper.findAll('button');
      const cancelBtn = buttons[0];
      expect(cancelBtn.text()).toBe('Abort');
    });

    test('uses default labels when not specified', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      const buttons = wrapper.findAll('button');
      expect(buttons[0].text()).toBe('Deny');
      expect(buttons[buttons.length - 1].text()).toBe('Approve');
    });
  });

  describe('accessibility', () => {
    test('has correct tabindex for keyboard navigation', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      const article = wrapper.find('article');
      expect(article.attributes('tabindex')).toBe('-1');
    });

    test('receipt has correct data-slot attribute', () => {
      const wrapper = mount(ApprovalCard, {
        props: createProps({ choice: 'approved' }),
      });
      const receipt = wrapper.find('[data-receipt="true"]');
      expect(receipt.attributes('data-slot')).toBe('approval-card');
    });
  });

  describe('i18n', () => {
    beforeEach(() => { currentLocale.value = 'en'; });

    test('uses zh-CN labels when locale is set to zh-CN', () => {
      currentLocale.value = 'zh-CN';
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      const buttons = wrapper.findAll('button');
      expect(buttons[0].text()).toBe('拒绝');
      expect(buttons[buttons.length - 1].text()).toBe('批准');
    });

    test('uses English labels when locale is en', () => {
      currentLocale.value = 'en';
      const wrapper = mount(ApprovalCard, {
        props: createProps(),
      });
      const buttons = wrapper.findAll('button');
      expect(buttons[0].text()).toBe('Deny');
      expect(buttons[buttons.length - 1].text()).toBe('Approve');
    });
  });
});
