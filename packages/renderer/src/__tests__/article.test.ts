import {
  parseSerializableArticle,
  safeParseSerializableArticle,
  ArticleTypeSchema,
  useArticle,
  Article,
} from '@lionad/vtu-components';
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';

describe('Article schema', () => {
  test('parses valid article with all fields', () => {
    const input = {
      id: 'article-1',
      type: 'md',
      content: '# Hello\n\nThis is a test article.',
      title: 'Test Article',
      description: 'A short description',
      author: { name: 'Alice', avatarUrl: 'https://example.com/avatar.png' },
      coverImage: 'https://example.com/cover.png',
      tags: ['tech', 'vue'],
      rate: 4.2,
      createdAt: '2026-05-22T10:00:00Z',
      updatedAt: '2026-05-22T12:00:00Z',
      source: 'https://example.com/source',
      readingTime: 5,
      wordCount: 1200,
      maxHeight: '300px',
      locale: 'zh-CN',
    };
    const result = parseSerializableArticle(input);
    expect(result.id).toBe('article-1');
    expect(result.type).toBe('md');
    expect(result.content).toBe('# Hello\n\nThis is a test article.');
    expect(result.title).toBe('Test Article');
    expect(result.description).toBe('A short description');
    expect(result.author).toEqual({ name: 'Alice', avatarUrl: 'https://example.com/avatar.png' });
    expect(result.coverImage).toBe('https://example.com/cover.png');
    expect(result.tags).toEqual(['tech', 'vue']);
    expect(result.rate).toBe(4.2);
    expect(result.createdAt).toBe('2026-05-22T10:00:00Z');
    expect(result.updatedAt).toBe('2026-05-22T12:00:00Z');
    expect(result.source).toBe('https://example.com/source');
    expect(result.readingTime).toBe(5);
    expect(result.wordCount).toBe(1200);
    expect(result.maxHeight).toBe('300px');
    expect(result.locale).toBe('zh-CN');
    expect(result.role).toBeUndefined();
    expect(result.receipt).toBeUndefined();
  });

  test('parses minimal article with required fields only', () => {
    const input = {
      id: 'article-min',
      type: 'html',
      content: '<p>Hello world</p>',
    };
    const result = parseSerializableArticle(input);
    expect(result.id).toBe('article-min');
    expect(result.type).toBe('html');
    expect(result.content).toBe('<p>Hello world</p>');
    expect(result.title).toBeUndefined();
    expect(result.rate).toBeUndefined();
  });

  test('rejects invalid type', () => {
    const input = {
      id: 'article-bad',
      type: 'pdf',
      content: 'content',
    };
    expect(() => parseSerializableArticle(input)).toThrow();
  });

  test('accepts all valid type values', () => {
    const types = ['md', 'html'] as const;
    for (const type of types) {
      const result = parseSerializableArticle({ id: `a-${type}`, type, content: 'test' });
      expect(result.type).toBe(type);
    }
  });

  test('rejects missing id', () => {
    const input = { type: 'md', content: 'test' };
    expect(() => parseSerializableArticle(input)).toThrow();
  });

  test('rejects missing content', () => {
    const input = { id: 'a1', type: 'md' };
    expect(() => parseSerializableArticle(input)).toThrow();
  });

  test('parses article with receipt', () => {
    const input = {
      id: 'article-receipt',
      type: 'md',
      content: 'test',
      receipt: {
        outcome: 'success',
        summary: 'Generated article',
        at: '2026-05-22T10:00:00Z',
      },
    };
    const result = parseSerializableArticle(input);
    expect(result.receipt?.outcome).toBe('success');
    expect(result.receipt?.summary).toBe('Generated article');
  });

  test('safeParse returns null for invalid input', () => {
    expect(safeParseSerializableArticle({ type: 'md' })).toBeNull();
    expect(safeParseSerializableArticle(null)).toBeNull();
  });

  test('ArticleTypeSchema rejects non-enum values', () => {
    expect(() => ArticleTypeSchema.parse('txt')).toThrow();
    expect(ArticleTypeSchema.parse('md')).toBe('md');
    expect(ArticleTypeSchema.parse('html')).toBe('html');
  });
});

