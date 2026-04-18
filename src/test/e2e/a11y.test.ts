// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import type { Component } from 'vue';

// Mock Leaflet for GeoMap (not directly tested here but imported by some paths)
vi.mock('leaflet', () => ({
  default: {},
  map: () => ({
    setView: vi.fn(),
    fitBounds: vi.fn(),
    remove: vi.fn(),
  }),
  tileLayer: () => ({
    addTo: vi.fn(),
  }),
  marker: () => ({
    addTo: vi.fn(),
    bindPopup: vi.fn(),
  }),
  latLng: (lat: number, lng: number) => ({ lat, lng }),
  latLngBounds: () => ({
    extend: vi.fn(),
  }),
}));

vi.mock('@lionad/vtu-components/geo-map', () => ({
  GeoMap: {
    name: 'cmpt-geo-map',
    props: ['id', 'markers'],
    template: '<div class="mock-geo-map" :data-tool-ui-id="id"></div>',
  },
}));

describe('E2E: Accessibility', () => {
  describe('ImageGallery', () => {
    test('dialog has aria-label when lightbox is open', async () => {
      const { ImageGallery } = await import('@lionad/vtu-components/image-gallery');
      const wrapper = mount(ImageGallery as Component, {
        props: {
          id: 'test-gallery',
          images: [
            { id: '1', src: 'https://example.com/img.jpg', alt: 'Test image' },
          ],
        },
        attachTo: document.body,
      });

      // Open lightbox by clicking the image button
      const imageButton = wrapper.find('button[aria-label="Test image"]');
      expect(imageButton.exists()).toBe(true);
      await imageButton.trigger('click');

      // Dialog is teleported to body, query from document
      const dialog = document.body.querySelector('dialog');
      expect(dialog).not.toBeNull();
      expect(dialog!.getAttribute('aria-label')).toBe('Image lightbox');

      wrapper.unmount();
    });

    test('close button has aria-label', async () => {
      const { ImageGallery } = await import('@lionad/vtu-components/image-gallery');
      const wrapper = mount(ImageGallery as Component, {
        props: {
          id: 'test-gallery',
          images: [
            { id: '1', src: 'https://example.com/img.jpg', alt: 'Test image' },
          ],
        },
        attachTo: document.body,
      });

      // Open lightbox
      const imageButton = wrapper.find('button[aria-label="Test image"]');
      await imageButton.trigger('click');

      // Close button is inside teleported dialog, query from document
      const closeButton = document.body.querySelector('button[aria-label="Close"]');
      expect(closeButton).not.toBeNull();

      wrapper.unmount();
    });

    test('navigation buttons have aria-labels with multiple images', async () => {
      const { ImageGallery } = await import('@lionad/vtu-components/image-gallery');
      const wrapper = mount(ImageGallery as Component, {
        props: {
          id: 'test-gallery',
          images: [
            { id: '1', src: 'https://example.com/a.jpg', alt: 'Image A' },
            { id: '2', src: 'https://example.com/b.jpg', alt: 'Image B' },
          ],
        },
        attachTo: document.body,
      });

      // Open lightbox
      const imageButton = wrapper.find('button[aria-label="Image A"]');
      await imageButton.trigger('click');

      // Nav buttons are inside teleported dialog, query from document
      const prevButton = document.body.querySelector('button[aria-label="Previous image"]');
      const nextButton = document.body.querySelector('button[aria-label="Next image"]');
      expect(prevButton).not.toBeNull();
      expect(nextButton).not.toBeNull();

      wrapper.unmount();
    });

    test('gallery root has aria-busy attribute', async () => {
      const { ImageGallery } = await import('@lionad/vtu-components/image-gallery');
      const wrapper = mount(ImageGallery as Component, {
        props: {
          id: 'test-gallery',
          images: [
            { id: '1', src: 'https://example.com/img.jpg', alt: 'Test image' },
          ],
        },
        attachTo: document.body,
      });

      const root = wrapper.find('[data-tool-ui-id="test-gallery"]');
      expect(root.exists()).toBe(true);
      expect(root.attributes('aria-busy')).toBe('false');

      wrapper.unmount();
    });

    test('grid has list and listitem roles', async () => {
      const { ImageGallery } = await import('@lionad/vtu-components/image-gallery');
      const wrapper = mount(ImageGallery as Component, {
        props: {
          id: 'test-gallery',
          images: [
            { id: '1', src: 'https://example.com/img.jpg', alt: 'Test image' },
            { id: '2', src: 'https://example.com/b.jpg', alt: 'Image B' },
          ],
        },
        attachTo: document.body,
      });

      expect(wrapper.find("[role='list']").exists()).toBe(true);
      expect(wrapper.findAll("[role='listitem']").length).toBe(2);

      wrapper.unmount();
    });
  });

  describe('MessageDraft', () => {
    test('interactive article has aria-labelledby', async () => {
      const { MessageDraft } = await import('@lionad/vtu-components/message-draft');
      const wrapper = mount(MessageDraft as Component, {
        props: {
          id: 'test-draft',
          channel: 'email',
          body: 'Test body',
          subject: 'Test Subject',
          to: ['recipient@example.com'],
        },
      });

      const article = wrapper.find('article');
      expect(article.exists()).toBe(true);
      expect(article.attributes('aria-labelledby')).toBe('test-draft-title');
    });

    test('sent receipt has role=status and aria-label', async () => {
      const { MessageDraft } = await import('@lionad/vtu-components/message-draft');
      const wrapper = mount(MessageDraft as Component, {
        props: {
          id: 'test-draft',
          channel: 'email',
          body: 'Test body',
          subject: 'Test Subject',
          to: ['recipient@example.com'],
          outcome: 'sent',
        },
      });

      const receipt = wrapper.find('[data-receipt="true"]');
      expect(receipt.exists()).toBe(true);
      expect(receipt.attributes('role')).toBe('status');
      expect(receipt.attributes('aria-label')).toBe('Message sent');
    });

    test('interactive article has tabindex for focus management', async () => {
      const { MessageDraft } = await import('@lionad/vtu-components/message-draft');
      const wrapper = mount(MessageDraft as Component, {
        props: {
          id: 'test-draft',
          channel: 'email',
          body: 'Test body',
          subject: 'Test Subject',
          to: ['recipient@example.com'],
        },
      });

      const article = wrapper.find('article');
      expect(article.exists()).toBe(true);
      expect(article.attributes('tabindex')).toBe('-1');
    });

    test('sending state has aria-live=polite', async () => {
      const { MessageDraft } = await import('@lionad/vtu-components/message-draft');
      const wrapper = mount(MessageDraft as Component, {
        props: {
          id: 'test-draft',
          channel: 'email',
          body: 'Test body',
          subject: 'Test Subject',
          to: ['recipient@example.com'],
          undoGracePeriod: 99999,
        },
      });

      // Trigger sending state
      const sendButton = wrapper.findAll('button').find((b) => b.text().includes('Send'));
      await sendButton!.trigger('click');

      const liveRegion = wrapper.find('[aria-live="polite"]');
      expect(liveRegion.exists()).toBe(true);
    });

    test('separator has role=separator', async () => {
      const { MessageDraft } = await import('@lionad/vtu-components/message-draft');
      const wrapper = mount(MessageDraft as Component, {
        props: {
          id: 'test-draft',
          channel: 'email',
          body: 'Test body',
          subject: 'Test Subject',
          to: ['recipient@example.com'],
        },
      });

      const separators = wrapper.findAll('[role="separator"]');
      expect(separators.length).toBeGreaterThanOrEqual(1);
    });

    test('Escape key cancels draft in review state', async () => {
      const { MessageDraft } = await import('@lionad/vtu-components/message-draft');
      const wrapper = mount(MessageDraft as Component, {
        props: {
          id: 'test-draft',
          channel: 'email',
          body: 'Test body',
          subject: 'Test Subject',
          to: ['recipient@example.com'],
        },
      });

      const article = wrapper.find('article');
      await article.trigger('keydown', { key: 'Escape' });

      expect(wrapper.emitted('cancel')).toBeTruthy();
    });
  });

  describe('OptionList', () => {
    test('has group role with aria-label', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
          ],
        },
      });

      const group = wrapper.find("[role='group']");
      expect(group.exists()).toBe(true);
      expect(group.attributes('aria-label')).toBe('Option list');
    });

    test('listbox has aria-multiselectable in multi mode', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
          ],
          selectionMode: 'multi',
        },
      });

      const listbox = wrapper.find("[role='listbox']");
      expect(listbox.exists()).toBe(true);
      expect(listbox.attributes('aria-multiselectable')).toBe('true');
    });

    test('options have role=option and aria-selected', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
          ],
        },
      });

      const options = wrapper.findAll("[role='option']");
      expect(options.length).toBe(2);
      expect(options[0]!.attributes('aria-selected')).toBe('false');
      expect(options[1]!.attributes('aria-selected')).toBe('false');
    });

    test('first option has tabindex=0, others have tabindex=-1', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
            { id: 'c', label: 'Carol' },
          ],
        },
      });

      const options = wrapper.findAll("[role='option']");
      expect(options[0]!.attributes('tabindex')).toBe('0');
      expect(options[1]!.attributes('tabindex')).toBe('-1');
      expect(options[2]!.attributes('tabindex')).toBe('-1');
    });

    test('ArrowDown moves focus to next option', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
            { id: 'c', label: 'Carol' },
          ],
        },
      });

      const listbox = wrapper.find("[role='listbox']");
      await listbox.trigger('keydown', { key: 'ArrowDown' });

      const options = wrapper.findAll("[role='option']");
      expect(options[0]!.attributes('tabindex')).toBe('-1');
      expect(options[1]!.attributes('tabindex')).toBe('0');
    });

    test('ArrowUp moves focus to previous option', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
            { id: 'c', label: 'Carol' },
          ],
        },
      });

      const listbox = wrapper.find("[role='listbox']");
      // Move to last option first
      await listbox.trigger('keydown', { key: 'End' });
      // Then move up
      await listbox.trigger('keydown', { key: 'ArrowUp' });

      const options = wrapper.findAll("[role='option']");
      expect(options[1]!.attributes('tabindex')).toBe('0');
      expect(options[2]!.attributes('tabindex')).toBe('-1');
    });

    test('Enter selects focused option', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
          ],
        },
      });

      const options = wrapper.findAll("[role='option']");
      await options[0]!.trigger('keydown', { key: 'Enter' });

      const selected = wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true');
      expect(selected?.text()).toContain('Alice');
    });

    test('Space selects focused option', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
          ],
        },
      });

      const listbox = wrapper.find("[role='listbox']");
      await listbox.trigger('keydown', { key: ' ' });

      const selected = wrapper.findAll("[role='option']").find((b) => b.attributes('aria-selected') === 'true');
      expect(selected?.text()).toContain('Alice');
    });

    test('Home key moves focus to first option', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
            { id: 'c', label: 'Carol' },
          ],
        },
      });

      const listbox = wrapper.find("[role='listbox']");
      await listbox.trigger('keydown', { key: 'End' });
      await listbox.trigger('keydown', { key: 'Home' });

      const options = wrapper.findAll("[role='option']");
      expect(options[0]!.attributes('tabindex')).toBe('0');
    });

    test('End key moves focus to last option', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
            { id: 'c', label: 'Carol' },
          ],
        },
      });

      const listbox = wrapper.find("[role='listbox']");
      await listbox.trigger('keydown', { key: 'End' });

      const options = wrapper.findAll("[role='option']");
      expect(options[options.length - 1]!.attributes('tabindex')).toBe('0');
    });

    test('Escape clears selection', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
          ],
        },
      });

      // Select first option
      const options = wrapper.findAll("[role='option']");
      await options[0]!.trigger('click');

      // Then press Escape
      const listbox = wrapper.find("[role='listbox']");
      await listbox.trigger('keydown', { key: 'Escape' });

      expect(wrapper.emitted('action')?.[0]).toEqual(['cancel', null]);
    });

    test('disabled options have disabled attribute', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob', disabled: true },
          ],
        },
      });

      const options = wrapper.findAll("[role='option']");
      expect(options[0]!.attributes('disabled')).toBeUndefined();
      expect(options[1]!.attributes('disabled')).toBeDefined();
    });

    test('receipt mode has role=status', async () => {
      const { OptionList } = await import('@lionad/vtu-components/option-list');
      const wrapper = mount(OptionList as Component, {
        props: {
          id: 'test-options',
          options: [
            { id: 'a', label: 'Alice' },
            { id: 'b', label: 'Bob' },
          ],
          choice: 'a',
        },
      });

      const receipt = wrapper.find('[data-receipt="true"]');
      expect(receipt.exists()).toBe(true);
      expect(receipt.attributes('role')).toBe('status');
    });
  });

  describe('DataTable', () => {
    test('sortable headers have aria-sort attribute', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'value', label: 'Value' },
          ],
          data: [
            { name: 'Alpha', value: 100 },
            { name: 'Beta', value: 200 },
          ],
          rowIdKey: 'name',
          sort: { by: 'name', direction: 'asc' },
        },
      });

      const headers = wrapper.findAll('th');
      expect(headers[0]!.attributes('aria-sort')).toBe('ascending');
      expect(headers[1]!.attributes('aria-sort')).toBeUndefined();
    });

    test('aria-sort changes to descending when sorted desc', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'value', label: 'Value' },
          ],
          data: [
            { name: 'Alpha', value: 100 },
            { name: 'Beta', value: 200 },
          ],
          rowIdKey: 'name',
          sort: { by: 'name', direction: 'desc' },
        },
      });

      const headers = wrapper.findAll('th');
      expect(headers[0]!.attributes('aria-sort')).toBe('descending');
    });

    test('sort buttons have aria-label', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'value', label: 'Value' },
          ],
          data: [
            { name: 'Alpha', value: 100 },
          ],
          rowIdKey: 'name',
        },
      });

      const sortButton = wrapper.find('th button');
      expect(sortButton.exists()).toBe(true);
      expect(sortButton.attributes('aria-label')).toContain('Sort by');
    });

    test('sort button aria-label includes current sort direction', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [
            { key: 'name', label: 'Name' },
          ],
          data: [{ name: 'Alpha' }],
          rowIdKey: 'name',
          sort: { by: 'name', direction: 'asc' },
        },
      });

      const sortButton = wrapper.find('th button');
      expect(sortButton.attributes('aria-label')).toContain('ascending');
    });

    test('table headers have scope=col', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'value', label: 'Value' },
          ],
          data: [{ name: 'Alpha', value: 100 }],
          rowIdKey: 'name',
        },
      });

      const headers = wrapper.findAll('th');
      headers.forEach((header) => {
        expect(header.attributes('scope')).toBe('col');
      });
    });

    test('empty state has role=status', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [{ key: 'name', label: 'Name' }],
          data: [],
          rowIdKey: 'name',
        },
      });

      const status = wrapper.find('[role="status"]');
      expect(status.exists()).toBe(true);
    });

    test('mobile cards container has aria-label', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'value', label: 'Value' },
          ],
          data: [{ name: 'Alpha', value: 100 }],
          rowIdKey: 'name',
        },
      });

      const list = wrapper.find('[role="list"]');
      expect(list.exists()).toBe(true);
      expect(list.attributes('aria-label')).toBe('Data table (mobile card view)');
    });

    test('mobile card items have role=listitem', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'value', label: 'Value', priority: 'secondary' },
          ],
          data: [
            { name: 'Alpha', value: 100 },
            { name: 'Beta', value: 200 },
          ],
          rowIdKey: 'name',
          layout: 'cards',
        },
      });

      const listItems = wrapper.findAll('[role="listitem"]');
      expect(listItems.length).toBe(2);
    });

    test('expand button has aria-expanded and aria-controls', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'value', label: 'Value', priority: 'secondary' },
          ],
          data: [{ name: 'Alpha', value: 100 }],
          rowIdKey: 'name',
          layout: 'cards',
        },
      });

      const expandButton = wrapper.find('[aria-expanded]');
      expect(expandButton.exists()).toBe(true);
      expect(expandButton.attributes('aria-expanded')).toBe('false');
      expect(expandButton.attributes('aria-controls')).toBeDefined();
    });

    test('expanded content has role=region', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'value', label: 'Value', priority: 'secondary' },
          ],
          data: [{ name: 'Alpha', value: 100 }],
          rowIdKey: 'name',
          layout: 'cards',
        },
      });

      // Expand the row
      const expandButton = wrapper.find('[aria-expanded]');
      await expandButton.trigger('click');

      const region = wrapper.find('[role="region"]');
      expect(region.exists()).toBe(true);
    });

    test('sort announcement has aria-live=polite', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [{ key: 'name', label: 'Name' }],
          data: [{ name: 'Alpha' }],
          rowIdKey: 'name',
          sort: { by: 'name', direction: 'asc' },
        },
      });

      const announcement = wrapper.find('[aria-live="polite"]');
      expect(announcement.exists()).toBe(true);
      expect(announcement.text()).toContain('Sorted by Name');
      expect(announcement.text()).toContain('ascending');
    });

    test('non-sortable columns have aria-disabled on button', async () => {
      const { DataTable } = await import('@lionad/vtu-components/data-table');
      const wrapper = mount(DataTable as Component, {
        props: {
          id: 'test-table',
          columns: [
            { key: 'name', label: 'Name', sortable: false },
            { key: 'value', label: 'Value' },
          ],
          data: [{ name: 'Alpha', value: 100 }],
          rowIdKey: 'name',
        },
      });

      const buttons = wrapper.findAll('th button');
      expect(buttons[0]!.attributes('aria-disabled')).toBe('true');
      expect(buttons[1]!.attributes('aria-disabled')).toBeUndefined();
    });
  });
});
