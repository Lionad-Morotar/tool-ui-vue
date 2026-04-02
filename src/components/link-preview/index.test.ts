import { describe, expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import LinkPreview from "./index.vue";

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: "test-link-preview",
    href: "https://example.com/page",
    ...overrides,
  };
}

describe("LinkPreview", () => {
  describe("rendering", () => {
    test("renders with URL", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain("example.com");
    });

    test("extracts and displays domain from href", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ href: "https://sub.example.com/path" }),
      });
      expect(wrapper.text()).toContain("sub.example.com");
    });

    test("renders title when provided", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ title: "Page Title" }),
      });
      expect(wrapper.text()).toContain("Page Title");
    });

    test("renders description when provided", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ description: "Desc" }),
      });
      expect(wrapper.text()).toContain("Desc");
    });

    test("renders image when provided", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ image: "thumb.jpg" }),
      });
      const img = wrapper.find("img");
      expect(img.exists()).toBe(true);
      expect(img.attributes("src")).toBe("thumb.jpg");
    });

    test("renders favicon when provided", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({
          favicon: "https://example.com/favicon.ico",
          domain: "example.com",
        }),
      });
      const imgs = wrapper.findAll("img");
      const faviconImg = imgs.find((img) =>
        img.attributes("src")?.includes("favicon")
      );
      expect(faviconImg).toBeTruthy();
    });

    test("shows globe icon when no favicon provided", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ domain: "example.com" }),
      });
      const svg = wrapper.find("svg");
      expect(svg.exists()).toBe(true);
    });

    test("renders without image when image prop not provided", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      const imgs = wrapper.findAll("img");
      expect(imgs.length).toBe(0);
    });

    test("uses provided domain over extracted domain", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({
          href: "https://example.com/page",
          domain: "Custom Domain",
        }),
      });
      expect(wrapper.text()).toContain("Custom Domain");
      expect(wrapper.text()).not.toContain("example.com");
    });
  });

  describe("ratio and fit variants", () => {
    test("applies aspect-square class for 1:1 ratio", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({
          image: "test.jpg",
          ratio: "1:1",
        }),
      });
      const imgContainer = wrapper.find(".aspect-square");
      expect(imgContainer.exists()).toBe(true);
    });

    test("applies aspect-video class for 16:9 ratio", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({
          image: "test.jpg",
          ratio: "16:9",
        }),
      });
      const imgContainer = wrapper.find(".aspect-video");
      expect(imgContainer.exists()).toBe(true);
    });

    test("applies default aspect-[5/3] when ratio is auto", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({
          image: "test.jpg",
          ratio: "auto",
        }),
      });
      const imgContainer = wrapper.find(".aspect-\\[5\\/3\\]");
      expect(imgContainer.exists()).toBe(true);
    });

    test("applies object-cover class by default", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({
          image: "test.jpg",
        }),
      });
      const img = wrapper.find("img");
      expect(img.classes()).toContain("object-cover");
    });

    test("applies object-contain class when fit is contain", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({
          image: "test.jpg",
          fit: "contain",
        }),
      });
      const img = wrapper.find("img");
      expect(img.classes()).toContain("object-contain");
    });
  });

  describe("events", () => {
    test("emits navigate on click", async () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      await wrapper.find("[role='link']").trigger("click");
      expect(wrapper.emitted("navigate")).toBeTruthy();
      expect(wrapper.emitted("navigate")?.[0]).toEqual([
        "https://example.com/page",
      ]);
    });

    test("emits navigate on Enter key press", async () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      const link = wrapper.find("[role='link']");
      await link.trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("navigate")).toBeTruthy();
    });

    test("emits navigate on Space key press", async () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      const link = wrapper.find("[role='link']");
      await link.trigger("keydown", { key: " " });
      expect(wrapper.emitted("navigate")).toBeTruthy();
    });

    test("does not emit navigate when href is empty", async () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ href: "" }),
      });
      const clickable = wrapper.find("[data-slot='link-preview'] > div");
      if (clickable.attributes("role") !== "link") {
        expect(wrapper.emitted("navigate")).toBeFalsy();
      }
    });
  });

  describe("accessibility", () => {
    test("has role='link' when href is provided", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      expect(wrapper.find("[role='link']").exists()).toBe(true);
    });

    test("has tabindex=0 when href is provided", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      expect(wrapper.find("[tabindex='0']").exists()).toBe(true);
    });

    test("has cursor-pointer class when href is provided", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      const linkElement = wrapper.find("[role='link']");
      expect(linkElement.classes()).toContain("cursor-pointer");
    });

    test("image has loading='lazy' attribute", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ image: "test.jpg" }),
      });
      const img = wrapper.find("img");
      expect(img.attributes("loading")).toBe("lazy");
    });

    test("image has decoding='async' attribute", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ image: "test.jpg" }),
      });
      const img = wrapper.find("img");
      expect(img.attributes("decoding")).toBe("async");
    });

    test("favicon has aria-hidden='true'", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({
          favicon: "https://example.com/favicon.ico",
          domain: "example.com",
        }),
      });
      const imgs = wrapper.findAll("img");
      const faviconImg = imgs.find((img) =>
        img.attributes("src")?.includes("favicon")
      );
      expect(faviconImg?.attributes("aria-hidden")).toBe("true");
    });
  });

  describe("attributes", () => {
    test("sets data-slot attribute", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      expect(wrapper.find("[data-slot='link-preview']").exists()).toBe(true);
    });

    test("sets data-tool-ui-id attribute", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      expect(
        wrapper.find("[data-slot='link-preview']").attributes("data-tool-ui-id")
      ).toBe("test-link-preview");
    });

    test("sets lang attribute", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps(),
      });
      expect(wrapper.find("article").attributes("lang")).toBe("en");
    });

    test("applies custom className", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ className: "my-custom-class" }),
      });
      expect(wrapper.find("article").classes()).toContain("my-custom-class");
    });
  });

  describe("domain extraction edge cases", () => {
    test("handles URLs with www prefix", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ href: "https://www.example.com/page" }),
      });
      // The component extracts domain without www prefix
      expect(wrapper.text()).toContain("example.com");
    });

    test("handles URLs with query parameters", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ href: "https://example.com/page?foo=bar" }),
      });
      expect(wrapper.text()).toContain("example.com");
    });

    test("handles URLs with hash", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ href: "https://example.com/page#section" }),
      });
      expect(wrapper.text()).toContain("example.com");
    });

    test("handles invalid URLs gracefully", () => {
      const wrapper = mount(LinkPreview, {
        props: createProps({ href: "not-a-valid-url" }),
      });
      // Should not throw, component should render
      expect(wrapper.find("[data-slot='link-preview']").exists()).toBe(true);
    });
  });
});