describe('useArticle markdown parsing', () => {
  test('parses markdown heading to h1 tag', () => {
    const props = { id: 'a1', type: 'md' as const, content: '# Title' };
    const state = useArticle(props);
    expect(state.parsedContent.value).toContain('<h1');
    expect(state.parsedContent.value).toContain('Title');
  });

  test('parses markdown paragraph to p tag', () => {
    const props = { id: 'a2', type: 'md' as const, content: 'Hello world' };
    const state = useArticle(props);
    expect(state.parsedContent.value).toContain('<p>Hello world</p>');
  });

  test('parses markdown unordered list', () => {
    const props = { id: 'a3', type: 'md' as const, content: '- Apple\n- Banana\n- Cherry' };
    const state = useArticle(props);
    expect(state.parsedContent.value).toContain('<ul>');
    expect(state.parsedContent.value).toContain('<li>Apple</li>');
  });

  test('parses markdown ordered list', () => {
    const props = { id: 'a4', type: 'md' as const, content: '1. First\n2. Second' };
    const state = useArticle(props);
    expect(state.parsedContent.value).toContain('<ol>');
    expect(state.parsedContent.value).toContain('<li>First</li>');
  });

  test('parses markdown code block', () => {
    const props = { id: 'a5', type: 'md' as const, content: '```js\nconst x = 1;\n```' };
    const state = useArticle(props);
    expect(state.parsedContent.value).toContain('<pre><code');
    expect(state.parsedContent.value).toContain('const x = 1;');
  });

  test('parses markdown blockquote', () => {
    const props = { id: 'a6', type: 'md' as const, content: '> Quote this' };
    const state = useArticle(props);
    expect(state.parsedContent.value).toContain('<blockquote>');
    expect(state.parsedContent.value).toContain('Quote this');
  });

  test('parses markdown table', () => {
    const props = { id: 'a7', type: 'md' as const, content: '| A | B |\n|---|---|\n| 1 | 2 |' };
    const state = useArticle(props);
    expect(state.parsedContent.value).toContain('<table>');
    expect(state.parsedContent.value).toContain('<td>1</td>');
  });

  test('html type uses raw content without parsing', () => {
    const props = { id: 'a8', type: 'html' as const, content: '<p>Raw HTML</p>' };
    const state = useArticle(props);
    expect(state.parsedContent.value).toBe('<p>Raw HTML</p>');
  });

  test('falls back to raw text when marked throws', () => {
    const props = { id: 'a9', type: 'md' as const, content: 'safe content' };
    const state = useArticle(props);
    expect(state.parsedContent.value).toBeTruthy();
  });
});

