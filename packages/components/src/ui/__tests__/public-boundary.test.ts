import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

/**
 * ui/* 私有边界断言
 *
 * ui 原子层是 components 包的内部实现细节(私有底座,对齐 reka-ui 薄封装),
 * 公开面只有两个泄漏通道:主入口 src/index.ts 的导出、package.json 的 subpath exports。
 * 两者都在这里锁死——新增公开通道必须先过这道断言的显式修改。
 */

const pkgRoot = resolve(__dirname, '../../..');

describe('ui/* private boundary', () => {
  test('main entry does not re-export the ui layer', () => {
    const entry = readFileSync(resolve(pkgRoot, 'src/index.ts'), 'utf8');
    // 单一正则覆盖全部泄漏形态:`export { X } from './ui'`、`from './ui/rating'` 子路径、
    // `export * from './ui'` 都含 `from './ui'` 片段;不再单列 export-star 正则,
    // 避免对 './ui-kit' 之类合法前缀的误伤
    expect(entry).not.toMatch(/from\s+['"]\.\/ui(\/[^'"]*)?['"]/);
  });

  test('package.json exposes no ui subpath', () => {
    const pkg = JSON.parse(readFileSync(resolve(pkgRoot, 'package.json'), 'utf8')) as {
      exports: Record<string, unknown>;
    };
    const leaked = Object.keys(pkg.exports).filter((k) => k === './ui' || k.startsWith('./ui/'));
    expect(leaked).toEqual([]);
  });

  test('ui barrel is not part of the published files allowlist surface', () => {
    // files 字段只含 dist 产物;'./src' 与 'src' 在 npm 规范化下等价,统一剥前缀再断言
    const pkg = JSON.parse(readFileSync(resolve(pkgRoot, 'package.json'), 'utf8')) as {
      files?: string[];
    };
    const normalized = (pkg.files ?? []).map((f) => f.replace(/^\.\//, ''));
    expect(normalized).not.toContain('src');
  });
});
