// Re-export cn utility for downstream packages
export { cn, prefersReducedMotion } from './utils'

// Export shared infrastructure for tool components
export * from './contract'
export * from './schema'
export * from './parse'
export * from './media'

// Export Button component and variants
export { Button, buttonVariants } from './components/button'
export type { ButtonProps, ButtonVariants } from './components/button'

// Export Card sub-components
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/card'

// Export Badge component and variants
export { Badge, badgeVariants } from './components/badge'
export type { BadgeProps, BadgeVariants } from './components/badge'

// Export CopyButton component
export { CopyButton } from './components/copy-button'
export type { CopyButtonProps } from './components/copy-button'

// Export i18n system
export { useI18n, LocaleProvider, zhCN, en, i18nInjectionKey } from './i18n'
export type { DeepKeyPath, DeepValueOf, KeysFor, ParamValue, I18nContext, I18nReturn } from './i18n'

// ---------------------------------------------------------------------------
// Global default LocaleProvider auto-registration (per D-05/D-06/D-07)
// Copy-paste users need zero configuration -- components display zh-CN by
// default. An explicit <LocaleProvider> with custom messages overrides this.
// ---------------------------------------------------------------------------

import { setMessages, setLocale } from './i18n'
import { zhCN as coreZhCN } from './i18n/locales/zh-CN'

// Component i18n messages (zh-CN defaults)
// Previously migrated components
import { zhCN as terminalZhCN } from '../../components/src/terminal/i18n/zh-CN'
import { zhCN as codeBlockZhCN } from '../../components/src/code-block/i18n/zh-CN'
import { zhCN as codeDiffZhCN } from '../../components/src/code-diff/i18n/zh-CN'
import { zhCN as orderSummaryZhCN } from '../../components/src/order-summary/i18n/zh-CN'
import { zhCN as questionFlowZhCN } from '../../components/src/question-flow/i18n/zh-CN'
import { zhCN as dataTableZhCN } from '../../components/src/data-table/i18n/zh-CN'
import { zhCN as messageDraftZhCN } from '../../components/src/message-draft/i18n/zh-CN'
import { zhCN as audioZhCN } from '../../components/src/audio/i18n/zh-CN'
import { zhCN as videoZhCN } from '../../components/src/video/i18n/zh-CN'
import { zhCN as geoMapZhCN } from '../../components/src/geo-map/i18n/zh-CN'
import { zhCN as itemCarouselZhCN } from '../../components/src/item-carousel/i18n/zh-CN'
import { zhCN as preferencesPanelZhCN } from '../../components/src/preferences-panel/i18n/zh-CN'

// Newly migrated components
import { zhCN as approvalCardZhCN } from '../../components/src/approval-card/i18n/zh-CN'
import { zhCN as chartZhCN } from '../../components/src/chart/i18n/zh-CN'
import { zhCN as citationZhCN } from '../../components/src/citation/i18n/zh-CN'
import { zhCN as imageZhCN } from '../../components/src/image/i18n/zh-CN'
import { zhCN as instagramPostZhCN } from '../../components/src/instagram-post/i18n/zh-CN'
import { zhCN as linkedinPostZhCN } from '../../components/src/linkedin-post/i18n/zh-CN'
import { zhCN as optionListZhCN } from '../../components/src/option-list/i18n/zh-CN'
import { zhCN as parameterSliderZhCN } from '../../components/src/parameter-slider/i18n/zh-CN'
import { zhCN as planZhCN } from '../../components/src/plan/i18n/zh-CN'
import { zhCN as statsDisplayZhCN } from '../../components/src/stats-display/i18n/zh-CN'
import { zhCN as xPostZhCN } from '../../components/src/x-post/i18n/zh-CN'

// Merge multiple message objects (shallow merge at top level, deep merge one
// level for overlapping component namespaces)
function mergeMessages(...messages: Record<string, unknown>[]): Record<string, unknown> {
  const merged: Record<string, unknown> = {}
  for (const msg of messages) {
    for (const key of Object.keys(msg)) {
      if (!(key in merged)) {
        merged[key] = msg[key]
      } else if (typeof merged[key] === 'object' && typeof msg[key] === 'object') {
        merged[key] = { ...(merged[key] as object), ...(msg[key] as object) }
      }
    }
  }
  return merged
}

