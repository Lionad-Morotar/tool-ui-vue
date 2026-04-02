/**
 * Adapter: UI and utility re-exports for copy-standalone portability.
 */
export { cn } from '../../utils'

import type L from 'leaflet'

// Re-export Leaflet types
export type { L }

// Vue Leaflet components (to be imported from @vue-leaflet/vue-leaflet)
// These are re-exported for portability
export {
  LMap as MapContainer,
  LTileLayer as TileLayer,
  LMarker as Marker,
  LCircleMarker as CircleMarker,
  LPolyline as Polyline,
  LPopup as Popup,
  LTooltip as Tooltip,
  LControlZoom as ZoomControl,
} from '@vue-leaflet/vue-leaflet'
