import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { VtuRenderer } from '../index';

function createMinimalSpec() {
  return {
    root: 'Image',
    elements: {
      img: {
        type: 'Image',
        props: {
          id: 'img-1',
          assetId: 'asset-123',
          src: 'https://example.com/image.png',
          alt: 'Test image',
        },
      },
    },
  };
}

describe('VtuRenderer', () => {
  test('mounts without error', () => {
    const wrapper = mount(VtuRenderer, {
      props: {
        spec: createMinimalSpec(),
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  test('passes spec and registry to inner Renderer', () => {
    const wrapper = mount(VtuRenderer, {
      props: {
        spec: createMinimalSpec(),
      },
    });
    const renderer = wrapper.findComponent({ name: 'JsonRenderer' });
    expect(renderer.exists()).toBe(true);
    expect(renderer.props('spec')).toEqual(createMinimalSpec());
    expect(renderer.props('registry')).toBeDefined();
  });

  test('wraps content with all json-render providers', () => {
    const wrapper = mount(VtuRenderer, {
      props: {
        spec: createMinimalSpec(),
      },
    });
    expect(wrapper.findComponent({ name: 'StateProvider' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'ActionProvider' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'VisibilityProvider' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'ValidationProvider' }).exists()).toBe(true);
  });

  test('passes initialState to StateProvider', () => {
    const initialState = { foo: 'bar' };
    const wrapper = mount(VtuRenderer, {
      props: {
        spec: createMinimalSpec(),
        initialState,
      },
    });
    const provider = wrapper.findComponent({ name: 'StateProvider' });
    expect(provider.props('initialState')).toEqual(initialState);
  });

  test('passes handlers to ActionProvider', () => {
    const handlers = { onClick: () => {} };
    const wrapper = mount(VtuRenderer, {
      props: {
        spec: createMinimalSpec(),
        handlers,
      },
    });
    const provider = wrapper.findComponent({ name: 'ActionProvider' });
    expect(provider.props('handlers')).toEqual(handlers);
  });

  test('uses empty objects as defaults for optional props', () => {
    const wrapper = mount(VtuRenderer, {
      props: {
        spec: createMinimalSpec(),
      },
    });
    const stateProvider = wrapper.findComponent({ name: 'StateProvider' });
    const actionProvider = wrapper.findComponent({ name: 'ActionProvider' });
    expect(stateProvider.props('initialState')).toEqual({});
    expect(actionProvider.props('handlers')).toEqual({});
  });
});
