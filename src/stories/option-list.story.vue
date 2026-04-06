<script setup lang="ts">
import { ref, reactive } from 'vue';
import { OptionList } from '@lionad/components';

/**
 * # OptionList
 *
 * A selection component for choosing one or more options from a list.
 * Supports single/multi selection, keyboard navigation, and receipt states.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier for the component |
 * | options | OptionListOption[] | required | Array of options to display |
 * | selectionMode | 'single' \| 'multi' | 'single' | Selection mode |
 * | value | string \| string[] \| null | undefined | Controlled value |
 * | defaultValue | string \| string[] \| null | undefined | Default value (uncontrolled) |
 * | choice | string \| string[] \| null | undefined | Receipt state value |
 * | minSelections | number | 1 | Minimum selections required |
 * | maxSelections | number | undefined | Maximum selections allowed |
 * | actions | Action[] \| ActionsConfig | undefined | Custom action buttons |
 * | css | { root?: string } | undefined | CSS classes for component elements |
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | change | value: OptionListSelection | Emitted when selection changes |
 * | update:modelValue | value: OptionListSelection | v-model support |
 * | action | actionId: string, value: OptionListSelection | Action button clicked |
 *
 * ## Usage
 *
 * ```vue
 * <OptionList
 *   id="transport-options"
 *   :options="[
 *     { id: 'walk', label: 'Walking', description: 'Sidewalk-friendly' },
 *     { id: 'drive', label: 'Driving', description: 'Fastest route' },
 *   ]"
 *   selection-mode="single"
 *   v-model="selected"
 * />
 * ```
 */

const singleSelection = ref<string | null>(null);
const multiSelection = ref<string[]>([]);

const interactiveOptions = [
  { id: 'opt-1', label: 'Option 1', description: 'First interactive option' },
  { id: 'opt-2', label: 'Option 2', description: 'Second interactive option' },
  { id: 'opt-3', label: 'Option 3', description: 'Third interactive option', disabled: false },
];

const interactiveState = reactive({
  options: interactiveOptions,
  selectionMode: 'single' as const,
  minSelections: 0,
  maxSelections: 2,
});
</script>

<template>
  <Story title="OptionList/All Variants">
    <Variant title="Single Select">
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-single"
          v-model="singleSelection"
          :options="[
            { id: 'walk', label: 'Walking', description: 'Sidewalk-friendly route' },
            { id: 'drive', label: 'Driving', description: 'Fastest ETA for this route' },
            { id: 'transit', label: 'Transit', description: 'Use subway and buses' },
          ]"
          selection-mode="single"
        />
      </div>
    </Variant>

    <Variant title="Multi Select">
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-multi"
          v-model="multiSelection"
          :options="[
            { id: 'good', label: 'Good', description: 'High quality work' },
            { id: 'fast', label: 'Fast', description: 'Quick turnaround' },
            { id: 'cheap', label: 'Cheap', description: 'Low cost' },
          ]"
          selection-mode="multi"
          :min-selections="1"
          :max-selections="2"
        />
      </div>
    </Variant>

    <Variant title="With Actions">
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-actions"
          :options="[
            { id: 'option-a', label: 'Option A', description: 'First choice' },
            { id: 'option-b', label: 'Option B', description: 'Second choice' },
            { id: 'option-c', label: 'Option C', description: 'Third choice' },
          ]"
          selection-mode="single"
          :actions="[
            { id: 'cancel', label: 'Reset' },
            { id: 'confirm', label: 'Confirm', variant: 'default' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="With Disabled Options">
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-disabled"
          :options="[
            { id: 'available', label: 'Available', description: 'This option is available' },
            { id: 'disabled', label: 'Disabled', description: 'This option is disabled', disabled: true },
            { id: 'also-available', label: 'Also Available', description: 'This option is also available' },
          ]"
          selection-mode="single"
        />
      </div>
    </Variant>

    <Variant title="Receipt State (Single)">
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-receipt-single"
          :options="[
            { id: 'walk', label: 'Walking', description: 'Sidewalk-friendly route' },
            { id: 'drive', label: 'Driving', description: 'Fastest ETA for this route' },
            { id: 'transit', label: 'Transit', description: 'Use subway and buses' },
          ]"
          selection-mode="single"
          choice="drive"
        />
      </div>
    </Variant>

    <Variant title="Receipt State (Multi)">
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-receipt-multi"
          :options="[
            { id: 'feature-a', label: 'Feature A', description: 'Core functionality' },
            { id: 'feature-b', label: 'Feature B', description: 'Additional capability' },
            { id: 'feature-c', label: 'Feature C', description: 'Premium option' },
          ]"
          selection-mode="multi"
          :choice="['feature-a', 'feature-c']"
        />
      </div>
    </Variant>

    <Variant title="Interactive" auto-props-disabled>
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>
  </Story>
</template>
