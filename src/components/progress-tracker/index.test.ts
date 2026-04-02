import { describe, expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import ProgressTracker from "./index.vue";

const STEPS = [
  { id: "account", label: "Account", description: "Create account", status: "completed" as const },
  { id: "profile", label: "Profile", description: "Set up profile", status: "in-progress" as const },
  { id: "confirm", label: "Confirm", description: "Review", status: "pending" as const },
];

describe("rendering", () => {
  test("renders all steps", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    expect(wrapper.text()).toContain("Account");
    expect(wrapper.text()).toContain("Profile");
    expect(wrapper.text()).toContain("Confirm");
  });

  test("renders step descriptions", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    expect(wrapper.text()).toContain("Create account");
    expect(wrapper.text()).toContain("Set up profile");
    expect(wrapper.text()).toContain("Review");
  });

  test("renders connector lines between steps", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    const connectors = wrapper.findAll("[aria-hidden='true'].bg-border");
    expect(connectors.length).toBeGreaterThanOrEqual(2);
  });

  test("has correct data attributes", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    expect(wrapper.find('[data-slot="progress-tracker"]').exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="tracker-1"]').exists()).toBe(true);
  });
});

describe("current step highlighting", () => {
  test("highlights current step", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    const listItems = wrapper.findAll("li");
    const currentLi = listItems.find((li) => li.text().includes("Profile"));
    expect(currentLi?.attributes("aria-current")).toBe("step");
  });

  test("shows previous steps as completed", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    const completed = wrapper.findAll("span").filter((span) =>
      span.classes().includes("bg-primary") && span.classes().includes("text-primary-foreground")
    );
    expect(completed.length).toBeGreaterThanOrEqual(1);
  });

  test("shows future steps as pending", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    const pending = wrapper.findAll("span").filter((span) =>
      span.classes().includes("bg-card") && span.classes().includes("border-border")
    );
    expect(pending.length).toBeGreaterThanOrEqual(1);
  });

  test("updates highlight on currentStep change", async () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: [
          { id: "s1", label: "Step 1", status: "pending" as const },
          { id: "s2", label: "Step 2", status: "in-progress" as const },
        ],
      },
    });
    let listItems = wrapper.findAll("li");
    expect(listItems[1]?.attributes("aria-current")).toBe("step");

    await wrapper.setProps({
      steps: [
        { id: "s1", label: "Step 1", status: "in-progress" as const },
        { id: "s2", label: "Step 2", status: "pending" as const },
      ],
    });
    listItems = wrapper.findAll("li");
    expect(listItems[0]?.attributes("aria-current")).toBe("step");
    expect(listItems[1]?.attributes("aria-current")).toBeUndefined();
  });

  test("prioritizes in-progress step over failed", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: [
          { id: "s1", label: "Step 1", status: "completed" as const },
          { id: "s2", label: "Step 2", status: "failed" as const },
          { id: "s3", label: "Step 3", status: "in-progress" as const },
        ],
      },
    });
    const listItems = wrapper.findAll("li");
    // In-progress step should be marked as current (not failed)
    const inProgressLi = listItems.find((li) => li.text().includes("Step 3"));
    expect(inProgressLi?.attributes("aria-current")).toBe("step");
  });
});

describe("step statuses", () => {
  test("shows spinner for in-progress step", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    // Check for animate-spin class on the in-progress step
    const spinners = wrapper.findAll(".motion-safe\\:animate-spin");
    expect(spinners.length).toBeGreaterThanOrEqual(1);
  });

  test("shows checkmark for completed step", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: [
          { id: "s1", label: "Step 1", status: "completed" as const },
        ],
      },
    });
    // Should have the completed styling
    const completed = wrapper.findAll("span").filter((span) =>
      span.classes().includes("bg-primary") && span.classes().includes("text-primary-foreground")
    );
    expect(completed.length).toBeGreaterThanOrEqual(1);
  });

  test("shows X for failed step", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: [
          { id: "s1", label: "Step 1", status: "failed" as const },
        ],
      },
    });
    // Should have the destructive styling
    const failed = wrapper.findAll("span").filter((span) =>
      span.classes().includes("bg-destructive")
    );
    expect(failed.length).toBeGreaterThanOrEqual(1);
  });
});

