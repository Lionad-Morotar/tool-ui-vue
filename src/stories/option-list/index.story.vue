<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { OptionList } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.subtitle', messages);
const resetLabel = useStoryLocale('content.resetLabel', messages);
const confirmLabel = useStoryLocale('content.confirmLabel', messages);
const singleSelect = useStoryLocale('content.singleSelect', messages)
const multiSelect = useStoryLocale('content.multiSelect', messages)
const withActions = useStoryLocale('content.withActions', messages)
const withDisabledOptions = useStoryLocale('data.withDisabledOptions', messages)
const receiptStateSingle = useStoryLocale('content.receiptStateSingle', messages)
const receiptStateMulti = useStoryLocale('content.receiptStateMulti', messages)
const interactive = useStoryLocale('content.interactive', messages)

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
 *   :options="optionsSingle"
 *   selection-mode="single"
 *   v-model="selected"
 * />
 * ```
 */

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const OptionListProps = useStoryLocale('content.optionListProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = OptionListProps

const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件的唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'options', type: 'OptionListOption[]', required: true, description: { zh: '要显示的选项数组', en: 'Array of options to display' } },
  { name: 'selectionMode', type: "'single' | 'multi'", default: 'single', description: { zh: '选择模式', en: 'Selection mode' } },
  { name: 'value', type: 'string | string[] | null', description: { zh: '受控值', en: 'Controlled value' } },
  { name: 'defaultValue', type: 'string | string[] | null', description: { zh: '默认值（非受控）', en: 'Default value (uncontrolled)' } },
  { name: 'choice', type: 'string | string[] | null', description: { zh: '回执状态的值', en: 'Receipt state value' } },
  { name: 'minSelections', type: 'number', default: '1', description: { zh: '最少选择数', en: 'Minimum selections required' } },
  { name: 'maxSelections', type: 'number', description: { zh: '最多选择数', en: 'Maximum selections allowed' } },
  { name: 'actions', type: 'Action[] | ActionsConfig', description: { zh: '自定义操作按钮', en: 'Custom action buttons' } },
  { name: 'css', type: '{ root?: string; item?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

const singleSelection = ref<string | null>(null);
const multiSelection = ref<string[]>([]);

// Single select options (transport)
const optionsTransportZh = [
  { id: 'walk', label: '步行', description: '人行道友好路线' },
  { id: 'drive', label: '驾车', description: '最快到达时间' },
  { id: 'transit', label: '公共交通', description: '使用地铁和公交' },
];
const optionsTransportEn = [
  { id: 'walk', label: 'Walking', description: 'Sidewalk-friendly route' },
  { id: 'drive', label: 'Driving', description: 'Fastest ETA for this route' },
  { id: 'transit', label: 'Transit', description: 'Use subway and buses' },
];
const optionsTransport = computed(() => currentLocale.value === 'zh-CN' ? optionsTransportZh : optionsTransportEn);

// Multi select options (good/fast/cheap)
const optionsGfcZh = [
  { id: 'good', label: '优质', description: '高质量工作' },
  { id: 'fast', label: '快速', description: '快速周转' },
  { id: 'cheap', label: '廉价', description: '低成本' },
];
const optionsGfcEn = [
  { id: 'good', label: 'Good', description: 'High quality work' },
  { id: 'fast', label: 'Fast', description: 'Quick turnaround' },
  { id: 'cheap', label: 'Cheap', description: 'Low cost' },
];
const optionsGfc = computed(() => currentLocale.value === 'zh-CN' ? optionsGfcZh : optionsGfcEn);

// Options A/B/C
const optionsAbcZh = [
  { id: 'option-a', label: '选项 A', description: '第一个选择' },
  { id: 'option-b', label: '选项 B', description: '第二个选择' },
  { id: 'option-c', label: '选项 C', description: '第三个选择' },
];
const optionsAbcEn = [
  { id: 'option-a', label: 'Option A', description: 'First choice' },
  { id: 'option-b', label: 'Option B', description: 'Second choice' },
  { id: 'option-c', label: 'Option C', description: 'Third choice' },
];
const optionsAbc = computed(() => currentLocale.value === 'zh-CN' ? optionsAbcZh : optionsAbcEn);

// Available/Disabled
const optionsAvailZh = [
  { id: 'available', label: '可用', description: '此选项可用' },
  { id: 'disabled', label: '已禁用', description: '此选项已禁用', disabled: true },
  { id: 'also-available', label: '也可用', description: '此选项也可用' },
];
const optionsAvailEn = [
  { id: 'available', label: 'Available', description: 'This option is available' },
  { id: 'disabled', label: 'Disabled', description: 'This option is disabled', disabled: true },
  { id: 'also-available', label: 'Also Available', description: 'This option is also available' },
];
const optionsAvail = computed(() => currentLocale.value === 'zh-CN' ? optionsAvailZh : optionsAvailEn);

// Feature A/B/C
const optionsFeatureZh = [
  { id: 'feature-a', label: '功能 A', description: '核心功能' },
  { id: 'feature-b', label: '功能 B', description: '额外能力' },
  { id: 'feature-c', label: '功能 C', description: '高级选项' },
];
const optionsFeatureEn = [
  { id: 'feature-a', label: 'Feature A', description: 'Core functionality' },
  { id: 'feature-b', label: 'Feature B', description: 'Additional capability' },
  { id: 'feature-c', label: 'Feature C', description: 'Premium option' },
];
const optionsFeature = computed(() => currentLocale.value === 'zh-CN' ? optionsFeatureZh : optionsFeatureEn);

// Action labels

const interactiveOptionsZh = [
  { id: 'opt-1', label: '选项 1', description: '第一个交互选项' },
  { id: 'opt-2', label: '选项 2', description: '第二个交互选项' },
  { id: 'opt-3', label: '选项 3', description: '第三个交互选项', disabled: false },
];
const interactiveOptionsEn = [
  { id: 'opt-1', label: 'Option 1', description: 'First interactive option' },
  { id: 'opt-2', label: 'Option 2', description: 'Second interactive option' },
  { id: 'opt-3', label: 'Option 3', description: 'Third interactive option', disabled: false },
];
const interactiveOptions = computed(() => currentLocale.value === 'zh-CN' ? interactiveOptionsZh : interactiveOptionsEn);

const interactiveState = reactive({
  options: interactiveOptions,
  selectionMode: 'single' as const,
  minSelections: 0,
  maxSelections: 2,
});

</script>

<template>
  <Story title="OptionList/All Variants">
    <Variant :title="singleSelect">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-single"
          v-model="singleSelection"
          :options="optionsTransport"
          selection-mode="single"
        />
      </div>
    </Variant>

    <Variant :title="multiSelect">
      <div class="w-full max-w-sm">
        <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
        <option-list
          id="option-list-multi"
          v-model="multiSelection"
          :options="optionsGfc"
          selection-mode="multi"
          :min-selections="1"
          :max-selections="2"
        />
      </div>
    </Variant>

    <Variant :title="withActions">
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-actions"
          :options="optionsAbc"
          selection-mode="single"
          :actions="[
            { id: 'cancel', label: resetLabel },
            { id: 'confirm', label: confirmLabel, variant: 'default' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="withDisabledOptions">
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-disabled"
          :options="optionsAvail"
          selection-mode="single"
        />
      </div>
    </Variant>

    <Variant :title="receiptStateSingle">
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-receipt-single"
          :options="optionsTransport"
          selection-mode="single"
          choice="drive"
        />
      </div>
    </Variant>

    <Variant :title="receiptStateMulti">
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-receipt-multi"
          :options="optionsFeature"
          selection-mode="multi"
          :choice="['feature-a', 'feature-c']"
        />
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="w-full max-w-sm">
        <option-list
          id="option-list-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>
    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ componentPropsTitle }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ prop.default || '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
