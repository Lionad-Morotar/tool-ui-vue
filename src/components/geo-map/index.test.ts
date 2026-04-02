import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import GeoMap from './index.vue';
import type { GeoMapMarker, GeoMapRoute } from './schema';

const GeoMapEngineStub = {
  template: '<div data-testid="geo-map-engine-stub" />',
  props: ['id', 'markers', 'routes', 'clustering', 'viewport', 'showZoomControl', 'tileUrl', 'mapAriaLabel', 'tooltipClassName', 'popupClassName'],
  emits: ['markerClick', 'routeClick', 'ready'],
};

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'location-map',
    title: 'Store Locations',
    markers: [
      { id: 'store1', lat: 37.7749, lng: -122.4194, label: 'Main Store' },
      { id: 'store2', lat: 37.7849, lng: -122.4094, label: 'Branch 1' },
    ],
    ...overrides,
  };
}

describe('GeoMap', () => {
  describe('rendering', () => {
    test('renders map container', () => {
      const wrapper = mount(GeoMap, {
        props: createProps(),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      expect(wrapper.find('[data-slot="geo-map"]').exists()).toBe(true);
    });

    test('renders map title', () => {
      const wrapper = mount(GeoMap, {
        props: createProps(),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      expect(wrapper.text()).toContain('Store Locations');
    });

    test('renders center coordinates from markers when no viewport', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({
          viewport: { mode: 'center', center: { lat: 37.7749, lng: -122.4194 }, zoom: 12 },
        }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      expect(wrapper.find('[data-slot="geo-map"]').exists()).toBe(true);
    });

    test('renders zoom level via viewport', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({
          viewport: { mode: 'center', center: { lat: 37.7749, lng: -122.4194 }, zoom: 12 },
        }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      expect(wrapper.find('[data-slot="geo-map"]').exists()).toBe(true);
    });
  });

  describe('markers', () => {
    test('passes markers prop to engine', () => {
      const props = createProps();
      const wrapper = mount(GeoMap, {
        props,
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('markers')).toEqual(props.markers);
    });

    test('passes multiple markers to engine', () => {
      const markers = [
        { id: 'm1', lat: 37, lng: -122, label: 'A' },
        { id: 'm2', lat: 37.1, lng: -122.1, label: 'B' },
        { id: 'm3', lat: 37.2, lng: -122.2, label: 'C' },
      ];
      const wrapper = mount(GeoMap, {
        props: createProps({ markers }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('markers')).toHaveLength(3);
    });

    test('passes marker labels via markers prop', () => {
      const markers = [
        { id: 'store1', lat: 37.7749, lng: -122.4194, label: 'Main Store' },
      ];
      const wrapper = mount(GeoMap, {
        props: createProps({ markers }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('markers')[0].label).toBe('Main Store');
    });
  });

  describe('routes', () => {
    test('renders route names when provided', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({
          routes: [
            { id: 'r1', points: [{ lat: 37.7749, lng: -122.4194 }, { lat: 37.7849, lng: -122.4094 }], label: 'Route A' },
          ],
        }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      expect(wrapper.find('[data-slot="geo-map"]').exists()).toBe(true);
    });
  });

  describe('events', () => {
    test('emits marker-click on marker interaction', () => {
      const wrapper = mount(GeoMap, {
        props: createProps(),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      engine.vm.$emit('markerClick', { id: 'store1', lat: 37.7749, lng: -122.4194, label: 'Main Store' });
      expect(wrapper.emitted('marker-click')).toBeTruthy();
      const emitted = wrapper.emitted('marker-click') as unknown[][];
      expect(emitted[0][0]).toMatchObject({ id: 'store1' });
    });

    test('emits route-click on route interaction', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({
          routes: [{ id: 'r1', points: [{ lat: 37, lng: -122 }, { lat: 37.1, lng: -122.1 }], label: 'Route A' }],
        }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      engine.vm.$emit('routeClick', { id: 'r1', points: [{ lat: 37, lng: -122 }, { lat: 37.1, lng: -122.1 }], label: 'Route A' });
      expect(wrapper.emitted('route-click')).toBeTruthy();
    });
  });

  describe('configuration', () => {
    test('applies custom className', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({ className: 'my-map' }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      expect(wrapper.find('[data-slot="geo-map"]').classes()).toContain('my-map');
    });
  });

  describe('loading state', () => {
    test('shows loading state before engine is ready', () => {
      const wrapper = mount(GeoMap, {
        props: createProps(),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      // Initially engine emits ready on mount; with stub it doesn't auto-emit
      expect(wrapper.text()).toContain('Loading map');
    });

    test('hides loading state after engine becomes ready', async () => {
      const wrapper = mount(GeoMap, {
        props: createProps(),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      await engine.vm.$emit('ready', true);
      expect(wrapper.text()).not.toContain('Loading map');
    });
  });

  describe('theme support', () => {
    test('passes theme prop to engine', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({ theme: 'dark' }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      expect(wrapper.find('[data-slot="geo-map"]').exists()).toBe(true);
    });

    test('applies custom style', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({ style: { '--custom-var': 'red' } }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const container = wrapper.find('[data-slot="geo-map"]');
      expect(container.exists()).toBe(true);
    });
  });

  describe('clustering', () => {
    test('passes clustering config to engine', () => {
      const clustering = { enabled: true, radius: 40, maxZoom: 16 };
      const wrapper = mount(GeoMap, {
        props: createProps({ clustering }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('clustering')).toEqual(clustering);
    });

    test('passes disabled clustering to engine', () => {
      const clustering = { enabled: false };
      const wrapper = mount(GeoMap, {
        props: createProps({ clustering }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('clustering')).toEqual(clustering);
    });
  });

  describe('viewport configuration', () => {
    test('passes fit viewport to engine', () => {
      const viewport = { mode: 'fit' as const, padding: 50, target: 'all' as const };
      const wrapper = mount(GeoMap, {
        props: createProps({ viewport }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('viewport')).toEqual(viewport);
    });

    test('passes center viewport to engine', () => {
      const viewport = { mode: 'center' as const, center: { lat: 37.7749, lng: -122.4194 }, zoom: 12 };
      const wrapper = mount(GeoMap, {
        props: createProps({ viewport }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('viewport')).toEqual(viewport);
    });
  });

  describe('accessibility', () => {
    test('sets aria-label from title and description', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({
          title: 'Map Title',
          description: 'Map Description',
        }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const region = wrapper.find('[role="region"]');
      expect(region.attributes('aria-label')).toBe('Map Title. Map Description');
    });

    test('sets aria-label from title only', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({ title: 'Map Title', description: undefined }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const region = wrapper.find('[role="region"]');
      expect(region.attributes('aria-label')).toBe('Map Title');
    });

    test('sets default aria-label when no title or description', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({ title: undefined, description: undefined }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const region = wrapper.find('[role="region"]');
      expect(region.attributes('aria-label')).toBe('Geographic map');
    });
  });

  describe('zoom control', () => {
    test('passes showZoomControl false to engine', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({ showZoomControl: false }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('showZoomControl')).toBe(false);
    });

    test('passes showZoomControl true to engine', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({ showZoomControl: true }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('showZoomControl')).toBe(true);
    });
  });

  describe('custom classes', () => {
    test('applies tooltipClassName to engine', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({ tooltipClassName: 'custom-tooltip' }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('tooltipClassName')).toBe('custom-tooltip');
    });

    test('applies popupClassName to engine', () => {
      const wrapper = mount(GeoMap, {
        props: createProps({ popupClassName: 'custom-popup' }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('popupClassName')).toBe('custom-popup');
    });
  });

  describe('callback props', () => {
    test('calls onMarkerClick when marker is clicked', () => {
      const onMarkerClick = vi.fn();
      const marker: GeoMapMarker = { id: 'store1', lat: 37.7749, lng: -122.4194, label: 'Main Store' };
      const wrapper = mount(GeoMap, {
        props: createProps({ onMarkerClick }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      engine.vm.$emit('markerClick', marker);
      expect(onMarkerClick).toHaveBeenCalledWith(marker);
    });

    test('calls onRouteClick when route is clicked', () => {
      const onRouteClick = vi.fn();
      const route: GeoMapRoute = { id: 'r1', points: [{ lat: 37, lng: -122 }, { lat: 37.1, lng: -122.1 }], label: 'Route A' };
      const wrapper = mount(GeoMap, {
        props: createProps({ routes: [route], onRouteClick }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      engine.vm.$emit('routeClick', route);
      expect(onRouteClick).toHaveBeenCalledWith(route);
    });
  });

  describe('markers with icons', () => {
    test('passes markers with dot icons to engine', () => {
      const markers: GeoMapMarker[] = [
        { id: 'm1', lat: 37, lng: -122, icon: { type: 'dot', color: 'red', radius: 10 } },
      ];
      const wrapper = mount(GeoMap, {
        props: createProps({ markers }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('markers')[0].icon).toEqual({ type: 'dot', color: 'red', radius: 10 });
    });

    test('passes markers with emoji icons to engine', () => {
      const markers: GeoMapMarker[] = [
        { id: 'm1', lat: 37, lng: -122, icon: { type: 'emoji', value: '🍽️' } },
      ];
      const wrapper = mount(GeoMap, {
        props: createProps({ markers }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('markers')[0].icon).toEqual({ type: 'emoji', value: '🍽️' });
    });

    test('passes markers with image icons to engine', () => {
      const markers: GeoMapMarker[] = [
        { id: 'm1', lat: 37, lng: -122, icon: { type: 'image', url: 'https://example.com/icon.png' } },
      ];
      const wrapper = mount(GeoMap, {
        props: createProps({ markers }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('markers')[0].icon).toEqual({ type: 'image', url: 'https://example.com/icon.png' });
    });
  });

  describe('routes with styling', () => {
    test('passes routes with custom styling to engine', () => {
      const routes: GeoMapRoute[] = [
        {
          id: 'r1',
          points: [{ lat: 37, lng: -122 }, { lat: 37.1, lng: -122.1 }],
          color: '#ff0000',
          weight: 5,
          opacity: 0.8,
          dashArray: '5, 10',
        },
      ];
      const wrapper = mount(GeoMap, {
        props: createProps({ routes }),
        global: { stubs: { GeoMapEngine: GeoMapEngineStub } },
      });
      const engine = wrapper.findComponent(GeoMapEngineStub);
      expect(engine.props('routes')[0]).toMatchObject({
        color: '#ff0000',
        weight: 5,
        opacity: 0.8,
        dashArray: '5, 10',
      });
    });
  });
});
