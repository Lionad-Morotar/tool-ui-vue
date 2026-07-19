import { mount } from '@vue/test-utils';
import { describe, expect, test, beforeEach } from 'vitest';
import { nextTick, defineComponent } from 'vue';
import {
  useStoryLocale,
  toggleLocale,
  currentLocale,
  getPath,
  type StoryLocaleMessages,
} from './use-story-locale';

describe('useStoryLocale', () => {
  beforeEach(() => {
    currentLocale.value = 'zh-CN';
  });

  describe('bilingual labels', () => {
    test('returns zh text when locale is zh-CN', () => {
      const label = useStoryLocale({ zh: '数据展示', en: 'Data Display' });
      expect(label.value).toBe('数据展示');
    });

    test('returns en text when locale is en', async () => {
      const label = useStoryLocale({ zh: '数据展示', en: 'Data Display' });
      toggleLocale();
      await nextTick();
      expect(label.value).toBe('Data Display');
    });
  });

  describe('key-based messages', () => {
    const messages = {
      zh: { hero: { tagline: '为 AI 设计的 Vue 组件' } },
      en: { hero: { tagline: 'Vue components for AI' } },
    };

    test('resolves nested key path for zh-CN', () => {
      const text = useStoryLocale('hero.tagline', messages);
      expect(text.value).toBe('为 AI 设计的 Vue 组件');
    });

    test('resolves nested key path for en after toggle', async () => {
      const text = useStoryLocale('hero.tagline', messages);
      toggleLocale();
      await nextTick();
      expect(text.value).toBe('Vue components for AI');
    });

    test('returns key itself when message is missing', () => {
      const text = useStoryLocale('missing.key', messages);
      expect(text.value).toBe('missing.key');
    });
  });

  describe('getPath', () => {
    const obj: StoryLocaleMessages = {
      a: {
        b: {
          c: 'deep value',
        },
      },
    };

    test('retrieves deeply nested value', () => {
      expect(getPath(obj, 'a.b.c')).toBe('deep value');
    });

    test('returns path for missing keys', () => {
      expect(getPath(obj, 'a.b.missing')).toBe('a.b.missing');
    });

    test('returns path for undefined object', () => {
      expect(getPath(undefined, 'a.b')).toBe('a.b');
    });
  });

  describe('reactivity in templates', () => {
    const TestComponent = defineComponent({
      props: {
        source: { type: Object, required: true },
      },
      setup(props) {
        const text = useStoryLocale(props.source as { zh: string; en: string });
        return { text };
      },
      template: '<span data-testid="text">{{ text }}</span>',
    });

    test('template updates when locale toggles', async () => {
      const wrapper = mount(TestComponent, {
        props: { source: { zh: '中文', en: 'English' } },
      });
      expect(wrapper.find('[data-testid="text"]').text()).toBe('中文');

      toggleLocale();
      await nextTick();
      expect(wrapper.find('[data-testid="text"]').text()).toBe('English');
    });
  });
});
