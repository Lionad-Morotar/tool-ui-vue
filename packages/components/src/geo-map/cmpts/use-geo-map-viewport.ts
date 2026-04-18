import { ref } from 'vue';
import {
  roundCoordinate,
  serializeFitPoints,
  resolveFitPointsWithFallback,
  DEFAULT_VIEWPORT_PADDING,
  SINGLE_LOCATION_ZOOM,
} from '../utils';
import type { GeoMapMarker, GeoMapRoute, GeoMapViewport } from '../schema';
import type { Map as LeafletMap } from 'leaflet';

export function useGeoMapViewport(
  getLeafletModule: () => typeof import('leaflet') | null,
  _getMapCenter: () => [number, number],
  setMapCenter: (center: [number, number]) => void,
  _getMapZoom: () => number,
  setMapZoom: (zoom: number) => void
) {
  const lastAppliedViewportRef = ref<string | null>(null);

  function applyViewportToMap(
    map: LeafletMap,
    viewport: GeoMapViewport | undefined,
    markers: GeoMapMarker[],
    routes: GeoMapRoute[]
  ): void {
    const leafletModule = getLeafletModule();
    if (!leafletModule) return;

    if (viewport?.mode === 'center') {
      const viewportKey = `center:${roundCoordinate(viewport.center.lat)}:${roundCoordinate(viewport.center.lng)}:${viewport.zoom}`;
      if (lastAppliedViewportRef.value === viewportKey) return;

      lastAppliedViewportRef.value = viewportKey;
      map.setView([viewport.center.lat, viewport.center.lng], viewport.zoom);
      setMapCenter([viewport.center.lat, viewport.center.lng]);
      setMapZoom(viewport.zoom);
      return;
    }

    const fitTarget = viewport?.target ?? 'all';
    const fitPoints = resolveFitPointsWithFallback(markers, routes, fitTarget);
    if (fitPoints.length === 0) return;

    const maxZoom = viewport?.maxZoom;

    if (fitPoints.length === 1) {
      const [lat, lng] = fitPoints[0];
      const zoom = maxZoom
        ? Math.min(SINGLE_LOCATION_ZOOM, maxZoom)
        : SINGLE_LOCATION_ZOOM;
      const viewportKey = `fit-single:${roundCoordinate(lat)}:${roundCoordinate(lng)}:${zoom}`;
      if (lastAppliedViewportRef.value === viewportKey) return;

      lastAppliedViewportRef.value = viewportKey;
      map.setView([lat, lng], zoom);
      setMapCenter([lat, lng]);
      setMapZoom(zoom);
      return;
    }

    const padding = viewport?.padding ?? DEFAULT_VIEWPORT_PADDING;
    const viewportKey = `fit:${fitTarget}:${padding}:${maxZoom ?? 'none'}:${serializeFitPoints(fitPoints)}`;
    if (lastAppliedViewportRef.value === viewportKey) return;

    lastAppliedViewportRef.value = viewportKey;

    const validPoints = fitPoints.filter(
      ([lat, lng]) =>
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        Number.isFinite(lat) &&
        Number.isFinite(lng)
    );
    if (validPoints.length < 2) return;

    try {
      const bounds = leafletModule.latLngBounds(validPoints);
      if (!bounds.isValid()) return;
      map.fitBounds(bounds, {
        maxZoom,
        padding: [padding, padding],
      });
      const nextCenter = map.getCenter();
      setMapCenter([nextCenter.lat, nextCenter.lng]);
      setMapZoom(map.getZoom());
    } catch {
      // Silently ignore fitBounds errors
    }
  }

  function invalidateViewport() {
    lastAppliedViewportRef.value = null;
  }

  return {
    applyViewportToMap,
    invalidateViewport,
  };
}
