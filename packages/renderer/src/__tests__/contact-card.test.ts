import {
  parseSerializableContactCard,
  safeParseSerializableContactCard,
  ContactKindSchema,
  useContactCard,
  ContactCard,
  type ContactKind,
} from '@lionad/vtu-components';
import { mount } from '@vue/test-utils';
import { describe, expect, test, afterEach, vi } from 'vitest';

describe('ContactCard schema', () => {
  test('parses valid contact card with all fields', () => {
    const input = {
      id: 'contact-1',
      kind: 'phone',
      value: '+86 138-0000-0000',
      label: '客服电话',
      href: 'tel:+8613800000000',
      copyable: true,
    };
    const result = parseSerializableContactCard(input);
    expect(result.id).toBe('contact-1');
    expect(result.kind).toBe('phone');
    expect(result.value).toBe('+86 138-0000-0000');
    expect(result.label).toBe('客服电话');
    expect(result.href).toBe('tel:+8613800000000');
    expect(result.copyable).toBe(true);
    expect(result.description).toBeUndefined();
  });

  test('parses minimal contact card with required fields only', () => {
    const input = {
      id: 'contact-2',
      kind: 'email',
      value: 'hello@example.com',
    };
    const result = parseSerializableContactCard(input);
    expect(result.id).toBe('contact-2');
    expect(result.kind).toBe('email');
    expect(result.value).toBe('hello@example.com');
    expect(result.label).toBeUndefined();
    expect(result.href).toBeUndefined();
    expect(result.copyable).toBeUndefined();
  });

  test('rejects invalid kind', () => {
    const input = {
      id: 'contact-3',
      kind: 'invalid-kind',
      value: 'test',
    };
    expect(() => parseSerializableContactCard(input)).toThrow();
  });

  test('accepts all valid kind values', () => {
    const kinds = ['phone', 'email', 'address', 'whatsapp', 'wechat', 'website', 'other'] as const;
    for (const kind of kinds) {
      const result = parseSerializableContactCard({ id: `c-${kind}`, kind, value: 'test' });
      expect(result.kind).toBe(kind);
    }
  });

  test('parses contact card with description', () => {
    const input = {
      id: 'contact-desc',
      kind: 'phone',
      value: '123',
      description: '工作日 9:00-18:00',
    };
    const result = parseSerializableContactCard(input);
    expect(result.description).toBe('工作日 9:00-18:00');
  });

  test('ContactKindSchema rejects non-enum values', () => {
    expect(() => ContactKindSchema.parse('fax')).toThrow();
    expect(ContactKindSchema.parse('phone')).toBe('phone');
  });
});

describe('useContactCard href generation', () => {
  test('phone kind generates tel: link', () => {
    const props = { id: 'c1', kind: 'phone' as const, value: '+8613800000000' };
    const state = useContactCard(props);
    expect(state.generatedHref.value).toBe('tel:+8613800000000');
  });

  test('email kind generates mailto: link', () => {
    const props = { id: 'c2', kind: 'email' as const, value: 'hello@example.com' };
    const state = useContactCard(props);
    expect(state.generatedHref.value).toBe('mailto:hello@example.com');
  });

  test('whatsapp kind generates wa.me link', () => {
    const props = { id: 'c3', kind: 'whatsapp' as const, value: '8613800000000' };
    const state = useContactCard(props);
    expect(state.generatedHref.value).toBe('https://wa.me/8613800000000');
  });

  test('website kind uses value as href when protocol present', () => {
    const props = { id: 'c3b', kind: 'website' as const, value: 'https://lionad.art' };
    const state = useContactCard(props);
    expect(state.generatedHref.value).toBe('https://lionad.art');
  });

  test('website kind prepends https:// when no protocol', () => {
    const props = { id: 'c3c', kind: 'website' as const, value: 'lionad.art' };
    const state = useContactCard(props);
    expect(state.generatedHref.value).toBe('https://lionad.art');
  });

  test('wechat kind has no default href', () => {
    const props = { id: 'c4', kind: 'wechat' as const, value: 'wxid_xxx' };
    const state = useContactCard(props);
    expect(state.generatedHref.value).toBeUndefined();
  });

  test('address kind has no default href', () => {
    const props = { id: 'c5', kind: 'address' as const, value: '上海市' };
    const state = useContactCard(props);
    expect(state.generatedHref.value).toBeUndefined();
  });

  test('other kind has no default href', () => {
    const props = { id: 'c6', kind: 'other' as const, value: 'some info' };
    const state = useContactCard(props);
    expect(state.generatedHref.value).toBeUndefined();
  });

  test('explicit href overrides generated href', () => {
    const props = { id: 'c7', kind: 'phone' as const, value: '123', href: 'tel:+999' };
    const state = useContactCard(props);
    expect(state.generatedHref.value).toBe('tel:+999');
  });
});

