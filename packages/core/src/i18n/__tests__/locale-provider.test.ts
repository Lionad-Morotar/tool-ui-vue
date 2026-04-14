import { mount } from '@vue/test-utils';
import { describe, expect, test, beforeEach } from 'vitest';
import { nextTick, defineComponent, h } from 'vue';
import { LocaleProvider } from '../locale-provider';
import { en } from '../locales/en';
import { zhCN } from '../locales/zh-CN';
import { useI18n, setMessages, setLocale } from '../use-i18n';
import type { computed } from 'vue';

// MessageSchema alias for test consumers — matches the shape of zhCN/en
type MessageSchema = typeof zhCN;

// Test consumer component that uses useI18n (template syntax for auto-unwrapping)
const TestConsumer = defineComponent({
  setup() {
    const { t, locale } = useI18n<MessageSchema>();
    return { t, locale };
  },
  template: `
    <div>
      <span data-testid="copy-text">{{ t('shared.copy') }}</span>
      <span data-testid="locale">{{ locale }}</span>
    </div>
  `,
});

// Consumer that uses template interpolation with params
const InterpConsumer = defineComponent({
  props: { count: { type: Number, default: 5 } },
  setup() {
    const { t } = useI18n<MessageSchema>();
    return { t };
  },
  template: '<span data-testid="show-all">{{ t(\'shared.showAll\', { count }) }}</span>',
});

// Consumer for testing missing key fallback (uses render fn for TS cast)
const MissingKeyConsumer = defineComponent({
  setup() {
    const { t } = useI18n<MessageSchema>();
    return { t };
  },
  render() {
    return h('span', { 'data-testid': 'missing' }, (this.t('nonExistent.key' as never) as ReturnType<typeof computed>).value);
  },
});

// Consumer for testing without LocaleProvider
const NoProviderConsumer = defineComponent({
  setup() {
    const { t } = useI18n<MessageSchema>();
    return { t };
  },
  template: '<span data-testid="fallback">{{ t(\'shared.copy\') }}</span>',
});

// Consumer for testing nested LocaleProvider
const NestedConsumer = defineComponent({
  setup() {
    const { t } = useI18n<MessageSchema>();
    return { t };
  },
  template: '<span data-testid="nested">{{ t(\'shared.copy\') }}</span>',
});

