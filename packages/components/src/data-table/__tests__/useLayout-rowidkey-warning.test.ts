import { afterEach, describe, expect, test, vi } from 'vitest';

/**
 * useLayout 缺 rowIdKey 警告的 once 语义测试。
 *
 * 警告目的是提示调用方补 rowIdKey,同页多表实例(genui 流式物料常态)各 setup
 * 一次属同一问题,警一次足够定位——刷屏会淹掉真错误。模块级去重,页面刷新重置。
 *
 * 每个用例经 vi.resetModules + 动态 import 拿 fresh 模块态(flag 归零)隔离。
 */
describe('useLayout — 缺 rowIdKey 警告 once 语义', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function importFresh() {
    vi.resetModules();
    return await import('../states/useLayout');
  }

  function callUseLayout(useLayout: typeof import('../states/useLayout').useLayout, rowIdKey?: string) {
    return useLayout({
      columns: [{ key: 'name', label: 'Name' }],
      data: [{ name: 'Alpha' }],
      rowIdKey,
      layout: 'auto',
      id: 't1',
    });
  }

  test('同页两个缺 rowIdKey 的实例只警一次(once 兑现)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { useLayout } = await importFresh();

    callUseLayout(useLayout);
    callUseLayout(useLayout);

    const rowIdKeyWarns = warnSpy.mock.calls.filter((args) =>
      String(args[0]).includes('Missing `rowIdKey`'),
    );
    expect(rowIdKeyWarns).toHaveLength(1);
  });

  test('传 rowIdKey 不警', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { useLayout } = await importFresh();

    callUseLayout(useLayout, 'name');

    expect(
      warnSpy.mock.calls.filter((args) => String(args[0]).includes('Missing `rowIdKey`')),
    ).toHaveLength(0);
  });

  test('缺 rowIdKey 但空数据不警(无行则无 key 漂移面)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { useLayout } = await importFresh();

    useLayout({
      columns: [{ key: 'name', label: 'Name' }],
      data: [],
      rowIdKey: undefined,
      layout: 'auto',
      id: 't1',
    });

    expect(
      warnSpy.mock.calls.filter((args) => String(args[0]).includes('Missing `rowIdKey`')),
    ).toHaveLength(0);
  });
});
