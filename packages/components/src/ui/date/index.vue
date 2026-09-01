<script setup lang="ts">
import type { DateValue } from 'reka-ui';
import { CalendarDateTime } from '@internationalized/date';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import {
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger,
  TimeFieldInput,
  TimeFieldRoot,
} from 'reka-ui';
import { computed, ref, shallowRef, watch } from 'vue';
import { cn } from '../../core';
import DateRangePicker from './date-range.vue';
import { formatDateTimeValue, formatDateValue, parseDateString, parseDateTimeString } from './date-bridge';

defineOptions({ name: 'VtuDatePicker' });

const props = withDefaults(
  defineProps<{
    mode?: 'date' | 'datetime' | 'range';
    disabled?: boolean;
    placeholder?: string;
    confirmText?: string;
    locale?: string;
    class?: string;
  }>(),
  // 缺省兜底放原子层:单日模式、非禁用
  { mode: 'date', disabled: false, placeholder: '', confirmText: 'OK', locale: undefined }
);

// 对外契约随 mode 变化:date/datetime 为 string,range 为 [start, end]
const model = defineModel<string | string[]>({ default: '' });

const isDatetime = computed(() => props.mode === 'datetime');

// 浮层显隐始终受控:datetime 需要「选日期不关浮层、确认才提交」,
// date 模式沿用同一受控通道由 reka 默认行为驱动(closeOnSelect 默认 true)
const open = ref(false);

// 内部持 DateValue 本地态,reka 日历的选择写回这里,再经桥接格式化外发;
// 双 watch 靠值比对防循环(格式化后与 model 相同则不再写回)
// DateValue 是带 #private 的类实例,ref() 的 UnwrapRef 会把它拆成匿名结构、
// 丢类身份而不再兼容 reka 的 DateValue 契约,必须 shallowRef
const localDate = shallowRef<DateValue | undefined>(
  parseDateString(typeof model.value === 'string' ? model.value : '')
);
watch(model, (v) => {
  const s = typeof v === 'string' ? v : '';
  localDate.value = parseDateString(s);
  // 外部 model 是权威源:浮层开期间的外部更新同步进草稿,
  // 否则确认会以打开时的旧快照回写、静默回滚外部新值
  if (isDatetime.value && open.value) {
    const parsed = parseDateTimeString(s);
    draftDate.value = parsed;
    draftTime.value = parsed;
  }
});
watch(localDate, (v) => {
  // 仅 date 模式经本地态外发;range 切走时日历本地态会被外部数组清空,
  // 放行会把 '' emit 回父级,污染 range 的 string[] 契约
  if (props.mode !== 'date') return;
  const s = v ? formatDateValue(v) : '';
  if (s !== model.value) model.value = s;
});

// datetime 草稿态:打开浮层时从 model 初始化,确认才合并外发;
// 非确认关闭(Esc/点外)不作清理,草稿经「下次打开重新初始化」自然丢弃
const draftDate = shallowRef<DateValue | undefined>();
const draftTime = shallowRef<CalendarDateTime | undefined>();
watch(open, (v) => {
  if (!v || !isDatetime.value) return;
  const parsed = parseDateTimeString(typeof model.value === 'string' ? model.value : '');
  draftDate.value = parsed;
  draftTime.value = parsed;
});

// reka 日历点选写回 CalendarDate(时间部分归零),故 datetime 绝不能把日历
// 直接绑到对外 model——经此 computed 按模式路由到本地态或草稿态
const calendarModel = computed<DateValue | undefined>({
  get: () => (isDatetime.value ? draftDate.value : localDate.value),
  set: (v) => {
    if (isDatetime.value) draftDate.value = v;
    else localDate.value = v;
  },
});

// 显示层格式:存储契约 'YYYY-MM-DDTHH:mm'(naive ISO),展示习惯用空格分隔
const displayText = computed(() => {
  if (isDatetime.value) {
    const parsed = parseDateTimeString(typeof model.value === 'string' ? model.value : '');
    return parsed ? formatDateTimeValue(parsed).replace('T', ' ') : '';
  }
  return localDate.value ? formatDateValue(localDate.value) : '';
});

function confirmDatetime() {
  const d = draftDate.value;
  if (d) {
    const t = draftTime.value;
    const merged = new CalendarDateTime(d.year, d.month, d.day, t?.hour ?? 0, t?.minute ?? 0);
    const s = formatDateTimeValue(merged);
    if (s !== model.value) model.value = s;
  }
  open.value = false;
}