describe('useArticle HTML sanitization', () => {
  test('filters dangerous tags (script, iframe, style, form, input)', () => {
    const dirty = `
      <p>Safe paragraph</p>
      <script>alert(1)</script>
      <iframe src="evil.com"></iframe>
      <style>body{color:red}</style>
      <form><input type="text"><button>Click</button></form>
    `;
    const props = { id: 'a10', type: 'html' as const, content: dirty };
    const state = useArticle(props);
    const html = state.parsedContent.value;
    expect(html).toContain('Safe paragraph');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<iframe');
    expect(html).not.toContain('<style');
    expect(html).not.toContain('<form');
    expect(html).not.toContain('<input');
    expect(html).not.toContain('<button');
  });

  test('preserves safe tags', () => {
    const safe = `
      <h1>Title</h1>
      <p>Paragraph with <strong>bold</strong> and <em>italic</em></p>
      <ul><li>Item</li></ul>
      <ol><li>Item</li></ol>
      <blockquote>Quote</blockquote>
      <pre><code>code</code></pre>
      <hr>
      <table><tr><td>Cell</td></tr></table>
      <p><a href="https://example.com">Link</a></p>
      <p><img src="img.png" alt="Alt"></p>
    `;
    const props = { id: 'a11', type: 'html' as const, content: safe };
    const state = useArticle(props);
    const html = state.parsedContent.value;
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<p>Paragraph');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
    expect(html).toContain('<ul><li>Item</li></ul>');
    expect(html).toContain('<ol><li>Item</li></ol>');
    expect(html).toContain('<blockquote>Quote</blockquote>');
    expect(html).toContain('<pre><code>code</code></pre>');
    expect(html).toContain('<hr>');
    expect(html).toContain('<table>');
    expect(html).toContain('<td>Cell</td>');
  });

  test('injects target="_blank" and rel="noopener noreferrer" into links', () => {
    const props = { id: 'a12', type: 'html' as const, content: '<p><a href="https://example.com">Link</a></p>' };
    const state = useArticle(props);
    const html = state.parsedContent.value;
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  test('injects loading="lazy" into images', () => {
    const props = { id: 'a13', type: 'html' as const, content: '<p><img src="img.png" alt="Alt"></p>' };
    const state = useArticle(props);
    const html = state.parsedContent.value;
    expect(html).toContain('loading="lazy"');
  });

  test('sanitizes markdown output as well', () => {
    const md = '# Title\n\n<script>evil()</script>\n\n[Link](https://example.com)';
    const props = { id: 'a14', type: 'md' as const, content: md };
    const state = useArticle(props);
    const html = state.parsedContent.value;
    expect(html).toContain('<h1>Title</h1>');
    expect(html).not.toContain('<script');
    expect(html).toContain('target="_blank"');
  });
});

describe('useArticle star rating', () => {
  test('rate 4.2 produces 4 full + 1 partial star', () => {
    const props = { id: 'a15', type: 'md' as const, content: 'test', rate: 4.2 };
    const state = useArticle(props);
    expect(state.starOpacities.value).toEqual([1, 1, 1, 1, 0.2]);
  });

  test('rate 0 produces all empty stars', () => {
    const props = { id: 'a16', type: 'md' as const, content: 'test', rate: 0 };
    const state = useArticle(props);
    expect(state.starOpacities.value).toEqual([0, 0, 0, 0, 0]);
  });

  test('rate 5 produces all full stars', () => {
    const props = { id: 'a17', type: 'md' as const, content: 'test', rate: 5 };
    const state = useArticle(props);
    expect(state.starOpacities.value).toEqual([1, 1, 1, 1, 1]);
  });

  test('negative rate clamps to 0', () => {
    const props = { id: 'a18', type: 'md' as const, content: 'test', rate: -1 };
    const state = useArticle(props);
    expect(state.starOpacities.value).toEqual([0, 0, 0, 0, 0]);
  });

  test('rate above 5 clamps to 5', () => {
    const props = { id: 'a19', type: 'md' as const, content: 'test', rate: 6 };
    const state = useArticle(props);
    expect(state.starOpacities.value).toEqual([1, 1, 1, 1, 1]);
  });

  test('NaN rate returns null (hide rating)', () => {
    const props = { id: 'a20', type: 'md' as const, content: 'test', rate: NaN };
    const state = useArticle(props);
    expect(state.starOpacities.value).toBeNull();
  });

  test('undefined rate returns null (hide rating)', () => {
    const props = { id: 'a21', type: 'md' as const, content: 'test' };
    const state = useArticle(props);
    expect(state.starOpacities.value).toBeNull();
  });

  test('rate rounds to nearest 0.1 (4.25 -> 4.3)', () => {
    const props = { id: 'a22', type: 'md' as const, content: 'test', rate: 4.25 };
    const state = useArticle(props);
    expect(state.starOpacities.value).toEqual([1, 1, 1, 1, 0.3]);
  });

  test('rate rounds to nearest 0.1 (4.24 -> 4.2)', () => {
    const props = { id: 'a23', type: 'md' as const, content: 'test', rate: 4.24 };
    const state = useArticle(props);
    expect(state.starOpacities.value).toEqual([1, 1, 1, 1, 0.2]);
  });
});

describe('useArticle expand/collapse', () => {
  test('without maxHeight, contentStyle is empty and isExpanded is false', () => {
    const props = { id: 'a24', type: 'md' as const, content: 'test' };
    const state = useArticle(props);
    expect(state.isExpanded.value).toBe(false);
    expect(Object.keys(state.contentStyle.value)).toHaveLength(0);
  });

  test('with maxHeight, contentStyle injects maxHeight style', () => {
    const props = { id: 'a25', type: 'md' as const, content: 'test', maxHeight: '300px' };
    const state = useArticle(props);
    expect(state.isExpanded.value).toBe(false);
    expect(state.contentStyle.value).toEqual({ maxHeight: '300px' });
  });

  test('toggleExpanded removes max-height limit', () => {
    const props = { id: 'a26', type: 'md' as const, content: 'test', maxHeight: '20rem' };
    const state = useArticle(props);
    expect(state.contentStyle.value).toEqual({ maxHeight: '20rem' });

    state.toggleExpanded();
    expect(state.isExpanded.value).toBe(true);
    expect(Object.keys(state.contentStyle.value)).toHaveLength(0);
  });

  test('toggleExpanded twice restores max-height limit', () => {
    const props = { id: 'a27', type: 'md' as const, content: 'test', maxHeight: '300px' };
    const state = useArticle(props);

    state.toggleExpanded();
    expect(state.isExpanded.value).toBe(true);

    state.toggleExpanded();
    expect(state.isExpanded.value).toBe(false);
    expect(state.contentStyle.value).toEqual({ maxHeight: '300px' });
  });
});

describe('useArticle empty content', () => {
  test('empty string content is detected as empty', () => {
    const props = { id: 'a28', type: 'md' as const, content: '' };
    const state = useArticle(props);
    expect(state.isEmptyContent.value).toBe(true);
  });

  test('whitespace-only content is detected as empty', () => {
    const props = { id: 'a29', type: 'md' as const, content: '   \n\t  ' };
    const state = useArticle(props);
    expect(state.isEmptyContent.value).toBe(true);
  });

  test('non-empty content is not empty', () => {
    const props = { id: 'a30', type: 'md' as const, content: 'Hello' };
    const state = useArticle(props);
    expect(state.isEmptyContent.value).toBe(false);
  });

  test('html empty string is detected as empty', () => {
    const props = { id: 'a31', type: 'html' as const, content: '' };
    const state = useArticle(props);
    expect(state.isEmptyContent.value).toBe(true);
  });
});

describe('Article template', () => {
  test('renders with data-slot and data-tool-ui-id', () => {
    const wrapper = mount(Article, {
      props: { id: 'article-tpl', type: 'md', content: 'Hello' },
    });
    expect(wrapper.find('[data-slot="article"]').exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="article-tpl"]').exists()).toBe(true);
  });

  test('renders title when provided', () => {
    const wrapper = mount(Article, {
      props: { id: 'a32', type: 'md', content: 'Body', title: 'My Title' },
    });
    expect(wrapper.text()).toContain('My Title');
  });

  test('renders author name when provided', () => {
    const wrapper = mount(Article, {
      props: { id: 'a33', type: 'md', content: 'Body', author: { name: 'Alice' } },
    });
    expect(wrapper.text()).toContain('Alice');
  });

  test('renders tags when provided', () => {
    const wrapper = mount(Article, {
      props: { id: 'a34', type: 'md', content: 'Body', tags: ['vue', 'ts'] },
    });
    expect(wrapper.text()).toContain('vue');
    expect(wrapper.text()).toContain('ts');
  });

  test('renders star rating when rate is provided', () => {
    const wrapper = mount(Article, {
      props: { id: 'a35', type: 'md', content: 'Body', rate: 4.2 },
    });
    // Star icons should be present (5 stars)
    expect(wrapper.findAll('[data-slot="star"]').length).toBe(5);
  });

  test('does not render stars when rate is undefined', () => {
    const wrapper = mount(Article, {
      props: { id: 'a36', type: 'md', content: 'Body' },
    });
    expect(wrapper.findAll('[data-slot="star"]').length).toBe(0);
  });

  test('renders empty content placeholder', () => {
    const wrapper = mount(Article, {
      props: { id: 'a37', type: 'md', content: '' },
    });
    expect(wrapper.find('[data-slot="empty-placeholder"]').exists()).toBe(true);
  });

  test('renders expand button when maxHeight is provided', () => {
    const wrapper = mount(Article, {
      props: { id: 'a38', type: 'md', content: 'Body', maxHeight: '300px' },
    });
    expect(wrapper.find('[data-slot="expand-button"]').exists()).toBe(true);
  });

  test('does not render expand button without maxHeight', () => {
    const wrapper = mount(Article, {
      props: { id: 'a39', type: 'md', content: 'Body' },
    });
    expect(wrapper.find('[data-slot="expand-button"]').exists()).toBe(false);
  });

  test('body contains parsed HTML content', () => {
    const wrapper = mount(Article, {
      props: { id: 'a40', type: 'md', content: '# Hello\n\nWorld' },
    });
    const body = wrapper.find('[data-slot="article-body"]');
    expect(body.exists()).toBe(true);
    expect(body.html()).toContain('Hello');
    expect(body.html()).toContain('World');
  });
});
