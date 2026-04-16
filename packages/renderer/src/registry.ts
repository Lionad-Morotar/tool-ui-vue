import { h } from 'vue';
import type { Components } from '@json-render/vue';
import { defineRegistry } from '@json-render/vue';
import {
  ApprovalCard,
  Audio,
  Chart,
  Citation,
  CitationList,
  CodeBlock,
  CodeDiff,
  DataTable,
  GeoMap,
  Image,
  ImageGallery,
  InstagramPost,
  ItemCarousel,
  LinkPreview,
  LinkedInPost,
  MessageDraft,
  OptionList,
  OrderSummary,
  ParameterSlider,
  Plan,
  PreferencesPanel,
  ProgressTracker,
  QuestionFlow,
  StatsDisplay,
  Terminal,
  Video,
  WeatherWidget,
  XPost,
} from '@lionad/vtu-components';
import { catalog } from './catalog';
import type { AppCatalog } from './catalog';
import { withErrorBoundary } from './with-error-boundary';

const rawComponents: Components<AppCatalog> = {
  ApprovalCard: ({ props }) => h(ApprovalCard, props as any),
  Audio: ({ props }) => h(Audio, props as any),
  Chart: ({ props }) => h(Chart, props as any),
  Citation: ({ props }) => h(Citation, props as any),
  CitationList: ({ props }) => h(CitationList, props as any),
  CodeBlock: ({ props }) => h(CodeBlock, props as any),
  CodeDiff: ({ props }) => h(CodeDiff, props as any),
  DataTable: ({ props }) => h(DataTable, props as any),
  GeoMap: ({ props }) => h(GeoMap, props as any),
  Image: ({ props }) => h(Image, props as any),
  ImageGallery: ({ props }) => h(ImageGallery, props as any),
  InstagramPost: ({ props }) => h(InstagramPost, props as any),
  ItemCarousel: ({ props }) => h(ItemCarousel, props as any),
  LinkPreview: ({ props }) => h(LinkPreview, props as any),
  LinkedInPost: ({ props }) => h(LinkedInPost, props as any),
  MessageDraft: ({ props }) => h(MessageDraft, props as any),
  OptionList: ({ props }) => h(OptionList, props as any),
  OrderSummary: ({ props }) => h(OrderSummary, props as any),
  ParameterSlider: ({ props }) => h(ParameterSlider, props as any),
  Plan: ({ props }) => h(Plan, props as any),
  PreferencesPanel: ({ props }) => h(PreferencesPanel, props as any),
  ProgressTracker: ({ props }) => h(ProgressTracker, props as any),
  QuestionFlow: ({ props }) => h(QuestionFlow, props as any),
  StatsDisplay: ({ props }) => h(StatsDisplay, props as any),
  Terminal: ({ props }) => h(Terminal, props as any),
  Video: ({ props }) => h(Video, props as any),
  WeatherWidget: ({ props }) => h(WeatherWidget, props as any),
  XPost: ({ props }) => h(XPost, props as any),
};

export const components = Object.fromEntries(
  Object.entries(rawComponents).map(([key, renderer]) => [
    key,
    withErrorBoundary(renderer),
  ]),
) as Components<AppCatalog>;

export const { registry } = defineRegistry(catalog, {
  components,
  actions: {},
});
