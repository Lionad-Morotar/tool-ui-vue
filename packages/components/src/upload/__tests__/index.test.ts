import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { nextTick } from 'vue';
// 触发组件 locale 聚合注册:zhCNAll 自动 setMessages,useI18n 主分支拿到真实文案
import { enAll, zhCNAll } from '../../i18n';
import Upload from '../index.vue';
import {
  parseSerializableUpload,
  safeParseSerializableUpload,
  safeParseSerializableUploadReceipt,
} from '../schema';
import type { UploadedFile } from '../schema';

enableAutoUnmount(afterEach);

function makeFile(name = 'a.png', type = 'image/png', size = 1024): File {
  return new File([new Uint8Array(size)], name, { type });
}

/** jsdom 的 input.files 只读且无 DataTransfer,经 defineProperty 注入后派发 change */
async function chooseFiles(wrapper: ReturnType<typeof mount>, files: File[]) {
  const input = wrapper.find('input[type="file"]');
  Object.defineProperty(input.element, 'files', { value: files, configurable: true });
  await input.trigger('change');
  // handler 异步:让 promise 链落定
  await new Promise((r) => setTimeout(r, 0));
}

function okHandler(url = 'https://cdn.example.com/x.png') {
  return vi.fn(async (file: File): Promise<UploadedFile> => ({
    name: file.name,
    url,
    size: file.size,
  }));
}

/** 挂起的 handler:resolve 由测试手动控制,用于构造 uploading 中间态 */
function pendingHandler() {
  let resolveFn: (f: UploadedFile) => void = () => undefined;
  const gate = new Promise<UploadedFile>((r) => {
    resolveFn = r;
  });
  const upload = vi.fn((_file: File): Promise<UploadedFile> => gate);
  return { upload, resolve: (f: UploadedFile) => resolveFn(f) };
}

