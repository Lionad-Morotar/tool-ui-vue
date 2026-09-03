<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { cn } from '../../core';
import { Switch, ToggleGroup, Input, Textarea, Select, Rating, NumberField, TagsInput, DatePicker } from '../../ui';
import Upload from '../../upload';
import type { UploadedFile } from '../../upload';
import type { PreferenceFieldValue, PreferenceItem } from '../schema';

defineOptions({ name: 'PreferenceField' });

const props = defineProps<{
  item: PreferenceItem;
  value: PreferenceFieldValue;
  itemIndex: number;
  hasHeading: boolean;
  hasTitle: boolean;
  cssItem?: string;
  // upload 字段的上传通道,由面板层注入透传
  upload?: (file: File) => Promise<UploadedFile>;
}>();

const emit = defineEmits<{
  update: [value: PreferenceFieldValue];
  // upload 字段传输中状态外发,供面板层门控 Save 与进行中上传的竞态
  flight: [itemId: string, hasUploading: boolean];
}>();

// 值可能来自序列化数据,字符串 'true' 视为开
const switchChecked = computed<boolean>({
  get: () => (typeof props.value === 'boolean' ? props.value : props.value === 'true'),
  set: (v) => emit('update', v),
});

// toggle 值桥接:field 联合类型收窄为 string | string[],写回统一走 update 上抛
// (Array.isArray 收窄含 UploadedFile[] 形态,cast 回 string[] 由脏数据分支兜底)
const toggleModel = computed<string | string[]>({
  get: () => {
    if (Array.isArray(props.value)) return props.value as string[];
    return typeof props.value === 'string' ? props.value : '';
  },
  set: (v) => emit('update', v),
});

// 字符串控件值桥接:select/input/textarea 均为 string 值,联合类型收窄后与原子 defineModel<string> 对齐
const textModel = computed<string>({
  get: () => String(props.value ?? ''),
  set: (v) => emit('update', v),
});

// rating 恒 number,空值归 0(与初始值兜底一致)
const ratingModel = computed<number>({
  get: () => (typeof props.value === 'number' ? props.value : 0),
  set: (v) => emit('update', v),
});

// number 的空态 null 原样透传,与原子 defineModel<number|null> 对齐
const numberModel = computed<number | null>({
  get: () => (typeof props.value === 'number' || props.value === null ? props.value : null),
  set: (v) => emit('update', v),
});

// tags 值桥接:string[] 收窄,非数组输入(脏数据)归空数组
// (Array.isArray 收窄含 UploadedFile[] 形态,cast 后脏数据仍由运行时归空兜底)
const tagsModel = computed<string[]>({
  get: () => (Array.isArray(props.value) ? (props.value as string[]) : []),
  set: (v) => emit('update', v),
});

// date 值桥接:按 item.mode 感知收窄——range 只认 string[],单值只认 string;
// 受控/receipt 入口不过 zod,脏形态(数组进单值分支等)在此归空防御
const dateModel = computed<string | string[]>({
  get: () => {
    if (props.item.type === 'date' && props.item.mode === 'range') {
      return Array.isArray(props.value) ? (props.value as string[]) : [];
    }
    return typeof props.value === 'string' ? props.value : '';
  },
  set: (v) => emit('update', v),
});

// upload 值桥接:UploadedFile[] 收窄,非数组输入(脏数据)归空数组
const uploadModel = computed<UploadedFile[]>({
  get: () => (Array.isArray(props.value) ? (props.value as UploadedFile[]) : []),
  set: (v) => emit('update', v),
});

// upload 原子实例:success/error 落定时读其传输中状态,外发 flight 供面板门控 Save;
// nextTick 等原子内部 items 状态先行转移,避免读到旧值
const uploadRef = ref<InstanceType<typeof Upload> | null>(null);

function emitFlight() {
  void nextTick(() => {
    const hasUploading = uploadRef.value?.getUploadStatus().hasUploading ?? false;
    emit('flight', props.item.id, hasUploading);
  });
}

// 宽控件独占一行,其余与文案同行排列
const isBlockControl = computed(
  () =>
    props.item.type === 'input' ||
    props.item.type === 'textarea' ||
    props.item.type === 'toggle' ||
    props.item.type === 'tags' ||
    props.item.type === 'upload'
);

// 无标题卡片的首行去掉上 padding,与容器内边距互补避免顶部双倍留白
const rowPaddingClass = computed(() =>
  !props.hasHeading && props.itemIndex === 0 && !props.hasTitle ? 'pt-0 pb-3' : 'py-3'
);

