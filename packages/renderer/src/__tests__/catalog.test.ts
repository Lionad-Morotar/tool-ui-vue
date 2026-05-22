import { describe, expect, test } from 'vitest';
import { catalog } from '../catalog';

const EXPECTED_COMPONENTS = [
  'ApprovalCard',
  'Article',
  'Audio',
  'Chart',
  'Citation',
  'CitationList',
  'CodeBlock',
  'CodeDiff',
  'ContactCard',
  'DataTable',
  'GeoMap',
  'Image',
  'ImageGallery',
  'InstagramPost',
  'ItemCarousel',
  'LinkPreview',
  'LinkedInPost',
  'MessageDraft',
  'OptionList',
  'OrderSummary',
  'ParameterSlider',
  'Plan',
  'PreferencesPanel',
  'ProgressTracker',
  'QuestionFlow',
  'StatsDisplay',
  'Terminal',
  'Video',
  'WeatherWidget',
  'XPost',
  // Layout Primitives
  'Stack',
  'Card',
  'Text',
  'Button',
  'Badge',
  'ListItem',
  'Input',
];

describe('catalog', () => {
  test('contains all 37 expected components', () => {
    expect(catalog.componentNames).toHaveLength(37);
    for (const name of EXPECTED_COMPONENTS) {
      expect(catalog.componentNames).toContain(name);
    }
  });

  test('each component has a Zod schema for props', () => {
    const components = (catalog.data as Record<string, unknown>).components as Record<
      string,
      { props?: { parse?: (...args: unknown[]) => unknown }; description?: string }
    >;
    for (const [name, def] of Object.entries(components)) {
      expect(def.props, `${name} should have props schema`).toBeDefined();
      expect(typeof def.props?.parse, `${name} props should be a Zod schema`).toBe('function');
    }
  });

  test('CitationList uses hand-written schema', () => {
    const components = (catalog.data as Record<string, unknown>).components as Record<
      string,
      { props?: { parse?: (...args: unknown[]) => unknown }; description?: string }
    >;
    const citationList = components.CitationList;
    expect(citationList.description).toContain('citations');
    const parsed = citationList.props!.parse!({
      id: 'test',
      citations: [],
    });
    expect((parsed as Record<string, unknown>).id).toBe('test');
    expect((parsed as Record<string, unknown>).citations).toEqual([]);
  });

  test('catalog defines no actions', () => {
    expect(catalog.actionNames).toHaveLength(0);
  });
});
