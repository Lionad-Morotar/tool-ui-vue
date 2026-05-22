import type { Components } from '@json-render/vue';
import { defineRegistry } from '@json-render/vue';
import {
  ApprovalCard,
  Article,
  Audio,
  Chart,
  Citation,
  CitationList,
  CodeBlock,
  CodeDiff,
  ContactCard,
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
import { createRenderer, withErrorBoundary } from './with-error-boundary';
import { primitivesComponents } from './primitives';

const rawComponents: Components<AppCatalog> = {
  ApprovalCard: createRenderer(ApprovalCard),
  Article: createRenderer(Article),
  Audio: createRenderer(Audio),
  Chart: createRenderer(Chart),
  Citation: createRenderer(Citation),
  CitationList: createRenderer(CitationList),
  CodeBlock: createRenderer(CodeBlock),
  CodeDiff: createRenderer(CodeDiff),
  ContactCard: createRenderer(ContactCard),
  DataTable: createRenderer(DataTable),
  GeoMap: createRenderer(GeoMap),
  Image: createRenderer(Image),
  ImageGallery: createRenderer(ImageGallery),
  InstagramPost: createRenderer(InstagramPost),
  ItemCarousel: createRenderer(ItemCarousel),
  LinkPreview: createRenderer(LinkPreview),
  LinkedInPost: createRenderer(LinkedInPost),
  MessageDraft: createRenderer(MessageDraft),
  OptionList: createRenderer(OptionList),
  OrderSummary: createRenderer(OrderSummary),
  ParameterSlider: createRenderer(ParameterSlider),
  Plan: createRenderer(Plan),
  PreferencesPanel: createRenderer(PreferencesPanel),
  ProgressTracker: createRenderer(ProgressTracker),
  QuestionFlow: createRenderer(QuestionFlow),
  StatsDisplay: createRenderer(StatsDisplay),
  Terminal: createRenderer(Terminal),
  Video: createRenderer(Video),
  WeatherWidget: createRenderer(WeatherWidget),
  XPost: createRenderer(XPost),
  // ---- Layout Primitives ----
  Stack: primitivesComponents.Stack,
  Card: primitivesComponents.Card,
  Text: primitivesComponents.Text,
  Button: primitivesComponents.Button,
  Badge: primitivesComponents.Badge,
  ListItem: primitivesComponents.ListItem,
  Input: primitivesComponents.Input,
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