const controlWrapperClass = computed(() =>
  props.hasHeading
    ? cn('flex', isBlockControl.value && 'w-full', !isBlockControl.value && 'shrink-0')
    : cn('flex', props.item.type !== 'input' && props.item.type !== 'textarea' && 'shrink-0')
);
</script>

<template>
  <div
    :class="
      cn(
        'flex items-start justify-between gap-4',
        rowPaddingClass,
        isBlockControl
          ? 'flex-col gap-3'
          : props.item.type !== 'switch' &&
              'flex-col gap-3 @sm/preferences-panel:flex-row @sm/preferences-panel:gap-4',
        props.cssItem
      )
    "
    data-testid="preference-field"
  >
    <!-- 文案块:label 关联控件 id,description 辅助说明;label 自身带 id 供 button 形态控件接 aria-labelledby -->
    <div :class="props.hasHeading ? 'flex shrink-0 flex-col gap-1' : 'flex flex-col gap-1'">
      <label
        :id="`preference-${item.id}-label`"
        :for="`preference-${item.id}`"
        class="leading-6 font-medium text-pretty"
      >
        {{ item.label }}
      </label>
      <p
        v-if="item.description"
        class="text-sm font-normal text-pretty text-muted-foreground"
      >
        {{ item.description }}
      </p>
    </div>

    <!-- 控件块:按 item.type 调度 -->
    <div :class="controlWrapperClass">
      <Switch
        v-if="item.type === 'switch'"
        :id="`preference-${item.id}`"
        v-model="switchChecked"
      />

      <!-- ToggleGroupRoot 渲染 div role=group 非 labelable,label[for] 不参与命名,
           组容器可访问名称靠 aria-labelledby 指回文案块 label(该 label 恒带此 id) -->
      <ToggleGroup
        v-else-if="item.type === 'toggle' && item.options"
        v-model="toggleModel"
        :options="item.options"
        :multiple="item.multiple"
        :aria-labelledby="`preference-${item.id}-label`"
        :class="props.hasHeading ? 'w-full' : undefined"
      />

      <!-- Select trigger 渲染为 button,label[for] 无法提供无障碍命名,须补 aria-labelledby -->
      <Select
        v-else-if="item.type === 'select' && item.selectOptions"
        :id="`preference-${item.id}`"
        v-model="textModel"
        :options="item.selectOptions"
        :aria-labelledby="`preference-${item.id}-label`"
      />

      <Input
        v-else-if="item.type === 'input'"
        :id="`preference-${item.id}`"
        v-model="textModel"
        :type="item.inputType"
        :placeholder="item.placeholder"
      />

      <Textarea
        v-else-if="item.type === 'textarea'"
        :id="`preference-${item.id}`"
        v-model="textModel"
        :placeholder="item.placeholder"
        :rows="item.rows"
      />

      <!-- Rating/TagsInput/DatePicker 均非 labelable 原生控件,aria-labelledby 指回文案块 label -->
      <Rating
        v-else-if="item.type === 'rating'"
        v-model="ratingModel"
        :max="item.max"
        :aria-labelledby="`preference-${item.id}-label`"
      />

      <NumberField
        v-else-if="item.type === 'number'"
        :id="`preference-${item.id}`"
        v-model="numberModel"
        :min="item.min"
        :max="item.max"
        :step="item.step"
        :placeholder="item.placeholder"
      />

      <TagsInput
        v-else-if="item.type === 'tags'"
        v-model="tagsModel"
        :max="item.max"
        :placeholder="item.placeholder"
        :aria-labelledby="`preference-${item.id}-label`"
        :class="props.hasHeading ? 'w-full' : undefined"
      />

      <DatePicker
        v-else-if="item.type === 'date'"
        v-model="dateModel"
        :mode="item.mode"
        :placeholder="item.placeholder"
        :aria-labelledby="`preference-${item.id}-label`"
      />

      <!-- Upload 非 labelable:根是无 role 的 div,aria-labelledby 落上去不参与命名,
           命名由原子内 trigger 按钮承接 aria-label;label[for] 不可聚焦,同样以 trigger 兜底;
           upload handler 缺省时禁用原子,杜绝「选文件后永久卡在 uploading」的死态 -->
      <Upload
        v-else-if="item.type === 'upload'"
        ref="uploadRef"
        :id="`preference-${item.id}`"
        v-model="uploadModel"
        :accept="item.accept"
        :max-size="item.maxSize"
        :limit="item.limit"
        :multiple="item.multiple"
        :variant="item.variant"
        v-bind="props.upload ? { upload: props.upload } : { disabled: true }"
        :aria-labelledby="`preference-${item.id}-label`"
        :class="props.hasHeading ? 'w-full' : undefined"
        @success="emitFlight"
        @error="emitFlight"
      />
    </div>
  </div>
</template>
