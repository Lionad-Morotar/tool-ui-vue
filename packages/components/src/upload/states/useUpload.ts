import { computed, nextTick, ref, watch } from 'vue';
import type { UploadedFile, UploadInteractiveProps, UploadProps } from '../schema';

export type UploadItemStatus = 'uploading' | 'done' | 'error';

/** 列表项:对外契约 UploadedFile + 内部状态;rawFile 留存供重试重新走 handler */
export interface UploadItem extends UploadedFile {
  uid: string;
  status: UploadItemStatus;
  errorMessage?: string;
  rawFile?: File;
}

export type UploadEmit = {
  (e: 'update:modelValue', value: UploadedFile[]): void;
  (e: 'success', item: UploadedFile): void;
  (e: 'error', item: UploadedFile, reason: unknown): void;
};

let uidCounter = 0;
function nextUid(): string {
  return `uf-${Date.now().toString(36)}-${++uidCounter}`;
}

/**
 * upload 状态机:uploading/done/error 三态 + 重试转移 + 回显合并。
 * v-model 只外泄 done 集;进行中的 uploading/error 项活在组件内部。
 * 模式判别收敛在此:receipt(带 choice)只读,模板不直接触碰联合 props。
 */
export function useUpload(
  props: UploadProps,
  emit: UploadEmit,
  messages: {
    uploadFailed: () => string;
    invalidType: () => string;
    fileTooLarge: () => string;
    limitReached: () => string;
  },
) {
  // 判别先例同 question-flow:联合 props 编译后所有声明字段都进运行时声明,
  // 值判别(!== undefined)与 in 守卫在运行时不等价——cast 逃逸联合类型后做值判别,
  // 规避 in 守卫对「声明但未传值」键的语义歧义,也绕开复合条件取反分支令 TS 放弃窄化的坑
  const rawProps = props as unknown as Record<string, unknown>;
  const isReceipt = computed(() => rawProps.choice !== undefined);

  // 交互分支收窄:receipt 模式下为 undefined,全部交互字段经此访问
  const interactive = computed(() =>
    isReceipt.value ? undefined : (props as UploadInteractiveProps),
  );

  const disabled = computed(() => interactive.value?.disabled === true);
  const multiple = computed(() => interactive.value?.multiple === true);

  // 回显初始化:serializable files 或受控 modelValue 皆落成 done 项
  const items = ref<UploadItem[]>(
    (interactive.value?.modelValue ?? interactive.value?.files ?? []).map((f) => ({
      ...f,
      uid: f.uid ?? nextUid(),
      status: 'done' as const,
    })),
  );

  /** 渲染数据源:receipt 模式展示 choice 的只读规范化副本,交互模式展示内部列表 */
  const displayItems = computed<UploadItem[]>(() => {
    if (isReceipt.value) {
      return (rawProps.choice as UploadedFile[]).map((f, i) => ({
        ...f,
        uid: f.uid ?? `receipt-${i}`,
        status: 'done' as const,
      }));
    }
    return items.value;
  });

  // 内联错误区(校验失败等组件级提示,区别于项级 errorMessage)
  const notice = ref('');

  // 内部 emit 引发的外部 value 回流不回灌列表;nextTick 复位保证只挡紧邻回流
  let syncingFromInside = false;

  function doneList(): UploadedFile[] {
    return items.value
      .filter((i) => i.status === 'done')
      .map(({ rawFile: _rawFile, status: _status, errorMessage: _e, ...f }) => f);
  }

  function emitDone() {
    syncingFromInside = true;
    emit('update:modelValue', doneList());
    void nextTick(() => {
      syncingFromInside = false;
    });
  }

  // 外部主动变更:替换 done 集(已有项按 uid 保留身份),进行中的 uploading/error 项保留不被吞
  watch(
    () => interactive.value?.modelValue,
    (v) => {
      if (syncingFromInside || v === undefined) return;
      const inFlight = items.value.filter((i) => i.status !== 'done');
      const doneIncoming = v.map((f) => {
        // 按 uid 保留身份,但内容以外部回流为准——同 uid 重签 url 等字段更新必须生效
        const existing = items.value.find((i) => i.status === 'done' && i.uid === f.uid);
        return { ...f, uid: existing?.uid ?? f.uid ?? nextUid(), status: 'done' as const };
      });
      items.value = [...inFlight, ...doneIncoming];
    },
  );

  const acceptAttr = computed(() =>
    (interactive.value?.accept ?? []).map((a) => (a.includes('/') ? a : `.${a}`)).join(','),
  );

  function fileSuffix(name: string): string {
    const idx = name.lastIndexOf('.');
    return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
  }

  /** 三重校验:数量上限、accept 后缀白名单、maxSize(MB);返回错误文案或空串 */
  function validate(file: File): string {
    const cfg = interactive.value;
    if (cfg?.limit !== undefined && items.value.length >= cfg.limit) {
      return messages.limitReached();
    }
    const accept = cfg?.accept;
    if (accept && accept.length > 0) {
      const suffix = fileSuffix(file.name);
      const mimeOk = accept.some((a) => a.includes('/') && file.type === a);
      const extOk = accept.some((a) => !a.includes('/') && a.toLowerCase() === suffix);
      if (!mimeOk && !extOk) return messages.invalidType();
    }
    if (cfg?.maxSize !== undefined && file.size > cfg.maxSize * 1024 * 1024) {
      return messages.fileTooLarge();
    }
    return '';
  }

  async function startUpload(item: UploadItem) {
    const handler = interactive.value?.upload;
    // receipt 态无 handler,视图层已挡住选择入口;此处仅为类型守卫
    if (!handler || !item.rawFile) return;
    item.status = 'uploading';
    item.errorMessage = undefined;
    try {
      const result = await handler(item.rawFile);
      // 项可能在传输中被用户移除:幽灵成功事件与被移除的列表状态矛盾,直接丢弃结果
      if (!items.value.some((i) => i.uid === item.uid)) return;
      Object.assign(item, result, { status: 'done' as const, errorMessage: undefined });
      // success 外发必须是干净契约形:经 doneList 重建,不带 status/rawFile 等内部字段
      const clean = doneList().find((f) => f.uid === item.uid);
      if (!clean) return;
      emit('success', clean);
      emitDone();
    } catch (reason) {
      // 同上:已移除项的失败也不再外发
      if (!items.value.some((i) => i.uid === item.uid)) return;
      item.status = 'error';
      item.errorMessage = reason instanceof Error ? reason.message : messages.uploadFailed();
      emit('error', item, reason);
    }
  }

  /** 选择入口:逐个校验,通过即入队开传;校验失败聚合到内联错误区 */
  async function onPick(fileList: FileList | File[]) {
    if (disabled.value) return;
    const files = Array.from(fileList);
    const rejected: string[] = [];
    for (const file of files) {
      const failure = validate(file);
      if (failure) {
        rejected.push(failure);
        continue;
      }
      const item: UploadItem = {
        name: file.name,
        url: '',
        size: file.size,
        uid: nextUid(),
        status: 'uploading',
        rawFile: file,
      };
      items.value.push(item);
      // 必须传数组代理内的引用:startUpload 的状态写入若落在原始对象上,
      // 绕过响应式代理,视图不会随 uploading→done/error 转移更新;
      // 经长度守卫取值(lib ES2021 无 Array.at),显式携带 undefined 语义
      const tracked = items.value.length > 0 ? items.value[items.value.length - 1] : undefined;
      if (tracked) void startUpload(tracked);
    }
    notice.value = [...new Set(rejected)].join('; ');
  }

  /** error 项重试:回 uploading 并再次调用 handler */
  async function retry(item: UploadItem) {
    if (disabled.value || item.status !== 'error' || !item.rawFile) return;
    await startUpload(item);
  }

  /** 移除:beforeRemove 返回/resolve false 时保留;异步拦截不阻塞其他项 */
  async function remove(item: UploadItem) {
    if (disabled.value) return;
    const gate = interactive.value?.beforeRemove;
    if (gate) {
      const allowed = await gate(item);
      if (!allowed) return;
    }
    items.value = items.value.filter((i) => i.uid !== item.uid);
    emitDone();
  }

  function getUploadStatus(): { hasUploading: boolean; hasError: boolean } {
    return {
      hasUploading: items.value.some((i) => i.status === 'uploading'),
      hasError: items.value.some((i) => i.status === 'error'),
    };
  }

  function reset() {
    // receipt 是纯展示态:无内部列表可清,也绝不对只读回执外发 emit
    if (isReceipt.value) return;
    items.value = [];
    notice.value = '';
    emitDone();
  }

  const limitReached = computed(() => {
    const limit = interactive.value?.limit;
    return limit !== undefined && items.value.length >= limit;
  });

  return {
    isReceipt,
    disabled,
    multiple,
    items,
    displayItems,
    notice,
    acceptAttr,
    limitReached,
    onPick,
    retry,
    remove,
    getUploadStatus,
    reset,
  };
}
