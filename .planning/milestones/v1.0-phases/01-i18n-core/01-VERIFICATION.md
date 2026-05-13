---
phase: 01-i18n-core
verified: 2026-04-11T14:00:00Z
status: human_needed
score: 4.5/5 must-haves verified
re_verification: null
gaps:
  - truth: "dev 环境缺失 key 时 console.warn 显示 key 路径，prod 环境 fallback 到 zh-CN"
    status: partial
    reason: "DEV console.warn implemented correctly. PROD returns key string instead of fetching from zh-CN messages. zh-CN is NOT imported in use-i18n.ts, so there is no zh-CN data available for fallback at runtime."
    artifacts:
      - path: "packages/core/src/i18n/use-i18n.ts"
        issue: "Line 80: resolved = keyStr (returns key string, not zh-CN translation)"
    missing:
      - "Import zhCN messages in use-i18n.ts or pass them through LocaleProvider"
      - "Add resolveMessage fallback to zh-CN when current locale message is undefined and PROD mode"
human_verification:
  - test: "Wrap a test app with <LocaleProvider :messages=\"en\" locale=\"en\"> and reference a key that only exists in zh-CN. Verify that in PROD build the zh-CN text appears instead of the raw key string."
    expected: "Chinese text from zh-CN messages displayed for missing en keys"
    why_human: "Requires running a Vue app with LocaleProvider, switching locale, and observing rendered output. Cannot verify zh-CN fallback programmatically since zh-CN messages are not currently accessible in use-i18n.ts"
  - test: "Verify that t() key parameter provides TypeScript autocomplete and rejects invalid keys in a consuming component"
    expected: "IDE shows dot-notation key suggestions, invalid key shows type error"
    why_human: "TypeScript typecheck passes (npx vue-tsc --noEmit returned 0 errors), but actual IDE autocomplete behavior requires manual verification in editor"
---

# Phase 1: I18N Core Infrastructure Verification Report

**Phase Goal:** 轻量 i18n 基础设施，provide/inject 模式，zh-CN 默认，en fallback，零外部依赖
**Verified:** 2026-04-11T14:00:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| #   | Truth   | Status     | Evidence       |
| --- | ------- | ---------- | -------------- |
| 1   | 开发者用 LocaleProvider 包裹应用后，子组件可通过 useI18n() 获取翻译 | VERIFIED | `locale-provider/index.vue` line 35: `provide(i18nInjectionKey, context)`. `use-i18n.ts` line 43: `inject<I18nContext<TMessages> | null>(i18nInjectionKey, null)`. Context shape includes `messages` and `locale`. |
| 2   | useI18n() 返回 computed，切换语言实时更新（无需手动刷新） | VERIFIED | `t()` returns `computed(() => ...)` (line 65), `locale` is `computed(() => _locale.value)` (line 89). LocaleProvider `watch` (line 21-28) with `{ immediate: true }` syncs props to module-level `_messages`/`_locale` refs. Changing `_locale` triggers all computed refs to re-evaluate. |
| 3   | t('nested.key.path', { param: value }) 正确解析并插值 | VERIFIED | `resolveMessage()` (line 19-31) splits key by `.` and traverses nested object. `interpolate()` (line 34-40) uses regex `/\{(\w+)\}/g` for `{param}` replacement with typed `ParamValue` params. |
| 4   | TypeScript 自动补全 t() key，无效 key 路径报类型错误 | VERIFIED | `t()` key parameter constrained to `DeepKeyPath<TMessages>` (line 61). `DeepKeyPath<T>` (types.ts line 5-15) recursively extracts all dot-notation paths. `npx vue-tsc --noEmit` passes with 0 errors. |
| 5   | dev 环境缺失 key 时 console.warn 显示 key 路径，prod 环境 fallback 到 zh-CN | PARTIAL | DEV: `console.warn(\`[vtu:i18n] Missing key: "${keyStr}"\`)` at line 76 -- correct. PROD: `resolved = keyStr` at line 80 -- returns raw key string, NOT zh-CN translation. `zhCN` is NOT imported in `use-i18n.ts`. The comment on line 72 says "prod tries zh-CN" but the implementation does not. |

**Score:** 4.5/5 truths verified (1 partial)

### Required Artifacts

