/* eslint-disable import-x/order */

// Re-export cn utility for downstream packages
export { cn, prefersReducedMotion } from './utils'

// Export shared infrastructure for tool components
export * from './contract'
export * from './schema'
export * from './parse'
export * from './media'
export * from './usePropsValidator'

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

// Note: core components fallback to built-in zh-CN/en messages via useI18n
// when no LocaleProvider is configured. Full message aggregation lives in
// @lionad/vtu-components/i18n.
