import { schema } from '@json-render/vue/schema';
import {
  SerializableApprovalCardSchema,
  SerializableArticleSchema,
  SerializableAudioSchema,
  SerializableChartSchema,
  SerializableCitationSchema,
  SerializableCitationListSchema,
  SerializableCodeBlockSchema,
  SerializableCodeDiffSchema,
  SerializableContactCardSchema,
  SerializableDataTableSchema,
  SerializableGeoMapSchema,
  SerializableImageSchema,
  SerializableImageGallerySchema,
  SerializableInstagramPostSchema,
  SerializableItemCarouselSchema,
  SerializableLinkPreviewSchema,
  SerializableLinkedInPostSchema,
  SerializableMessageDraftSchema,
  SerializableOptionListSchema,
  SerializableOrderSummarySchema,
  SerializableParameterSliderSchema,
  SerializablePlanSchema,
  SerializablePreferencesPanelSchema,
  SerializableProgressTrackerSchema,
  SerializableQuestionFlowSchema,
  SerializableStatsDisplaySchema,
  SerializableTerminalSchema,
  SerializableVideoSchema,
  SerializableWeatherWidgetSchema,
  SerializableXPostSchema,
} from '@lionad/vtu-components';
import { primitiveEntries } from './primitives/catalog';

export const catalog = schema.createCatalog({
  components: {
    ApprovalCard: {
      props: SerializableApprovalCardSchema,
      slots: [],
      description: 'A card for approval decisions with confirm/cancel actions',
    },
    Article: {
      props: SerializableArticleSchema,
      slots: [],
      description: 'Article display with markdown or HTML content, author info, and rating',
    },
    Audio: {
      props: SerializableAudioSchema,
      slots: [],
      description: 'Audio player with playback controls',
    },
    Chart: {
      props: SerializableChartSchema,
      slots: [],
      description: 'Data visualization chart',
    },
    Citation: {
      props: SerializableCitationSchema,
      slots: [],
      description: 'A single citation/link reference',
    },
    CitationList: {
      props: SerializableCitationListSchema,
      slots: [],
      description: 'A list of citations with collapse/expand behavior',
    },
    CodeBlock: {
      props: SerializableCodeBlockSchema,
      slots: [],
      description: 'Syntax-highlighted code block',
    },
    CodeDiff: {
      props: SerializableCodeDiffSchema,
      slots: [],
      description: 'Side-by-side or inline code diff',
    },
    ContactCard: {
      props: SerializableContactCardSchema,
      slots: [],
      description: 'Contact information card with click-to-call, email, or copy',
    },
    DataTable: {
      props: SerializableDataTableSchema,
      slots: [],
      description: 'Sortable and filterable data table',
    },
    GeoMap: {
      props: SerializableGeoMapSchema,
      slots: [],
      description: 'Interactive map with markers and routes',
    },
    Image: {
      props: SerializableImageSchema,
      slots: [],
      description: 'Responsive image with aspect ratio and fit options',
    },
    ImageGallery: {
      props: SerializableImageGallerySchema,
      slots: [],
      description: 'Image gallery with grid and lightbox',
    },
    InstagramPost: {
      props: SerializableInstagramPostSchema,
      slots: [],
      description: 'Instagram post preview card',
    },
    ItemCarousel: {
      props: SerializableItemCarouselSchema,
      slots: [],
      description: 'Horizontal scrollable item carousel',
    },
    LinkPreview: {
      props: SerializableLinkPreviewSchema,
      slots: [],
      description: 'Rich link preview card',
    },
    LinkedInPost: {
      props: SerializableLinkedInPostSchema,
      slots: [],
      description: 'LinkedIn post preview card',
    },
    MessageDraft: {
      props: SerializableMessageDraftSchema,
      slots: [],
      description: 'Email or Slack message draft preview',
    },
    OptionList: {
      props: SerializableOptionListSchema,
      slots: [],
      description: 'Selectable list of options',
    },
    OrderSummary: {
      props: SerializableOrderSummarySchema,
      slots: [],
      description: 'Order summary with items and pricing breakdown',
    },
    ParameterSlider: {
      props: SerializableParameterSliderSchema,
      slots: [],
      description: 'Slider input for numeric parameters',
    },
    Plan: {
      props: SerializablePlanSchema,
      slots: [],
      description: 'Plan or todo list with status tracking',
    },
    PreferencesPanel: {
      props: SerializablePreferencesPanelSchema,
      slots: [],
      description: 'User preferences configuration panel',
    },
    ProgressTracker: {
      props: SerializableProgressTrackerSchema,
      slots: [],
      description: 'Multi-step progress tracker',
    },
    QuestionFlow: {
      props: SerializableQuestionFlowSchema,
      slots: [],
      description: 'Interactive question and answer flow',
    },
    StatsDisplay: {
      props: SerializableStatsDisplaySchema,
      slots: [],
      description: 'Statistics display with sparklines and formatting',
    },
    Terminal: {
      props: SerializableTerminalSchema,
      slots: [],
      description: 'Terminal output emulation',
    },
    Video: {
      props: SerializableVideoSchema,
      slots: [],
      description: 'Video player with controls',
    },
    WeatherWidget: {
      props: SerializableWeatherWidgetSchema,
      slots: [],
      description: 'Weather forecast widget with effects',
    },
    XPost: {
      props: SerializableXPostSchema,
      slots: [],
      description: 'X (Twitter) post preview card',
    },
    // ---- Layout Primitives ----
    ...primitiveEntries,
  },
  actions: {},
});

export type AppCatalog = typeof catalog;