describe('LocaleProvider', () => {
  beforeEach(() => {
    // Reset module-level state before each test
    setMessages({} as Record<string, unknown>);
    setLocale('zh-CN');
  });

  describe('provide/inject', () => {
    test('renders default slot content', () => {
      const wrapper = mount(LocaleProvider, {
        props: { messages: zhCN },
        slots: { default: () => h('span', 'Hello') },
      });
      expect(wrapper.text()).toContain('Hello');
    });

    test('child component receives t() function via useI18n', () => {
      const wrapper = mount(LocaleProvider, {
        props: { messages: zhCN, locale: 'zh-CN' },
        slots: { default: () => h(TestConsumer) },
      });
      expect(wrapper.find('[data-testid="copy-text"]').text()).toBe('复制');
    });

    test('t() returns zh-CN messages when locale is zh-CN', () => {
      const wrapper = mount(LocaleProvider, {
        props: { messages: zhCN, locale: 'zh-CN' },
        slots: { default: () => h(TestConsumer) },
      });
      expect(wrapper.find('[data-testid="copy-text"]').text()).toBe('复制');
      expect(wrapper.find('[data-testid="locale"]').text()).toBe('zh-CN');
    });
  });

  describe('locale switching', () => {
    test('changing locale prop updates all t() values', async () => {
      const wrapper = mount(LocaleProvider, {
        props: { messages: zhCN, locale: 'zh-CN' },
        slots: { default: () => h(TestConsumer) },
      });
      expect(wrapper.find('[data-testid="copy-text"]').text()).toBe('复制');

      // Switch to English
      await wrapper.setProps({ messages: en, locale: 'en' });
      await nextTick();
      expect(wrapper.find('[data-testid="copy-text"]').text()).toBe('Copy');
    });

    test('t() computed auto-updates when locale changes (Vue reactivity)', async () => {
      const wrapper = mount(LocaleProvider, {
        props: { messages: zhCN, locale: 'zh-CN' },
        slots: { default: () => h(TestConsumer) },
      });

      // Verify initial Chinese
      expect(wrapper.find('[data-testid="copy-text"]').text()).toBe('复制');

      // Switch to English and verify reactivity
      await wrapper.setProps({ messages: en, locale: 'en' });
      await nextTick();
      await nextTick(); // Extra tick for computed to propagate
      expect(wrapper.find('[data-testid="copy-text"]').text()).toBe('Copy');

      // Switch back to Chinese
      await wrapper.setProps({ messages: zhCN, locale: 'zh-CN' });
      await nextTick();
      await nextTick();
      expect(wrapper.find('[data-testid="copy-text"]').text()).toBe('复制');
    });

    test('parameter interpolation updates on locale switch', async () => {
      const wrapper = mount(LocaleProvider, {
        props: { messages: zhCN, locale: 'zh-CN' },
        slots: { default: () => h(InterpConsumer, { count: 5 }) },
      });
      expect(wrapper.find('[data-testid="show-all"]').text()).toContain('显示全部');

      await wrapper.setProps({ messages: en, locale: 'en' });
      await nextTick();
      expect(wrapper.find('[data-testid="show-all"]').text()).toContain('Show all');
    });
  });

  describe('fallback behavior', () => {
    test('missing key returns the key string itself', () => {
      const wrapper = mount(LocaleProvider, {
        props: { messages: zhCN, locale: 'zh-CN' },
        slots: { default: () => h(MissingKeyConsumer) },
      });

      expect(wrapper.find('[data-testid="missing"]').text()).toBe('nonExistent.key');
    });

    test('useI18n without LocaleProvider falls back to zh-CN built-in messages', () => {
      setMessages(null as unknown as Record<string, unknown>);
      const wrapper = mount(NoProviderConsumer);
      // Task 1 fix: fallback returns zh-CN translations, not raw keys
      expect(wrapper.find('[data-testid="fallback"]').text()).toBe('复制');
    });

    test('useI18n without LocaleProvider returns key for nonexistent keys', () => {
      setMessages(null as unknown as Record<string, unknown>);
      const Consumer = defineComponent({
        setup() {
          const { t } = useI18n<MessageSchema>();
          return { t };
        },
        template: '<span data-testid="deep-fallback">{{ t(\'completely.made.up.key\') }}</span>',
      });
      const wrapper = mount(Consumer);
      expect(wrapper.find('[data-testid="deep-fallback"]').text()).toBe('completely.made.up.key');
    });

    test('nested LocaleProvider inner overrides outer', () => {
      const wrapper = mount(LocaleProvider, {
        props: { messages: zhCN, locale: 'zh-CN' },
        slots: {
          default: () => h(LocaleProvider, {
            messages: en,
            locale: 'en',
          }, {
            default: () => h(NestedConsumer),
          }),
        },
      });

      expect(wrapper.find('[data-testid="nested"]').text()).toBe('Copy');
    });
  });

  describe('COMPAT-02: copy-paste consumer compatibility', () => {
    test('component importing core i18n renders zh-CN without LocaleProvider (copy-paste scenario)', () => {
      // Simulates a consumer who copies a .vue component file into their project
      // and imports useI18n from core, but does NOT set up LocaleProvider.
      // The component should still render readable zh-CN text (not raw keys).
      setMessages(null as unknown as Record<string, unknown>);

      // Simulates a copied component that uses useI18n
      const CopiedComponent = defineComponent({
        setup() {
          const { t } = useI18n<MessageSchema>();
          return { t };
        },
        template: `
          <div>
            <span data-testid="btn-copy">{{ t('shared.copy') }}</span>
            <span data-testid="btn-cancel">{{ t('shared.cancel') }}</span>
          </div>
        `,
      });

      const wrapper = mount(CopiedComponent);
      // Must render actual Chinese text, not 'shared.copy' / 'shared.cancel'
      expect(wrapper.find('[data-testid="btn-copy"]').text()).toBe('复制');
      expect(wrapper.find('[data-testid="btn-cancel"]').text()).toBe('取消');
    });

    test('copy-paste consumer with params interpolation works without LocaleProvider', () => {
      setMessages(null as unknown as Record<string, unknown>);

      const ConsumerWithParams = defineComponent({
        setup() {
          const { t } = useI18n<MessageSchema>();
          return { t };
        },
        template: '<span data-testid="page">{{ t(\'dataTable.page\', { current: 2, total: 5 }) }}</span>',
      });

      const wrapper = mount(ConsumerWithParams);
      expect(wrapper.find('[data-testid="page"]').text()).toBe('第 2 / 5 页');
    });
  });
});