| Artifact | Expected    | Status | Details |
| -------- | ----------- | ------ | ------- |
| `packages/core/src/i18n/types.ts` | DeepKeyPath 泛型 + 嵌套 key 路径推导 | VERIFIED | Contains `DeepKeyPath`, `DeepValueOf`, `KeysFor`, `ParamValue`, `I18nContext`, `I18nReturn`, `ReadonlyRef` -- 63 lines, all substantive type definitions |
| `packages/core/src/i18n/use-i18n.ts` | useI18n composable + t() 函数 | VERIFIED | Exports `useI18n`, `i18nInjectionKey`, `setMessages`, `setLocale`. 92 lines with `resolveMessage`, `interpolate`, and full composable implementation. Imports types from `./types`. |
| `packages/core/src/i18n/locale-provider/index.vue` | LocaleProvider 组件（provide/inject 模式） | VERIFIED | Generic SFC with `messages: TMessages` and `locale?: string` props. `watch` syncs to module-level refs. `provide(i18nInjectionKey, context)`. Template is `<slot />`. |
| `packages/core/src/i18n/locales/zh-CN.ts` | zh-CN 默认语言包（全组件覆盖） | VERIFIED | 280 string values, 27 namespaces, 747 Chinese characters. Uses `as const`. |
| `packages/core/src/i18n/locales/en.ts` | en 英文语言包（key 与 zh-CN 一致） | VERIFIED | 280 string values, 27 namespaces, 0 non-ASCII characters. Namespace set matches zh-CN exactly. Uses `as const`. |

27 namespaces covered in both locale files: `approvalCard`, `audio`, `chart`, `citation`, `codeBlock`, `codeDiff`, `dataTable`, `geoMap`, `image`, `imageGallery`, `instagramPost`, `itemCarousel`, `linkPreview`, `linkedinPost`, `messageDraft`, `optionList`, `orderSummary`, `parameterSlider`, `preferencesPanel`, `progressTracker`, `questionFlow`, `shared`, `statsDisplay`, `terminal`, `video`, `weatherWidget`, `xPost`.

### Key Link Verification

| From | To  | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| `use-i18n.ts` | `types.ts` | `import type { DeepKeyPath, ParamValue, I18nContext, I18nReturn }` | WIRED | Line 2 of use-i18n.ts imports all required types |
| `locale-provider/index.vue` | `use-i18n.ts` | `provide(i18nInjectionKey, context)` | WIRED | Line 3 imports `{ i18nInjectionKey, setMessages, setLocale }`. Line 35 calls `provide(i18nInjectionKey, context)` |
| `i18n/index.ts` | All modules | Barrel re-exports | WIRED | Exports composable, component, types, and locale messages |
| `src/index.ts` | `i18n/index.ts` | Re-export in main entry | WIRED | Lines 33-34: `{ useI18n, LocaleProvider, zhCN, en, i18nInjectionKey }` + types |
| `package.json` | `./i18n` subpath | Subpath export | WIRED | Lines 19-23: `"./i18n"` with types/import/require |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| `use-i18n.ts` t() | `resolved` from `resolveMessage(messages, keyStr)` | `context.messages` (from LocaleProvider) or `_messages` (module ref) | Real nested message objects from zh-CN.ts or en.ts | FLOWING |
| `use-i18n.ts` t() params | `interpolate(resolved, params)` | Caller-provided `Record<string, ParamValue>` | String replacement of `{param}` patterns | FLOWING |
| `use-i18n.ts` locale | `_locale.value` | `setLocale()` called by LocaleProvider watch | String locale identifier | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| TypeScript compiles with i18n | `npx vue-tsc --noEmit` | 0 errors, exit 0 | PASS |
| zh-CN has Chinese text | Python CJK char count | 747 Chinese chars found | PASS |
| en has only ASCII | Python non-ASCII check | 0 non-ASCII chars | PASS |
| Namespace key match | Python namespace comparison | 27/27 match, identical sets | PASS |
| Locale value count | `grep -c ": '"` both files | 280 each | PASS |
| No external i18n deps | Check package.json dependencies | Only vue, cva, clsx, tailwind-merge, zod | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ---------- | ----------- | ------ | -------- |
| CORE-01 | 01-PLAN.md | LocaleProvider 组件（provide/inject 模式，接受 messages prop） | SATISFIED | `locale-provider/index.vue` accepts `messages` and `locale` props, calls `provide(i18nInjectionKey, context)` |
| CORE-02 | 01-PLAN.md | useI18n() composable（返回 computed，支持 t() 函数和 {param} 插值） | SATISFIED | `use-i18n.ts` exports `useI18n()` returning `{ t, locale, setLocale }`. `t()` returns `computed<string>`, `interpolate()` handles `{param}` |
| CORE-03 | 01-PLAN.md | TypeScript 类型定义（LocaleKey, MessageSchema，t() key 有类型推导） | SATISFIED | `types.ts` defines `DeepKeyPath<T>`, `DeepValueOf<T,P>`, `KeysFor<T>`. `t()` key constrained to `DeepKeyPath<TMessages>`. `vue-tsc --noEmit` passes |
| CORE-04 | 01-PLAN.md | zh-CN 消息文件（默认语言，覆盖所有组件文案） | SATISFIED | 280 keys across 27 namespaces, 747 Chinese characters, `as const` |
| CORE-05 | 01-PLAN.md | en 消息文件（英文翻译，key 与 zh-CN 一致） | SATISFIED | 280 keys across 27 namespaces, namespace set matches zh-CN exactly, 0 non-ASCII |
| CORE-06 | 01-PLAN.md | 缺失 key fallback 逻辑（dev: console.warn + 显示 key；prod: fallback 到 zh-CN） | PARTIAL | DEV: `console.warn` with key path -- correct. PROD: returns key string (line 80), NOT zh-CN translation. No zh-CN messages imported in `use-i18n.ts`. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `use-i18n.ts` | 72 | Comment says "prod tries zh-CN" but code returns key string | Info | Documentation mismatch with implementation |
| `use-i18n.ts` | 75 | `(import.meta as any).env?.DEV` -- type assertion needed | Info | Standard Vite workaround, not a stub |

