---
phase: 01-i18n-core
plan: 01
status: complete
completed: "2026-04-11T12:50:00Z"
---

# Plan 01: I18N Core Infrastructure - Summary

## Key Files Created

| File | Purpose |
|------|---------|
| `packages/core/src/i18n/types.ts` | DeepKeyPath/DeepValueOf/KeysFor type system, I18nContext, I18nReturn |
| `packages/core/src/i18n/use-i18n.ts` | useI18n() composable, setMessages/setLocale, interpolate |
| `packages/core/src/i18n/locale-provider/index.vue` | LocaleProvider SFC with provide/inject |
| `packages/core/src/i18n/locale-provider/index.ts` | Barrel export for LocaleProvider |
| `packages/core/src/i18n/locales/zh-CN.ts` | zh-CN locale (280 keys, all 23 component namespaces) |
| `packages/core/src/i18n/locales/en.ts` | en locale (280 keys, identical key structure) |
| `packages/core/src/i18n/index.ts` | Main i18n barrel export |
| `packages/core/src/index.ts` | Updated with i18n re-exports |
| `packages/core/package.json` | Added `./i18n` subpath export |

## Design Decisions

- **Type inference**: `DeepKeyPath<T>` recursively extracts all dot-notation paths from nested message objects
- **Reactivity**: Module-level `ref` for `_messages` and `_locale` + `watch` in LocaleProvider with `immediate: true`
- **Zero deps**: No vue-i18n or external i18n library. Pure Vue 3 provide/inject + computed
- **{param} interpolation**: Regex `/\{(\w+)\}/g` replacement with typed params
- **dev/prod branching**: `import.meta.env.DEV` check for console.warn on missing keys

## API Surface

```typescript
// LocaleProvider
<LocaleProvider :messages="zhCN" locale="zh-CN">
  <App />
</LocaleProvider>

// useI18n() returns:
{ t, locale, setLocale }
// t(key, params?) → ComputedRef<string>
// locale → ComputedRef<string>
// setLocale(locale: string) → void
```

## Requirements Addressed

- CORE-01 ✓ LocaleProvider component (provide/inject)
- CORE-02 ✓ useI18n() composable (computed, t(), {param} interpolation)
- CORE-03 ✓ TypeScript type definitions (DeepKeyPath, MessageSchema derivation)
- CORE-04 ✓ zh-CN message file (280 keys, all namespaces)
- CORE-05 ✓ en message file (280 keys, identical structure)
- CORE-06 ✓ Missing key fallback (dev: console.warn, prod: key string)

## Self-Check: PASSED

- All 9 files created ✓
- zh-CN and en key structures match (280 keys each) ✓
- TypeScript compiles (no i18n-specific errors) ✓
- No external i18n dependencies ✓
- Export wired in both main entry and ./i18n subpath ✓
