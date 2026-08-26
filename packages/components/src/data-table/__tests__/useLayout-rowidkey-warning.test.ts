import { afterEach, describe, expect, test, vi } from 'vitest';

/**
 * useLayout 行键兜底链测试:显式 rowIdKey → 常见唯一字段探测 → 行号。
 *
 * 警告语义:只在「显式缺失且探测失败(真落行号)」时警一次——探测命中说明
 * 数据里已有可用唯一字段,流式初帧 rowIdKey 尚未到达的场景不该被误报;
 * 同页多表实例(genui 流式物料常态)各 setup 一次属同一问题,警一次足够定位。
 * 模块级去重,页面刷新重置。
 *
 * 每个用例经 vi.resetModules + 动态 import 拿 fresh 模块态(flag 归零)隔离。
 * 行数据用 company/score 等非候选字段,默认走不进探测的路径。
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
      columns: [{ key: 'company', label: 'Company' }],
      data: [{ company: 'Alpha', score: 1 }],
      rowIdKey,
      layout: 'auto',
      id: 't1',
    });
  }

  test('同页两个缺 rowIdKey 且探测失败的实例只警一次(once 兑现)', async () => {
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

    callUseLayout(useLayout, 'company');

    expect(
      warnSpy.mock.calls.filter((args) => String(args[0]).includes('Missing `rowIdKey`')),
    ).toHaveLength(0);
  });

  test('缺 rowIdKey 但空数据不警(无行则无 key 漂移面)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { useLayout } = await importFresh();

    useLayout({
      columns: [{ key: 'company', label: 'Company' }],
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

describe('useLayout — 行键探测兜底', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function importFresh() {
    vi.resetModules();
    return await import('../states/useLayout');
  }

  function layoutWith(
    useLayout: typeof import('../states/useLayout').useLayout,
    data: import('../schema').RowData[],
    rowIdKey?: string,
  ) {
    return useLayout({
      columns: [{ key: 'company', label: 'Company' }],
      data,
      rowIdKey,
      layout: 'auto',
      id: 't1',
    });
  }

  test('缺 rowIdKey 但 name 全行唯一:静默不警,getRowId 用探测字段', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { useLayout } = await importFresh();

    const layout = layoutWith(useLayout, [
      { name: 'Alpha', score: 1 },
      { name: 'Beta', score: 2 },
    ]);

    expect(layout.getRowId({ name: 'Alpha', score: 1 }, 0)).toBe('Alpha');
    expect(
      warnSpy.mock.calls.filter((args) => String(args[0]).includes('Missing `rowIdKey`')),
    ).toHaveLength(0);
  });

  test('候选字段重复(name 撞车):探测跳过该字段,警 + 行号兜底', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { useLayout } = await importFresh();

    const layout = layoutWith(useLayout, [
      { name: 'Alpha', score: 1 },
      { name: 'Alpha', score: 2 },
    ]);

    expect(layout.getRowId({ name: 'Alpha', score: 1 }, 0)).toBe('row-0');
    expect(layout.getRowId({ name: 'Alpha', score: 2 }, 1)).toBe('row-1');
    expect(
      warnSpy.mock.calls.filter((args) => String(args[0]).includes('Missing `rowIdKey`')),
    ).toHaveLength(1);
  });

  test('候选字段含空值(某行 name 为 null):该字段整体不可用,行号兜底', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { useLayout } = await importFresh();

    const layout = layoutWith(useLayout, [
      { name: 'Alpha', score: 1 },
      { name: null, score: 2 },
    ]);

    expect(layout.getRowId({ name: 'Alpha', score: 1 }, 0)).toBe('row-0');
  });

  test('显式 rowIdKey 优先于探测:探测不越权接管', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { useLayout } = await importFresh();

    const layout = layoutWith(
      useLayout,
      [
        { id: 'a1', name: 'Alpha', score: 1 },
        { id: 'a2', name: 'Beta', score: 2 },
      ],
      'id',
    );

    expect(layout.getRowId({ id: 'a1', name: 'Alpha', score: 1 }, 0)).toBe('a1');
  });
});