// range 模式由内部组件接管(契约 string[]),经 computed 在联合 model 上适配
const isRange = computed(() => props.mode === 'range');
const rangeModel = computed<string[]>({
  get: () => (Array.isArray(model.value) ? model.value : []),
  set: (v) => {
    model.value = v;
  },
});
</script>

<template>
  <DateRangePicker
    v-if="isRange"
    v-model="rangeModel"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :locale="props.locale"
    :class="props.class"
  />
  <DatePickerRoot
    v-else
    v-model="calendarModel"
    v-model:open="open"
    :disabled="props.disabled"
    :locale="props.locale"
    :close-on-select="!isDatetime"
    data-testid="date-root"
  >
    <!-- 触发器:表单语义按钮,空值显示占位文案 -->
    <DatePickerTrigger
      :class="
        cn(
          'inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !displayText && 'text-muted-foreground',
          props.class
        )
      "
      data-testid="date-trigger"
    >
      <CalendarIcon class="size-4 opacity-60" />
      <span>{{ displayText || props.placeholder }}</span>
    </DatePickerTrigger>

    <!-- 浮层:日历网格,选中态挂 data-selected;datetime 追加时间行与确认位 -->
    <DatePickerContent
      :class="
        cn(
          'z-50 rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-none',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
        )
      "
      data-testid="date-content"
    >
      <DatePickerCalendar v-slot="{ weekDays, grid }" class="space-y-2">
        <DatePickerHeader class="flex items-center justify-between">
          <DatePickerPrev
            class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronLeft class="size-4" />
          </DatePickerPrev>
          <DatePickerHeading class="text-sm font-medium" />
          <DatePickerNext
            class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronRight class="size-4" />
          </DatePickerNext>
        </DatePickerHeader>

        <DatePickerGrid
          v-for="month in grid"
          :key="month.value.toString()"
          class="w-full border-collapse select-none space-y-1"
        >
          <DatePickerGridHead>
            <DatePickerGridRow class="flex">
              <DatePickerHeadCell
                v-for="day in weekDays"
                :key="day"
                class="w-8 rounded-md text-center text-xs font-normal text-muted-foreground"
              >
                {{ day }}
              </DatePickerHeadCell>
            </DatePickerGridRow>
          </DatePickerGridHead>
          <DatePickerGridBody>
            <DatePickerGridRow
              v-for="(week, weekIndex) in month.rows"
              :key="weekIndex"
              class="mt-1 flex"
            >
              <DatePickerCell v-for="day in week" :key="day.toString()" :date="day">
                <DatePickerCellTrigger
                  :day="day"
                  :month="month.value"
                  :class="
                    cn(
                      'inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors',
                      'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                      'data-[selected]:bg-primary data-[selected]:text-primary-foreground',
                      'data-[today]:font-semibold',
                      'data-[outside-view]:text-muted-foreground data-[outside-view]:opacity-50',
                      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                    )
                  "
                />
              </DatePickerCell>
            </DatePickerGridRow>
          </DatePickerGridBody>
        </DatePickerGrid>
      </DatePickerCalendar>

      <!-- datetime 时间行:24 小时制时/分两段,段为 contenteditable spinbutton -->
      <div v-if="isDatetime" class="mt-2 border-t pt-2">
        <TimeFieldRoot
          v-model="draftTime"
          :hour-cycle="24"
          class="flex items-center gap-1 text-sm"
          data-testid="time-field"
        >
          <TimeFieldInput
            part="hour"
            class="w-7 rounded-sm px-1 text-center focus-visible:bg-accent focus-visible:outline-none"
          />
          <span class="text-muted-foreground">:</span>
          <TimeFieldInput
            part="minute"
            class="w-7 rounded-sm px-1 text-center focus-visible:bg-accent focus-visible:outline-none"
          />
        </TimeFieldRoot>
        <button
          type="button"
          :disabled="!draftDate"
          class="mt-2 inline-flex h-7 w-full items-center justify-center rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          data-testid="date-confirm"
          @click="confirmDatetime"
        >
          {{ props.confirmText }}
        </button>
      </div>
    </DatePickerContent>
  </DatePickerRoot>
</template>
