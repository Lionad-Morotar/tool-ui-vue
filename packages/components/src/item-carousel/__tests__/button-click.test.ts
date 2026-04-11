import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { nextTick } from 'vue';
import ItemCarousel from '../index.vue';

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
    await new Promise(r => setTimeout(r, 200));

    const scrollContainer = wrapper.find("[role='list']");
    console.log('scrollContainer scrollWidth:', scrollContainer.element.scrollWidth);
    console.log('scrollContainer clientWidth:', scrollContainer.element.clientWidth);
    console.log('scrollContainer scrollLeft:', scrollContainer.element.scrollLeft);

    // Try manual scroll to verify element works
    scrollContainer.element.scrollLeft = 100;
    console.log('scrollLeft after manual set:', scrollContainer.element.scrollLeft);

    // Reset
    scrollContainer.element.scrollLeft = 0;
    await nextTick();

    // Call scroll method directly
    await (wrapper.vm as any).scroll('right');
    console.log('scrollLeft after scroll("right"):', scrollContainer.element.scrollLeft);

    expect(scrollContainer.element.scrollLeft).toBeGreaterThan(0);
  });
});
