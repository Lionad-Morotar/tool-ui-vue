import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Image from './index.vue';

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

    test('renders with custom className', () => {
      const wrapper = mount(Image, {
        props: createProps({ className: 'my-image' }),
      });
      expect(wrapper.find("[data-slot='image']").classes()).toContain('my-image');
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
});
