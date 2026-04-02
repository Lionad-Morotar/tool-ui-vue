<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";
import { Check, AlertCircle } from "lucide-vue-next";
import { cn } from "./_adapter";
import type {
  PreferencesPanelProps,
  PreferencesPanelReceiptProps,
  PreferencesValue,
  PreferenceItem,
  PreferenceSection,
} from "./schema";

const props = defineProps<PreferencesPanelProps & Partial<PreferencesPanelReceiptProps> & { className?: string }>();

const emit = defineEmits<{
  change: [value: PreferencesValue];
  action: [actionId: string, value: PreferencesValue];
  beforeAction: [actionId: string, value: PreferencesValue];
  "update:value": [value: PreferencesValue];
}>();

// Determine if we're in receipt mode
const isReceipt = computed(() => "choice" in props && props.choice !== undefined);

// Get initial value for an item
function getInitialValue(item: PreferenceItem): string | boolean {
  switch (item.type) {
    case "switch":
      return item.defaultChecked ?? false;
    case "toggle":
      return item.defaultValue ?? item.options?.[0]?.value ?? "";
    case "select":
      return item.defaultSelected ?? item.selectOptions?.[0]?.value ?? "";
  }
}

// Compute initial values from all sections
function computeInitialValues(sections: PreferenceSection[]): PreferencesValue {
  return sections.reduce<PreferencesValue>((acc, section) => {
    section.items.forEach((item) => {
      acc[item.id] = getInitialValue(item);
    });
    return acc;
  }, {});
}

// Get all sections (common for both modes)
const sections = computed<PreferenceSection[]>(() => props.sections || []);

// Initial values computed from sections
const initialValues = computed(() => computeInitialValues(sections.value));

// Controlled mode: use v-model if value prop is provided
// Uncontrolled mode: use local ref
const localValues = ref<PreferencesValue>({});
const controlledValue = computed(() =>
  !isReceipt.value && "value" in props ? props.value : undefined
);

// Use VueUse's useVModel for controlled state
const modelValue = useVModel(props, "value", emit, {
  passive: true,
  defaultValue: initialValues.value,
});

// Get current value for an item (handles both controlled and uncontrolled modes)
function getItemValue(item: PreferenceItem): string | boolean {
  if (isReceipt.value) {
    return ((props as unknown) as PreferencesPanelReceiptProps).choice[item.id] ?? getInitialValue(item);
  }

  // Controlled mode: use modelValue
  if (controlledValue.value !== undefined) {
    return modelValue.value?.[item.id] ?? getInitialValue(item);
  }

  // Uncontrolled mode: use localValues
  if (item.id in localValues.value) {
    return localValues.value[item.id];
  }

  return getInitialValue(item);
}

// Current values for all items (used for action emission)
const currentValues = computed<PreferencesValue>(() => {
  const result: PreferencesValue = {};
  sections.value.forEach((section) => {
    section.items.forEach((item) => {
      result[item.id] = getItemValue(item);
    });
  });
  return result;
});

// Update value (only in interactive mode)
function updateValue(itemId: string, value: string | boolean) {
  if (isReceipt.value) return;

  if (controlledValue.value !== undefined) {
    // Controlled mode
    modelValue.value = { ...modelValue.value, [itemId]: value };
  } else {
    // Uncontrolled mode
    localValues.value = { ...localValues.value, [itemId]: value };
    emit("change", currentValues.value);
  }
}

// Check if dirty (has changes from initial)
const isDirty = computed(() => {
  if (isReceipt.value) return false;
  return Object.keys(currentValues.value).some(
    (key) => currentValues.value[key] !== initialValues.value[key]
  );
});

// Format display value
function formatDisplayValue(item: PreferenceItem, value: string | boolean): string {
  if (item.type === "switch") {
    return typeof value === "boolean" && value ? "On" : "Off";
  }

  const stringValue = typeof value === "string" ? value : "";
  const options = item.type === "toggle" ? item.options : item.selectOptions;
  const option = options?.find((opt) => opt.value === stringValue);

  return option?.label ?? stringValue;
}

