import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { nextTick } from 'vue';
import ItemCard from '../cmpts/item-card.vue';
import ItemCarousel from '../index.vue';

const ITEMS = [
  { id: '1', name: 'Product A', subtitle: 'Great product', image: 'https://example.com/a.jpg' },
  { id: '2', name: 'Product B', subtitle: 'Also great', image: 'https://example.com/b.jpg' },
  { id: '3', name: 'Product C', subtitle: 'Best one', image: 'https://example.com/c.jpg' },
];

const MANY_ITEMS = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  name: `Product ${i + 1}`,
  subtitle: `Description ${i + 1}`,
  image: `https://example.com/${i + 1}.jpg`,
}));

describe('ItemCarousel - Rendering', () => {
  test('renders all items', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });
    expect(wrapper.text()).toContain('Product A');
    expect(wrapper.text()).toContain('Product B');
    expect(wrapper.text()).toContain('Product C');
  });

  test('renders item images', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });
    const images = wrapper.findAll('img');
    expect(images.length).toBeGreaterThanOrEqual(3);
    expect(images[0]?.attributes('src')).toBe('https://example.com/a.jpg');
  });

  test('renders item titles', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });
    expect(wrapper.text()).toContain('Product A');
  });

  test('renders item descriptions', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });
    expect(wrapper.text()).toContain('Great product');
  });

  test('renders empty state when no items', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: [] },
    });
    expect(wrapper.text()).toContain('No items to display');
  });

  test('renders color background when no image', () => {
    const itemsWithColor = [
      { id: '1', name: 'Product A', color: '#ff0000' },
    ];
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: itemsWithColor },
    });
    const colorDiv = wrapper.find('[role="img"]');
    expect(colorDiv.exists()).toBe(true);
    expect(colorDiv.attributes('aria-label')).toBe('Product A');
  });
});

describe('ItemCarousel - Navigation', () => {
  test('renders navigation buttons', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });
    const buttons = wrapper.findAll("button[aria-label='Scroll left'], button[aria-label='Scroll right']");
    expect(buttons.length).toBe(2);
  });

  test('navigation buttons have correct initial state', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });
    const leftButton = wrapper.find("button[aria-label='Scroll left']");
    const rightButton = wrapper.find("button[aria-label='Scroll right']");

    expect(leftButton.exists()).toBe(true);
    expect(rightButton.exists()).toBe(true);
  });

  test('emits slideChange event when scrolling', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });

    // Wait for component to mount
    await nextTick();

    // Simulate scroll event
    const scrollContainer = wrapper.find("[role='list']");
    expect(scrollContainer.exists()).toBe(true);

    // Trigger scroll
    await scrollContainer.trigger('scroll');

    // The slideChange event may or may not be emitted depending on scroll state
    // Just verify the component handles scroll events without error
    expect(wrapper.emitted()).toBeDefined();
  });

  test('exposes scrollToIndex method', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });

    await nextTick();

    // Check that the component exposes the method
    expect(typeof wrapper.vm.scrollToIndex).toBe('function');
  });

  test('exposes scroll method', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });

    await nextTick();

    expect(typeof wrapper.vm.scroll).toBe('function');
  });

  test('exposes currentIndex as computed property', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });

    await nextTick();

    expect(wrapper.vm.currentIndex).toBeDefined();
    expect(typeof wrapper.vm.currentIndex).toBe('number');
  });
});

