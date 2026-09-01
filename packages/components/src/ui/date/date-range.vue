<script setup lang="ts">
import type { DateRange, DateValue } from 'reka-ui';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import {
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger,
} from 'reka-ui';
import { computed, shallowRef, watch } from 'vue';
import { cn } from '../../core';
import { formatDateValue, parseDateString } from './date-bridge';

/**
 * range 模式内部实现(经 index.vue 按 mode 分发,不直接对外)。
 * reka RangeCalendar 的选择序列:第一击 start,第二击 end(早于 start 自动交换),
 * 中间态 {start, end:undefined} 也会写进 modelValue——对外「双端齐才 emit」
 * 的契约由这里的本地态 + 提交条件兜住。
 */

defineOptions({ name: 'VtuDateRangePicker' });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    placeholder?: string;
    locale?: string;
    class?: string;
  }>(),
  { disabled: false, placeholder: '', locale: undefined }
);

const model = defineModel<string[]>({ default: () => [] });

type RangeValue = DateRange;

function toLocal(v: string[]): RangeValue {
  const start = parseDateString(v[0] ?? '');
  const end = parseDateString(v[1] ?? '');
  return { start, end };
}

const local = shallowRef<RangeValue>(toLocal(model.value));
watch(model, (v) => {
  local.value = toLocal(v);
});
watch(local, (v) => {
  // 只选一端属中间态不外发;双端齐才提交。清空仅由外部传 [] 驱动(单向同步)
  if (!v.start || !v.end) return;
  const next = [formatDateValue(v.start), formatDateValue(v.end)];
  if (next[0] !== model.value[0] || next[1] !== model.value[1]) model.value = next;
});

const displayText = computed(() => {
  const { start, end } = local.value;
  return start && end ? `${formatDateValue(start)} ~ ${formatDateValue(end)}` : '';
});
</script>

<template>
  <DateRangePickerRoot
    v-model="local"
    :disabled="props.disabled"
    :locale="props.locale"
    data-testid="date-root"
  >
    <!-- 触发器:空值显示占位文案,有值显示 start ~ end -->
    <DateRangePickerTrigger
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
    </DateRangePickerTrigger>

    <!-- 浮层:端点挂 data-selected,区间内挂 data-highlighted -->
    <DateRangePickerContent
      :class="
        cn(
          'z-50 rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-none',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
        )
      "
      data-testid="date-content"
    >
      <DateRangePickerCalendar v-slot="{ weekDays, grid }" class="space-y-2">
        <DateRangePickerHeader class="flex items-center justify-between">
          <DateRangePickerPrev
            class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronLeft class="size-4" />
          </DateRangePickerPrev>
          <DateRangePickerHeading class="text-sm font-medium" />
          <DateRangePickerNext
            class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronRight class="size-4" />
          </DateRangePickerNext>
        </DateRangePickerHeader>

        <DateRangePickerGrid
          v-for="month in grid"
          :key="month.value.toString()"
          class="w-full border-collapse select-none space-y-1"
        >
          <DateRangePickerGridHead>
            <DateRangePickerGridRow class="flex">
              <DateRangePickerHeadCell
                v-for="day in weekDays"
                :key="day"
                class="w-8 rounded-md text-center text-xs font-normal text-muted-foreground"
              >
                {{ day }}
              </DateRangePickerHeadCell>
            </DateRangePickerGridRow>
          </DateRangePickerGridHead>
          <DateRangePickerGridBody>
            <DateRangePickerGridRow
              v-for="(week, weekIndex) in month.rows"
              :key="weekIndex"
              class="mt-1 flex"
            >
              <DateRangePickerCell v-for="day in week" :key="day.toString()" :date="day">
                <DateRangePickerCellTrigger
                  :day="day"
                  :month="month.value"
                  :class="
                    cn(
                      'inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors',
                      'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                      'data-[selected]:bg-primary data-[selected]:text-primary-foreground',
                      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[highlighted]:rounded-none',
                      'data-[today]:font-semibold',
                      'data-[outside-view]:text-muted-foreground data-[outside-view]:opacity-50',
                      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                    )
                  "
                />
              </DateRangePickerCell>
            </DateRangePickerGridRow>
          </DateRangePickerGridBody>
        </DateRangePickerGrid>
      </DateRangePickerCalendar>
    </DateRangePickerContent>
  </DateRangePickerRoot>
</template>