// Normalize actions config
const normalizedActions = computed(() => {
  if (isReceipt.value) return null;

  const actionsProp = ((props as unknown) as PreferencesPanelProps).actions;
  if (!actionsProp) {
    return {
      items: [
        { id: "cancel", label: "Cancel", variant: "ghost" as const },
        { id: "save", label: "Save Changes", variant: "default" as const },
      ],
      align: "right" as const,
    };
  }

  // Handle array of actions
  if (Array.isArray(actionsProp)) {
    return {
      items: actionsProp.map((action) => ({
        ...action,
        variant: action.variant || (action.id === "save" ? "default" : "ghost"),
      })),
      align: "right" as const,
    };
  }

  // Handle actions config object
  return {
    items: actionsProp.items,
    align: actionsProp.align ?? "right",
  };
});

// Actions with disabled state
const actionsWithState = computed(() => {
  if (!normalizedActions.value) return [];

  return normalizedActions.value.items.map((action) => {
    const isSaveAction = action.id === "save";
    const baseDisabled = action.disabled ?? false;
    const shouldDisable = baseDisabled || (isSaveAction && !isDirty.value);

    return {
      ...action,
      disabled: shouldDisable,
    };
  });
});

function handleCancel() {
  if (controlledValue.value !== undefined) {
    modelValue.value = initialValues.value;
  } else {
    localValues.value = {};
  }
  emit("change", initialValues.value);
  emit("action", "cancel", initialValues.value);
}

async function handleAction(actionId: string) {
  // Emit beforeAction for interception
  emit("beforeAction", actionId, currentValues.value);

  if (actionId === "cancel") {
    handleCancel();
  } else {
    emit("action", actionId, currentValues.value);
  }
}

// Check if switch is on
function isSwitchValue(value: string | boolean): boolean {
  return typeof value === "boolean" ? value : value === "true";
}

// Check if there are errors (receipt mode only)
const hasErrors = computed(() => {
  if (!isReceipt.value) return false;
  const error = ((props as unknown) as PreferencesPanelReceiptProps).error;
  return error !== undefined && Object.keys(error).length > 0;
});

// Check if item has error (receipt mode only)
function getItemError(item: PreferenceItem): string | undefined {
  if (!isReceipt.value) return undefined;
  const error = ((props as unknown) as PreferencesPanelReceiptProps).error;
  return error?.[item.id];
}

// Reset state when sections change (signature reset)
watch(
  () => sections.value.map((s: PreferenceSection) => s.items.map((i: PreferenceItem) => i.id).join(",")).join("|"),
  () => {
    if (!isReceipt.value && controlledValue.value === undefined) {
      localValues.value = {};
    }
  }
);
</script>

