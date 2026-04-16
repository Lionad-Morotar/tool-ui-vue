import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import { nextTick } from 'vue';
import ItemCarousel from '../index.vue';

vi.mock('../../core', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    prefersReducedMotion: () => true,
  };
});

const ITEMS = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  name: `Product ${i + 1}`,
  subtitle: `Description ${i + 1}`,
  image: `https://example.com/${i + 1}.jpg`,
}));

describe('ItemCarousel - Button click scroll', () => {
  test('right button scrolls right when clicked', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-test', items: ITEMS },
      attachTo: document.body,
    });

    await nextTick();
    await nextTick();

    const scrollContainer = wrapper.find("[role='list']");
    const listItems = scrollContainer.element.querySelectorAll('[data-carousel-item]');

    // Stub layout metrics so scroll target can be computed in jsdom
    Object.defineProperty(scrollContainer.element, 'clientWidth', { value: 300, writable: true });
    Object.defineProperty(scrollContainer.element, 'scrollWidth', { value: 1200, writable: true });
    Object.defineProperty(scrollContainer.element, 'scrollLeft', { value: 0, writable: true });
    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({ scrollPaddingLeft: '0px' }),
      writable: true,
    });

    listItems.forEach((el, i) => {
      Object.defineProperty(el, 'offsetLeft', { value: i * 150, writable: true });
      Object.defineProperty(el, 'offsetWidth', { value: 150, writable: true });
    });

    // Reset scrollLeft
    scrollContainer.element.scrollLeft = 0;
    await nextTick();

    await (wrapper.vm as any).scroll('right');

    expect(scrollContainer.element.scrollLeft).toBeGreaterThan(0);
  });
});
