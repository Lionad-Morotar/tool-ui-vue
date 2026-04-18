import {
  setMessages,
  setLocale,
  useI18n,
  LocaleProvider,
  i18nInjectionKey,
  zhCN,
  en,
  hasMessages,
  isLocaleExplicitlySet,
} from '../core/i18n'

export {
  useI18n,
  LocaleProvider,
  i18nInjectionKey,
  setMessages,
  setLocale,
  zhCN,
  en,
}

/**
 * 组件级别 locale 消息类型
 * 每个顶级 key 是 namespace（如 'terminal'），值是该 namespace 下的消息映射
 */
export interface LocaleMessages {
  [namespace: string]: Record<string, string>
}

/**
 * 合并多个组件的 locale 消息
 * 相同 namespace 的键值会合并，后面的覆盖前面的
 */
function mergeMessages(...messages: LocaleMessages[]): LocaleMessages {
  const merged: LocaleMessages = {}
  for (const msg of messages) {
    for (const [ns, entries] of Object.entries(msg)) {
      merged[ns] = { ...(merged[ns] ?? {}), ...entries }
    }
  }
  return merged
}

/**
 * 自动收集所有组件的中文 locale 文件
 * 路径相对于 packages/components/src/i18n/index.ts
 */
const zhCNModules = import.meta.glob<{ zhCN: LocaleMessages }>(
  '../*/i18n/zh-CN.ts',
  { eager: true }
)

/**
 * 自动收集所有组件的英文 locale 文件
 */
const enModules = import.meta.glob<{ en: LocaleMessages }>(
  '../*/i18n/en.ts',
  { eager: true }
)

/** Merged Chinese messages (all component locales included) */
export const zhCNAll = mergeMessages(
  zhCN as LocaleMessages,
  ...Object.values(zhCNModules).map((m) => m.zhCN)
)

/** Merged English messages (all component locales included) */
export const enAll = mergeMessages(
  en as LocaleMessages,
  ...Object.values(enModules).map((m) => m.en)
)

/** Register English messages and switch locale atomically */
export function registerEnglish(): void {
  setMessages(enAll)
  setLocale('en')
}

// Auto-register zh-CN with all component messages for non-i18n users
// (per D-05/D-06: global default, copy-paste users need no config)
// Guard against overwriting messages/locale that were explicitly set before this import.
if (!hasMessages()) {
  setMessages(zhCNAll)
}
if (!isLocaleExplicitlySet()) {
  setLocale('zh-CN')
}
