import type { GeoMapMarker } from './schema';
import type * as LeafletNS from 'leaflet';
import type { DivIcon, Icon, IconOptions } from 'leaflet';

type LeafletModule = typeof LeafletNS;
type LeafletIconRuntime = Pick<LeafletModule, 'divIcon'>;

// Helper type to work around vue-leaflet's strict Icon typing
// DivIcon is a subclass of Icon but the types don't fully align
type LeafletIcon = Icon<IconOptions> | DivIcon;

function isSafeHttpUrl(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function createEmojiIcon(
  icon: Extract<NonNullable<GeoMapMarker['icon']>, { type: 'emoji' }>,
  leafletRuntime: LeafletIconRuntime
): LeafletIcon {
  const size = icon.size ?? 24;
  const background = icon.bgColor ?? 'var(--color-card)';
  const border = icon.borderColor ?? 'var(--color-border)';

  return leafletRuntime.divIcon({
    className: '', // Leaflet API - intentionally empty to avoid default styling
    html: `<span style="
display:flex;
align-items:center;
justify-content:center;
width:${size}px;
height:${size}px;
border-radius:999px;
background:${background};
border:1px solid ${border};
font-size:${Math.round(size * 0.62)}px;
line-height:1;
box-shadow:0 1px 3px oklch(from var(--color-foreground) l c h / 0.22);
">${escapeHtml(icon.value)}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -Math.round(size / 2)],
    tooltipAnchor: [0, -Math.round(size / 2)],
  });
}

function createImageIcon(
  icon: Extract<NonNullable<GeoMapMarker['icon']>, { type: 'image' }>,
  leafletRuntime: LeafletIconRuntime
): LeafletIcon {
  const width = icon.width ?? 28;
  const height = icon.height ?? 28;
  const borderRadius = icon.borderRadius ?? Math.min(width, height) / 2;
  const border = icon.borderColor ?? 'var(--color-border)';

  return leafletRuntime.divIcon({
    className: '', // Leaflet API - intentionally empty to avoid default styling
    html: `<span style="
display:block;
width:${width}px;
height:${height}px;
border-radius:${borderRadius}px;
overflow:hidden;
border:1px solid ${border};
background:var(--color-card);
box-shadow:0 1px 3px oklch(from var(--color-foreground) l c h / 0.22);
"><img src="${escapeHtml(icon.url)}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" /></span>`,
    iconSize: [width, height],
    iconAnchor: [width / 2, height / 2],
    popupAnchor: [0, -Math.round(height / 2)],
    tooltipAnchor: [0, -Math.round(height / 2)],
  });
}

export function createClusterIcon(
  count: number,
  leafletRuntime: LeafletIconRuntime
): LeafletIcon {
  const size = count >= 100 ? 42 : count >= 10 ? 38 : 34;
  const background = 'var(--color-primary)';
  const border = 'var(--color-background)';

  return leafletRuntime.divIcon({
    className: '', // Leaflet API - intentionally empty to avoid default styling
    html: `<span style="
display:flex;
align-items:center;
justify-content:center;
width:${size}px;
height:${size}px;
border-radius:999px;
background:${background};
border:2px solid ${border};
color:var(--color-primary-foreground);
font-size:12px;
font-weight:700;
line-height:1;
box-shadow:0 2px 6px oklch(from var(--color-foreground) l c h / 0.25);
">${count}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -Math.round(size / 2)],
    tooltipAnchor: [0, -Math.round(size / 2)],
  });
}

export function resolveMarkerIcon(
  icon: GeoMapMarker['icon'] | undefined,
  leafletRuntime: LeafletIconRuntime
): LeafletIcon | null {
  if (icon?.type === 'emoji') {
    return createEmojiIcon(icon, leafletRuntime);
  }

  if (icon?.type === 'image' && isSafeHttpUrl(icon.url)) {
    return createImageIcon(icon, leafletRuntime);
  }

  return null;
}