// Auto-register zh-CN with all component messages for non-i18n users
// (per D-05/D-06: global default, copy-paste users need no config)
// Explicit LocaleProvider with custom messages overrides this.
setMessages(mergeMessages(
  coreZhCN as unknown as Record<string, unknown>,
  terminalZhCN as unknown as Record<string, unknown>,
  codeBlockZhCN as unknown as Record<string, unknown>,
  codeDiffZhCN as unknown as Record<string, unknown>,
  orderSummaryZhCN as unknown as Record<string, unknown>,
  questionFlowZhCN as unknown as Record<string, unknown>,
  dataTableZhCN as unknown as Record<string, unknown>,
  messageDraftZhCN as unknown as Record<string, unknown>,
  audioZhCN as unknown as Record<string, unknown>,
  videoZhCN as unknown as Record<string, unknown>,
  geoMapZhCN as unknown as Record<string, unknown>,
  itemCarouselZhCN as unknown as Record<string, unknown>,
  preferencesPanelZhCN as unknown as Record<string, unknown>,
  approvalCardZhCN as unknown as Record<string, unknown>,
  chartZhCN as unknown as Record<string, unknown>,
  citationZhCN as unknown as Record<string, unknown>,
  imageZhCN as unknown as Record<string, unknown>,
  instagramPostZhCN as unknown as Record<string, unknown>,
  linkedinPostZhCN as unknown as Record<string, unknown>,
  optionListZhCN as unknown as Record<string, unknown>,
  parameterSliderZhCN as unknown as Record<string, unknown>,
  planZhCN as unknown as Record<string, unknown>,
  statsDisplayZhCN as unknown as Record<string, unknown>,
  xPostZhCN as unknown as Record<string, unknown>,
))

// ---------------------------------------------------------------------------
// English locale support
// Import and merge all component English messages for bilingual consumers.
// Call registerEnglish() to switch to English; zh-CN remains the default.
// ---------------------------------------------------------------------------
import { en as coreEn } from './i18n/locales/en'
import { en as terminalEn } from '../../components/src/terminal/i18n/en'
import { en as codeBlockEn } from '../../components/src/code-block/i18n/en'
import { en as codeDiffEn } from '../../components/src/code-diff/i18n/en'
import { en as orderSummaryEn } from '../../components/src/order-summary/i18n/en'
import { en as questionFlowEn } from '../../components/src/question-flow/i18n/en'
import { en as dataTableEn } from '../../components/src/data-table/i18n/en'
import { en as messageDraftEn } from '../../components/src/message-draft/i18n/en'
import { en as audioEn } from '../../components/src/audio/i18n/en'
import { en as videoEn } from '../../components/src/video/i18n/en'
import { en as geoMapEn } from '../../components/src/geo-map/i18n/en'
import { en as itemCarouselEn } from '../../components/src/item-carousel/i18n/en'
import { en as preferencesPanelEn } from '../../components/src/preferences-panel/i18n/en'
import { en as approvalCardEn } from '../../components/src/approval-card/i18n/en'
import { en as chartEn } from '../../components/src/chart/i18n/en'
import { en as citationEn } from '../../components/src/citation/i18n/en'
import { en as imageEn } from '../../components/src/image/i18n/en'
import { en as instagramPostEn } from '../../components/src/instagram-post/i18n/en'
import { en as linkedinPostEn } from '../../components/src/linkedin-post/i18n/en'
import { en as optionListEn } from '../../components/src/option-list/i18n/en'
import { en as parameterSliderEn } from '../../components/src/parameter-slider/i18n/en'
import { en as planEn } from '../../components/src/plan/i18n/en'
import { en as statsDisplayEn } from '../../components/src/stats-display/i18n/en'
import { en as xPostEn } from '../../components/src/x-post/i18n/en'

/** Merged English messages (all component locales included) */
export const enAll = mergeMessages(
  coreEn as unknown as Record<string, unknown>,
  terminalEn as unknown as Record<string, unknown>,
  codeBlockEn as unknown as Record<string, unknown>,
  codeDiffEn as unknown as Record<string, unknown>,
  orderSummaryEn as unknown as Record<string, unknown>,
  questionFlowEn as unknown as Record<string, unknown>,
  dataTableEn as unknown as Record<string, unknown>,
  messageDraftEn as unknown as Record<string, unknown>,
  audioEn as unknown as Record<string, unknown>,
  videoEn as unknown as Record<string, unknown>,
  geoMapEn as unknown as Record<string, unknown>,
  itemCarouselEn as unknown as Record<string, unknown>,
  preferencesPanelEn as unknown as Record<string, unknown>,
  approvalCardEn as unknown as Record<string, unknown>,
  chartEn as unknown as Record<string, unknown>,
  citationEn as unknown as Record<string, unknown>,
  imageEn as unknown as Record<string, unknown>,
  instagramPostEn as unknown as Record<string, unknown>,
  linkedinPostEn as unknown as Record<string, unknown>,
  optionListEn as unknown as Record<string, unknown>,
  parameterSliderEn as unknown as Record<string, unknown>,
  planEn as unknown as Record<string, unknown>,
  statsDisplayEn as unknown as Record<string, unknown>,
  xPostEn as unknown as Record<string, unknown>,
)

/** Register English messages and switch locale atomically */
export function registerEnglish(): void {
  setMessages(enAll)
  setLocale('en')
}
