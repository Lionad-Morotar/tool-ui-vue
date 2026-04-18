import type { GeoMapMarker, GeoMapRoute, GeoMapViewport } from './schema';

const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_VIEW_ZOOM = 2;
const SINGLE_LOCATION_ZOOM = 13;
const DEFAULT_VIEWPORT_PADDING = 32;

type GeoMapBbox = [west: number, south: number, east: number, north: number];
type GeoMapLatLng = [lat: number, lng: number];

type MapViewportState = {
  bbox: GeoMapBbox;
  zoom: number;
};

export function roundCoordinate(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

export function normalizeViewportState(state: MapViewportState): MapViewportState {
  return {
    bbox: [
      roundCoordinate(state.bbox[0]),
      roundCoordinate(state.bbox[1]),
      roundCoordinate(state.bbox[2]),
      roundCoordinate(state.bbox[3]),
    ],
    zoom: state.zoom,
  };
}

export function areViewportStatesEqual(
  a: MapViewportState | null,
  b: MapViewportState
): boolean {
  if (!a) return false;
  return (
    a.zoom === b.zoom &&
    a.bbox[0] === b.bbox[0] &&
    a.bbox[1] === b.bbox[1] &&
    a.bbox[2] === b.bbox[2] &&
    a.bbox[3] === b.bbox[3]
  );
}

export function serializeFitPoints(points: [number, number][]): string {
  return points
    .map(([lat, lng]) => `${roundCoordinate(lat)},${roundCoordinate(lng)}`)
    .join('|');
}

export function readViewportState(map: import('leaflet').Map): MapViewportState {
  const bounds = map.getBounds();
  return normalizeViewportState({
    bbox: [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ],
    zoom: Math.round(map.getZoom()),
  });
}

export function isValidLatLng(
  lat: number | undefined,
  lng: number | undefined
): lat is number {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function collectFitPoints(
  markers: GeoMapMarker[],
  routes: GeoMapRoute[],
  target: 'markers' | 'routes' | 'all'
): GeoMapLatLng[] {
  const markerPoints =
    target === 'markers' || target === 'all'
      ? markers
          .filter((marker) => isValidLatLng(marker.lat, marker.lng))
          .map((marker) => [marker.lat, marker.lng] as GeoMapLatLng)
      : [];

  const routePoints =
    target === 'routes' || target === 'all'
      ? routes.flatMap((route) =>
          route.points
            .filter((point) => isValidLatLng(point.lat, point.lng))
            .map((point) => [point.lat, point.lng] as GeoMapLatLng)
        )
      : [];

  return [...markerPoints, ...routePoints];
}

export function resolveFitPointsWithFallback(
  markers: GeoMapMarker[],
  routes: GeoMapRoute[],
  target: 'markers' | 'routes' | 'all'
): GeoMapLatLng[] {
  const selected = collectFitPoints(markers, routes, target);
  if (selected.length > 0) return selected;
  if (target !== 'markers') return collectFitPoints(markers, routes, 'markers');
  return [];
}

export function splitDatelineBbox(bbox: GeoMapBbox): GeoMapBbox[] {
  const [west, south, east, north] = bbox;
  if (west <= east) return [bbox];
  return [
    [west, south, 180, north],
    [-180, south, east, north],
  ];
}

export function toSafeExpansionZoom(
  zoom: number,
  options?: { minZoom?: number; maxZoom?: number; fallback?: number }
): number {
  const minZoom = options?.minZoom ?? 1;
  const maxZoom = options?.maxZoom ?? 22;
  const fallback = options?.fallback ?? 2;

  if (!Number.isFinite(zoom)) return fallback;
  return Math.min(maxZoom, Math.max(minZoom, Math.round(zoom)));
}

export function resolveInitialView(
  markers: GeoMapMarker[],
  routes: GeoMapRoute[],
  viewport: GeoMapViewport | undefined
): { center: [number, number]; zoom: number } {
  if (viewport?.mode === 'center') {
    return {
      center: [viewport.center.lat, viewport.center.lng],
      zoom: viewport.zoom,
    };
  }

  const fitTarget = viewport?.target ?? 'all';
  const fitPoints = resolveFitPointsWithFallback(markers, routes, fitTarget);

  if (fitPoints.length === 0) {
    return { center: DEFAULT_CENTER, zoom: DEFAULT_VIEW_ZOOM };
  }

  if (fitPoints.length === 1) {
    return {
      center: [fitPoints[0][0], fitPoints[0][1]],
      zoom: viewport?.maxZoom
        ? Math.min(SINGLE_LOCATION_ZOOM, viewport.maxZoom)
        : SINGLE_LOCATION_ZOOM,
    };
  }

  const lats = fitPoints.map(([lat]) => lat);
  const lngs = fitPoints.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const center: [number, number] = [
    (minLat + maxLat) / 2,
    (minLng + maxLng) / 2,
  ];

  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;
  const cosLat = Math.cos((center[0] * Math.PI) / 180);
  const adjustedLngSpan = lngSpan / Math.max(cosLat, 0.01);
  const maxSpan = Math.max(latSpan, adjustedLngSpan);

  let zoom: number;
  if (maxSpan < 1e-10) {
    zoom = SINGLE_LOCATION_ZOOM;
  } else {
    zoom = Math.max(
      1,
      Math.min(22, Math.round(Math.log2(360 / maxSpan) - 1))
    );
  }

  if (viewport?.maxZoom) {
    zoom = Math.min(zoom, viewport.maxZoom);
  }

  return { center, zoom };
}

export function resolveMarkerAriaLabel(marker: GeoMapMarker): string {
  if (marker.label && marker.description) {
    return `${marker.label}. ${marker.description}`;
  }
  return (
    marker.label ??
    marker.description ??
    `Marker at ${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}`
  );
}

export function getDotRadius(icon: GeoMapMarker['icon']): number {
  return icon?.type === 'dot' ? icon.radius ?? 7 : 7;
}

export function getDotBorderColor(icon: GeoMapMarker['icon']): string {
  return icon?.type === 'dot'
    ? icon.borderColor ?? 'var(--color-border)'
    : 'var(--color-border)';
}

export function getDotFillColor(icon: GeoMapMarker['icon']): string {
  return icon?.type === 'dot'
    ? icon.color ?? 'var(--color-primary)'
    : 'var(--color-primary)';
}

export {
  DEFAULT_CENTER,
  DEFAULT_VIEW_ZOOM,
  SINGLE_LOCATION_ZOOM,
  DEFAULT_VIEWPORT_PADDING,
};
export type { GeoMapBbox, GeoMapLatLng, MapViewportState };
