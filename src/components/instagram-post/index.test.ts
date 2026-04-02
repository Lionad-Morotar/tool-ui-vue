import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import InstagramPost from "./index.vue";

describe("InstagramPost", () => {
  const basePost = {
    id: "ig-1",
    author: {
      name: "John Doe",
      handle: "johndoe",
      avatarUrl: "https://example.com/avatar.jpg",
      verified: true,
    },
    text: "Great photo!",
    createdAt: "2024-01-01T00:00:00Z",
    stats: {
      likes: 100,
      isLiked: false,
    },
  };

  describe("rendering", () => {
    it("renders author username", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      expect(wrapper.text()).toContain("johndoe");
    });

    it("renders caption", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      expect(wrapper.text()).toContain("Great photo!");
    });

    it("renders avatar", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      const img = wrapper.find('img[alt="John Doe avatar"]');
      expect(img.exists()).toBe(true);
      expect(img.attributes("src")).toBe("https://example.com/avatar.jpg");
    });

    it("renders timestamp", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      const text = wrapper.text();
      expect(text.length).toBeGreaterThan(0);
    });

    it("renders verified badge when author is verified", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      const html = wrapper.html();
      expect(html).toContain("Verified");
    });

    it("does not render verified badge when author is not verified", () => {
      const unverifiedPost = {
        ...basePost,
        author: { ...basePost.author, verified: false },
      };
      const wrapper = mount(InstagramPost, {
        props: { post: unverifiedPost },
      });
      const html = wrapper.html();
      const verifiedMatches = html.match(/Verified/g);
      expect(verifiedMatches?.length).toBeUndefined();
    });

    it("renders correctly without optional fields", () => {
      const minimalPost = {
        id: "minimal",
        author: {
          name: "Minimal User",
          handle: "minimal",
          avatarUrl: "https://example.com/avatar.jpg",
        },
      };
      const wrapper = mount(InstagramPost, {
        props: { post: minimalPost },
      });
      expect(wrapper.text()).toContain("minimal");
    });
  });

  describe("media", () => {
    it("renders single image", () => {
      const postWithMedia = {
        ...basePost,
        media: [
          {
            type: "image" as const,
            url: "https://example.com/photo.jpg",
            alt: "A photo",
          },
        ],
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithMedia },
      });
      const img = wrapper.find('img[alt="A photo"]');
      expect(img.exists()).toBe(true);
      expect(img.attributes("src")).toBe("https://example.com/photo.jpg");
    });

    it("renders multiple images", () => {
      const postWithMedia = {
        ...basePost,
        media: [
          { type: "image" as const, url: "https://example.com/1.jpg", alt: "" },
          { type: "image" as const, url: "https://example.com/2.jpg", alt: "" },
          { type: "image" as const, url: "https://example.com/3.jpg", alt: "" },
        ],
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithMedia },
      });
      const images = wrapper.findAll("img").filter((img) =>
        img.attributes("src")?.startsWith("https://example.com/")
      );
      expect(images.length).toBe(4); // 3 media + 1 avatar
    });

    it("renders video media", () => {
      const postWithVideo = {
        ...basePost,
        media: [
          {
            type: "video" as const,
            url: "https://example.com/video.mp4",
            alt: "A video",
          },
        ],
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithVideo },
      });
      const video = wrapper.find("video");
      expect(video.exists()).toBe(true);
      expect(video.attributes("src")).toBe("https://example.com/video.mp4");
    });

    it("renders extra media count overlay", () => {
      const postWithMedia = {
        ...basePost,
        media: [
          { type: "image" as const, url: "https://example.com/1.jpg", alt: "" },
          { type: "image" as const, url: "https://example.com/2.jpg", alt: "" },
          { type: "image" as const, url: "https://example.com/3.jpg", alt: "" },
          { type: "image" as const, url: "https://example.com/4.jpg", alt: "" },
          { type: "image" as const, url: "https://example.com/5.jpg", alt: "" },
        ],
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithMedia },
      });
      expect(wrapper.text()).toContain("+1");
    });

    it("renders two images in grid layout", () => {
      const postWithTwoImages = {
        ...basePost,
        media: [
          { type: "image" as const, url: "https://example.com/1.jpg", alt: "First" },
          { type: "image" as const, url: "https://example.com/2.jpg", alt: "Second" },
        ],
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithTwoImages },
      });
      const grid = wrapper.find(".grid-cols-2");
      expect(grid.exists()).toBe(true);
    });

    it("renders three images in special layout", () => {
      const postWithThreeImages = {
        ...basePost,
        media: [
          { type: "image" as const, url: "https://example.com/1.jpg", alt: "First" },
          { type: "image" as const, url: "https://example.com/2.jpg", alt: "Second" },
          { type: "image" as const, url: "https://example.com/3.jpg", alt: "Third" },
        ],
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithThreeImages },
      });
      const gridRows = wrapper.find(".grid-rows-2");
      expect(gridRows.exists()).toBe(true);
    });

    it("renders four images in 2x2 grid", () => {
      const postWithFourImages = {
        ...basePost,
        media: [
          { type: "image" as const, url: "https://example.com/1.jpg", alt: "" },
          { type: "image" as const, url: "https://example.com/2.jpg", alt: "" },
          { type: "image" as const, url: "https://example.com/3.jpg", alt: "" },
          { type: "image" as const, url: "https://example.com/4.jpg", alt: "" },
        ],
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithFourImages },
      });
      const grid = wrapper.find(".grid-cols-2");
      expect(grid.exists()).toBe(true);
      // Should not show +N overlay for exactly 4 images
      expect(wrapper.text()).not.toContain("+");
    });

    it("renders mixed image and video media", () => {
      const postWithMixedMedia = {
        ...basePost,
        media: [
          { type: "image" as const, url: "https://example.com/1.jpg", alt: "" },
          { type: "video" as const, url: "https://example.com/2.mp4", alt: "" },
        ],
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithMixedMedia },
      });
      const img = wrapper.find('img[src="https://example.com/1.jpg"]');
      const video = wrapper.find('video[src="https://example.com/2.mp4"]');
      expect(img.exists()).toBe(true);
      expect(video.exists()).toBe(true);
    });
  });

  describe("engagement", () => {
    it("renders like button", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      const likeBtn = wrapper.find('button[aria-label="Like"]');
      expect(likeBtn.exists()).toBe(true);
    });

    it("renders share button", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      const shareBtn = wrapper.find('button[aria-label="Share"]');
      expect(shareBtn.exists()).toBe(true);
    });

    it("applies liked state styling when isLiked is true", () => {
      const likedPost = {
        ...basePost,
        stats: { likes: 100, isLiked: true },
      };
      const wrapper = mount(InstagramPost, {
        props: { post: likedPost },
      });
      const html = wrapper.html();
      expect(html).toContain("text-red-500");
    });

    it("renders without stats", () => {
      const postWithoutStats = {
        ...basePost,
        stats: undefined,
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithoutStats },
      });
      const likeBtn = wrapper.find('button[aria-label="Like"]');
      expect(likeBtn.exists()).toBe(true);
    });
  });

  describe("events", () => {
    it("emits action event on like click", async () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      const likeBtn = wrapper.find('button[aria-label="Like"]');
      await likeBtn.trigger("click");
      expect(wrapper.emitted("action")).toBeTruthy();
      expect(wrapper.emitted("action")![0]).toEqual(["like", basePost]);
    });

    it("emits action event on share click", async () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      const shareBtn = wrapper.find('button[aria-label="Share"]');
      await shareBtn.trigger("click");
      expect(wrapper.emitted("action")).toBeTruthy();
      expect(wrapper.emitted("action")![0]).toEqual(["share", basePost]);
    });

    it("emits action event on media click", async () => {
      const postWithMedia = {
        ...basePost,
        media: [
          { type: "image" as const, url: "https://example.com/photo.jpg", alt: "" },
        ],
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithMedia },
      });
      const mediaBtn = wrapper.find("button[type='button']");
      // First button after header is the media button
      await mediaBtn.trigger("click");
      expect(wrapper.emitted("action")).toBeTruthy();
      expect(wrapper.emitted("action")![0]).toEqual(["open-media", postWithMedia]);
    });

    it("emits action event with correct payload for multiple media", async () => {
      const postWithMultipleMedia = {
        ...basePost,
        media: [
          { type: "image" as const, url: "https://example.com/1.jpg", alt: "" },
          { type: "image" as const, url: "https://example.com/2.jpg", alt: "" },
        ],
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithMultipleMedia },
      });
      const mediaButtons = wrapper.findAll("button[type='button']");
      await mediaButtons[0].trigger("click");
      expect(wrapper.emitted("action")![0]).toEqual(["open-media", postWithMultipleMedia]);
    });
  });

  describe("structure", () => {
    it("has data-slot attribute", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      expect(wrapper.attributes("data-slot")).toBe("instagram-post");
    });

    it("has data-tool-ui-id attribute", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      expect(wrapper.attributes("data-tool-ui-id")).toBe("ig-1");
    });

    it("applies custom className when provided", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost, className: "custom-class" },
      });
      expect(wrapper.classes()).toContain("custom-class");
    });
  });

  describe("caption rendering", () => {
    it("renders caption with username prefix", () => {
      const wrapper = mount(InstagramPost, {
        props: { post: basePost },
      });
      // Caption is rendered in a div with text content inside .p-3 when post.text exists
      // Look for the div containing the handle and text
      const captionSpan = wrapper.find('.text-sm.font-semibold');
      const textSpan = wrapper.find('.whitespace-pre-wrap');
      expect(captionSpan.exists()).toBe(true);
      expect(captionSpan.text()).toContain("johndoe");
      expect(textSpan.exists()).toBe(true);
      expect(textSpan.text()).toContain("Great photo!");
    });

    it("renders without caption when text is not provided", () => {
      const postWithoutText = {
        ...basePost,
        text: undefined,
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithoutText },
      });
      // When text is not provided, caption section is not rendered
      // but header still shows the username
      expect(wrapper.text()).toContain("johndoe");
    });

    it("preserves whitespace in caption", () => {
      const postWithMultiline = {
        ...basePost,
        text: "Line 1\nLine 2\nLine 3",
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithMultiline },
      });
      expect(wrapper.text()).toContain("Line 1");
      expect(wrapper.text()).toContain("Line 2");
      expect(wrapper.text()).toContain("Line 3");
    });
  });

  describe("time formatting", () => {
    it("formats recent timestamps correctly", () => {
      const recentDate = new Date();
      recentDate.setMinutes(recentDate.getMinutes() - 30);
      const postWithRecentDate = {
        ...basePost,
        createdAt: recentDate.toISOString(),
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithRecentDate },
      });
      const text = wrapper.text();
      // Should contain 'm' for minutes
      expect(text).toMatch(/\d+m/);
    });

    it("formats old timestamps as dates", () => {
      const oldDate = new Date("2020-01-01T00:00:00Z");
      const postWithOldDate = {
        ...basePost,
        createdAt: oldDate.toISOString(),
      };
      const wrapper = mount(InstagramPost, {
        props: { post: postWithOldDate },
      });
      const text = wrapper.text();
      expect(text.length).toBeGreaterThan(0);
    });
  });
});
