import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import MessageDraft from '../cmpts/message-draft.vue';

function createEmailProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-message',
    channel: 'email',
    subject: 'Hello',
    body: 'Message content',
    to: ['john@example.com'],
    from: 'sender@example.com',
    ...overrides,
  };
}

function createSlackProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-message',
    channel: 'slack',
    body: 'Slack message content',
    target: { type: 'channel', name: 'general' },
    ...overrides,
  };
}

describe('MessageDraft', () => {
  describe('rendering', () => {
    test('renders recipient in email draft', () => {
      const wrapper = mount(MessageDraft, {
        props: createEmailProps(),
      });
      expect(wrapper.text()).toContain('john@example.com');
    });

    test('renders subject field', () => {
      const wrapper = mount(MessageDraft, {
        props: createEmailProps(),
      });
      expect(wrapper.text()).toContain('Hello');
    });

    test('renders message body for email', () => {
      const wrapper = mount(MessageDraft, {
        props: createEmailProps(),
      });
      expect(wrapper.text()).toContain('Message content');
    });

    test('renders slack target name', () => {
      const wrapper = mount(MessageDraft, {
        props: createSlackProps(),
      });
      expect(wrapper.text()).toContain('#general');
    });

    test('renders slack message body', () => {
      const wrapper = mount(MessageDraft, {
        props: createSlackProps(),
      });
      expect(wrapper.text()).toContain('Slack message content');
    });
  });

  describe('events', () => {
    test('emits send after undo grace period expires', async () => {
      const wrapper = mount(MessageDraft, {
        props: createEmailProps({ undoGracePeriod: 50 }),
      });
      const sendButton = wrapper.findAll('button').find((b) => b.text().includes('Send'));
      expect(sendButton).toBeDefined();
      await sendButton!.trigger('click');
      expect(wrapper.emitted('send')).toBeFalsy();
      await new Promise((r) => setTimeout(r, 80));
      expect(wrapper.emitted('send')).toBeTruthy();
    });

    test('emits cancel on cancel button click', async () => {
      const wrapper = mount(MessageDraft, {
        props: createEmailProps(),
      });
      const cancelButton = wrapper.findAll('button').find((b) => b.text().includes('Cancel'));
      expect(cancelButton).toBeDefined();
      await cancelButton!.trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    test('emits undo on undo button click in sending state', async () => {
      const wrapper = mount(MessageDraft, {
        props: createEmailProps({ undoGracePeriod: 99999 }),
      });
      const sendButton = wrapper.findAll('button').find((b) => b.text().includes('Send'));
      await sendButton!.trigger('click');
      await new Promise((r) => setTimeout(r, 10));
      const undoButton = wrapper.findAll('button').find((b) => b.text().includes('Undo'));
      expect(undoButton).toBeDefined();
      await undoButton!.trigger('click');
      expect(wrapper.emitted('undo')).toBeTruthy();
    });
  });

  describe('states', () => {
    test('renders sent receipt when outcome is sent', () => {
      const wrapper = mount(MessageDraft, {
        props: createEmailProps({ outcome: 'sent' }),
      });
      expect(wrapper.find('[data-receipt="true"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Sent at');
    });

    test('renders nothing when outcome is cancelled', () => {
      const wrapper = mount(MessageDraft, {
        props: createEmailProps({ outcome: 'cancelled' }),
      });
      expect(wrapper.find('article').exists()).toBe(false);
      expect(wrapper.find('[data-receipt="true"]').exists()).toBe(false);
    });

    test('has data-slot attribute', () => {
      const wrapper = mount(MessageDraft, {
        props: createEmailProps(),
      });
      expect(wrapper.find('[data-slot="message-draft"]').exists()).toBe(true);
    });

    test('applies custom css.root', () => {
      const wrapper = mount(MessageDraft, {
        props: createEmailProps({ css: { root: 'my-draft' } }),
      });
      expect(wrapper.find('[data-slot="message-draft"]').classes()).toContain('my-draft');
    });
  });
});
