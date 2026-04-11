import { mount } from '@vue/test-utils';
import { describe, expect, test, beforeEach } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { useI18n, setMessages, setLocale } from '../use-i18n';
import { zhCN } from '../locales/zh-CN';
import { en } from '../locales/en';

type MessageSchema = typeof zhCN;

// Generic T consumer using template (Vue 3 auto-unwraps ComputedRef in templates)
function createTConsumer() {
  return defineComponent({
    props: {
      i18nKey: { type: String, required: true },
      params: { type: Object, default: undefined },
    },
    setup() {
      const { t } = useI18n<MessageSchema>();
      return { t };
    },
    template: `<span data-testid="result">{{ t(i18nKey, params) }}</span>`,
  });
}

const LocaleConsumer = defineComponent({
  setup() {
    const { locale } = useI18n<MessageSchema>();
    return { locale };
  },
  template: `<span data-testid="locale">{{ locale }}</span>`,
});

describe('useI18n()', () => {
  beforeEach(() => {
    setMessages({} as Record<string, unknown>);
    setLocale('zh-CN');
  });

  describe('t() function', () => {
    test('resolves simple key path', () => {
      setMessages(zhCN);
      const TConsumer = createTConsumer();
      const wrapper = mount(TConsumer, { props: { i18nKey: 'shared.copy' } });
      expect(wrapper.find('[data-testid="result"]').text()).toBe('复制');
    });

    test('resolves nested key path', () => {
      setMessages(zhCN);
      const TConsumer = createTConsumer();
      const wrapper = mount(TConsumer, { props: { i18nKey: 'terminal.copyOutput' } });
      expect(wrapper.find('[data-testid="result"]').text()).toBe('复制输出');
    });

    test('resolves deeply nested key path', () => {
      setMessages(zhCN);
      const TConsumer = createTConsumer();
      const wrapper = mount(TConsumer, { props: { i18nKey: 'weatherWidget.spokenUnitCelsius' } });
      expect(wrapper.find('[data-testid="result"]').text()).toBe('摄氏度');
    });

    test('interpolates {param} placeholders', () => {
      setMessages(zhCN);
      const TConsumer = createTConsumer();
      const wrapper = mount(TConsumer, {
        props: { i18nKey: 'dataTable.page', params: { current: 1, total: 3 } },
      });
      expect(wrapper.find('[data-testid="result"]').text()).toBe('第 1 / 3 页');
    });

    test('interpolates with English messages', () => {
      setMessages(en);
      const TConsumer = createTConsumer();
      const wrapper = mount(TConsumer, {
        props: { i18nKey: 'shared.showAll', params: { count: 10 } },
      });
      expect(wrapper.find('[data-testid="result"]').text()).toBe('Show all 10 items');
    });

    test('returns key string for missing keys', () => {
      setMessages(zhCN);
      const TConsumer = createTConsumer();
      const wrapper = mount(TConsumer, { props: { i18nKey: 'does.not.exist' } });
      expect(wrapper.find('[data-testid="result"]').text()).toBe('does.not.exist');
    });

    test('returns ComputedRef that updates when messages change', async () => {
      setMessages(zhCN);
      const TConsumer = createTConsumer();
      const wrapper = mount(TConsumer, { props: { i18nKey: 'shared.copy' } });
      expect(wrapper.find('[data-testid="result"]').text()).toBe('复制');

      setMessages(en);
      await nextTick();
      await nextTick();
      expect(wrapper.find('[data-testid="result"]').text()).toBe('Copy');
    });

    test('handles params with null/undefined gracefully', () => {
      setMessages(zhCN);
      const TConsumer = createTConsumer();
      const wrapper = mount(TConsumer, { props: { i18nKey: 'shared.copy' } });
      expect(wrapper.find('[data-testid="result"]').text()).toBe('复制');
    });
  });

  describe('locale', () => {
    test('setLocale updates locale value', () => {
      setMessages(zhCN);
      setLocale('en');
      const wrapper = mount(LocaleConsumer);
      expect(wrapper.find('[data-testid="locale"]').text()).toBe('en');
    });

    test('default locale is zh-CN', () => {
      setMessages(zhCN);
      const wrapper = mount(LocaleConsumer);
      expect(wrapper.find('[data-testid="locale"]').text()).toBe('zh-CN');
    });
  });

  describe('fallback mode (no provider, no global messages)', () => {
    test('t() falls back to zh-CN built-in messages', () => {
      setMessages(null as unknown as Record<string, unknown>);
      const TConsumer = createTConsumer();
      const wrapper = mount(TConsumer, { props: { i18nKey: 'shared.copy' } });
      expect(wrapper.find('[data-testid="result"]').text()).toBe('复制');
    });

    test('t() returns key itself when key not in zh-CN messages', () => {
      setMessages(null as unknown as Record<string, unknown>);
      const TConsumer = createTConsumer();
      const wrapper = mount(TConsumer, { props: { i18nKey: 'nonexistent.key' } });
      expect(wrapper.find('[data-testid="result"]').text()).toBe('nonexistent.key');
    });
  });
});
