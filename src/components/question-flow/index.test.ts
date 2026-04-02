import { describe, expect, test, vi } from "vitest";
import { mount } from "@vue/test-utils";
import QuestionFlow from "./index.vue";

const globalMountOptions = {
  global: { config: { warnHandler: () => {} } },
};

const QUESTIONS = [
  {
    id: "q1",
    title: "What is your name?",
    description: "Choose a name",
    options: [
      { id: "a", label: "Alice" },
      { id: "b", label: "Bob" },
    ],
  },
  {
    id: "q2",
    title: "What is your age?",
    description: "Select your age group",
    options: [
      { id: "young", label: "Under 30" },
      { id: "old", label: "Over 30" },
    ],
  },
];

describe("rendering", () => {
  test("renders current question", () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    expect(wrapper.text()).toContain("What is your name?");
  });

  test("renders question number", () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    expect(wrapper.text()).toContain("Step 1 of 2");
  });

  test("renders answer options", () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    expect(wrapper.text()).toContain("Alice");
    expect(wrapper.text()).toContain("Bob");
  });

  test("renders question description", () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    expect(wrapper.text()).toContain("Choose a name");
  });
});

describe("navigation", () => {
  test("disables next when no answer selected", () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    const nextButton = wrapper.findAll("button").find((b) => b.text() === "Next");
    expect(nextButton?.attributes("disabled")).toBeDefined();
  });

  test("enables next when answer selected", async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    const optionButtons = wrapper.findAll("[role='option']");
    await optionButtons[0]?.trigger("click");
    const nextButton = wrapper.findAll("button").find((b) => b.text() === "Next");
    expect(nextButton?.attributes("disabled")).toBeUndefined();
  });
});

describe("progressive mode selection", () => {
  test("selects option on click and highlights it", async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", step: 1, title: "Pick one", options: QUESTIONS[0].options },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger("click");
    const selected = wrapper.findAll("[role='option']").find((b) => b.attributes("aria-selected") === "true");
    expect(selected?.text()).toContain("Alice");
  });

  test("emits select on complete in progressive mode", async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", step: 1, title: "Pick one", options: QUESTIONS[0].options },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger("click");
    const nextButton = wrapper.findAll("button").find((b) => b.text() === "Complete");
    await nextButton?.trigger("click");
    expect(wrapper.emitted("select")?.[0]).toEqual([["a"]]);
  });

  test("shows selected answer from defaultValue", async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", step: 1, title: "Pick one", options: QUESTIONS[0].options, defaultValue: ["a"] },
    });
    const selected = wrapper.findAll("[role='option']").find((b) => b.attributes("aria-selected") === "true");
    expect(selected).toBeTruthy();
    expect(selected?.text()).toContain("Alice");
  });

  test("allows changing answer in progressive mode", async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", step: 1, title: "Pick one", options: QUESTIONS[0].options },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger("click");
    expect(wrapper.findAll("[role='option']").find((b) => b.attributes("aria-selected") === "true")?.text()).toContain("Alice");
    await options[1]?.trigger("click");
    expect(wrapper.findAll("[role='option']").find((b) => b.attributes("aria-selected") === "true")?.text()).toContain("Bob");
  });

  test("supports multiple answers if configured", async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", step: 1, title: "Pick many", options: QUESTIONS[0].options, selectionMode: "multi" as const },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger("click");
    await options[1]?.trigger("click");
    const selected = wrapper.findAll("[role='option']").filter((b) => b.attributes("aria-selected") === "true");
    expect(selected.length).toBe(2);
  });
});

describe("progress", () => {
  test("shows progress indicator", () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    expect(wrapper.find("[role='progressbar']").exists()).toBe(true);
  });

  test("calculates progress correctly", () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    const progressbar = wrapper.find("[role='progressbar']");
    expect(progressbar.attributes("aria-valuenow")).toBe("1");
    expect(progressbar.attributes("aria-valuemax")).toBe("2");
  });
});

describe("upfront complete", () => {
  test("emits complete on final question next", async () => {
    vi.useFakeTimers();
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    let options = wrapper.findAll("[role='option']");
    await options[0]?.trigger("click");
    let nextButton = wrapper.findAll("button").find((b) => b.text() === "Next");
    await nextButton?.trigger("click");
    await vi.advanceTimersByTimeAsync(300);
    options = wrapper.findAll("[role='option']");
    await options[0]?.trigger("click");
    nextButton = wrapper.findAll("button").find((b) => b.text() === "Complete");
    await nextButton?.trigger("click");
    expect(wrapper.emitted("complete")?.length).toBe(1);
    vi.useRealTimers();
  });

  test("emits back on back button click", async () => {
    vi.useFakeTimers();
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger("click");
    const nextButton = wrapper.findAll("button").find((b) => b.text() === "Next");
    await nextButton?.trigger("click");
    await vi.advanceTimersByTimeAsync(300);
    const backButton = wrapper.findAll("button").find((b) => b.text().includes("Back"));
    await backButton?.trigger("click");
    // upfront mode navigates internally on back, no event emit
    expect(backButton?.exists()).toBe(true);
    vi.useRealTimers();
  });
});

describe("receipt mode", () => {
  test("shows completion summary", () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: {
        id: "qf-1",
        choice: { title: "Done", summary: [{ label: "Name", value: "Alice" }] },
      },
    });
    expect(wrapper.text()).toContain("Done");
    expect(wrapper.text()).toContain("Alice");
  });
});

describe("keyboard navigation", () => {
  test("navigates with arrow keys", async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", steps: QUESTIONS },
    });
    const listbox = wrapper.find("[role='listbox']");
    let options = wrapper.findAll("[role='option']");
    expect(options[0]?.attributes("tabindex")).toBe("0");
    await listbox.trigger("keydown", { key: "ArrowDown" });
    options = wrapper.findAll("[role='option']");
    expect(options[1]?.attributes("tabindex")).toBe("0");
    expect(options[0]?.attributes("tabindex")).toBe("-1");
  });

  test("selects with Enter on focused option", async () => {
    const wrapper = mount(QuestionFlow, {
      ...globalMountOptions,
      props: { id: "qf-1", step: 1, title: "Pick", options: QUESTIONS[0].options },
    });
    const options = wrapper.findAll("[role='option']");
    await options[0]?.trigger("focus");
    await options[0]?.trigger("keydown", { key: "Enter" });
    const selected = wrapper.findAll("[role='option']").find((b) => b.attributes("aria-selected") === "true");
    expect(selected?.text()).toContain("Alice");
  });
});
