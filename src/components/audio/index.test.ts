import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Audio from './index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-audio',
    src: 'https://example.com/audio.mp3',
    assetId: 'asset-audio-1',
    ...overrides,
  };
}

describe('Audio', () => {
  describe('rendering', () => {
    test('renders audio element with src', () => {
      const wrapper = mount(Audio, {
        props: createProps(),
      });
      const audio = wrapper.find('audio');
      expect(audio.exists()).toBe(true);
      expect(audio.attributes('src')).toBe('https://example.com/audio.mp3');
    });

    test('renders with title and description', () => {
      const wrapper = mount(Audio, {
        props: createProps({
          title: 'Test Track',
          description: 'A test audio track',
        }),
      });
      expect(wrapper.text()).toContain('Test Track');
      expect(wrapper.text()).toContain('A test audio track');
    });

    test('renders artwork when provided', () => {
      const wrapper = mount(Audio, {
        props: createProps({
          artwork: 'https://example.com/artwork.jpg',
        }),
      });
      const img = wrapper.find('img');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://example.com/artwork.jpg');
    });

    test('applies variant classes correctly', () => {
      const fullWrapper = mount(Audio, {
        props: createProps({ variant: 'full' }),
      });
      expect(fullWrapper.find("[data-slot='audio']").classes()).toContain(
        'min-w-52'
      );

      const compactWrapper = mount(Audio, {
        props: createProps({ variant: 'compact' }),
      });
      expect(compactWrapper.find("[data-slot='audio']").classes()).toContain(
        'min-w-72'
      );
    });

    test('applies custom css.root', () => {
      const wrapper = mount(Audio, {
        props: createProps({ css: { root: 'my-audio' } }),
      });
      expect(wrapper.find("[data-slot='audio']").classes()).toContain(
        'my-audio'
      );
    });

    test('sets lang attribute based on locale', () => {
      const wrapper = mount(Audio, {
        props: createProps({ locale: 'zh-CN' }),
      });
      expect(wrapper.find("[data-slot='audio']").attributes('lang')).toBe(
        'zh-CN'
      );
    });
  });

  describe('media events', () => {
    test('emits mediaEvent on play', async () => {
      const wrapper = mount(Audio, {
        props: createProps(),
      });
      const audio = wrapper.find('audio');
      await audio.element.dispatchEvent(new Event('play'));
      expect(wrapper.emitted('mediaEvent')).toBeTruthy();
      expect(wrapper.emitted('mediaEvent')?.[0]).toEqual(['play']);
    });

    test('emits mediaEvent on pause', async () => {
      const wrapper = mount(Audio, {
        props: createProps(),
      });
      const audio = wrapper.find('audio');
      await audio.element.dispatchEvent(new Event('pause'));
      expect(wrapper.emitted('mediaEvent')).toBeTruthy();
      expect(wrapper.emitted('mediaEvent')?.[0]).toEqual(['pause']);
    });

    test('emits mediaEvent on error', async () => {
      const wrapper = mount(Audio, {
        props: createProps(),
      });
      const audio = wrapper.find('audio');
      await audio.element.dispatchEvent(new Event('error'));
      expect(wrapper.emitted('mediaEvent')).toBeTruthy();
      expect(wrapper.emitted('mediaEvent')?.[0]).toEqual(['error']);
    });
  });

  describe('playback controls', () => {
    test('play/pause button exists and has correct aria-label', () => {
      const wrapper = mount(Audio, {
        props: createProps(),
      });
      const button = wrapper.find('button[aria-label]');
      expect(button.exists()).toBe(true);
      expect(button.attributes('aria-label')).toBe('Play');
    });

    test('progress slider exists with correct attributes', () => {
      const wrapper = mount(Audio, {
        props: createProps(),
      });
      const slider = wrapper.find('input[type="range"]');
      expect(slider.exists()).toBe(true);
      expect(slider.attributes('aria-label')).toBe('Audio progress');
      expect(slider.attributes('step')).toBe('0.1');
    });

    test('time display shows formatted time', async () => {
      const wrapper = mount(Audio, {
        props: createProps({
          durationMs: 125000, // 2:05
        }),
      });
      // Duration should be displayed
      expect(wrapper.text()).toContain('2:05');
    });
  });

  describe('compact variant', () => {
    test('renders compact layout correctly', () => {
      const wrapper = mount(Audio, {
        props: createProps({
          variant: 'compact',
          title: 'Compact Track',
        }),
      });
      expect(wrapper.text()).toContain('Compact Track');
      // Compact should have different structure
      expect(wrapper.find("[data-slot='audio']").classes()).toContain(
        'min-w-72'
      );
    });

    test('compact shows progress bar when duration provided', () => {
      const wrapper = mount(Audio, {
        props: createProps({
          variant: 'compact',
          durationMs: 60000,
        }),
      });
      // Should have progress indicator
      const progressBar = wrapper.find('.bg-foreground\\/20');
      expect(progressBar.exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    test('has correct data attributes', () => {
      const wrapper = mount(Audio, {
        props: createProps({ id: 'test-audio-id' }),
      });
      const article = wrapper.find("[data-slot='audio']");
      expect(article.attributes('data-slot')).toBe('audio');
      expect(article.attributes('data-tool-ui-id')).toBe('test-audio-id');
    });

    test('play button is keyboard accessible', () => {
      const wrapper = mount(Audio, {
        props: createProps(),
      });
      const button = wrapper.find('button');
      expect(button.attributes('type')).toBe('button');
    });

    test('audio element is hidden from view', () => {
      const wrapper = mount(Audio, {
        props: createProps(),
      });
      const audio = wrapper.find('audio');
      expect(audio.classes()).toContain('hidden');
    });
  });

  describe('edge cases', () => {
    test('handles missing optional props gracefully', () => {
      const wrapper = mount(Audio, {
        props: createProps(),
      });
      // Should render without errors
      expect(wrapper.find("[data-slot='audio']").exists()).toBe(true);
    });

    test('handles zero duration gracefully', () => {
      const wrapper = mount(Audio, {
        props: createProps({ durationMs: 0 }),
      });
      expect(wrapper.find("[data-slot='audio']").exists()).toBe(true);
    });

    test('handles very long durations', () => {
      const wrapper = mount(Audio, {
        props: createProps({ durationMs: 3600000 }), // 1 hour
      });
      // Should show 60:00
      expect(wrapper.text()).toContain('60:00');
    });
  });
});
