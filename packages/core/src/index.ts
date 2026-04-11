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

import { setMessages } from './i18n'
import { zhCN as coreZhCN } from './i18n/locales/zh-CN'

// Component i18n messages (zh-CN defaults)
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
))
