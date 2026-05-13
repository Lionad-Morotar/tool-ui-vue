---
phase: 03-component-i18n-low-tests
plan: 04
type: execute
wave: 1
requires:
  - Phase 1: LocaleProvider + useI18n infrastructure
provides:
  - weatherWidget.srTemperature locale key (zh-CN: '{temp} 度', en: '{temp} degrees {unit}')
  - weatherWidget.spokenUnitCelsius/locale key (zh-CN: '摄氏度', en: 'Celsius')
  - weatherWidget.spokenUnitFahrenheit/locale key (zh-CN: '华氏度', en: 'Fahrenheit')
affects:
  - packages/components/src/weather-widget/cmpts/weather-data-overlay.vue
tags: [i18n, accessibility, weather-widget, sr-only]
tech-stack:
  added: []
  patterns: [useI18n in script setup, computed with t().value for reactive strings]
key-files:
  created: []
  modified:
    - path: packages/core/src/i18n/locales/zh-CN.ts
      change: "Added spokenUnitCelsius, spokenUnitFahrenheit, srTemperature to weatherWidget namespace"
    - path: packages/core/src/i18n/locales/en.ts
      change: "Added spokenUnitCelsius, spokenUnitFahrenheit, srTemperature to weatherWidget namespace"
    - path: packages/components/src/weather-widget/cmpts/weather-data-overlay.vue
      change: "i18n-ized spokenUnit computed and sr-only accessibility text"
    - path: packages/components/src/weather-widget/__tests__/WeatherDataOverlay.test.ts
      change: "Updated accessibility test to verify i18n sr-only text"
decisions:
  - "Used separate spokenUnitCelsius/spokenUnitFahrenheit keys instead of a single {unit} param key for flexibility"
  - "srTemperature uses {temp} and {unit} interpolation where unit is the localized spoken unit string"
  - "In <script setup> templates, ComputedRef auto-unwraps so spokenUnit (not spokenUnit.value) is passed to t() params"
  - "No effects/WebGL/rendering pipeline code was modified (per decision D-06/D-07)"
  - "Test uses setMessages(en) module-level API instead of LocaleProvider wrapper for simpler test setup"
metrics:
  duration: "~5 min"
  completed: "2026-04-11"
---

# Phase 3 Plan 04: weather-widget Accessibility i18n Summary

Eliminated hardcoded English text ("degrees Celsius", "degrees Fahrenheit") from the weather-widget sr-only accessibility layer by introducing locale-aware temperature description keys.

## One-liner

weather-widget sr-only screen reader text now displays "X 度" in zh-CN and "X degrees Fahrenheit/Celsius" in en via i18n.

## Tasks Completed

### Task 1: Add weatherWidget locale keys

Added four new keys to both `zh-CN.ts` and `en.ts` in the `weatherWidget` namespace:

| Key | zh-CN | en |
|---|---|---|
| `spokenUnitCelsius` | 摄氏度 | Celsius |
| `spokenUnitFahrenheit` | 华氏度 | Fahrenheit |
| `srTemperature` | {temp} 度 | {temp} degrees {unit} |

### Task 2: i18n-ize weather-data-overlay accessibility layer

- Added `useI18n` import from `@lionad/vtu-core/i18n`
- Replaced hardcoded `spokenUnit` computed with locale-aware version using `t().value`
- Replaced sr-only `<span>` content from hardcoded template string to `t('weatherWidget.srTemperature', { temp, unit })`

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- All 165 weather tests pass (5 test files)
- No TypeScript errors in weather-data-overlay.vue
- sr-only text: en = "72 degrees Fahrenheit", zh-CN = "72 度"
- Zero modifications to WebGL/effects/rendering pipeline
- `unitSymbol` (visual °C/°F display) intentionally unchanged per plan rules

## Commits

- `ce4a490` feat(03-04): add weatherWidget srTemperature and spokenUnit locale keys
- `1715dd3` feat(03-04): i18n-ize weather-data-overlay accessibility layer

## Self-Check: PASSED

All modified files verified present, all commits verified in git log.
