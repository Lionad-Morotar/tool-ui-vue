import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import GalleryGrid from '../cmpts/gallery-grid.vue';
import GalleryLightbox from '../cmpts/gallery-lightbox.vue';
import ImageGallery from '../index.vue';
import { useImageGallery } from '../states';

const IMAGES = [
  { id: '1', src: 'https://example.com/a.jpg', alt: 'Image A', width: 400, height: 400 },
  { id: '2', src: 'https://example.com/b.jpg', alt: 'Image B', width: 300, height: 600 },
  { id: '3', src: 'https://example.com/c.jpg', alt: 'Image C', width: 500, height: 300 },
];

// Helper to create wrapper with proper setup
function createWrapper(props = {}) {
  return mount(ImageGallery, {
    props: { id: 'ig-1', images: IMAGES, ...props },
    attachTo: document.body,
  });
}

describe('ImageGallery', () => {
  describe('rendering', () => {
    test('renders all images', () => {
      const wrapper = createWrapper();
      const imgs = wrapper.findAll('img');
      expect(imgs.length).toBe(3);
    });

    test('renders image alt text', () => {
      const wrapper = createWrapper();
      const imgs = wrapper.findAll('img');
      expect(imgs[0]?.attributes('alt')).toBe('Image A');
      expect(imgs[1]?.attributes('alt')).toBe('Image B');
    });

    test('renders title and description', () => {
      const wrapper = createWrapper({
        title: 'Gallery',
        description: 'Best shots',
      });
      expect(wrapper.text()).toContain('Gallery');
      expect(wrapper.text()).toContain('Best shots');
    });

    test('does not render header when no title or description', () => {
      const wrapper = createWrapper();
      const header = wrapper
        .findAll('div')
        .find((div) => div.find('h3').exists() && div.classes().includes('border-b'));
      expect(header).toBeFalsy();
    });

    test('applies portrait class to portrait images', () => {
      const wrapper = createWrapper();
      const listItems = wrapper.findAll("[role='listitem']");
      // Image B is portrait (300x600)
      expect(listItems[1]?.classes()).toContain('row-span-2');
    });

    test('does not apply portrait class to square images', () => {
      const wrapper = createWrapper();
      const listItems = wrapper.findAll("[role='listitem']");
      // Image A is square-ish (400x400)
      expect(listItems[0]?.classes()).not.toContain('row-span-2');
    });
  });

  describe('interactions', () => {
    test('emits imageClick on image click', async () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAll("button[type='button']");
      const imageButton = buttons.find((b) => b.attributes('aria-label') === 'Image A');
      await imageButton?.trigger('click');
      expect(wrapper.emitted('imageClick')?.[0]).toEqual(['1', IMAGES[0]]);
    });
  });

  describe('accessibility', () => {
    test('images have alt attributes', () => {
      const wrapper = createWrapper();
      const imgs = wrapper.findAll('img');
      expect(imgs[0]?.attributes('alt')).toBe('Image A');
      expect(imgs[1]?.attributes('alt')).toBe('Image B');
    });

    test('has list and listitem roles', () => {
      const wrapper = createWrapper();
      expect(wrapper.find("[role='list']").exists()).toBe(true);
      expect(wrapper.findAll("[role='listitem']").length).toBe(3);
    });

    test('image buttons have aria-label', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAll('button[aria-label]');
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('context', () => {
    test('useImageGallery throws when used outside provider', () => {
      // Create a component that uses the context
      const TestComponent = {
        setup() {
          useImageGallery();
          return {};
        },
        template: '<div></div>',
      };

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        mount(TestComponent);
      }).toThrow('useImageGallery must be used within ImageGalleryProvider');
      consoleSpy.mockRestore();
    });
  });
});

describe('GalleryGrid', () => {
  test('renders grid with correct number of items', () => {
    const wrapper = mount(ImageGallery, {
      props: { id: 'ig-1', images: IMAGES },
      attachTo: document.body,
    });

    const grid = wrapper.findComponent(GalleryGrid);
    expect(grid.exists()).toBe(true);

    const listItems = wrapper.findAll("[role='listitem']");
    expect(listItems.length).toBe(3);

    wrapper.unmount();
  });
});

describe('GalleryLightbox', () => {
  test('renders lightbox component', () => {
    const wrapper = mount(ImageGallery, {
      props: { id: 'ig-1', images: IMAGES },
      attachTo: document.body,
    });

    const lightbox = wrapper.findComponent(GalleryLightbox);
    expect(lightbox.exists()).toBe(true);

    wrapper.unmount();
  });
});
