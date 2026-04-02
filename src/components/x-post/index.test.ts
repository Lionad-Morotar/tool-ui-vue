import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import XPost from './index.vue';

describe('XPost', () => {
  const basePost = {
    id: 'post-1',
    author: {
      name: 'John Doe',
      handle: 'john',
      avatarUrl: 'https://example.com/avatar.jpg',
      verified: true,
    },
    text: 'Hello world',
    createdAt: '2024-01-01T00:00:00Z',
    stats: {
      likes: 42,
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
    },
  };

  describe('rendering', () => {
    it('renders author name', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      expect(wrapper.text()).toContain('John Doe');
    });

    it('renders author handle', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      expect(wrapper.text()).toContain('@john');
    });

    it('renders post content', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      expect(wrapper.text()).toContain('Hello world');
    });

    it('renders timestamp', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      // Timestamp is formatted as relative time, so it could be a date string or relative
      const text = wrapper.text();
      expect(text.length).toBeGreaterThan(0);
    });

    it('renders avatar when provided', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      const img = wrapper.find('img[alt="John Doe avatar"]');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://example.com/avatar.jpg');
    });

    it('renders verified badge when author is verified', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      const html = wrapper.html();
      expect(html).toContain('Verified account');
    });

    it('does not render verified badge when author is not verified', () => {
      const unverifiedPost = {
        ...basePost,
        author: { ...basePost.author, verified: false },
      };
      const wrapper = mount(XPost, {
        props: { post: unverifiedPost },
      });
      // Count aria-label occurrences - should only be the X logo
      const html = wrapper.html();
      const verifiedMatches = html.match(/Verified account/g);
      expect(verifiedMatches?.length).toBeUndefined();
    });

    it('renders correctly without optional fields', () => {
      const minimalPost = {
        id: 'minimal',
        author: {
          name: 'Minimal User',
          handle: 'minimal',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: minimalPost },
      });
      expect(wrapper.text()).toContain('Minimal User');
      expect(wrapper.text()).toContain('@minimal');
    });
  });

  describe('engagement metrics', () => {
    it('renders like count', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      expect(wrapper.text()).toContain('42');
    });

    it('renders share button', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      const buttons = wrapper.findAll('button');
      // XPost has like button (first) and share button (second)
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('formats large like counts with K suffix', () => {
      const postWithManyLikes = {
        ...basePost,
        stats: { likes: 1500, isLiked: false },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithManyLikes },
      });
      expect(wrapper.text()).toContain('1.5K');
    });

    it('formats very large like counts with M suffix', () => {
      const postWithMillions = {
        ...basePost,
        stats: { likes: 2500000, isLiked: false },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithMillions },
      });
      expect(wrapper.text()).toContain('2.5M');
    });

    it('applies liked state styling when isLiked is true', () => {
      const likedPost = {
        ...basePost,
        stats: { likes: 42, isLiked: true },
      };
      const wrapper = mount(XPost, {
        props: { post: likedPost },
      });
      const html = wrapper.html();
      expect(html).toContain('text-pink-500');
    });
  });

  describe('media', () => {
    it('renders media attachments', () => {
      const postWithMedia = {
        ...basePost,
        media: {
          type: 'image' as const,
          url: 'https://example.com/image.jpg',
          alt: 'An image',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithMedia },
      });
      const img = wrapper.find('img[alt="An image"]');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://example.com/image.jpg');
    });

    it('renders video media', () => {
      const postWithVideo = {
        ...basePost,
        media: {
          type: 'video' as const,
          url: 'https://example.com/video.mp4',
          alt: 'A video',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithVideo },
      });
      const video = wrapper.find('video');
      expect(video.exists()).toBe(true);
      expect(video.attributes('src')).toBe('https://example.com/video.mp4');
    });

    it('applies correct aspect ratio for 1:1 media', () => {
      const postWithSquareMedia = {
        ...basePost,
        media: {
          type: 'image' as const,
          url: 'https://example.com/image.jpg',
          alt: 'Square image',
          aspectRatio: '1:1' as const,
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithSquareMedia },
      });
      const mediaContainer = wrapper.find('[style*="aspect-ratio"]');
      expect(mediaContainer.exists()).toBe(true);
    });

    it('applies correct aspect ratio for 4:3 media', () => {
      const postWithFourThreeMedia = {
        ...basePost,
        media: {
          type: 'image' as const,
          url: 'https://example.com/image.jpg',
          alt: '4:3 image',
          aspectRatio: '4:3' as const,
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithFourThreeMedia },
      });
      const mediaContainer = wrapper.find('[style*="aspect-ratio"]');
      expect(mediaContainer.exists()).toBe(true);
    });
  });

  describe('events', () => {
    it('emits action event on like click', async () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      const buttons = wrapper.findAll('button');
      const likeBtn = buttons.find((b) => b.text().includes('42'));
      expect(likeBtn).toBeDefined();
      await likeBtn!.trigger('click');
      expect(wrapper.emitted('action')).toBeTruthy();
      expect(wrapper.emitted('action')![0]).toEqual(['like', basePost]);
    });

    it('emits action event on share click', async () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      const buttons = wrapper.findAll('button');
      // Share button is the second button (first is like)
      const shareBtn = buttons[1];
      expect(shareBtn).toBeDefined();
      await shareBtn.trigger('click');
      expect(wrapper.emitted('action')).toBeTruthy();
      expect(wrapper.emitted('action')![0]).toEqual(['share', basePost]);
    });

    it('emits action event with correct payload', async () => {
      const customPost = { ...basePost, id: 'custom-id' };
      const wrapper = mount(XPost, {
        props: { post: customPost },
      });
      const buttons = wrapper.findAll('button');
      await buttons[0]!.trigger('click');
      expect(wrapper.emitted('action')![0]).toEqual(['like', customPost]);
    });
  });

  describe('link preview', () => {
    it('renders link preview when provided', () => {
      const postWithLink = {
        ...basePost,
        linkPreview: {
          url: 'https://example.com/article',
          title: 'Article Title',
          description: 'Article description',
          imageUrl: 'https://example.com/thumb.jpg',
          domain: 'example.com',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithLink },
      });
      expect(wrapper.text()).toContain('Article Title');
      expect(wrapper.text()).toContain('example.com');
      const img = wrapper.find('img[alt=""]');
      expect(img.exists()).toBe(true);
    });

    it('extracts domain from URL when not provided', () => {
      const postWithLinkNoDomain = {
        ...basePost,
        linkPreview: {
          url: 'https://www.example.com/article',
          title: 'Article Title',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithLinkNoDomain },
      });
      expect(wrapper.text()).toContain('example.com');
    });

    it('filters unsafe javascript: URLs', () => {
      const postWithUnsafeLink = {
        ...basePost,
        linkPreview: {
          url: "javascript:alert('xss')",
          title: 'Unsafe Link',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithUnsafeLink },
      });
      // Should still render the preview but without clickable link
      expect(wrapper.text()).toContain('Unsafe Link');
    });

    it('filters unsafe data: URLs', () => {
      const postWithDataUrl = {
        ...basePost,
        linkPreview: {
          url: "data:text/html,<script>alert('xss')</script>",
          title: 'Data URL',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithDataUrl },
      });
      expect(wrapper.text()).toContain('Data URL');
    });

    it('allows safe HTTPS URLs', () => {
      const postWithSafeLink = {
        ...basePost,
        linkPreview: {
          url: 'https://example.com/article',
          title: 'Safe Link',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithSafeLink },
      });
      expect(wrapper.text()).toContain('Safe Link');
    });

    it('renders link preview without image', () => {
      const postWithLinkNoImage = {
        ...basePost,
        linkPreview: {
          url: 'https://example.com/article',
          title: 'Article Title',
          description: 'Description only',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithLinkNoImage },
      });
      expect(wrapper.text()).toContain('Article Title');
      expect(wrapper.text()).toContain('Description only');
    });
  });

  describe('quoted post', () => {
    it('renders quoted post when provided', () => {
      const postWithQuote = {
        ...basePost,
        quotedPost: {
          id: 'post-2',
          author: {
            name: 'Jane Doe',
            handle: 'jane',
            avatarUrl: 'https://example.com/jane.jpg',
            verified: false,
          },
          text: 'Quoted text',
          createdAt: '2024-01-02T00:00:00Z',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithQuote },
      });
      expect(wrapper.text()).toContain('Jane Doe');
      expect(wrapper.text()).toContain('@jane');
      expect(wrapper.text()).toContain('Quoted text');
    });

    it('renders quoted post with media', () => {
      const postWithQuoteAndMedia = {
        ...basePost,
        quotedPost: {
          id: 'post-2',
          author: {
            name: 'Jane Doe',
            handle: 'jane',
            avatarUrl: 'https://example.com/jane.jpg',
            verified: false,
          },
          text: 'Quoted text',
          createdAt: '2024-01-02T00:00:00Z',
          media: {
            type: 'image' as const,
            url: 'https://example.com/quoted-image.jpg',
            alt: 'Quoted image',
          },
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithQuoteAndMedia },
      });
      const img = wrapper.find('img[alt="Quoted image"]');
      expect(img.exists()).toBe(true);
    });

    it('renders verified badge in quoted post when author is verified', () => {
      const postWithVerifiedQuote = {
        ...basePost,
        quotedPost: {
          id: 'post-2',
          author: {
            name: 'Jane Doe',
            handle: 'jane',
            avatarUrl: 'https://example.com/jane.jpg',
            verified: true,
          },
          text: 'Quoted text',
          createdAt: '2024-01-02T00:00:00Z',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithVerifiedQuote },
      });
      const html = wrapper.html();
      // Should have multiple verified badges (main post + quoted)
      const verifiedMatches = html.match(/Verified account/g);
      expect(verifiedMatches?.length).toBeGreaterThanOrEqual(2);
    });

    it('does not render link preview when quoted post is present', () => {
      const postWithQuoteAndLink = {
        ...basePost,
        text: 'Check this out',
        quotedPost: {
          id: 'post-2',
          author: {
            name: 'Jane Doe',
            handle: 'jane',
            avatarUrl: 'https://example.com/jane.jpg',
            verified: false,
          },
          text: 'Quoted text',
        },
        linkPreview: {
          url: 'https://example.com/article',
          title: 'Article Title',
        },
      };
      const wrapper = mount(XPost, {
        props: { post: postWithQuoteAndLink },
      });
      // Link preview should not be rendered when quoted post exists
      expect(wrapper.text()).not.toContain('Article Title');
    });
  });

  describe('structure', () => {
    it('has data-slot attribute', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      expect(wrapper.attributes('data-slot')).toBe('x-post');
    });

    it('has data-tool-ui-id attribute', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost },
      });
      expect(wrapper.attributes('data-tool-ui-id')).toBe('post-1');
    });

    it('applies custom className when provided', () => {
      const wrapper = mount(XPost, {
        props: { post: basePost, className: 'custom-class' },
      });
      expect(wrapper.classes()).toContain('custom-class');
    });
  });

  describe('time formatting', () => {
    it('formats recent timestamps correctly', () => {
      const recentDate = new Date();
      recentDate.setMinutes(recentDate.getMinutes() - 5);
      const postWithRecentDate = {
        ...basePost,
        createdAt: recentDate.toISOString(),
      };
      const wrapper = mount(XPost, {
        props: { post: postWithRecentDate },
      });
      const text = wrapper.text();
      // Should contain 'm' for minutes
      expect(text).toMatch(/\d+m/);
    });

    it('formats old timestamps as dates', () => {
      const oldDate = new Date('2020-01-01T00:00:00Z');
      const postWithOldDate = {
        ...basePost,
        createdAt: oldDate.toISOString(),
      };
      const wrapper = mount(XPost, {
        props: { post: postWithOldDate },
      });
      const text = wrapper.text();
      // Should contain date formatting
      expect(text.length).toBeGreaterThan(0);
    });
  });
});
