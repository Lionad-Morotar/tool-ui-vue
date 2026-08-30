import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';

// Shared locale state
const currentLocale = ref('en');
const messagesByLocale: Record<string, Record<string, string>> = {
  en: { 'image.alt': 'Image description', 'image.loading': 'Loading image...', 'image.error': 'Failed to load image', 'image.retry': 'Reload' },
  'zh-CN': { 'image.alt': '图片描述', 'image.loading': '图片加载中...', 'image.error': '图片加载失败', 'image.retry': '重新加载' },
};

vi.mock('../../core/i18n', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => computed(() => {
        const msgs = messagesByLocale[currentLocale.value] ?? {};
        return msgs[key] ?? key;
      }),
      locale: computed(() => currentLocale.value),
      setLocale: (locale: string) => { currentLocale.value = locale; },
    }),
  };
});

import Image from '../index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-image',
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
    assetId: 'asset-1',
    ...overrides,
  };
}

describe('Image', () => {
  describe('rendering', () => {
    test('renders img element with src and alt', () => {
      const wrapper = mount(Image, {
        props: createProps(),
      });
      const img = wrapper.find('img');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://example.com/image.jpg');
      expect(img.attributes('alt')).toBe('Test image');
    });

    test('applies aspect ratio classes', () => {
      const wrapper = mount(Image, {
        props: createProps({ ratio: '16:9' }),
      });
      expect(wrapper.find("[data-slot='image']").exists()).toBe(true);
      expect(wrapper.html()).toContain('aspect-video');
    });

    test('applies object-fit class', () => {
      const wrapper = mount(Image, {
        props: createProps(),
      });
      const img = wrapper.find('img');
      expect(img.classes()).toContain('object-cover');
    });

    test('renders with custom css.root', () => {
      const wrapper = mount(Image, {
        props: createProps({ css: { root: 'my-image' } }),
      });
      expect(wrapper.find("[data-slot='image']").classes()).toContain('my-image');
    });
  });

  describe('src sanitization', () => {
    // 宿主侧常以根相对路径喂图(如 BFF 代理通道 /api/...),不应被当作非法 URL 丢弃
    test('keeps root-relative src', () => {
      const wrapper = mount(Image, {
        props: createProps({ src: '/api/workspace/conv-1/files/a.png?raw=1' }),
      });
      expect(wrapper.find('img').attributes('src')).toBe(
        '/api/workspace/conv-1/files/a.png?raw=1',
      );
    });

    test('drops protocol-relative src', () => {
      const wrapper = mount(Image, {
        props: createProps({ src: '//evil.com/x.png' }),
      });
      expect(wrapper.find('img').attributes('src')).toBeUndefined();
    });

    test('drops javascript: src', () => {
      const wrapper = mount(Image, {
        props: createProps({ src: 'javascript:alert(1)' }),
      });
      expect(wrapper.find('img').attributes('src')).toBeUndefined();
    });
  });

  describe('attributes', () => {
    test('sets data-slot attribute', () => {
      const wrapper = mount(Image, {
        props: createProps(),
      });
      expect(wrapper.find("[data-slot='image']").exists()).toBe(true);
    });

    test('sets data-tool-ui-id attribute', () => {
      const wrapper = mount(Image, {
        props: createProps(),
      });
      expect(wrapper.find("[data-slot='image']").attributes('data-tool-ui-id')).toBe('test-image');
    });
  });

  describe('i18n', () => {
    beforeEach(() => { currentLocale.value = 'en'; });

    test('uses zh-CN alt text when locale is zh-CN', () => {
      currentLocale.value = 'zh-CN';
      const { alt: _, ...propsWithoutAlt } = createProps();
      const wrapper = mount(Image, {
        props: propsWithoutAlt,
      });
      const img = wrapper.find('img');
      expect(img.attributes('alt')).toBe('图片描述');
    });

    test('uses English alt text when locale is en', () => {
      currentLocale.value = 'en';
      const { alt: _, ...propsWithoutAlt } = createProps();
      const wrapper = mount(Image, {
        props: propsWithoutAlt,
      });
      const img = wrapper.find('img');
      expect(img.attributes('alt')).toBe('Image description');
    });
  });
});
