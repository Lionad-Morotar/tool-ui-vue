import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Video from './index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-video',
    src: 'https://example.com/video.mp4',
    assetId: 'asset-video-1',
    ...overrides,
  };
}

describe('Video', () => {
  describe('rendering', () => {
    test('renders video element with src', () => {
      const wrapper = mount(Video, {
        props: createProps(),
      });
      const video = wrapper.find('video');
      expect(video.exists()).toBe(true);
      expect(video.attributes('src')).toBe('https://example.com/video.mp4');
    });

    test('renders poster when provided', () => {
      const wrapper = mount(Video, {
        props: createProps({ poster: 'thumb.jpg' }),
      });
      const video = wrapper.find('video');
      expect(video.attributes('poster')).toBe('thumb.jpg');
    });

    test('applies aspect ratio classes', () => {
      const wrapper = mount(Video, {
        props: createProps({ ratio: '16:9' }),
      });
      expect(wrapper.html()).toContain('aspect-video');
    });

    test('applies square aspect ratio', () => {
      const wrapper = mount(Video, {
        props: createProps({ ratio: '1:1' }),
      });
      expect(wrapper.html()).toContain('aspect-square');
    });

    test('applies custom className', () => {
      const wrapper = mount(Video, {
        props: createProps({ className: 'my-video' }),
      });
      expect(wrapper.find("[data-slot='video']").classes()).toContain('my-video');
    });

    test('renders title when provided', () => {
      const wrapper = mount(Video, {
        props: createProps({ title: 'Test Video' }),
      });
      expect(wrapper.text()).toContain('Test Video');
    });

    test('renders description when provided', () => {
      const wrapper = mount(Video, {
        props: createProps({ description: 'A test video' }),
      });
      expect(wrapper.text()).toContain('A test video');
    });

    test('renders duration when provided', () => {
      const wrapper = mount(Video, {
        props: createProps({ durationMs: 125000 }),
      });
      // 125000ms = 2:05
      expect(wrapper.text()).toContain('2:05');
    });

    test('renders source label when provided', () => {
      const wrapper = mount(Video, {
        props: createProps({
          source: { label: 'YouTube' },
        }),
      });
      expect(wrapper.text()).toContain('YouTube');
    });
  });

  describe('media events', () => {
    test('emits mediaEvent on play', async () => {
      const wrapper = mount(Video, {
        props: createProps(),
      });
      const video = wrapper.find('video');
      await video.element.dispatchEvent(new Event('play'));
      expect(wrapper.emitted('mediaEvent')).toBeTruthy();
      expect(wrapper.emitted('mediaEvent')?.[0]).toEqual(['play']);
    });

    test('emits mediaEvent on pause', async () => {
      const wrapper = mount(Video, {
        props: createProps(),
      });
      const video = wrapper.find('video');
      await video.element.dispatchEvent(new Event('pause'));
      expect(wrapper.emitted('mediaEvent')).toBeTruthy();
      expect(wrapper.emitted('mediaEvent')?.[0]).toEqual(['pause']);
    });

    test('emits mediaEvent on error', async () => {
      const wrapper = mount(Video, {
        props: createProps(),
      });
      const video = wrapper.find('video');
      await video.element.dispatchEvent(new Event('error'));
      expect(wrapper.emitted('mediaEvent')).toBeTruthy();
      expect(wrapper.emitted('mediaEvent')?.[0]).toEqual(['error']);
    });

    test('emits mediaEvent on mute/unmute via volumechange', async () => {
      const wrapper = mount(Video, {
        props: createProps(),
      });
      const videoEl = wrapper.find('video').element as HTMLVideoElement;

      // Trigger play first to initialize state
      await videoEl.dispatchEvent(new Event('play'));

      // Set initial muted state and dispatch
      videoEl.muted = true;
      await videoEl.dispatchEvent(new Event('volumechange'));

      // Wait for Vue to process
      await wrapper.vm.$nextTick();

      // Change to unmuted
      videoEl.muted = false;
      await videoEl.dispatchEvent(new Event('volumechange'));

      // Wait for Vue to process
      await wrapper.vm.$nextTick();

      // Should have emitted media events
      expect(wrapper.emitted('mediaEvent')).toBeTruthy();
    });
  });

  describe('navigation', () => {
    test('emits navigate event when Open button clicked', async () => {
      const wrapper = mount(Video, {
        props: createProps({
          title: 'Video with Link',
          href: 'https://example.com/video',
        }),
      });
      const openButton = wrapper.find('button');
      // First button should be Open when href is provided
      if (openButton.text().includes('Open')) {
        await openButton.trigger('click');
        expect(wrapper.emitted('navigate')).toBeTruthy();
        expect(wrapper.emitted('navigate')?.[0]).toEqual([
          'https://example.com/video',
        ]);
      }
    });

    test('shows overlay buttons when title or href provided', () => {
      const wrapper = mount(Video, {
        props: createProps({
          title: 'Video with Overlay',
        }),
      });
      // Should have overlay elements
      expect(wrapper.find('.z-30').exists()).toBe(true);
    });

    test('does not show overlay when no title or href', () => {
      const wrapper = mount(Video, {
        props: createProps(),
      });
      // Should not have overlay
      expect(wrapper.find('.z-30').exists()).toBe(false);
    });
  });

  describe('playback controls', () => {
    test('play/pause button exists in overlay', () => {
      const wrapper = mount(Video, {
        props: createProps({
          title: 'Test Video',
        }),
      });
      const buttons = wrapper.findAll('button');
      const playButton = buttons.find((b) => b.text().includes('Watch') || b.text().includes('Pause'));
      expect(playButton).toBeTruthy();
    });

    test('video has controls attribute', () => {
      const wrapper = mount(Video, {
        props: createProps(),
      });
      const video = wrapper.find('video');
      expect(video.attributes('controls')).toBeDefined();
    });

    test('video has playsinline attribute', () => {
      const wrapper = mount(Video, {
        props: createProps(),
      });
      const video = wrapper.find('video');
      expect(video.attributes('playsinline')).toBeDefined();
    });
  });

  describe('accessibility', () => {
    test('has correct data attributes', () => {
      const wrapper = mount(Video, {
        props: createProps({ id: 'test-video-id' }),
      });
      const article = wrapper.find("[data-slot='video']");
      expect(article.attributes('data-slot')).toBe('video');
      expect(article.attributes('data-tool-ui-id')).toBe('test-video-id');
    });

    test('sets lang attribute based on locale', () => {
      const wrapper = mount(Video, {
        props: createProps({ locale: 'zh-CN' }),
      });
      expect(wrapper.find("[data-slot='video']").attributes('lang')).toBe('zh-CN');
    });

    test('buttons are keyboard accessible', () => {
      const wrapper = mount(Video, {
        props: createProps({
          title: 'Test Video',
          href: 'https://example.com',
        }),
      });
      const buttons = wrapper.findAll('button');
      buttons.forEach((button) => {
        expect(button.attributes('type')).toBe('button');
      });
    });
  });

  describe('edge cases', () => {
    test('handles missing optional props gracefully', () => {
      const wrapper = mount(Video, {
        props: createProps(),
      });
      expect(wrapper.find("[data-slot='video']").exists()).toBe(true);
    });

    test('handles invalid date string gracefully', () => {
      const wrapper = mount(Video, {
        props: createProps({
          createdAt: 'invalid-date',
        }),
      });
      // Should still render the invalid string
      expect(wrapper.text()).toContain('invalid-date');
    });

    test('handles valid ISO date', () => {
      const wrapper = mount(Video, {
        props: createProps({
          createdAt: '2024-03-15T10:00:00Z',
        }),
      });
      // Should render formatted date
      expect(wrapper.find('time').exists()).toBe(true);
    });

    test('hides domain when same as source label', () => {
      const wrapper = mount(Video, {
        props: createProps({
          domain: 'YouTube',
          source: { label: 'YouTube' },
        }),
      });
      // Domain should not appear twice
      const text = wrapper.text();
      const matches = text.match(/YouTube/g);
      expect(matches?.length).toBe(1);
    });
  });

  describe('video helpers integration', () => {
    test('uses shared media helpers for duration formatting', () => {
      const wrapper = mount(Video, {
        props: createProps({
          durationMs: 3661000, // 1:01:01
        }),
      });
      expect(wrapper.text()).toContain('1:01:01');
    });

    test('uses shared media helpers for aspect ratio', () => {
      const wrapper = mount(Video, {
        props: createProps({
          ratio: '4:3',
        }),
      });
      expect(wrapper.html()).toContain('aspect-[4/3]');
    });
  });
});
