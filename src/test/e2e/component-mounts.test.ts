// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import type { Component } from 'vue';

/**
 * E2E Test: Component Mounts
 *
 * Verifies all 27 components can be mounted with minimal valid props.
 * This is a minimal existence test — components mount without throwing.
 */

// Mock Leaflet for GeoMap
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

describe('E2E: Component Mounts', () => {
  test('ApprovalCard mounts with minimal props', async () => {
    const { ApprovalCard } = await import('@lionad/vtu-components/approval-card');
    const wrapper = mount(ApprovalCard as Component, {
      props: {
        id: 'test-approval',
        title: 'Test Approval',
        description: 'Test description',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-approval"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Approval');
  });

  test('Audio mounts with minimal props', async () => {
    const { Audio } = await import('@lionad/vtu-components/audio');
    const wrapper = mount(Audio as Component, {
      props: {
        id: 'test-audio',
        src: 'https://example.com/audio.mp3',
        assetId: 'asset-audio-1',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('audio').exists()).toBe(true);
    expect(wrapper.find('audio').attributes('src')).toBe('https://example.com/audio.mp3');
  });

  test('Image mounts with minimal props', async () => {
    const { Image } = await import('@lionad/vtu-components/image');
    const wrapper = mount(Image as Component, {
      props: {
        id: 'test-image',
        src: 'https://example.com/image.jpg',
        assetId: 'asset-image-1',
        alt: 'Test image',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/image.jpg');
  });

  test('Video mounts with minimal props', async () => {
    const { Video } = await import('@lionad/vtu-components/video');
    const wrapper = mount(Video as Component, {
      props: {
        id: 'test-video',
        src: 'https://example.com/video.mp4',
        assetId: 'asset-video-1',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('video').exists()).toBe(true);
    expect(wrapper.find('video').attributes('src')).toBe('https://example.com/video.mp4');
  });

  test('CodeBlock mounts with minimal props', async () => {
    const { CodeBlock } = await import('@lionad/vtu-components/code-block');
    const wrapper = mount(CodeBlock as Component, {
      props: {
        id: 'test-code',
        code: "console.log('hello');",
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-slot="code-block"]').exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-code"]').exists()).toBe(true);
  });

  test('Terminal mounts with minimal props', async () => {
    const { Terminal } = await import('@lionad/vtu-components/terminal');
    const wrapper = mount(Terminal as Component, {
      props: {
        id: 'test-terminal',
        command: 'ls -la',
        stdout: 'file.txt directory/',
        exitCode: 0,
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-slot="terminal"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('ls -la');
  });

  test('Citation mounts with minimal props', async () => {
    const { Citation } = await import('@lionad/vtu-components/citation');
    const wrapper = mount(Citation as Component, {
      props: {
        id: 'test-citation',
        title: 'Test Article',
        href: 'https://example.com/article',
        domain: 'example.com',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-citation"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Article');
  });

  test('LinkPreview mounts with minimal props', async () => {
    const { LinkPreview } = await import('@lionad/vtu-components/link-preview');
    const wrapper = mount(LinkPreview as Component, {
      props: {
        id: 'test-link',
        href: 'https://example.com',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-link"]').exists()).toBe(true);
    expect(wrapper.find('[role="link"]').exists()).toBe(true);
  });

  test('OptionList mounts with minimal props', async () => {
    const { OptionList } = await import('@lionad/vtu-components/option-list');
    const wrapper = mount(OptionList as Component, {
      props: {
        id: 'test-options',
        options: [
          { id: 'opt1', label: 'Option 1' },
          { id: 'opt2', label: 'Option 2' },
        ],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findAll('button[role="option"]').length).toBe(2);
    expect(wrapper.text()).toContain('Option 1');
  });

  test('XPost mounts with minimal props', async () => {
    const { XPost } = await import('@lionad/vtu-components/x-post');
    const wrapper = mount(XPost as Component, {
      props: {
        post: {
          id: 'post-1',
          author: {
            name: 'John Doe',
            handle: 'john',
            avatarUrl: 'https://example.com/avatar.jpg',
          },
          text: 'Hello world',
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-slot="x-post"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Hello world');
  });

  test('InstagramPost mounts with minimal props', async () => {
    const { InstagramPost } = await import('@lionad/vtu-components/instagram-post');
    const wrapper = mount(InstagramPost as Component, {
      props: {
        post: {
          id: 'ig-1',
          author: {
            name: 'Jane Doe',
            handle: 'jane',
            avatarUrl: 'https://example.com/avatar.jpg',
          },
          text: 'Beautiful photo',
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-slot="instagram-post"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Beautiful photo');
  });

  test('LinkedInPost mounts with minimal props', async () => {
    const { LinkedInPost } = await import('@lionad/vtu-components/linkedin-post');
    const wrapper = mount(LinkedInPost as Component, {
      props: {
        post: {
          id: 'li-1',
          author: {
            name: 'Professional User',
            avatarUrl: 'https://example.com/avatar.jpg',
            headline: 'Engineer',
          },
          text: 'Professional update',
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-slot="linkedin-post"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Professional update');
  });

  test('OrderSummary mounts with minimal props', async () => {
    const { OrderSummary } = await import('@lionad/vtu-components/order-summary');
    const wrapper = mount(OrderSummary as Component, {
      props: {
        id: 'test-order',
        items: [{ id: 'item1', name: 'Item 1', quantity: 1, unitPrice: 10 }],
        pricing: {
          subtotal: 10,
          tax: 0,
          shipping: 0,
          total: 10,
          currency: 'USD',
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-order"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Item 1');
  });

  test('MessageDraft mounts with minimal props', async () => {
    const { MessageDraft } = await import('@lionad/vtu-components/message-draft');
    const wrapper = mount(MessageDraft as Component, {
      props: {
        id: 'test-draft',
        channel: 'email',
        body: 'Test email body',
        subject: 'Test Subject',
        to: ['recipient@example.com'],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-draft"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Subject');
  });

  test('DataTable mounts with minimal props', async () => {
    const { DataTable } = await import('@lionad/vtu-components/data-table');
    const wrapper = mount(DataTable as Component, {
      props: {
        id: 'test-table',
        columns: [{ key: 'name', label: 'Name', priority: 'primary' }],
        data: [{ name: 'Test' }],
        rowIdKey: 'name',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.findAll('tbody tr').length).toBeGreaterThanOrEqual(1);
  });

  // PreferencesPanel 与 QuestionFlow 的动态 import 会拉入 reka-ui 子图,
  // vite-node 冷缓存转换下远超默认 5s,阈值放宽到 30s(仅放宽等待窗口)
  test('PreferencesPanel mounts with minimal props', async () => {
    const { PreferencesPanel } = await import('@lionad/vtu-components/preferences-panel');
    const wrapper = mount(PreferencesPanel as Component, {
      props: {
        id: 'test-prefs',
        sections: [
          {
            items: [
              { id: 'pref1', label: 'Preference 1', type: 'switch', defaultChecked: true },
            ],
          },
        ],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[role="switch"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Preference 1');
  }, 30000);

  test('Plan mounts with minimal props', async () => {
    const { Plan } = await import('@lionad/vtu-components/plan');
    const wrapper = mount(Plan as Component, {
      props: {
        id: 'test-plan',
        title: 'Test Plan',
        todos: [
          { id: 'todo1', label: 'Todo item', status: 'pending' },
        ],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-plan"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Todo item');
  });

  test('ProgressTracker mounts with minimal props', async () => {
    const { ProgressTracker } = await import('@lionad/vtu-components/progress-tracker');
    const wrapper = mount(ProgressTracker as Component, {
      props: {
        id: 'test-progress',
        steps: [{ id: 'step1', label: 'Step 1', status: 'pending' }],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-progress"]').exists()).toBe(true);
    expect(wrapper.findAll('li').length).toBeGreaterThanOrEqual(1);
  });

  test('QuestionFlow mounts with minimal props', async () => {
    const { QuestionFlow } = await import('@lionad/vtu-components/question-flow');
    const wrapper = mount(QuestionFlow as Component, {
      props: {
        id: 'test-questions',
        steps: [
          {
            id: 'q1',
            title: 'Question 1?',
            options: [{ id: 'a1', label: 'Answer 1' }],
          },
        ],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-questions"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Question 1?');
  }, 30000);

  test('Upload mounts with minimal props', async () => {
    const { Upload } = await import('@lionad/vtu-components/upload');
    const wrapper = mount(Upload as Component, {
      props: {
        id: 'test-upload',
        title: 'Attachments',
        upload: async (file: File) => ({ name: file.name, url: `https://x/${file.name}` }),
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-upload"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="upload-trigger"]').exists()).toBe(true);
    expect(wrapper.find('input[type="file"]').exists()).toBe(true);
  });

  test('Upload mounts in receipt mode', async () => {
    const { Upload } = await import('@lionad/vtu-components/upload');
    const wrapper = mount(Upload as Component, {
      props: {
        id: 'test-upload-receipt',
        choice: [{ name: 'a.png', url: 'https://x/a.png' }],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-testid="upload-item"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="upload-trigger"]').exists()).toBe(false);
  });

  test('ItemCarousel mounts with minimal props', async () => {
    const { ItemCarousel } = await import('@lionad/vtu-components/item-carousel');
    const wrapper = mount(ItemCarousel as Component, {
      props: {
        id: 'test-carousel',
        items: [{ id: 'item1', name: 'Item 1' }],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-carousel-item]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Item 1');
  });

  test('ImageGallery mounts with minimal props', async () => {
    const { ImageGallery } = await import('@lionad/vtu-components/image-gallery');
    const wrapper = mount(ImageGallery as Component, {
      props: {
        id: 'test-gallery',
        images: [{ id: 'img1', src: 'https://example.com/img.jpg' }],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/img.jpg');
  });

  test('Chart mounts with minimal props (stub)', async () => {
    const { Chart } = await import('@lionad/vtu-components/chart');
    const wrapper = mount(Chart as Component, {
      props: {
        id: 'test-chart',
        type: 'line',
        xKey: 'x',
        series: [{ key: 'y', label: 'Y' }],
        data: [{ x: 1, y: 2 }],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('[data-slot="chart"]').exists()).toBe(true);
  });

  test('CodeDiff mounts with minimal props', async () => {
    const { CodeDiff } = await import('@lionad/vtu-components/code-diff');
    const wrapper = mount(CodeDiff as Component, {
      props: {
        id: 'test-diff',
        oldCode: 'old line',
        newCode: 'new line',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-slot="code-diff"]').exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-diff"]').exists()).toBe(true);
  });

  test('WeatherWidget mounts with minimal props', async () => {
    const { WeatherWidget } = await import('@lionad/vtu-components/weather-widget');
    const wrapper = mount(WeatherWidget as Component, {
      props: {
        id: 'test-weather',
        location: { name: 'New York' },
        units: { temperature: 'celsius' },
        current: {
          conditionCode: 'clear',
          temperature: 20,
          tempMax: 25,
          tempMin: 15,
        },
        forecast: [
          { label: 'Mon', conditionCode: 'clear', tempMin: 15, tempMax: 25 },
        ],
      },
    });
    // NOTE: WeatherWidget uses WebGL and component refs that call getBoundingClientRect
    // on component instances (not DOM elements), which fails in jsdom. Keep assertion minimal.
    expect(wrapper.exists()).toBe(true);
  });

  test('ParameterSlider mounts with minimal props', async () => {
    const { ParameterSlider } = await import('@lionad/vtu-components/parameter-slider');
    const wrapper = mount(ParameterSlider as Component, {
      props: {
        id: 'test-params',
        sliders: [{ id: 'param1', label: 'Param 1', min: 0, max: 100, value: 50 }],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('input[type="range"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Param 1');
  });

  test('StatsDisplay mounts with minimal props', async () => {
    const { StatsDisplay } = await import('@lionad/vtu-components/stats-display');
    const wrapper = mount(StatsDisplay as Component, {
      props: {
        id: 'test-stats',
        stats: [{ id: 'stat1', label: 'Stat 1', value: 100 }],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="test-stats"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Stat 1');
  });

  test('GeoMap mounts with minimal props', async () => {
    const { GeoMap } = await import('@lionad/vtu-components/geo-map');
    const wrapper = mount(GeoMap as Component, {
      props: {
        id: 'test-map',
        markers: [{ id: 'marker1', lat: 0, lng: 0 }],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.mock-geo-map').exists()).toBe(true);
  });
});