describe('useContactCard href sanitization', () => {
  test('filters javascript: protocol', () => {
    const props = { id: 'c1', kind: 'phone' as const, value: '123', href: 'javascript:alert(1)' };
    const state = useContactCard(props);
    expect(state.sanitizedHref.value).toBeUndefined();
  });

  test('filters data: protocol', () => {
    const props = { id: 'c2', kind: 'email' as const, value: 'a@b.com', href: 'data:text/html,evil' };
    const state = useContactCard(props);
    expect(state.sanitizedHref.value).toBeUndefined();
  });

  test('filters vbscript: protocol', () => {
    const props = { id: 'c3', kind: 'other' as const, value: 'x', href: 'vbscript:evil' };
    const state = useContactCard(props);
    expect(state.sanitizedHref.value).toBeUndefined();
  });

  test('allows legitimate tel: href', () => {
    const props = { id: 'c4', kind: 'phone' as const, value: '123', href: 'tel:+8613800000000' };
    const state = useContactCard(props);
    expect(state.sanitizedHref.value).toBe('tel:+8613800000000');
  });

  test('allows legitimate mailto: href', () => {
    const props = { id: 'c5', kind: 'email' as const, value: 'a@b.com', href: 'mailto:a@b.com' };
    const state = useContactCard(props);
    expect(state.sanitizedHref.value).toBe('mailto:a@b.com');
  });

  test('allows https: href', () => {
    const props = { id: 'c6', kind: 'whatsapp' as const, value: '123', href: 'https://example.com' };
    const state = useContactCard(props);
    expect(state.sanitizedHref.value).toBe('https://example.com');
  });
});

describe('useContactCard copy action', () => {
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  test('copyable=true triggers clipboard write on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    const props = { id: 'c1', kind: 'wechat' as const, value: 'wxid_hello', copyable: true };
    const state = useContactCard(props);
    state.handleClick();

    // Wait for microtask
    await new Promise((r) => setTimeout(r, 10));

    expect(writeText).toHaveBeenCalledWith('wxid_hello');
  });

  test('copyable=true sets copied flag briefly', async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });

    const props = { id: 'c2', kind: 'phone' as const, value: '123', copyable: true };
    const state = useContactCard(props);

    expect(state.copied.value).toBe(false);
    state.handleClick();
    await vi.advanceTimersByTimeAsync(10);

    expect(state.copied.value).toBe(true);
    await vi.advanceTimersByTimeAsync(2000);
    expect(state.copied.value).toBe(false);

    vi.useRealTimers();
  });

  test('copyable=false does not write clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    const props = { id: 'c3', kind: 'email' as const, value: 'a@b.com', copyable: false, href: 'mailto:a@b.com' };
    const state = useContactCard(props);
    state.handleClick();

    await new Promise((r) => setTimeout(r, 10));
    expect(writeText).not.toHaveBeenCalled();
  });

  test('gracefully handles missing clipboard API', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const props = { id: 'c4', kind: 'other' as const, value: 'info', copyable: true };
    const state = useContactCard(props);

    // Should not throw
    expect(() => state.handleClick()).not.toThrow();
  });
});

describe('ContactCard template', () => {
  test('renders phone card with tel link', () => {
    const wrapper = mount(ContactCard, {
      props: {
        id: 'cc-phone',
        kind: 'phone',
        value: '+86 138-0000-0000',
        label: '客服电话',
      },
    });
    expect(wrapper.find('[data-slot="contact-card"]').exists()).toBe(true);
    expect(wrapper.find('[data-tool-ui-id="cc-phone"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('+86 138-0000-0000');
    expect(wrapper.text()).toContain('客服电话');
  });

  test('renders description when provided', () => {
    const wrapper = mount(ContactCard, {
      props: {
        id: 'cc-desc',
        kind: 'phone',
        value: '123',
        description: '工作日 9:00-18:00',
      },
    });
    expect(wrapper.text()).toContain('工作日 9:00-18:00');
  });

  test('renders email card with mailto link', () => {
    const wrapper = mount(ContactCard, {
      props: {
        id: 'cc-email',
        kind: 'email',
        value: 'hello@example.com',
      },
    });
    expect(wrapper.text()).toContain('hello@example.com');
  });

  test('address kind preserves line breaks in value', () => {
    const wrapper = mount(ContactCard, {
      props: {
        id: 'cc-address',
        kind: 'address',
        value: '上海市浦东新区\n陆家嘴环路 1000 号',
      },
    });
    expect(wrapper.text()).toContain('上海市浦东新区');
    expect(wrapper.text()).toContain('陆家嘴环路 1000 号');
  });

  test('copyable card shows copy indicator', () => {
    const wrapper = mount(ContactCard, {
      props: {
        id: 'cc-copy',
        kind: 'wechat',
        value: 'wxid_hello',
        copyable: true,
      },
    });
    expect(wrapper.text()).toContain('wxid_hello');
    // Copyable cards should have a visual indicator
    expect(wrapper.find('[data-copyable="true"]').exists()).toBe(true);
  });

  test('renders all 7 kind types without error', () => {
    const kinds: ContactKind[] = ['phone', 'email', 'address', 'whatsapp', 'wechat', 'website', 'other'];
    for (const kind of kinds) {
      const wrapper = mount(ContactCard, {
        props: { id: `cc-${kind}`, kind, value: 'test' },
      });
      expect(wrapper.exists()).toBe(true);
    }
  });
});
