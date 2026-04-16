// Barrel exports for all components, types, schemas, and parsers
export * from './core'

// ApprovalCard
export { ApprovalCard } from './approval-card'
export type {
  ApprovalCardProps,
  ApprovalCardBaseProps,
  SerializableApprovalCard,
  ApprovalDecision,
  MetadataItem,
} from './approval-card'
export {
  SerializableApprovalCardSchema,
  ApprovalDecisionSchema,
  MetadataItemSchema,
  parseSerializableApprovalCard,
  safeParseSerializableApprovalCard,
} from './approval-card'

// Audio
export { Audio } from './audio'
export type { AudioProps, SerializableAudio } from './audio'
export {
  SerializableAudioSchema,
  parseSerializableAudio,
  safeParseSerializableAudio,
} from './audio'

// Image
export { Image } from './image'
export type {
  ImageProps,
  SerializableImage,
  AspectRatio,
  MediaFit,
} from './image'
export {
  SerializableImageSchema,
  AspectRatioSchema,
  MediaFitSchema,
  parseSerializableImage,
  safeParseSerializableImage,
} from './image'

// Video
export { Video } from './video'
export type { VideoProps, SerializableVideo } from './video'
export {
  SerializableVideoSchema,
  parseSerializableVideo,
  safeParseSerializableVideo,
} from './video'

// CodeBlock
export { CodeBlock } from './code-block'
export type {
  CodeBlockProps,
  SerializableCodeBlock,
  CodeBlockLineNumbersMode,
} from './code-block'
export {
  SerializableCodeBlockSchema,
  parseSerializableCodeBlock,
  safeParseSerializableCodeBlock,
} from './code-block'

// Terminal
export { Terminal } from './terminal'
export type { TerminalProps, SerializableTerminal } from './terminal'
export {
  SerializableTerminalSchema,
  parseSerializableTerminal,
  safeParseSerializableTerminal,
} from './terminal'

// Citation
export { Citation, CitationList } from './citation'
export type {
  CitationProps,
  CitationListProps,
  SerializableCitation,
  SerializableCitationList,
  CitationType,
  CitationVariant,
} from './citation'
export {
  SerializableCitationSchema,
  SerializableCitationListSchema,
  CitationTypeSchema,
  CitationVariantSchema,
  parseSerializableCitation,
  safeParseSerializableCitation,
  parseSerializableCitationList,
  safeParseSerializableCitationList,
} from './citation'

// LinkPreview
export { LinkPreview } from './link-preview'
export type { LinkPreviewProps, SerializableLinkPreview } from './link-preview'
export {
  SerializableLinkPreviewSchema,
  parseSerializableLinkPreview,
  safeParseSerializableLinkPreview,
} from './link-preview'

// OptionList
export { OptionList } from './option-list'
export type {
  OptionListProps,
  SerializableOptionList,
  OptionListOption,
  OptionListSelection,
} from './option-list'
export {
  OptionListPropsSchema,
  OptionListOptionSchema,
  SerializableOptionListSchema,
  parseSerializableOptionList,
  safeParseSerializableOptionList,
} from './option-list'

// XPost
export { XPost } from './x-post'
export type {
  XPostProps,
  XPostData,
  XPostAuthor,
  XPostMedia,
  XPostLinkPreview,
  XPostStats,
} from './x-post'
export {
  SerializableXPostSchema,
  XPostAuthorSchema,
  XPostMediaSchema,
  XPostLinkPreviewSchema,
  XPostStatsSchema,
  parseSerializableXPost,
  safeParseSerializableXPost,
} from './x-post'

// InstagramPost
export { InstagramPost } from './instagram-post'
export type {
  InstagramPostProps,
  InstagramPostData,
  InstagramPostAuthor,
  InstagramPostMedia,
  InstagramPostStats,
} from './instagram-post'
export {
  SerializableInstagramPostSchema,
  InstagramPostAuthorSchema,
  InstagramPostMediaSchema,
  InstagramPostStatsSchema,
  parseSerializableInstagramPost,
  safeParseSerializableInstagramPost,
} from './instagram-post'

// LinkedInPost
export { LinkedInPost } from './linkedin-post'
export type {
  LinkedInPostProps,
  LinkedInPostData,
  LinkedInPostAuthor,
  LinkedInPostMedia,
  LinkedInPostLinkPreview,
  LinkedInPostStats,
} from './linkedin-post'
export {
  SerializableLinkedInPostSchema,
  LinkedInPostAuthorSchema,
  LinkedInPostMediaSchema,
  LinkedInPostLinkPreviewSchema,
  LinkedInPostStatsSchema,
  parseSerializableLinkedInPost,
  safeParseSerializableLinkedInPost,
} from './linkedin-post'

