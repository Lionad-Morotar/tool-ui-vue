<script setup lang="ts">
import { cn } from '../../core'

/**
 * RowCheckbox：DataTable 行勾选框统一实现，table / accordion / simple 三视图共用。
 * 结构固定为 label > sr-only input + 自绘 span：原生 input 承担表单语义与
 * 键盘可达性（sr-only 视觉隐藏），自绘 span 承担视觉勾选态，
 * aria-checked 与视觉由同一受控 checked 驱动，避免两套真相漂移。
 *
 * 边界说明：表头全选勾选框（select-all）不在此组件范围内——
 * 其半选态只能经 DOM 属性写入原生 .indeterminate（无对应 attribute 可声明），
 * 且为三态显示（✓/—/空），与行勾选两态结构不同源，故保持内联于 index.vue。
 *
 * 视图差异经 labelClass 透传（卡片视图需 shrink-0 / self-center 防挤压）。
 * data-testid 契约 row-select-<rowId> 由调用方传入，勿改动。
 */
defineOptions({ name: 'CmptRowCheckbox' })

const props = withDefaults(
  defineProps<{
    /** 是否选中（受控：由父组件选择状态驱动） */
    checked: boolean
    /** 读屏标签，调用方按行内容拼装（首列文本优先、rowId 兜底） */
    ariaLabel: string
    /** data-testid：行勾选契约 row-select-<rowId> */
    testid: string
    /** label 额外 class（三视图布局差异） */
    labelClass?: string
  }>(),
  { labelClass: undefined },
)

const emit = defineEmits<{
  /** 透传原生 change 事件（事件对象可作阻止冒泡等用途） */
  change: [e: Event]
  /** 语义化切换事件：受控选中态由父组件翻转，不携带载荷 */
  toggle: []
}>()

function onChange(e: Event) {
  emit('change', e)
  emit('toggle')
}
</script>

<template>
  <!-- 勾选框本体：label 包住 sr-only input 与自绘 span，点击 label 即触达 input -->
  <label
    :class="cn('inline-flex h-8 w-8 cursor-pointer items-center justify-center', labelClass)"
  >
    <input
      type="checkbox"
      class="sr-only"
      :data-testid="testid"
      :checked="checked"
      :aria-checked="checked"
      :aria-label="ariaLabel"
      @change="onChange"
    />
    <span
      :class="cn(
        'flex h-4 w-4 items-center justify-center rounded-sm border border-border',
        checked && 'bg-primary text-primary-foreground',
      )"
      aria-hidden="true"
    >{{ checked ? '✓' : '' }}</span>
  </label>
</template>