describe("elapsed time", () => {
  test("shows elapsed time when provided", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: STEPS,
        elapsedTime: 5500,
      },
    });
    expect(wrapper.text()).toContain("5.5s");
  });

  test("formats elapsed time in minutes when over 60 seconds", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: STEPS,
        elapsedTime: 125000, // 2m 5s
      },
    });
    expect(wrapper.text()).toContain("2m 5s");
  });

  test("does not show elapsed time when not provided", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: STEPS,
      },
    });
    // Should not have the timer icon section
    expect(wrapper.find("time").exists()).toBe(false);
  });
});

describe("receipt state", () => {
  test("renders receipt view when choice provided", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: STEPS,
        choice: { outcome: "success" as const, summary: "All done", at: "2024-01-01T00:00:00Z" },
      },
    });
    expect(wrapper.find("[data-receipt='true']").exists()).toBe(true);
    expect(wrapper.text()).toContain("All done");
  });

  test("shows elapsed time in receipt", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: STEPS,
        elapsedTime: 5500,
        choice: { outcome: "success" as const, summary: "Done", at: "2024-01-01T00:00:00Z" },
      },
    });
    expect(wrapper.text()).toContain("5.5s");
  });

  test("receipt shows success styling", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: STEPS,
        choice: { outcome: "success" as const, summary: "All done", at: "2024-01-01T00:00:00Z" },
      },
    });
    // Should have emerald/success color class
    expect(wrapper.html()).toContain("text-emerald");
  });

  test("receipt shows partial styling", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: STEPS,
        choice: { outcome: "partial" as const, summary: "Partially done", at: "2024-01-01T00:00:00Z" },
      },
    });
    // Should have amber/warning color class
    expect(wrapper.html()).toContain("text-amber");
  });

  test("receipt shows failed styling", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: STEPS,
        choice: { outcome: "failed" as const, summary: "Failed", at: "2024-01-01T00:00:00Z" },
      },
    });
    // Should have destructive color class
    expect(wrapper.html()).toContain("text-destructive");
  });

  test("receipt shows cancelled styling", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: STEPS,
        choice: { outcome: "cancelled" as const, summary: "Cancelled", at: "2024-01-01T00:00:00Z" },
      },
    });
    // Should have muted color class
    expect(wrapper.html()).toContain("text-muted-foreground");
  });

  test("receipt has correct role and aria attributes", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: STEPS,
        choice: { outcome: "success" as const, summary: "All done", at: "2024-01-01T00:00:00Z" },
      },
    });
    const receipt = wrapper.find("[data-receipt='true']");
    expect(receipt.attributes("role")).toBe("status");
    expect(receipt.attributes("aria-label")).toBe("All done");
  });
});

describe("accessibility", () => {
  test("has aria-current on active step", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    const currentLi = wrapper.findAll("li").find((li) => li.attributes("aria-current") === "step");
    expect(currentLi).toBeTruthy();
  });

  test("has aria-busy attribute on live state", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    const article = wrapper.find("article");
    expect(article.attributes("aria-busy")).toBe("true");
  });

  test("has aria-live attribute", () => {
    const wrapper = mount(ProgressTracker, {
      props: { id: "tracker-1", steps: STEPS },
    });
    expect(wrapper.find("article").attributes("aria-live")).toBe("polite");
  });

  test("has aria-busy false when complete", () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        id: "tracker-1",
        steps: [
          { id: "s1", label: "Step 1", status: "completed" as const },
          { id: "s2", label: "Step 2", status: "completed" as const },
        ],
      },
    });
    const article = wrapper.find("article");
    expect(article.attributes("aria-busy")).toBe("false");
  });
});