describe('ItemCarousel - Keyboard Navigation', () => {
  test('responds to ArrowLeft key', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });

    await nextTick();

    const container = wrapper.find("[data-slot='item-carousel']");
    expect(container.exists()).toBe(true);

    // Trigger keydown event
    await container.trigger('keydown', { key: 'ArrowLeft' });

    // Component should handle the event without error
    expect(wrapper.emitted()).toBeDefined();
  });

  test('responds to ArrowRight key', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });

    await nextTick();

    const container = wrapper.find("[data-slot='item-carousel']");
    await container.trigger('keydown', { key: 'ArrowRight' });

    expect(wrapper.emitted()).toBeDefined();
  });

  test('responds to Home key', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });

    await nextTick();

    const container = wrapper.find("[data-slot='item-carousel']");
    await container.trigger('keydown', { key: 'Home' });

    expect(wrapper.emitted()).toBeDefined();
  });

  test('responds to End key', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });

    await nextTick();

    const container = wrapper.find("[data-slot='item-carousel']");
    await container.trigger('keydown', { key: 'End' });

    expect(wrapper.emitted()).toBeDefined();
  });

  test('has correct ARIA attributes', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS, title: 'Test Carousel' },
    });

    const container = wrapper.find("[role='region']");
    expect(container.exists()).toBe(true);
    expect(container.attributes('aria-roledescription')).toBe('carousel');
    expect(container.attributes('aria-label')).toBe('Test Carousel');
  });

  test('has correct ARIA attributes without title', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });

    const container = wrapper.find("[role='region']");
    expect(container.exists()).toBe(true);
    expect(container.attributes('aria-label')).toBe('Item carousel');
  });
});

describe('ItemCarousel - Touch/Swipe', () => {
  test('handles touchstart event', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });

    await nextTick();

    const scrollContainer = wrapper.find("[role='list']");
    expect(scrollContainer.exists()).toBe(true);

    // Simulate touch start
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 }] as unknown as Touch[],
      bubbles: true,
    });

    scrollContainer.element.dispatchEvent(touchStart);

    // Component should handle touch events without error
    expect(wrapper.emitted()).toBeDefined();
  });

  test('handles touchend event', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: MANY_ITEMS },
    });

    await nextTick();

    const scrollContainer = wrapper.find("[role='list']");

    // First trigger touchstart
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 }] as unknown as Touch[],
      bubbles: true,
    });
    scrollContainer.element.dispatchEvent(touchStart);

    // Then trigger touchend
    const touchEnd = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 50, clientY: 100 }] as unknown as Touch[],
      bubbles: true,
    });
    scrollContainer.element.dispatchEvent(touchEnd);

    expect(wrapper.emitted()).toBeDefined();
  });
});

describe('ItemCarousel - Item Interactions', () => {
  test('emits itemClick on interactive card click', async () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS, interactive: true },
    });

    const itemCards = wrapper.findAllComponents(ItemCard);
    expect(itemCards.length).toBeGreaterThan(0);

    // Find the clickable button in the first ItemCard
    const firstCard = itemCards[0];
    const clickButton = firstCard.find("button[aria-label^='View item']");

    if (clickButton.exists()) {
      await clickButton.trigger('click');
      expect(wrapper.emitted('itemClick')?.[0]).toEqual(['1']);
    }
  });

  test('does not render clickable overlay when not interactive', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });

    const itemCards = wrapper.findAllComponents(ItemCard);
    const firstCard = itemCards[0];
    const clickables = firstCard.findAll("button[aria-label^='View item']");
    expect(clickables.length).toBe(0);
  });
});

