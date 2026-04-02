/**
 * Shared utilities for Histoire stories
 */

/**
 * Creates a reactive control binding for Histoire stories
 */
export function useControl<T>(defaultValue: T): {
  value: T;
  update: (val: T) => void;
} {
  const state = { value: defaultValue };
  return {
    get value() {
      return state.value;
    },
    update: (val: T) => {
      state.value = val;
    },
  };
}

/**
 * Common variant names for consistent story organization
 */
export const VariantNames = {
  DEFAULT: "Default",
  LOADING: "Loading",
  ERROR: "Error",
  EMPTY: "Empty",
  RECEIPT: "Receipt",
  INTERACTIVE: "Interactive",
  DESTRUCTIVE: "Destructive",
  WITH_ACTIONS: "With Actions",
  CUSTOM_STYLED: "Custom Styled",
} as const;

/**
 * Helper to create common action handlers for stories
 */
export function createActionHandlers(showNotification?: (msg: string, type: "success" | "error") => void) {
  return {
    onConfirm: () => showNotification?.("Confirmed!", "success"),
    onCancel: () => showNotification?.("Cancelled!", "error"),
    onSelect: (id: string) => showNotification?.(`Selected: ${id}`, "success"),
    onChange: (value: unknown) => showNotification?.(`Changed: ${JSON.stringify(value)}`, "success"),
    onSubmit: () => showNotification?.("Submitted!", "success"),
    onSave: () => showNotification?.("Saved!", "success"),
  };
}

/**
 * Sample data generators for stories
 */
export const SampleData = {
  imageUrl: (seed: number, width = 400, height = 300) =>
    `https://picsum.photos/${width}/${height}?random=${seed}`,

  avatarUrl: (seed: number) => `https://picsum.photos/48/48?random=${seed}`,

  date: (daysAgo = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  },
};
