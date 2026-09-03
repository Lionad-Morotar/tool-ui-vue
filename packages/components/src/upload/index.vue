<script setup lang="ts">
import { File as FileIcon, Loader2, Plus, RefreshCw, X, XCircle } from 'lucide-vue-next';
import { computed, reactive, ref, useAttrs } from 'vue';
import { cn } from '../core';
import { useUpload, type UploadEmit } from './states';
import { useI18n } from '../core/i18n';
import type { UploadProps } from './schema';

defineOptions({ name: 'CmptUpload', inheritAttrs: false });

const props = withDefaults(defineProps<UploadProps>(), {
  variant: 'text',
});

// attrs 只消费 aria-* 命名通路:根是无 role 的 div,命名须落在真正可聚焦的 trigger 上;
// 其余 attrs 不转发,避免通用属性误落内部 button 造成重复 id 等污染
const attrs = useAttrs();
const triggerAria = computed(() => {
  const picked: Record<string, string> = {};
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'aria-label' || k === 'aria-labelledby') picked[k] = String(v);
  }
  return picked;
});

const emit = defineEmits<UploadEmit>();

const { t } = useI18n();

const state = reactive(
  useUpload(props, emit, {
    uploadFailed: () => t('upload.uploadFailed').value,
    invalidType: () => t('upload.invalidType').value,
    fileTooLarge: () => t('upload.fileTooLarge').value,
    limitReached: () => t('upload.limitReached').value,
  })
);

const inputEl = ref<HTMLInputElement | null>(null);

function onInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) void state.onPick(input.files);
  // 重置 value 允许连续选择同一文件(否则 change 不触发)
  input.value = '';
}

defineExpose({
  getUploadStatus: state.getUploadStatus,
  reset: state.reset,
});
</script>