describe('upload', () => {
  describe('file selection', () => {
    test('renders a hidden file input and a trigger', () => {
      const wrapper = mount(Upload, { props: { id: 'u1', upload: okHandler() } });
      const input = wrapper.find('input[type="file"]');
      expect(input.exists()).toBe(true);
      expect(input.attributes('class')).toContain('hidden');
      expect(wrapper.find('[data-testid="upload-trigger"]').exists()).toBe(true);
    });

    // accept 契约对齐 86links:无点后缀数组,映射为 .png,.jpg 写进原生 accept;
    // 含 / 的项视为 MIME 原样透传
    test('maps extension accept list to dotted attribute', () => {
      const wrapper = mount(Upload, {
        props: { id: 'u1', upload: okHandler(), accept: ['png', 'jpg', 'image/webp'] },
      });
      expect(wrapper.find('input[type="file"]').attributes('accept')).toBe('.png,.jpg,image/webp');
    });

    test('multiple attribute follows the multiple prop', () => {
      const single = mount(Upload, { props: { id: 'u1', upload: okHandler() } });
      expect(single.find('input[type="file"]').attributes('multiple')).toBeUndefined();
      const multi = mount(Upload, { props: { id: 'u1', upload: okHandler(), multiple: true } });
      expect(multi.find('input[type="file"]').attributes('multiple')).toBeDefined();
    });

    test('disabled blocks the trigger and the input', () => {
      const wrapper = mount(Upload, {
        props: { id: 'u1', upload: okHandler(), disabled: true, modelValue: [{ name: 'a.png', url: 'https://x/a.png' }] },
      });
      expect(wrapper.find('input[type="file"]').attributes('disabled')).toBeDefined();
      expect(wrapper.find('[data-testid="upload-trigger"]').attributes('disabled')).toBeDefined();
      expect(wrapper.find('[data-testid="upload-remove"]').attributes('disabled')).toBeDefined();
    });
  });

  describe('transfer injection', () => {
    test('invokes the injected handler with the picked File', async () => {
      const upload = okHandler();
      const wrapper = mount(Upload, { props: { id: 'u1', upload } });
      await chooseFiles(wrapper, [makeFile('photo.png')]);
      expect(upload).toHaveBeenCalledTimes(1);
      expect(upload.mock.calls[0][0]).toBeInstanceOf(File);
      expect(upload.mock.calls[0][0].name).toBe('photo.png');
    });

    test('resolved result lands in v-model as a done entry', async () => {
      const upload = okHandler('https://cdn.example.com/photo.png');
      const wrapper = mount(Upload, { props: { id: 'u1', upload } });
      await chooseFiles(wrapper, [makeFile('photo.png')]);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toBeTruthy();
      const done = emitted!.at(-1)![0] as UploadedFile[];
      expect(done).toHaveLength(1);
      expect(done[0]).toMatchObject({
        name: 'photo.png',
        url: 'https://cdn.example.com/photo.png',
        size: 1024,
      });
      expect(typeof done[0].uid).toBe('string');
    });

    // handler reject 转 error 态:Error 取 message,非 Error 走兜底文案;
    // 队列中其他文件不被中断
    test('rejected handler marks the entry as error without interrupting others', async () => {
      const upload = vi.fn(async (file: File): Promise<UploadedFile> => {
        if (file.name === 'bad.png') throw new Error('boom');
        return { name: file.name, url: `https://x/${file.name}` };
      });
      const wrapper = mount(Upload, {
        props: { id: 'u1', upload, multiple: true },
      });
      await chooseFiles(wrapper, [makeFile('bad.png'), makeFile('good.png')]);
      expect(wrapper.text()).toContain('boom');
      expect(wrapper.emitted('error')).toBeTruthy();
      const done = wrapper.emitted('update:modelValue')!.at(-1)![0] as UploadedFile[];
      expect(done).toHaveLength(1);
      expect(done[0].name).toBe('good.png');
      expect(wrapper.find('[data-testid="upload-item"][data-status="error"]').exists()).toBe(true);
    });

    test('non-Error rejection falls back to a generic message', async () => {
      const upload = vi.fn(async (): Promise<UploadedFile> => {

        throw 'string failure';
      });
      const wrapper = mount(Upload, { props: { id: 'u1', upload } });
      await chooseFiles(wrapper, [makeFile()]);
      expect(wrapper.find('[data-testid="upload-item"][data-status="error"]').exists()).toBe(true);
      expect(wrapper.text()).not.toContain('string failure');
    });
  });

  describe('state machine', () => {
    // 重试:error 项重新走 handler,成功后转 done 并进入 v-model
    test('retry re-invokes the handler and transitions the entry to done', async () => {
      const upload = vi.fn(
        async (file: File): Promise<UploadedFile> => ({ name: file.name, url: 'https://x/a.png' })
      );
      upload.mockRejectedValueOnce(new Error('boom'));
      const wrapper = mount(Upload, { props: { id: 'u1', upload } });
      await chooseFiles(wrapper, [makeFile()]);
      expect(wrapper.find('[data-testid="upload-item"][data-status="error"]').exists()).toBe(true);

      await wrapper.find('[data-testid="upload-retry"]').trigger('click');
      await new Promise((r) => setTimeout(r, 0));

      expect(upload).toHaveBeenCalledTimes(2);
      expect(wrapper.find('[data-testid="upload-item"][data-status="done"]').exists()).toBe(true);
      const done = wrapper.emitted('update:modelValue')!.at(-1)![0] as UploadedFile[];
      expect(done).toHaveLength(1);
      expect(done[0].url).toBe('https://x/a.png');
    });

    // v-model 只外泄 done 集:handler 未 resolve 前不产生任何 update:modelValue
    test('does not emit update:modelValue while the transfer is pending', async () => {
      const { upload } = pendingHandler();
      const wrapper = mount(Upload, { props: { id: 'u1', upload } });
      await chooseFiles(wrapper, [makeFile()]);
      expect(wrapper.find('[data-testid="upload-item"][data-status="uploading"]').exists()).toBe(true);
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    // 回显竞态:外部 modelValue 更新只替换 done 集,进行中的 uploading 项保留
    test('external modelValue sync preserves in-flight entries', async () => {
      const { upload, resolve } = pendingHandler();
      const wrapper = mount(Upload, { props: { id: 'u1', upload } });
      await chooseFiles(wrapper, [makeFile('a.png')]);

      await wrapper.setProps({
        modelValue: [{ name: 'b.png', url: 'https://x/b.png', uid: 'ext-b' }],
      });
      expect(wrapper.find('[data-testid="upload-item"][data-status="uploading"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('b.png');

      resolve({ name: 'a.png', url: 'https://x/a.png' });
      await new Promise((r) => setTimeout(r, 0));
      const done = wrapper.emitted('update:modelValue')!.at(-1)![0] as UploadedFile[];
      expect(done.map((f) => f.name).sort()).toEqual(['a.png', 'b.png']);
    });
  });

  describe('validation', () => {
    // accept 白名单:不符文件不入队、不调 handler,组件级提示进内联错误区
    // (全局 setup 已注册英文 locale,断言英文案)
    test('rejects files outside the accept list with an inline notice', async () => {
      const upload = okHandler();
      const wrapper = mount(Upload, { props: { id: 'u1', upload, accept: ['png'] } });
      await chooseFiles(wrapper, [makeFile('a.gif', 'image/gif')]);
      expect(upload).not.toHaveBeenCalled();
      expect(wrapper.find('[data-testid="upload-item"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="upload-notice"]').text()).toContain('File type not allowed');
    });

    test('rejects oversized files with an inline notice', async () => {
      const upload = okHandler();
      const wrapper = mount(Upload, { props: { id: 'u1', upload, maxSize: 0.5 } });
      await chooseFiles(wrapper, [makeFile('big.png', 'image/png', 1024 * 1024)]);
      expect(upload).not.toHaveBeenCalled();
      expect(wrapper.find('[data-testid="upload-notice"]').text()).toContain('File exceeds the size limit');
    });

    // limit 计数含进行中项:第一击入队后即占满名额
    test('rejects picks beyond the limit', async () => {
      const upload = okHandler();
      const wrapper = mount(Upload, { props: { id: 'u1', upload, multiple: true, limit: 1 } });
      await chooseFiles(wrapper, [makeFile('a.png'), makeFile('b.png')]);
      expect(upload).toHaveBeenCalledTimes(1);
      expect(wrapper.find('[data-testid="upload-notice"]').text()).toContain('File limit reached');
    });
  });

  describe('variants', () => {
    test('text variant renders done entries as links', async () => {
      const upload = okHandler('https://cdn.example.com/doc.pdf');
      const wrapper = mount(Upload, { props: { id: 'u1', upload } });
      await chooseFiles(wrapper, [makeFile('doc.pdf', 'application/pdf')]);
      const link = wrapper.find('[data-testid="upload-item"] a');
      expect(link.exists()).toBe(true);
      expect(link.attributes('href')).toBe('https://cdn.example.com/doc.pdf');
      expect(link.attributes('target')).toBe('_blank');
      expect(link.text()).toBe('doc.pdf');
    });

    // picture-card:网格 + 追加位;进行中项无 url 时渲染占位而非破图
    test('picture-card renders grid with append trigger and progress overlay', async () => {
      const { upload, resolve } = pendingHandler();
      const wrapper = mount(Upload, { props: { id: 'u1', upload, variant: 'picture-card' } });
      expect(wrapper.find('[data-testid="upload-grid"]').exists()).toBe(true);
      await chooseFiles(wrapper, [makeFile()]);
      expect(wrapper.find('[data-testid="upload-progress"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="upload-item"] img').exists()).toBe(false);

      resolve({ name: 'a.png', url: 'https://x/a.png' });
      await new Promise((r) => setTimeout(r, 0));
      expect(wrapper.find('[data-testid="upload-item"] img').attributes('src')).toBe('https://x/a.png');
      expect(wrapper.find('[data-testid="upload-progress"]').exists()).toBe(false);
    });

    // 追加位在达 limit 时消失;text 形态 trigger 保留但禁用
    test('picture-card hides the append trigger at the limit', () => {
      const wrapper = mount(Upload, {
        props: {
          id: 'u1',
          upload: okHandler(),
          variant: 'picture-card',
          limit: 1,
          files: [{ name: 'a.png', url: 'https://x/a.png' }],
        },
      });
      expect(wrapper.find('[data-testid="upload-trigger"]').exists()).toBe(false);
      const text = mount(Upload, {
        props: {
          id: 'u2',
          upload: okHandler(),
          limit: 1,
          files: [{ name: 'a.png', url: 'https://x/a.png' }],
        },
      });
      expect(text.find('[data-testid="upload-trigger"]').attributes('disabled')).toBeDefined();
    });
  });

  describe('beforeRemove', () => {
    // 移除拦截:gate 拒绝时项保留且不产生任何 emit
    test('keeps the entry when the gate refuses', async () => {
      const wrapper = mount(Upload, {
        props: {
          id: 'u1',
          upload: okHandler(),
          files: [{ name: 'a.png', url: 'https://x/a.png' }],
          beforeRemove: () => false,
        },
      });
      await wrapper.find('[data-testid="upload-remove"]').trigger('click');
      await new Promise((r) => setTimeout(r, 0));
      expect(wrapper.find('[data-testid="upload-item"]').exists()).toBe(true);
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    test('removes the entry and emits when the gate resolves true', async () => {
      const wrapper = mount(Upload, {
        props: {
          id: 'u1',
          upload: okHandler(),
          files: [{ name: 'a.png', url: 'https://x/a.png' }],
          beforeRemove: async () => true,
        },
      });
      await wrapper.find('[data-testid="upload-remove"]').trigger('click');
      await new Promise((r) => setTimeout(r, 0));
      expect(wrapper.find('[data-testid="upload-item"]').exists()).toBe(false);
      const done = wrapper.emitted('update:modelValue')!.at(-1)![0] as UploadedFile[];
      expect(done).toEqual([]);
    });
  });

  describe('receipt', () => {
    // 回执模式:choice 只读展示,无触发/移除/重试入口
    test('renders the choice list read-only', () => {
      const wrapper = mount(Upload, {
        props: {
          id: 'u1',
          choice: [
            { name: 'a.png', url: 'https://x/a.png' },
            { name: 'b.png', url: 'https://x/b.png' },
          ],
        },
      });
      expect(wrapper.findAll('[data-testid="upload-item"]')).toHaveLength(2);
      expect(wrapper.find('[data-testid="upload-trigger"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="upload-remove"]').exists()).toBe(false);
      expect(wrapper.find('a[href="https://x/a.png"]').exists()).toBe(true);
    });
  });

  describe('schema', () => {
    test('parses a valid serializable payload', () => {
      const parsed = parseSerializableUpload({
        id: 'u1',
        title: '附件',
        accept: ['png', 'image/webp'],
        maxSize: 5,
        limit: 3,
        multiple: true,
        variant: 'picture-card',
      });
      expect(parsed.variant).toBe('picture-card');
      expect(parsed.limit).toBe(3);
    });

    // 顶层 strict:未知 key 拒绝,防止脏字段潜入
    test('rejects unknown top-level keys', () => {
      expect(safeParseSerializableUpload({ id: 'u1', onUpload: 'x' })).toBeNull();
    });

    // 回执契约:choice 为已上传文件列表,缺失即非法
    test('receipt requires a choice list of uploaded files', () => {
      expect(
        safeParseSerializableUploadReceipt({
          id: 'u1',
          choice: [{ name: 'a.png', url: 'https://x/a.png' }],
        })
      ).not.toBeNull();
      expect(safeParseSerializableUploadReceipt({ id: 'u1' })).toBeNull();
    });

    // UploadedFile loose:消费方扩展字段(如 versionId)透传保留
    test('uploaded file entries pass through extension fields', () => {
      const parsed = parseSerializableUpload({
        id: 'u1',
        files: [{ name: 'a.png', url: 'https://x/a.png', versionId: 'v123' }],
      });
      expect(parsed.files?.[0]).toMatchObject({ versionId: 'v123' });
    });
  });

  describe('i18n wiring', () => {
    // 组件 locale 文件放好即被聚合注册,双语命名空间齐备
    test('upload messages are aggregated into both locales', () => {
      const zh = zhCNAll as unknown as { upload: Record<string, string> };
      const en = enAll as unknown as { upload: Record<string, string> };
      expect(zh.upload.selectFile).toBe('选择文件');
      expect(en.upload.selectFile).toBe('Select file');
    });
  });

  describe('expose', () => {
    // getUploadStatus:父表单提交闸口的数据源
    test('getUploadStatus reflects in-flight and error states', async () => {
      const { upload, resolve } = pendingHandler();
      const wrapper = mount(Upload, { props: { id: 'u1', upload } });
      const vm = wrapper.vm as unknown as {
        getUploadStatus: () => { hasUploading: boolean; hasError: boolean };
      };
      expect(vm.getUploadStatus()).toEqual({ hasUploading: false, hasError: false });
      await chooseFiles(wrapper, [makeFile()]);
      expect(vm.getUploadStatus()).toEqual({ hasUploading: true, hasError: false });
      resolve({ name: 'a.png', url: 'https://x/a.png' });
      await new Promise((r) => setTimeout(r, 0));
      expect(vm.getUploadStatus()).toEqual({ hasUploading: false, hasError: false });
    });

    // reset:清空内部列表并外发空 done 集
    test('reset clears entries and emits an empty model', async () => {
      const wrapper = mount(Upload, {
        props: { id: 'u1', upload: okHandler(), files: [{ name: 'a.png', url: 'https://x/a.png' }] },
      });
      const vm = wrapper.vm as unknown as { reset: () => void };
      expect(wrapper.find('[data-testid="upload-item"]').exists()).toBe(true);
      vm.reset();
      await nextTick();
      expect(wrapper.find('[data-testid="upload-item"]').exists()).toBe(false);
      const done = wrapper.emitted('update:modelValue')!.at(-1)![0] as UploadedFile[];
      expect(done).toEqual([]);
    });
  });

  describe('race and contract guards', () => {
    // 传输中被移除的项:handler 随后 resolve 不得再产生 success/modelValue 幽灵事件
    test('dropped mid-flight entries never emit after the handler resolves', async () => {
      const { upload, resolve } = pendingHandler();
      const wrapper = mount(Upload, { props: { id: 'u1', upload } });
      await chooseFiles(wrapper, [makeFile()]);
      await wrapper.find('[data-testid="upload-remove"]').trigger('click');
      await new Promise((r) => setTimeout(r, 0));
      expect(wrapper.find('[data-testid="upload-item"]').exists()).toBe(false);

      resolve({ name: 'a.png', url: 'https://x/a.png' });
      await new Promise((r) => setTimeout(r, 0));
      expect(wrapper.emitted('success')).toBeUndefined();
      // 唯一的 update:modelValue 是移除时空集,resolve 后不得追加
      const updates = wrapper.emitted('update:modelValue')!;
      expect(updates).toHaveLength(1);
      expect(updates[0][0]).toEqual([]);
    });

    // receipt 是纯展示态:reset 不外发任何 emit
    test('reset is a no-op in receipt mode', () => {
      const wrapper = mount(Upload, {
        props: { id: 'u1', choice: [{ name: 'a.png', url: 'https://x/a.png' }] },
      });
      (wrapper.vm as unknown as { reset: () => void }).reset();
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      expect(wrapper.find('[data-testid="upload-item"]').exists()).toBe(true);
    });

    // picture-card 形态的错误遮罩必须就近展示失败原因
    test('picture-card error overlay surfaces the failure message', async () => {
      const upload = vi.fn(async (): Promise<UploadedFile> => {
        throw new Error('签名过期');
      });
      const wrapper = mount(Upload, { props: { id: 'u1', upload, variant: 'picture-card' } });
      await chooseFiles(wrapper, [makeFile()]);
      expect(wrapper.find('[data-testid="upload-item"][data-status="error"]').text()).toContain(
        '签名过期'
      );
    });

    // 同 uid 回流:保留身份但内容以外部为准(重签 url 等字段更新必须生效)
    test('external resync refreshes fields of entries with the same uid', async () => {
      const wrapper = mount(Upload, {
        props: {
          id: 'u1',
          upload: okHandler(),
          modelValue: [{ uid: 'ext-1', name: 'a.png', url: 'https://x/old.png' }],
        },
      });
      expect(wrapper.find('[data-testid="upload-item"] a').attributes('href')).toBe(
        'https://x/old.png'
      );
      await wrapper.setProps({
        modelValue: [{ uid: 'ext-1', name: 'a.png', url: 'https://x/new.png' }],
      });
      expect(wrapper.find('[data-testid="upload-item"] a').attributes('href')).toBe(
        'https://x/new.png'
      );
    });

    // receipt schema 拒绝交互专属字段,脏数据不得潜入序列化层
    test('receipt schema rejects interactive-only fields', () => {
      expect(
        safeParseSerializableUploadReceipt({
          id: 'u1',
          choice: [{ name: 'a.png', url: 'https://x/a.png' }],
          files: [{ name: 'b.png', url: 'https://x/b.png' }],
        })
      ).toBeNull();
      expect(
        safeParseSerializableUploadReceipt({
          id: 'u1',
          choice: [{ name: 'a.png', url: 'https://x/a.png' }],
          accept: ['png'],
        })
      ).toBeNull();
    });

    // trigger 文案随 multiple 切换单复数(全局 setup 英文 locale)
    test('trigger copy follows the multiple prop', () => {
      const single = mount(Upload, { props: { id: 'u1', upload: okHandler() } });
      expect(single.find('[data-testid="upload-trigger"]').text()).toContain('Select file');
      const multi = mount(Upload, { props: { id: 'u2', upload: okHandler(), multiple: true } });
      expect(multi.find('[data-testid="upload-trigger"]').text()).toContain('Select files');
    });
  });
});
