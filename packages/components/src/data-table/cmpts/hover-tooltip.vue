<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'

/**
 * HoverTooltip：纯展示 tooltip，内容 teleport 到 body、fixed 定位。
 * Why: 表格滚动容器带 overflow，单元格内 absolute 定位的 tooltip 会被裁剪
 *      （z-index 无法逃逸 overflow clipping）；teleport 后彻底脱离裁剪与层叠上下文。
 *      代价是 DOM 不再嵌套在触发元素内，纯 CSS group-hover 失效，故改为 JS hover 驱动。
 */
const props = withDefaults(
  defineProps<{
    /** tooltip 文本 */
    text: string
    /** 禁用时不响应 hover（如文本未溢出、无需补全展示） */
    disabled?: boolean
    /**
     * 仅在插槽内容被截断（overflow）时才响应 hover。
     * Why: 判定放在 hover 时刻而非 mount 时刻——流式渲染表格布局随数据到达变化、
     *      字体子集晚载改变字宽，mount 期一次性测量会得出陈旧结论且不再修正。
     */
    overflowOnly?: boolean
    /** 内容强制单行（短汇总文本）；默认允许多行并限宽 */
    nowrap?: boolean
    /** 透传到触发元素包裹 span 的 class */
    triggerClass?: string
    testid?: string
  }>(),
  {
    disabled: false,
    overflowOnly: false,
    nowrap: false,
    triggerClass: undefined,
    testid: undefined,
  },
)

const open = ref(false)
const faded = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
// fixed 定位坐标：水平居中于触发元素，底边贴触发元素顶并留 4px 间隙
const pos = ref({ left: 0, bottom: 0 })

/** 按触发元素当前视口位置重算坐标；触发元素滚出视口时返回 false */
function measure(): boolean {
  const el = triggerRef.value
  if (!el) return false
  const rect = el.getBoundingClientRect()
  if (rect.bottom < 0 || rect.top > window.innerHeight) return false
  pos.value = {
    left: rect.left + rect.width / 2,
    bottom: window.innerHeight - rect.top + 4,
  }
  return true
}

/** hover 时刻测量插槽内容是否截断：取插槽首个元素（截断样式在其上），无元素则退回触发器 */
function isOverflowing(): boolean {
  const el = triggerRef.value
  if (!el) return false
  const target = (el.firstElementChild as HTMLElement | null) ?? el
  return target.scrollWidth > target.clientWidth
}

function show() {
  if (props.disabled || typeof window === 'undefined') return
  if (props.overflowOnly && !isOverflowing()) return
  open.value = measure()
}
function hide() {
  open.value = false
}

// enter 淡入：v-if 挂载后下一帧再切 opacity，离开直接卸载（放弃 leave 过渡换零常驻节点）
watch(open, async (v) => {
  if (!v) {
    faded.value = false
    return
  }
  await nextTick()
  faded.value = true
})

// 表格体自身可滚动，展示期间跟随触发元素重定位；滚出视口即收起
function syncPosition() {
  if (!open.value) return
  if (!measure()) open.value = false
}
if (typeof window !== 'undefined') {
  useEventListener(window, 'scroll', syncPosition, { capture: true, passive: true })
  useEventListener(window, 'resize', syncPosition, { passive: true })
}
</script>

<template>
  <span
    ref="triggerRef"
    :class="triggerClass"
    :data-testid="testid"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot />
  </span>
  <Teleport to="body">
    <span
      v-if="open"
      role="tooltip"
      :data-testid="testid ? `${testid}-content` : undefined"
      :class="[
        'pointer-events-none fixed z-[100] -translate-x-1/2 rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md transition-opacity',
        nowrap ? 'whitespace-nowrap' : 'max-w-[320px] whitespace-normal',
        faded ? 'opacity-100' : 'opacity-0',
      ]"
      :style="{ left: `${pos.left}px`, bottom: `${pos.bottom}px` }"
    >{{ text }}</span>
  </Teleport>
</template>