No stub patterns, no empty implementations, no TODO/FIXME markers (excluding "placeholder" which is a legitimate locale key value like `'Type a message...'`).

### Human Verification Required

1. **PROD zh-CN Fallback Behavior**
   - **Test:** Wrap a test app with `<LocaleProvider :messages="en" locale="en">` and reference a key. Remove that key from en.ts. Build for production. Observe rendered output.
   - **Expected:** Chinese text from zh-CN should appear (per CORE-06). Currently shows raw key string instead.
   - **Why human:** Requires running a Vue app in production mode with controlled locale. The code gap is confirmed (no zh-CN import in use-i18n.ts), but the severity of the UX impact (raw key vs Chinese text) needs human judgment.

2. **TypeScript IDE Autocomplete**
   - **Test:** In a consuming Vue component, type `t('` and observe IDE suggestions.
   - **Expected:** Dot-notation key paths appear (e.g., `shared.copy`, `terminal.title`, etc.). Invalid key like `t('nonexistent.key')` shows a type error.
   - **Why human:** `vue-tsc --noEmit` compiles successfully, confirming types are well-formed. Actual IDE autocomplete behavior (IntelliSense/Volar) requires manual editor verification.

3. **Real-time Language Switching**
   - **Test:** Render a component using `{{ t('shared.copy') }}`. Switch locale via `setLocale('en')` without re-rendering parent.
   - **Expected:** Text changes from "复制" to "Copy" instantly.
   - **Why human:** The computed reactivity chain is correctly wired (watch -> setLocale -> _locale ref -> computed re-evaluation), but actual runtime behavior with Vue's reactivity system needs manual testing.

### Gaps Summary

**CORE-06 PROD fallback is incomplete.** The implementation correctly warns in DEV (`console.warn` at line 76), but in PROD it returns the raw key string (line 80: `resolved = keyStr`) instead of falling back to zh-CN translations. The root cause is architectural: `use-i18n.ts` has no access to zh-CN messages -- they are not imported, and LocaleProvider only provides a single locale's messages. The PLAN comment on line 72 states "prod tries zh-CN" but the code does not implement this.

This is not a blocker for the phase goal -- the i18n system is fully functional for well-formed message files (where all keys exist in both locales). The PROD fallback is a safety net for missing keys, and returning the key string is a reasonable degradation (better than blank). However, it does not fully satisfy CORE-06 as specified in REQUIREMENTS.md.

---

_Verified: 2026-04-11T14:00:00Z_
_Verifier: Claude (gsd-verifier)_