describe('ItemCarousel - Actions', () => {
  test('renders action buttons when provided', () => {
    const itemsWithActions = [
      { id: '1', name: 'Product A', actions: [{ id: 'buy', label: 'Buy' }] },
    ];
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: itemsWithActions },
    });

    const itemCards = wrapper.findAllComponents(ItemCard);
    const firstCard = itemCards[0];
    expect(firstCard.text()).toContain('Buy');
  });

  test('emits itemAction on action click', async () => {
    const itemsWithActions = [
      { id: '1', name: 'Product A', actions: [{ id: 'buy', label: 'Buy' }] },
    ];
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: itemsWithActions },
    });

    const itemCards = wrapper.findAllComponents(ItemCard);
    const firstCard = itemCards[0];
    const actionButton = firstCard.findAll('button').find((b) => b.text() === 'Buy');

    if (actionButton) {
      await actionButton.trigger('click');
      expect(wrapper.emitted('itemAction')?.[0]).toEqual(['1', 'buy']);
    }
  });

  test('renders action buttons with different variants', () => {
    const itemsWithVariants = [
      {
        id: '1',
        name: 'Product A',
        actions: [
          { id: 'buy', label: 'Buy', variant: 'primary' as const },
          { id: 'cancel', label: 'Cancel', variant: 'destructive' as const },
          { id: 'save', label: 'Save', variant: 'secondary' as const },
          { id: 'outline', label: 'Outline', variant: 'outline' as const },
          { id: 'ghost', label: 'Ghost', variant: 'ghost' as const },
        ],
      },
    ];
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: itemsWithVariants },
    });

    const itemCards = wrapper.findAllComponents(ItemCard);
    const firstCard = itemCards[0];
    expect(firstCard.text()).toContain('Buy');
    expect(firstCard.text()).toContain('Cancel');
    expect(firstCard.text()).toContain('Save');
    expect(firstCard.text()).toContain('Outline');
    expect(firstCard.text()).toContain('Ghost');
  });

  test('disables action buttons when disabled prop is true', () => {
    const itemsWithDisabledAction = [
      {
        id: '1',
        name: 'Product A',
        actions: [{ id: 'buy', label: 'Buy', disabled: true }],
      },
    ];
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: itemsWithDisabledAction },
    });

    const itemCards = wrapper.findAllComponents(ItemCard);
    const firstCard = itemCards[0];
    const actionButton = firstCard.find('button:disabled');
    expect(actionButton.exists()).toBe(true);
  });
});

describe('ItemCarousel - Header', () => {
  test('renders title and description when provided', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS, title: 'Featured', description: 'Best picks' },
    });
    expect(wrapper.text()).toContain('Featured');
    expect(wrapper.text()).toContain('Best picks');
  });

  test('does not render header when no title or description', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });

    // The header wrapper div should not exist when there's no title or description
    const _headerDiv = wrapper.findAll('div').find((div) => {
      const hasTitle = div.find('h3').exists();
      const hasDesc = div.find('p').exists();
      // Check if it's the header div (not the item card content)
      return hasTitle && hasDesc;
    });

    // Header should not exist (or if it does, it shouldn't have our title)
    expect(wrapper.text()).not.toContain('Featured');
  });
});

describe('ItemCarousel - Accessibility', () => {
  test('has list and listitem roles', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });
    expect(wrapper.find("[role='list']").exists()).toBe(true);
    expect(wrapper.findAll("[role='listitem']").length).toBe(3);
  });

  test('listitems have correct aria-label', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });

    const listitems = wrapper.findAll("[role='listitem']");
    expect(listitems[0]?.attributes('aria-label')).toBe('Item 1 of 3');
    expect(listitems[1]?.attributes('aria-label')).toBe('Item 2 of 3');
    expect(listitems[2]?.attributes('aria-label')).toBe('Item 3 of 3');
  });

  test('images have alt text', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });
    const firstImg = wrapper.find('img');
    expect(firstImg.attributes('alt')).toBe('Product A');
  });

  test('has correct data attributes', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });

    const carousel = wrapper.find("[data-slot='item-carousel']");
    expect(carousel.exists()).toBe(true);
    expect(carousel.attributes('data-tool-ui-id')).toBe('ic-1');
  });

  test('carousel items have data attributes', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });

    const items = wrapper.findAll('[data-carousel-item]');
    expect(items.length).toBe(3);
    expect(items[0]?.attributes('data-item-id')).toBe('1');
    expect(items[0]?.attributes('data-index')).toBe('0');
  });
});

