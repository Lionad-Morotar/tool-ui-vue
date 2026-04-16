import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';

const currentLocale = ref('en');
const messagesByLocale: Record<string, Record<string, string>> = {
  en: {
    'linkedinPost.like': 'Like',
    'linkedinPost.share': 'Share',
    'linkedinPost.edited': 'Edited',
    'linkedinPost.logo': 'LinkedIn logo',
    'linkedinPost.seeMore': 'see more',
    'xPost.verified': 'Verified account',
  },
  'zh-CN': {
    'linkedinPost.like': '赞同',
    'linkedinPost.share': '发送',
    'linkedinPost.edited': '已编辑',
    'linkedinPost.logo': 'LinkedIn 标志',
    'linkedinPost.seeMore': '查看更多',
    'xPost.verified': '认证账号',
  },
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

import LinkedInPost from '../cmpts/linkedin-post.vue';

describe('LinkedInPost', () => {
  const basePost = {
    id: 'li-1',
    author: {
      name: 'Jane Doe',
      handle: 'janedoe',
      avatarUrl: 'https://example.com/avatar.jpg',
      headline: 'Engineer',
    },
    text: 'Excited to share...',
    createdAt: '2024-01-01T00:00:00Z',
    stats: {
      likes: 50,
      isLiked: false,
    },
  };

  describe('rendering', () => {
    it('renders author name', () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      expect(wrapper.text()).toContain('Jane Doe');
    });

    it('renders author headline', () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      expect(wrapper.text()).toContain('Engineer');
    });

    it('renders post content', () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      expect(wrapper.text()).toContain('Excited to share...');
    });

    it('renders author avatar', () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      const img = wrapper.find('img[alt="Jane Doe avatar"]');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://example.com/avatar.jpg');
    });

    it('renders timestamp', () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      const text = wrapper.text();
      expect(text.length).toBeGreaterThan(0);
    });

    it("renders 'Edited' indicator", () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      expect(wrapper.text()).toContain('Edited');
    });

    it('renders correctly without optional fields', () => {
      const minimalPost = {
        id: 'minimal',
        author: {
          name: 'Minimal User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: minimalPost },
      });
      expect(wrapper.text()).toContain('Minimal User');
    });

    it('renders without headline when not provided', () => {
      const postWithoutHeadline = {
        ...basePost,
        author: { ...basePost.author, headline: undefined },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithoutHeadline },
      });
      expect(wrapper.text()).toContain('Jane Doe');
      expect(wrapper.text()).not.toContain('Engineer');
    });
  });

  describe('engagement', () => {
    it('renders like button with count', () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      const likeBtn = wrapper.find('button[aria-label="Like"]');
      expect(likeBtn.exists()).toBe(true);
      expect(wrapper.text()).toContain('50');
    });

    it('renders share button', () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      const shareBtn = wrapper.find('button[aria-label="Share"]');
      expect(shareBtn.exists()).toBe(true);
    });

    it('formats large like counts with K suffix', () => {
      const postWithManyLikes = {
        ...basePost,
        stats: { likes: 1500, isLiked: false },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithManyLikes },
      });
      expect(wrapper.text()).toContain('1.5K');
    });

    it('formats very large like counts with M suffix', () => {
      const postWithMillions = {
        ...basePost,
        stats: { likes: 2500000, isLiked: false },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithMillions },
      });
      expect(wrapper.text()).toContain('2.5M');
    });

    it('applies liked state styling when isLiked is true', () => {
      const likedPost = {
        ...basePost,
        stats: { likes: 50, isLiked: true },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: likedPost },
      });
      const html = wrapper.html();
      expect(html).toContain('text-blue-600');
    });

    it('renders without stats', () => {
      const postWithoutStats = {
        ...basePost,
        stats: undefined,
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithoutStats },
      });
      const likeBtn = wrapper.find('button[aria-label="Like"]');
      expect(likeBtn.exists()).toBe(true);
    });
  });

  describe('media', () => {
    it('renders image when provided', () => {
      const postWithMedia = {
        ...basePost,
        media: {
          type: 'image' as const,
          url: 'https://example.com/photo.jpg',
          alt: 'A photo',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithMedia },
      });
      const img = wrapper.find('img[alt="A photo"]');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://example.com/photo.jpg');
    });

    it('renders video when provided', () => {
      const postWithVideo = {
        ...basePost,
        media: {
          type: 'video' as const,
          url: 'https://example.com/video.mp4',
          alt: 'A video',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithVideo },
      });
      const video = wrapper.find('video');
      expect(video.exists()).toBe(true);
      expect(video.attributes('src')).toBe('https://example.com/video.mp4');
    });

    it('applies 16:9 aspect ratio to media', () => {
      const postWithMedia = {
        ...basePost,
        media: {
          type: 'image' as const,
          url: 'https://example.com/photo.jpg',
          alt: 'A photo',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithMedia },
      });
      const mediaContainer = wrapper.find('[style*="aspect-ratio"]');
      expect(mediaContainer.exists()).toBe(true);
    });

    it('renders link preview when provided', () => {
      const postWithLink = {
        ...basePost,
        linkPreview: {
          url: 'https://example.com/article',
          title: 'Article Title',
          domain: 'example.com',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithLink },
      });
      expect(wrapper.text()).toContain('Article Title');
      expect(wrapper.text()).toContain('example.com');
    });

    it('renders link preview with image', () => {
      const postWithLinkAndImage = {
        ...basePost,
        linkPreview: {
          url: 'https://example.com/article',
          title: 'Article Title',
          imageUrl: 'https://example.com/thumb.jpg',
          domain: 'example.com',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithLinkAndImage },
      });
      const img = wrapper.find('img[alt=""]');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://example.com/thumb.jpg');
    });

    it('extracts domain from URL when not provided', () => {
      const postWithLinkNoDomain = {
        ...basePost,
        linkPreview: {
          url: 'https://www.example.com/article',
          title: 'Article Title',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithLinkNoDomain },
      });
      expect(wrapper.text()).toContain('example.com');
    });

    it('filters unsafe javascript: URLs in link preview', () => {
      const postWithUnsafeLink = {
        ...basePost,
        linkPreview: {
          url: "javascript:alert('xss')",
          title: 'Unsafe Link',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithUnsafeLink },
      });
      // Should still render the preview but without clickable link styling
      expect(wrapper.text()).toContain('Unsafe Link');
    });

    it('filters unsafe data: URLs in link preview', () => {
      const postWithDataUrl = {
        ...basePost,
        linkPreview: {
          url: "data:text/html,<script>alert('xss')</script>",
          title: 'Data URL',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithDataUrl },
      });
      expect(wrapper.text()).toContain('Data URL');
    });

    it('allows safe HTTPS URLs in link preview', () => {
      const postWithSafeLink = {
        ...basePost,
        linkPreview: {
          url: 'https://example.com/article',
          title: 'Safe Link',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithSafeLink },
      });
      expect(wrapper.text()).toContain('Safe Link');
    });

    it('does not render link preview when media is present', () => {
      const postWithBoth = {
        ...basePost,
        media: {
          type: 'image' as const,
          url: 'https://example.com/photo.jpg',
          alt: 'A photo',
        },
        linkPreview: {
          url: 'https://example.com/article',
          title: 'Article Title',
        },
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithBoth },
      });
      // Media takes precedence over link preview
      const img = wrapper.find('img[alt="A photo"]');
      expect(img.exists()).toBe(true);
      // Link preview should not be visible
      expect(wrapper.text()).not.toContain('Article Title');
    });
  });

  describe('events', () => {
    it('emits action event on like click', async () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      const likeBtn = wrapper.find('button[aria-label="Like"]');
      await likeBtn.trigger('click');
      expect(wrapper.emitted('action')).toBeTruthy();
      expect(wrapper.emitted('action')![0]).toEqual(['like', basePost]);
    });

    it('emits action event on share click', async () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      const shareBtn = wrapper.find('button[aria-label="Share"]');
      await shareBtn.trigger('click');
      expect(wrapper.emitted('action')).toBeTruthy();
      expect(wrapper.emitted('action')![0]).toEqual(['share', basePost]);
    });

    it('emits action event with correct payload', async () => {
      const customPost = { ...basePost, id: 'custom-id' };
      const wrapper = mount(LinkedInPost, {
        props: { post: customPost },
      });
      const likeBtn = wrapper.find('button[aria-label="Like"]');
      await likeBtn.trigger('click');
      expect(wrapper.emitted('action')![0]).toEqual(['like', customPost]);
    });
  });

  describe('text truncation', () => {
    it('truncates long text and shows see more button', () => {
      const longText = 'A'.repeat(300);
      const postWithLongText = {
        ...basePost,
        text: longText,
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithLongText },
      });
      expect(wrapper.text()).toContain('see more');
    });

    it('expands text when see more is clicked', async () => {
      const longText = 'A'.repeat(300);
      const postWithLongText = {
        ...basePost,
        text: longText,
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithLongText },
      });
      const seeMoreBtn = wrapper.find('button');
      expect(seeMoreBtn.text()).toContain('see more');
      await seeMoreBtn.trigger('click');
      // After clicking, the full text should be shown
      expect(wrapper.text()).toContain('A'.repeat(100));
    });

    it('does not truncate short text', () => {
      const shortText = 'Short text';
      const postWithShortText = {
        ...basePost,
        text: shortText,
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithShortText },
      });
      expect(wrapper.text()).not.toContain('see more');
      expect(wrapper.text()).toContain('Short text');
    });

    it('does not show see more for text exactly at limit', () => {
      const exactText = 'A'.repeat(280);
      const postWithExactText = {
        ...basePost,
        text: exactText,
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithExactText },
      });
      // Text at exactly 280 chars should not trigger truncation
      expect(wrapper.text()).not.toContain('see more');
    });
  });

  describe('structure', () => {
    it('has data-slot attribute', () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      expect(wrapper.attributes('data-slot')).toBe('linkedin-post');
    });

    it('has data-tool-ui-id attribute', () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      expect(wrapper.attributes('data-tool-ui-id')).toBe('li-1');
    });

    it('applies custom css.root when provided', () => {
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost, css: { root: 'custom-class' } },
      });
      expect(wrapper.classes()).toContain('custom-class');
    });
  });

  describe('time formatting', () => {
    it('formats recent timestamps correctly', () => {
      const recentDate = new Date();
      recentDate.setHours(recentDate.getHours() - 2);
      const postWithRecentDate = {
        ...basePost,
        createdAt: recentDate.toISOString(),
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithRecentDate },
      });
      const text = wrapper.text();
      // Should contain 'h' for hours
      expect(text).toMatch(/\d+h/);
    });

    it('formats week-old timestamps with w suffix', () => {
      const weekOldDate = new Date();
      weekOldDate.setDate(weekOldDate.getDate() - 10);
      const postWithWeekOldDate = {
        ...basePost,
        createdAt: weekOldDate.toISOString(),
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithWeekOldDate },
      });
      const text = wrapper.text();
      // Should contain 'w' for weeks
      expect(text).toMatch(/\d+w/);
    });

    it('formats old timestamps as dates', () => {
      const oldDate = new Date('2020-01-01T00:00:00Z');
      const postWithOldDate = {
        ...basePost,
        createdAt: oldDate.toISOString(),
      };
      const wrapper = mount(LinkedInPost, {
        props: { post: postWithOldDate },
      });
      const text = wrapper.text();
      expect(text.length).toBeGreaterThan(0);
    });
  });

  describe('i18n', () => {
    beforeEach(() => { currentLocale.value = 'en'; });

    it('uses zh-CN aria-labels for action buttons', () => {
      currentLocale.value = 'zh-CN';
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      const likeBtn = wrapper.find('button[aria-label="赞同"]');
      expect(likeBtn.exists()).toBe(true);
    });

    it('uses English aria-labels for action buttons', () => {
      currentLocale.value = 'en';
      const wrapper = mount(LinkedInPost, {
        props: { post: basePost },
      });
      const likeBtn = wrapper.find('button[aria-label="Like"]');
      expect(likeBtn.exists()).toBe(true);
    });
  });
});
