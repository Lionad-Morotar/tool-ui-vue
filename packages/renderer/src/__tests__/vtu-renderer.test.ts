import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import {
  ActionProvider,
  Renderer,
  StateProvider,
  ValidationProvider,
  VisibilityProvider,
} from '@json-render/vue';
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
    const renderer = wrapper.findComponent(Renderer);
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
    expect(wrapper.findComponent(StateProvider).exists()).toBe(true);
    expect(wrapper.findComponent(ActionProvider).exists()).toBe(true);
    expect(wrapper.findComponent(VisibilityProvider).exists()).toBe(true);
    expect(wrapper.findComponent(ValidationProvider).exists()).toBe(true);
  });

  test('passes initialState to StateProvider', () => {
    const initialState = { foo: 'bar' };
    const wrapper = mount(VtuRenderer, {
      props: {
        spec: createMinimalSpec(),
        initialState,
      },
    });
    const provider = wrapper.findComponent(StateProvider);
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
    const provider = wrapper.findComponent(ActionProvider);
    expect(provider.props('handlers')).toEqual(handlers);
  });

  test('uses empty objects as defaults for optional props', () => {
    const wrapper = mount(VtuRenderer, {
      props: {
        spec: createMinimalSpec(),
      },
    });
    const stateProvider = wrapper.findComponent(StateProvider);
    const actionProvider = wrapper.findComponent(ActionProvider);
    expect(stateProvider.props('initialState')).toEqual({});
    expect(actionProvider.props('handlers')).toEqual({});
  });
});