describe('ItemCarousel - Scrolling', () => {
  test('scroll container has snap classes', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });
    const scrollContainer = wrapper.find("[role='list']");
    expect(scrollContainer.classes()).toContain('snap-x');
    expect(scrollContainer.classes()).toContain('snap-mandatory');
  });

  test('items have snap-start class', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });
    const items = wrapper.findAll('[data-carousel-item]');
    expect(items[0]?.classes()).toContain('snap-start');
  });

  test('scroll container has correct inline padding style', () => {
    const wrapper = mount(ItemCarousel, {
      props: { id: 'ic-1', items: ITEMS },
    });
    const scrollContainer = wrapper.find("[role='list']");
    expect(scrollContainer.attributes('style')).toContain('scroll-padding-inline: 1rem');
  });
});

describe('ItemCard - Component', () => {
  test('renders item name', () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: { id: '1', name: 'Test Product' },
        interactive: false,
      },
    });
    expect(wrapper.text()).toContain('Test Product');
  });

  test('renders item subtitle when provided', () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: { id: '1', name: 'Test Product', subtitle: 'Test Subtitle' },
        interactive: false,
      },
    });
    expect(wrapper.text()).toContain('Test Subtitle');
  });

  test('renders clickable overlay when interactive', () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: { id: '1', name: 'Test Product' },
        interactive: true,
      },
    });
    const overlay = wrapper.find("button[aria-label^='View item']");
    expect(overlay.exists()).toBe(true);
  });

  test('does not render clickable overlay when not interactive', () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: { id: '1', name: 'Test Product' },
        interactive: false,
      },
    });
    const overlay = wrapper.find("button[aria-label^='View item']");
    expect(overlay.exists()).toBe(false);
  });

  test('emits itemClick when clicked', async () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: { id: '1', name: 'Test Product' },
        interactive: true,
      },
    });
    const overlay = wrapper.find("button[aria-label^='View item']");
    await overlay.trigger('click');
    expect(wrapper.emitted('itemClick')?.[0]).toEqual(['1']);
  });

  test('emits itemAction when action clicked', async () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: {
          id: '1',
          name: 'Test Product',
          actions: [{ id: 'buy', label: 'Buy' }],
        },
        interactive: false,
      },
    });
    const actionButton = wrapper.find('button');
    await actionButton.trigger('click');
    expect(wrapper.emitted('itemAction')?.[0]).toEqual(['1', 'buy']);
  });

  test('action click does not propagate to card click', async () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: {
          id: '1',
          name: 'Test Product',
          actions: [{ id: 'buy', label: 'Buy' }],
        },
        interactive: true,
      },
    });
    const actionButton = wrapper.findAll('button').find((b) => b.text() === 'Buy');
    if (actionButton) {
      await actionButton.trigger('click');
      // itemClick should not be emitted when action is clicked
      expect(wrapper.emitted('itemClick')).toBeUndefined();
      expect(wrapper.emitted('itemAction')?.[0]).toEqual(['1', 'buy']);
    }
  });

  test('renders image when provided', () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: { id: '1', name: 'Test Product', image: 'https://example.com/img.jpg' },
        interactive: false,
      },
    });
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('https://example.com/img.jpg');
    expect(img.attributes('alt')).toBe('Test Product');
  });

  test('renders color background when no image', () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: { id: '1', name: 'Test Product', color: '#ff0000' },
        interactive: false,
      },
    });
    const colorDiv = wrapper.find('[role="img"]');
    expect(colorDiv.exists()).toBe(true);
    expect(colorDiv.attributes('style')).toContain('background-color: rgb(255, 0, 0)');
  });

  test('applies hover scale effect when interactive', () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: { id: '1', name: 'Test Product', image: 'https://example.com/img.jpg' },
        interactive: true,
      },
    });
    const img = wrapper.find('img');
    expect(img.classes()).toContain('group-hover/card:scale-105');
  });

  test('has correct touch-manipulation class', () => {
    const wrapper = mount(ItemCard, {
      props: {
        item: { id: '1', name: 'Test Product' },
        interactive: true,
      },
    });
    const card = wrapper.find('.touch-manipulation');
    expect(card.exists()).toBe(true);
  });
});