// StatsDisplay
export { StatsDisplay } from './stats-display'
export type {
  StatsDisplayProps,
  SerializableStatsDisplay,
  StatItem,
  StatFormat,
  StatDiff,
  StatSparkline,
} from './stats-display'
export {
  SerializableStatsDisplaySchema,
  StatItemSchema,
  StatFormatSchema,
  StatDiffSchema,
  StatSparklineSchema,
  parseSerializableStatsDisplay,
  safeParseSerializableStatsDisplay,
} from './stats-display'

// OrderSummary
export { OrderSummaryRoot, OrderSummary } from './order-summary'
export type {
  OrderSummaryProps,
  SerializableOrderSummary,
  OrderItem,
  Pricing,
  OrderDecision,
  OrderSummaryVariant,
} from './order-summary'
export {
  SerializableOrderSummarySchema,
  OrderItemSchema,
  PricingSchema,
  OrderDecisionSchema,
  OrderSummaryVariantSchema,
  parseSerializableOrderSummary,
  safeParseSerializableOrderSummary,
} from './order-summary'

// MessageDraft
export { MessageDraft } from './message-draft'
export type {
  MessageDraftProps,
  SerializableMessageDraft,
  SerializableEmailDraft,
  SerializableSlackDraft,
  MessageDraftChannel,
  MessageDraftOutcome,
  SlackTarget,
} from './message-draft'
export {
  SerializableMessageDraftSchema,
  SerializableEmailDraftSchema,
  SerializableSlackDraftSchema,
  MessageDraftChannelSchema,
  MessageDraftOutcomeSchema,
  parseSerializableMessageDraft,
  safeParseSerializableMessageDraft,
} from './message-draft'

// DataTable
export { DataTable } from './data-table'
export type {
  DataTableProps,
  SerializableDataTable,
  Column,
  RowData,
} from './data-table'
export {
  SerializableDataTableSchema,
  serializableColumnSchema,
  serializableDataSchema,
  parseSerializableDataTable,
  safeParseSerializableDataTable,
} from './data-table'

// PreferencesPanel
export { PreferencesPanel } from './preferences-panel'
export type {
  PreferencesPanelProps,
  PreferencesPanelReceiptProps,
  SerializablePreferencesPanel,
  SerializablePreferencesPanelReceipt,
  PreferencesValue,
  PreferenceItem,
  PreferenceSection,
} from './preferences-panel'
export {
  SerializablePreferencesPanelSchema,
  SerializablePreferencesPanelReceiptSchema,
  parseSerializablePreferencesPanel,
  safeParseSerializablePreferencesPanel,
  parseSerializablePreferencesPanelReceipt,
  safeParseSerializablePreferencesPanelReceipt,
} from './preferences-panel'

// Plan
export { Plan } from './plan'
export type { PlanProps, SerializablePlan, PlanTodo, PlanTodoStatus } from './plan'
export {
  SerializablePlanSchema,
  PlanTodoSchema,
  PlanTodoStatusSchema,
  parseSerializablePlan,
  safeParseSerializablePlan,
} from './plan'

// ProgressTracker
export { ProgressTracker } from './progress-tracker'
export type {
  ProgressTrackerProps,
  SerializableProgressTracker,
  ProgressStep,
  ProgressTrackerChoice,
} from './progress-tracker'
export {
  SerializableProgressTrackerSchema,
  ProgressStepSchema,
  parseSerializableProgressTracker,
  safeParseSerializableProgressTracker,
} from './progress-tracker'

// QuestionFlow
export { QuestionFlow } from './question-flow'
export type {
  QuestionFlowProps,
  QuestionFlowProgressiveProps,
  QuestionFlowUpfrontProps,
  QuestionFlowReceiptProps,
  SerializableQuestionFlow,
  SerializableProgressiveMode,
  SerializableUpfrontMode,
  SerializableReceiptMode,
  QuestionFlowOption,
  QuestionFlowStepDefinition,
  QuestionFlowChoice,
  QuestionFlowSummaryItem,
} from './question-flow'
export {
  SerializableQuestionFlowSchema,
  SerializableProgressiveModeSchema,
  SerializableUpfrontModeSchema,
  SerializableReceiptModeSchema,
  QuestionFlowOptionSchema,
  QuestionFlowStepDefinitionSchema,
  QuestionFlowChoiceSchema,
  parseSerializableQuestionFlow,
  safeParseSerializableQuestionFlow,
} from './question-flow'

