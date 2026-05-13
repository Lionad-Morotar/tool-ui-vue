---
phase: 07-story-i18n
verified_at: "2026-04-13"
verifier: gsd-executor
---

# Phase 07 Verification: Story 结构重构与 i18n 解耦

## 验证目标

确认所有 story 文件已完成从平铺结构到目录结构的迁移，i18n 文案全部解耦到独立 locale 文件，且 TypeScript 编译无错误。

## 验证清单

### 1. 文件结构迁移

- [x] `src/stories/*.story.vue` 平铺文件已全部清理（0 个遗留）
- [x] 全部 29 个 story 目录结构已创建：`src/stories/{name}/index.story.vue`
  - approval-card, audio, chart, citation, code-block, code-diff, data-table, geo-map, image, image-gallery, instagram-post, item-carousel, landing, link-preview, linkedin-post, message-draft, option-list, order-summary, parameter-slider, plan, preferences-panel, progress-tracker, question-flow, stats-display, terminal, video, weather-widget, x-post, tailwind-test
- [x] 每个 story 目录包含 `i18n/zh.ts`, `i18n/en.ts`, `i18n/index.ts`

### 2. useStoryLocale 基础设施

- [x] `useStoryLocale` 支持双签名：`(labels: StoryLocaleLabels)`（向后兼容）和 `(key: string, messages: {zh, en})`（key-based）
- [x] `src/stories/_shared/use-story-locale.ts` 中包含 `StoryLocaleMessages` 类型和 `getPath` 辅助函数
- [x] `src/stories/_shared/index.ts` 导出了 `StoryLocaleMessages` 类型

### 3. Histoire 配置

- [x] `histoire.config.ts` 的 `tree.groups[].include` 同时匹配 `/${story}/index.story.vue` 和 `${story}.story.vue`
- [x] `src/stories/_shared/histoire-setup.ts` 的根重定向 hash 已更新为 `src-stories-landing-index-story-vue`
- [x] `landing/index.story.vue` 中所有内部 story href 已更新为目录路径格式（`-index-story-vue` 后缀）

### 4. 迁移质量

- [x] 所有 story 中的 `useStoryLocale({zh, en})` 内联调用已替换为 key-based 调用
- [x] 模板中残留的 `{{ useStoryLocale({...}) }}` 内联调用已提取为 script const 变量
- [x] 无未声明的 PascalCase 变量引用（所有 `useStoryLocale` const 声明已前置到使用点之前）

### 5. TypeScript 编译检查

```bash
npx vue-tsc --noEmit
```

- [x] `src/stories/**` 路径下零 TypeScript 错误
- [x] 修复了 `chart/i18n/en.ts` 和 `zh.ts` 中的数字开头 key（`24MonthFinancial` -> `month24Financial`）
- [x] 修复了 `weather-widget/i18n/en.ts` 中的多行字符串和未转义单引号问题
- [x] 修复了 `code-block/index.story.vue` 中未使用的 `supportedLanguages` 变量

## 例外说明

`packages/components/**` 中存在预先存在的 TypeScript 错误（`@lionad/vtu-core` 导出缺失），这些错误与 Phase 7 story 迁移无关，不在本阶段修复范围。

## 提交记录

1. `19bb7e1` feat(07-01): upgrade useStoryLocale to support key-based lookup
2. `2c5146e` feat(07-01): update Histoire config for directory-based story paths
3. `17d1711` feat(07-01): migrate link-preview to directory structure with extracted i18n
4. `...` Phase 7 Wave 2: bulk migration of remaining stories (07-02 ~ 07-12)
5. `f682306` fix(story-i18n): resolve TypeScript errors across migrated stories
6. `1ca82df` feat(07-story-i18n): migrate tailwind-test to directory structure

## 结论

Phase 07 所有目标和成功标准均已满足，可以标记为完成。