<template>
  <!-- Receipt State -->
  <article
    v-if="isReceipt"
    :class="cn('@container/preferences-panel flex w-full max-w-md min-w-80 flex-col', props.className)"
    data-slot="preferences-panel"
    :data-tool-ui-id="props.id"
    data-receipt="true"
    role="status"
    lang="en"
    :aria-busy="false"
    :aria-label="hasErrors ? 'Preferences with errors' : 'Confirmed preferences'"
  >
    <div class="bg-card/60 border-border flex w-full flex-col overflow-hidden rounded-2xl border opacity-95 shadow-xs">
      <!-- Header -->
      <template v-if="props.title">
        <div class="flex items-center justify-between gap-3 px-5 py-4">
          <h2 class="text-base leading-none font-semibold">{{ props.title }}</h2>
          <span
            v-if="hasErrors"
            class="text-destructive flex items-center gap-1.5 text-xs font-medium"
          >
            <AlertCircle class="size-3.5" />
            Error
          </span>
          <span
            v-else
            class="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500"
          >
            <Check class="size-3.5" />
            Saved
          </span>
        </div>
        <hr class="border-border" />
      </template>

      <!-- Content -->
      <div :class="cn('flex flex-col gap-4 px-5', props.title ? 'py-6' : 'py-2')">
        <template v-for="(section, sectionIndex) in sections" :key="sectionIndex">
          <fieldset v-if="section.heading" class="flex flex-col">
            <legend class="text-muted-foreground pb-1 text-xs tracking-widest uppercase">
              {{ section.heading }}
            </legend>
            <div class="flex flex-col">
              <template v-for="(item, itemIndex) in section.items" :key="item.id">
                <hr v-if="itemIndex > 0" class="border-border my-1" />
                <div class="flex items-start justify-between gap-4 py-3">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm leading-6 font-medium text-pretty">{{ item.label }}</span>
                    <span
                      v-if="getItemError(item)"
                      class="text-destructive text-sm font-normal text-pretty"
                    >
                      {{ getItemError(item) }}
                    </span>
                    <span
                      v-else-if="item.description"
                      class="text-muted-foreground text-sm font-normal text-pretty"
                    >
                      {{ item.description }}
                    </span>
                  </div>
                  <div class="flex shrink-0 items-center gap-2">
                    <span class="text-muted-foreground text-sm font-medium">
                      {{ formatDisplayValue(item, getItemValue(item)) }}
                    </span>
                    <AlertCircle
                      v-if="getItemError(item)"
                      class="text-destructive size-3.5"
                    />
                    <Check
                      v-else-if="hasErrors"
                      class="size-3.5 text-emerald-600 dark:text-emerald-500"
                    />
                  </div>
                </div>
              </template>
            </div>
          </fieldset>
          <div v-else class="flex flex-col">
            <template v-for="(item, itemIndex) in section.items" :key="item.id">
              <hr
                v-if="itemIndex > 0"
                class="border-border my-1"
              />
              <div
                :class="cn(
                  'flex items-start justify-between gap-4',
                  itemIndex === 0 && !props.title ? 'pt-0 pb-3' : 'py-3'
                )"
              >
                <div class="flex flex-col gap-1">
                  <span class="text-sm leading-6 font-medium text-pretty">{{ item.label }}</span>
                  <span
                    v-if="getItemError(item)"
                    class="text-destructive text-sm font-normal text-pretty"
                  >
                    {{ getItemError(item) }}
                  </span>
                  <span
                    v-else-if="item.description"
                    class="text-muted-foreground text-sm font-normal text-pretty"
                  >
                    {{ item.description }}
                  </span>
                </div>
                <div class="flex shrink-0 items-center gap-2">
                  <span class="text-muted-foreground text-sm font-medium">
                    {{ formatDisplayValue(item, getItemValue(item)) }}
                  </span>
                  <AlertCircle
                    v-if="getItemError(item)"
                    class="text-destructive size-3.5"
                  />
                  <Check
                      v-else-if="hasErrors"
                      class="size-3.5 text-emerald-600 dark:text-emerald-500"
                    />
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </article>

  <!-- Interactive State -->
  <article
    v-else
    :class="cn('text-foreground @container/preferences-panel flex w-full max-w-md min-w-80 flex-col gap-3', props.className)"
    data-slot="preferences-panel"
    :data-tool-ui-id="props.id"
    role="form"
    lang="en"
    :aria-busy="false"
  >
    <div class="bg-card border-border flex w-full flex-col overflow-hidden rounded-2xl border shadow-xs">
      <!-- Header -->
      <template v-if="props.title">
        <div class="px-5 py-4">
          <h2 class="text-base leading-none font-semibold">{{ props.title }}</h2>
        </div>
        <hr class="border-border" />
      </template>

      <!-- Content -->
      <div :class="cn('flex flex-col gap-4 px-5', props.title ? 'py-6' : 'py-2')">
        <template v-for="(section, sectionIndex) in sections" :key="sectionIndex">
          <fieldset v-if="section.heading" class="flex flex-col">
            <legend class="text-muted-foreground pb-1 text-xs tracking-widest uppercase">
              {{ section.heading }}
            </legend>
            <div class="flex flex-col">
              <template v-for="(item, itemIndex) in section.items" :key="item.id">
                <hr v-if="itemIndex > 0" class="border-border my-1" />
                <div
                  :class="cn(
                    'flex items-start justify-between gap-4',
                    'py-3',
                    item.type !== 'switch' && 'flex-col gap-3 @sm/preferences-panel:flex-row @sm/preferences-panel:gap-4'
                  )"
                >
                  <div class="flex flex-col gap-1">
                    <label
                      :for="`preference-${item.id}`"
                      class="leading-6 font-medium text-pretty"
                    >
                      {{ item.label }}
                    </label>
                    <p
                      v-if="item.description"
                      class="text-muted-foreground text-sm font-normal text-pretty"
                    >
                      {{ item.description }}
                    </p>
                  </div>
                  <div class="flex shrink-0">
                    <!-- Switch -->
                    <button
                      v-if="item.type === 'switch'"
                      :id="`preference-${item.id}`"
                      type="button"
                      role="switch"
                      :aria-checked="isSwitchValue(getItemValue(item))"
                      :class="cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        isSwitchValue(getItemValue(item)) ? 'bg-primary' : 'bg-muted-foreground/30'
                      )"
                      @click="updateValue(item.id, !isSwitchValue(getItemValue(item)))"
                    >
                      <span
                        :class="cn(
                          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
                          isSwitchValue(getItemValue(item)) ? 'translate-x-5' : 'translate-x-0.5'
                        )"
                        :style="{ marginTop: '2px' }"
                      />
                    </button>

                    <!-- Toggle -->
                    <div
                      v-else-if="item.type === 'toggle' && item.options"
                      class="flex items-center gap-1"
                    >
                      <button
                        v-for="option in item.options"
                        :key="option.value"
                        type="button"
                        :class="cn(
                          'px-3 py-1.5 text-sm rounded-full transition-colors',
                          getItemValue(item) === option.value
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
                        )"
                        @click="updateValue(item.id, option.value)"
                      >
                        {{ option.label }}
                      </button>
                    </div>

                    <!-- Select -->
                    <select
                      v-else-if="item.type === 'select' && item.selectOptions"
                      :id="`preference-${item.id}`"
                      :value="String(getItemValue(item))"
                      :class="cn(
                        'h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
                        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                      )"
                      @change="updateValue(item.id, ($event.target as HTMLSelectElement).value)"
                    >
                      <option
                        v-for="option in item.selectOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </template>
            </div>
          </fieldset>
          <div v-else class="flex flex-col">
            <template v-for="(item, itemIndex) in section.items" :key="item.id">
              <hr
                v-if="itemIndex > 0"
                class="border-border my-1"
              />
              <div
                :class="cn(
                  'flex items-start justify-between gap-4',
                  itemIndex === 0 && !props.title ? 'pt-0 pb-3' : 'py-3',
                  item.type !== 'switch' && 'flex-col gap-3 @sm/preferences-panel:flex-row @sm/preferences-panel:gap-4'
                )"
              >
                <div class="flex flex-col gap-1">
                  <label
                    :for="`preference-${item.id}`"
                    class="leading-6 font-medium text-pretty"
                  >
                    {{ item.label }}
                  </label>
                  <p
                    v-if="item.description"
                    class="text-muted-foreground text-sm font-normal text-pretty"
                  >
                    {{ item.description }}
                  </p>
                </div>
                <div class="flex shrink-0">
                  <!-- Switch -->
                  <button
                    v-if="item.type === 'switch'"
                    :id="`preference-${item.id}`"
                    type="button"
                    role="switch"
                    :aria-checked="isSwitchValue(getItemValue(item))"
                    :class="cn(
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isSwitchValue(getItemValue(item)) ? 'bg-primary' : 'bg-muted-foreground/30'
                    )"
                    @click="updateValue(item.id, !isSwitchValue(getItemValue(item)))"
                  >
                    <span
                      :class="cn(
                        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
                        isSwitchValue(getItemValue(item)) ? 'translate-x-5' : 'translate-x-0.5'
                      )"
                      :style="{ marginTop: '2px' }"
                    />
                  </button>

                  <!-- Toggle -->
                  <div
                    v-else-if="item.type === 'toggle' && item.options"
                    class="flex items-center gap-1"
                  >
                    <button
                      v-for="option in item.options"
                      :key="option.value"
                      type="button"
                      :class="cn(
                        'px-3 py-1.5 text-sm rounded-full transition-colors',
                        getItemValue(item) === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      )"
                      @click="updateValue(item.id, option.value)"
                    >
                      {{ option.label }}
                    </button>
                  </div>

                  <!-- Select -->
                  <select
                    v-else-if="item.type === 'select' && item.selectOptions"
                    :id="`preference-${item.id}`"
                    :value="String(getItemValue(item))"
                    :class="cn(
                      'h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
                      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                    )"
                    @change="updateValue(item.id, ($event.target as HTMLSelectElement).value)"
                  >
                    <option
                      v-for="option in item.selectOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="normalizedActions" class="@container/actions">
      <div
        :class="cn(
          'flex w-full gap-2',
          normalizedActions.align === 'left' ? 'flex-row justify-start' :
          normalizedActions.align === 'center' ? 'flex-row justify-center' :
          'flex-col @[240px]:flex-row @[240px]:justify-end',
        )"
      >
        <button
          v-for="action in actionsWithState"
          :key="action.id"
          type="button"
          :class="cn(
            'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
            'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            'h-9',
            normalizedActions.align === 'right' ? 'w-full @[240px]:w-auto' : '',
            action.variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : action.variant === 'secondary'
              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              : action.variant === 'ghost'
              ? 'hover:bg-accent hover:text-accent-foreground'
              : action.variant === 'outline'
              ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )"
          :disabled="action.disabled"
          @click="handleAction(action.id)"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
  </article>
</template>
