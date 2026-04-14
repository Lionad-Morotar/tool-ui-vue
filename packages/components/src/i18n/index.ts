import { setMessages, setLocale } from '@lionad/vtu-core/i18n'
import { zhCN as coreZhCN, en as coreEn } from '@lionad/vtu-core/i18n'

// Component i18n messages (zh-CN)
import { zhCN as terminalZhCN } from '../terminal/i18n/zh-CN'
import { zhCN as codeBlockZhCN } from '../code-block/i18n/zh-CN'
import { zhCN as codeDiffZhCN } from '../code-diff/i18n/zh-CN'
import { zhCN as orderSummaryZhCN } from '../order-summary/i18n/zh-CN'
import { zhCN as questionFlowZhCN } from '../question-flow/i18n/zh-CN'
import { zhCN as dataTableZhCN } from '../data-table/i18n/zh-CN'
import { zhCN as messageDraftZhCN } from '../message-draft/i18n/zh-CN'
import { zhCN as audioZhCN } from '../audio/i18n/zh-CN'
import { zhCN as videoZhCN } from '../video/i18n/zh-CN'
import { zhCN as geoMapZhCN } from '../geo-map/i18n/zh-CN'
import { zhCN as itemCarouselZhCN } from '../item-carousel/i18n/zh-CN'
import { zhCN as preferencesPanelZhCN } from '../preferences-panel/i18n/zh-CN'
import { zhCN as approvalCardZhCN } from '../approval-card/i18n/zh-CN'
import { zhCN as chartZhCN } from '../chart/i18n/zh-CN'
import { zhCN as citationZhCN } from '../citation/i18n/zh-CN'
import { zhCN as imageZhCN } from '../image/i18n/zh-CN'
import { zhCN as instagramPostZhCN } from '../instagram-post/i18n/zh-CN'
import { zhCN as linkedinPostZhCN } from '../linkedin-post/i18n/zh-CN'
import { zhCN as optionListZhCN } from '../option-list/i18n/zh-CN'
import { zhCN as parameterSliderZhCN } from '../parameter-slider/i18n/zh-CN'
import { zhCN as planZhCN } from '../plan/i18n/zh-CN'
import { zhCN as statsDisplayZhCN } from '../stats-display/i18n/zh-CN'
import { zhCN as xPostZhCN } from '../x-post/i18n/zh-CN'

// Component i18n messages (en)
import { en as terminalEn } from '../terminal/i18n/en'
import { en as codeBlockEn } from '../code-block/i18n/en'
import { en as codeDiffEn } from '../code-diff/i18n/en'
import { en as orderSummaryEn } from '../order-summary/i18n/en'
import { en as questionFlowEn } from '../question-flow/i18n/en'
import { en as dataTableEn } from '../data-table/i18n/en'
import { en as messageDraftEn } from '../message-draft/i18n/en'
import { en as audioEn } from '../audio/i18n/en'
import { en as videoEn } from '../video/i18n/en'
import { en as geoMapEn } from '../geo-map/i18n/en'
import { en as itemCarouselEn } from '../item-carousel/i18n/en'
import { en as preferencesPanelEn } from '../preferences-panel/i18n/en'
import { en as approvalCardEn } from '../approval-card/i18n/en'
import { en as chartEn } from '../chart/i18n/en'
import { en as citationEn } from '../citation/i18n/en'
import { en as imageEn } from '../image/i18n/en'
import { en as instagramPostEn } from '../instagram-post/i18n/en'
import { en as linkedinPostEn } from '../linkedin-post/i18n/en'
import { en as optionListEn } from '../option-list/i18n/en'
import { en as parameterSliderEn } from '../parameter-slider/i18n/en'
import { en as planEn } from '../plan/i18n/en'
import { en as statsDisplayEn } from '../stats-display/i18n/en'
import { en as xPostEn } from '../x-post/i18n/en'

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

/** Merged Chinese messages (all component locales included) */
export const zhCNAll = mergeMessages(
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
)

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

// Auto-register zh-CN with all component messages for non-i18n users
// (per D-05/D-06: global default, copy-paste users need no config)
setMessages(zhCNAll)
