// @vitest-environment jsdom
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";

/**
 * E2E Test: Playground Loads
 *
 * Verifies the playground entry point loads without errors.
 */

describe("E2E: Playground Loads", () => {
  describe("component imports", () => {
    test("playground App.vue can be imported and mounted", async () => {
      const { default: App } = await import("../App.vue");

      // App should be a valid Vue component
      expect(App).toBeDefined();
      expect(typeof App).toBe("object");

      // Should be able to mount it
      const wrapper = mount(App);
      expect(wrapper.exists()).toBe(true);

      // Should render the expected structure
      expect(wrapper.find("header").exists()).toBe(true);
      expect(wrapper.find("main").exists()).toBe(true);
    });

    test("playground renders gallery layout", async () => {
      const { default: App } = await import("../App.vue");
      const wrapper = mount(App);

      // Should have the gallery title
      expect(wrapper.text()).toContain("Component Gallery");
      expect(wrapper.text()).toContain("tool-ui-vue");

      // Should render component cards
      const cards = wrapper.findAll("article");
      expect(cards.length).toBeGreaterThan(0);
    });

    test("playground imports all 27 components", async () => {
      // This test verifies the playground can import all components
      // If any import fails, the test will fail
      const { default: App } = await import("../App.vue");
      const wrapper = mount(App);

      // Verify the app mounted successfully
      expect(wrapper.element).toBeTruthy();

      // Count gallery cards (should be around 27-28)
      const cards = wrapper.findAll("article");
      expect(cards.length).toBeGreaterThanOrEqual(27);
    });
  });

  describe("main entry point", () => {
    // Create a container for the app
    let appContainer: HTMLDivElement;
    let originalGetElementById: typeof document.getElementById;

    beforeEach(() => {
      // Create app container
      appContainer = document.createElement("div");
      appContainer.id = "app";
      document.body.appendChild(appContainer);

      // Store original method
      originalGetElementById = document.getElementById;

      // Mock getElementById to return our container
      document.getElementById = vi.fn((id: string) => {
        if (id === "app") {
          return appContainer;
        }
        return originalGetElementById.call(document, id);
      });
    });

    afterEach(() => {
      // Restore original method
      document.getElementById = originalGetElementById;

      // Clean up container
      if (appContainer.parentNode) {
        appContainer.parentNode.removeChild(appContainer);
      }
    });

    test("playground main.ts imports successfully", async () => {
      // This test verifies the main entry point can be imported without errors
      // The main.ts creates and mounts the app, which requires #app to exist
      const main = await import("../main");
      expect(main).toBeDefined();

      // Verify the app was mounted to our container
      expect(appContainer.childElementCount).toBeGreaterThan(0);
    });
  });
});