// ItemCarousel
export { ItemCarousel, ItemCard } from './item-carousel'
export type {
  ItemCarouselProps,
  SerializableItemCarousel,
  Item,
  SerializableItem,
  ItemCardCss,
  ItemCarouselCss,
} from './item-carousel'
export {
  SerializableItemCarouselSchema,
  ItemSchema,
  SerializableItemSchema,
  ItemCardCssSchema,
  ItemCarouselCssSchema,
  parseSerializableItemCarousel,
  safeParseSerializableItemCarousel,
} from './item-carousel'

// ImageGallery
export { ImageGallery, GalleryGrid, GalleryLightbox } from './image-gallery'
export type {
  ImageGalleryProps,
  SerializableImageGallery,
  ImageGalleryItem,
  ImageGallerySource,
} from './image-gallery'
export {
  SerializableImageGallerySchema,
  ImageGalleryItemSchema,
  ImageGallerySourceSchema,
  parseSerializableImageGallery,
  safeParseSerializableImageGallery,
} from './image-gallery'

// ParameterSlider
export { ParameterSlider } from './parameter-slider'
export type {
  ParameterSliderProps,
  SerializableParameterSlider,
  SliderConfig,
  SliderValue,
} from './parameter-slider'
export {
  SerializableParameterSliderSchema,
  SliderConfigSchema,
  parseSerializableParameterSlider,
  safeParseSerializableParameterSlider,
} from './parameter-slider'

// Chart
export { Chart } from './chart'
export type {
  ChartProps,
  SerializableChart,
  ChartSeries,
  ChartDataPoint,
  ChartClientProps,
} from './chart'
export {
  SerializableChartSchema,
  ChartSeriesSchema,
  parseSerializableChart,
  safeParseSerializableChart,
} from './chart'

// GeoMap
export { GeoMap, GeoMapEngine, GeoMapOverlays } from './geo-map'
export type {
  GeoMapProps,
  SerializableGeoMap,
  GeoMapMarker,
  GeoMapRoute,
  GeoMapMarkerIcon,
  GeoMapClustering,
  GeoMapViewport,
  GeoMapClientProps,
  GeoMapStyle,
  GeoMapCss,
  GeoMapEngineCss,
  GeoMapOverlaysCss,
} from './geo-map'
export {
  SerializableGeoMapSchema,
  GeoMapMarkerSchema,
  GeoMapRouteSchema,
  GeoMapMarkerIconSchema,
  GeoMapClusteringSchema,
  GeoMapViewportSchema,
  GeoMapCssSchema,
  GeoMapEngineCssSchema,
  GeoMapOverlaysCssSchema,
  parseSerializableGeoMap,
  safeParseSerializableGeoMap,
} from './geo-map'

// CodeDiff
export { CodeDiff } from './code-diff'
export type { CodeDiffProps, SerializableCodeDiff } from './code-diff'
export {
  SerializableCodeDiffSchema,
  parseSerializableCodeDiff,
  safeParseSerializableCodeDiff,
} from './code-diff'

// WeatherWidget
export { WeatherWidget, WeatherDataOverlay, EffectCompositor } from './weather-widget'
export type {
  WeatherWidgetProps,
  SerializableWeatherWidget,
  WeatherConditionCode,
  ForecastDay,
  TemperatureUnit,
  EffectSettings,
  EffectQuality,
  WeatherWidgetLocation,
  WeatherWidgetCurrent,
  WeatherWidgetTime,
} from './weather-widget'
export {
  SerializableWeatherWidgetSchema,
  WeatherConditionCodeSchema,
  ForecastDaySchema,
  TemperatureUnitSchema,
  EffectSettingsSchema,
  parseSerializableWeatherWidget,
  safeParseSerializableWeatherWidget,
} from './weather-widget'

// i18n exports (core i18n symbols are re-exported via `export * from './core'` above)
export {
  setMessages,
  setLocale,
  zhCNAll,
  enAll,
  registerEnglish,
} from './i18n'

// Placeholder version (kept for backwards compatibility)
export const VERSION = '0.4.0'