<template>
  <div
    :class="cn('flex w-full max-w-md flex-col gap-2')"
    :data-tool-ui-id="props.id"
    data-slot="upload"
    data-testid="upload-root"
  >
    <p v-if="props.title" class="text-sm font-medium">{{ props.title }}</p>

    <!-- 隐藏选择入口:accept 映射(.png,.jpg 或 MIME 原样),change 后重置 value 以允许重选同文件 -->
    <input
      ref="inputEl"
      type="file"
      class="hidden"
      :accept="state.acceptAttr || undefined"
      :multiple="state.multiple || undefined"
      :disabled="state.disabled || undefined"
      data-testid="upload-input"
      @change="onInputChange"
    />

    <!-- text 形态:触发按钮 + 纵向文件行 -->
    <template v-if="props.variant === 'text'">
      <button
        v-if="!state.isReceipt"
        type="button"
        :disabled="state.disabled || state.limitReached"
        class="inline-flex h-9 items-center gap-2 self-start rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        data-testid="upload-trigger"
        v-bind="triggerAria"
        @click="inputEl?.click()"
      >
        <plus class="size-4" />
        {{ state.multiple ? t('upload.selectFiles') : t('upload.selectFile') }}
      </button>

      <ul v-if="state.displayItems.length" class="flex flex-col gap-1" data-testid="upload-list">
        <li
          v-for="item in state.displayItems"
          :key="item.uid"
          :data-status="item.status"
          class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
          data-testid="upload-item"
        >
          <loader2 v-if="item.status === 'uploading'" class="size-4 animate-spin text-muted-foreground" />
          <x-circle v-else-if="item.status === 'error'" class="size-4 text-destructive" />
          <!-- 已传文件名可点击打开 url -->
          <a
            v-if="item.status === 'done'"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="truncate text-foreground underline-offset-4 hover:underline"
          >
            {{ item.name }}
          </a>
          <span v-else class="truncate" :class="item.status === 'error' && 'text-destructive'">
            {{ item.name }}
          </span>
          <span v-if="item.status === 'error' && item.errorMessage" class="text-xs text-destructive">
            {{ item.errorMessage }}
          </span>

          <!-- 操作区:receipt 只读无操作;disabled 时按钮保留渲染但禁用 -->
          <template v-if="!state.isReceipt">
            <button
              v-if="item.status === 'error'"
              type="button"
              class="ml-auto inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              :aria-label="t('upload.retry').value"
              :disabled="state.disabled"
              data-testid="upload-retry"
              @click="state.retry(item)"
            >
              <refresh-cw class="size-3.5" />
            </button>
            <button
              type="button"
              class="inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              :class="item.status !== 'error' && 'ml-auto'"
              :aria-label="`${t('upload.remove').value} ${item.name}`"
              :disabled="state.disabled"
              data-testid="upload-remove"
              @click="state.remove(item)"
            >
              <x class="size-3.5" />
            </button>
          </template>
        </li>
      </ul>
    </template>

    <!-- picture-card 形态:网格缩略图 + 追加位 -->
    <div v-else class="flex flex-wrap gap-2" data-testid="upload-grid">
      <div
        v-for="item in state.displayItems"
        :key="item.uid"
        :data-status="item.status"
        class="relative size-20 overflow-hidden rounded-md border"
        data-testid="upload-item"
      >
        <!-- 进行中的项尚无 url,用图标占位避免破图 -->
        <img
          v-if="item.url"
          :src="item.url"
          :alt="item.name"
          class="size-full object-cover"
        />
        <div v-else class="flex size-full flex-col items-center justify-center gap-1 bg-muted p-1">
          <file-icon class="size-5 text-muted-foreground" />
          <span class="w-full truncate text-center text-xs text-muted-foreground">{{ item.name }}</span>
        </div>
        <!-- 进行态遮罩 / 错误标识 -->
        <div
          v-if="item.status === 'uploading'"
          class="absolute inset-0 flex items-center justify-center bg-background/60"
          role="status"
          :aria-label="t('upload.uploading').value"
          data-testid="upload-progress"
        >
          <loader2 class="size-5 animate-spin text-muted-foreground" />
        </div>
        <!-- 错误遮罩:图标 + 就近的失败原因,重试与否需要知道为什么失败 -->
        <div
          v-else-if="item.status === 'error'"
          class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-destructive/10 p-1"
        >
          <span
            v-if="item.errorMessage"
            class="w-full truncate text-center text-xs text-destructive"
            :title="item.errorMessage"
          >
            {{ item.errorMessage }}
          </span>
          <button
            v-if="!state.isReceipt"
            type="button"
            class="inline-flex size-6 items-center justify-center rounded-sm bg-background text-destructive disabled:cursor-not-allowed disabled:opacity-50"
            :aria-label="t('upload.retry').value"
            :disabled="state.disabled"
            data-testid="upload-retry"
            @click="state.retry(item)"
          >
            <refresh-cw class="size-3.5" />
          </button>
        </div>
        <button
          v-if="!state.isReceipt"
          type="button"
          class="absolute top-0.5 right-0.5 inline-flex size-5 items-center justify-center rounded-sm bg-background/80 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          :aria-label="`${t('upload.remove').value} ${item.name}`"
          :disabled="state.disabled"
          data-testid="upload-remove"
          @click="state.remove(item)"
        >
          <x class="size-3" />
        </button>
      </div>

      <!-- 追加触发位:未达 limit 时渲染 -->
      <button
        v-if="!state.isReceipt && !state.limitReached"
        type="button"
        :disabled="state.disabled"
        class="flex size-20 items-center justify-center rounded-md border border-dashed text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        data-testid="upload-trigger"
        v-bind="triggerAria"
        @click="inputEl?.click()"
      >
        <plus class="size-5" />
      </button>
    </div>

    <!-- 校验失败等组件级提示:aria-live 供屏幕阅读器播报 -->
    <p
      v-if="state.notice"
      aria-live="polite"
      class="text-sm text-destructive"
      data-testid="upload-notice"
    >
      {{ state.notice }}
    </p>
  </div>
</template>
