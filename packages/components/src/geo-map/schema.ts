/**
 * GeoMap 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/geo-map/schema
 */
import { defineToolUiContract, ToolUIIdSchema, ToolUIReceiptSchema, ToolUIRoleSchema, type ToolUIReceipt } from '@lionad/vtu-core';
import { z } from 'zod';

const LatitudeSchema = z.number().min(-90).max(90);
const LongitudeSchema = z.number().min(-180).max(180);
const HttpUrlSchema = z.url()
  .refine((value) => /^https?:\/\//i.test(value), {
      error: 'Expected an http or https URL.'
});

const GeoMapMarkerIconDotSchema = z.object({
  type: z.literal('dot'),
  color: z.string().optional(),
  borderColor: z.string().optional(),
  radius: z.number().min(3).max(16).optional(),
});

const GeoMapMarkerIconEmojiSchema = z.object({
  type: z.literal('emoji'),
  value: z.string().min(1),
  size: z.number().min(16).max(40).optional(),
  bgColor: z.string().optional(),
  borderColor: z.string().optional(),
});

const GeoMapMarkerIconImageSchema = z.object({
  type: z.literal('image'),
  url: HttpUrlSchema,
  width: z.number().min(16).max(64).optional(),
  height: z.number().min(16).max(64).optional(),
  borderRadius: z.number().min(0).max(999).optional(),
  borderColor: z.string().optional(),
});

/**
 * 地图标记图标的 Schema 定义
 */
export const GeoMapMarkerIconSchema = z.union([
  GeoMapMarkerIconDotSchema,
  GeoMapMarkerIconEmojiSchema,
  GeoMapMarkerIconImageSchema,
]);

/**
 * 地图标记图标类型
 * 对应 GeoMapMarkerIconSchema 的 TypeScript 类型
 */
export type GeoMapMarkerIcon = z.infer<typeof GeoMapMarkerIconSchema>;

/**
 * 地图标记的 Schema 定义
 */
export const GeoMapMarkerSchema = z.object({
  id: z.string().min(1).optional(),
  lat: LatitudeSchema,
  lng: LongitudeSchema,
  label: z.string().optional(),
  description: z.string().optional(),
  tooltip: z.enum(['none', 'hover', 'always']).optional(),
  icon: GeoMapMarkerIconSchema.optional(),
});

/**
 * 地图标记类型
 * 对应 GeoMapMarkerSchema 的 TypeScript 类型
 */
export type GeoMapMarker = z.infer<typeof GeoMapMarkerSchema>;

/**
 * 地图路线点的 Schema 定义
 */
export const GeoMapRoutePointSchema = z.object({
  lat: LatitudeSchema,
  lng: LongitudeSchema,
});

/**
 * 地图路线的 Schema 定义
 */
export const GeoMapRouteSchema = z.object({
  id: z.string().min(1).optional(),
  points: z.array(GeoMapRoutePointSchema).min(2),
  label: z.string().optional(),
  description: z.string().optional(),
  tooltip: z.enum(['none', 'hover', 'always']).optional(),
  color: z.string().optional(),
  weight: z.number().min(1).max(12).optional(),
  opacity: z.number().min(0).max(1).optional(),
  dashArray: z.string().optional(),
});

/**
 * 地图路线类型
 * 对应 GeoMapRouteSchema 的 TypeScript 类型
 */
export type GeoMapRoute = z.infer<typeof GeoMapRouteSchema>;

/**
 * 地图聚类配置的 Schema 定义
 */
export const GeoMapClusteringSchema = z.object({
  enabled: z.boolean().optional(),
  radius: z.number().min(20).max(120).optional(),
  maxZoom: z.number().min(1).max(22).optional(),
  minPoints: z.number().min(2).max(20).optional(),
});

/**
 * 地图聚类配置类型
 * 对应 GeoMapClusteringSchema 的 TypeScript 类型
 */
export type GeoMapClustering = z.infer<typeof GeoMapClusteringSchema>;

/**
 * 地图适配目标的 Schema 定义
 */
export const GeoMapFitTargetSchema = z.enum(['markers', 'routes', 'all']);

/**
 * 地图适配目标类型
 * 对应 GeoMapFitTargetSchema 的 TypeScript 类型
 */
export type GeoMapFitTarget = z.infer<typeof GeoMapFitTargetSchema>;

const GeoMapFitViewportSchema = z.object({
  mode: z.literal('fit'),
  padding: z.number().nonnegative().optional(),
  maxZoom: z.number().min(1).max(22).optional(),
  target: GeoMapFitTargetSchema.optional(),
});

const GeoMapCenterViewportSchema = z.object({
  mode: z.literal('center'),
  center: z.object({
    lat: LatitudeSchema,
    lng: LongitudeSchema,
  }),
  zoom: z.number().min(1).max(22),
});

/**
 * 地图视口的 Schema 定义
 */
export const GeoMapViewportSchema = z.union([
  GeoMapFitViewportSchema,
  GeoMapCenterViewportSchema,
]);

/**
 * 地图视口类型
 * 对应 GeoMapViewportSchema 的 TypeScript 类型
 */
export type GeoMapViewport = z.infer<typeof GeoMapViewportSchema>;

/**
 * GeoMap 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const GeoMapPropsSchema = z
  .object({
    id: ToolUIIdSchema,
    role: ToolUIRoleSchema.optional(),
    receipt: ToolUIReceiptSchema.optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    markers: z.array(GeoMapMarkerSchema).min(1),
    routes: z.array(GeoMapRouteSchema).optional(),
    clustering: GeoMapClusteringSchema.optional(),
    viewport: GeoMapViewportSchema.optional(),
    showZoomControl: z.boolean().optional(),
    theme: z.enum(['light', 'dark']).optional(),
  })
  .superRefine((value, ctx) => {
    const seenMarkerIds = new Set<string>();

    value.markers.forEach((marker, index) => {
      if (!marker.id) {
        return;
      }

      if (seenMarkerIds.has(marker.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['markers', index, 'id'],
          message: `Duplicate marker id "${marker.id}".`,
        });
        return;
      }

      seenMarkerIds.add(marker.id);
    });

    const seenRouteIds = new Set<string>();
    value.routes?.forEach((route, index) => {
      if (!route.id) {
        return;
      }

      if (seenRouteIds.has(route.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['routes', index, 'id'],
          message: `Duplicate route id "${route.id}".`,
        });
        return;
      }

      seenRouteIds.add(route.id);
    });
  });

/**
 * 地图样式类型
 */
export type GeoMapStyle = {
  [key: string]: string | number | undefined;
};

/**
 * GeoMapEngine 子组件的 CssSchema
 */
export const GeoMapEngineCssSchema = z.object({
  root: z.string().optional(),
});

/**
 * GeoMapOverlays 子组件的 CssSchema
 */
export const GeoMapOverlaysCssSchema = z.object({
  root: z.string().optional(),
});

/**
 * GeoMapCssSchema Zod Schema
 */
export const GeoMapCssSchema = z.object({
  root: z.string().optional(),
  title: z.string().optional(),
  canvas: GeoMapEngineCssSchema.optional(),
  loading: z.string().optional(),
});

export type GeoMapCss = z.infer<typeof GeoMapCssSchema>;
export type GeoMapEngineCss = z.infer<typeof GeoMapEngineCssSchema>;
export type GeoMapOverlaysCss = z.infer<typeof GeoMapOverlaysCssSchema>;

/**
 * 地图客户端 Props 类型
 */
export type GeoMapClientProps = {
  css?: GeoMapCss;
  style?: GeoMapStyle;
  tooltipClassName?: string;
  popupClassName?: string;
  onMarkerClick?: (marker: GeoMapMarker) => void;
  onRouteClick?: (route: GeoMapRoute) => void;
};

/**
 * GeoMap 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface GeoMapProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: ToolUIReceipt;
  title?: string;
  description?: string;
  markers: GeoMapMarker[];
  routes?: GeoMapRoute[];
  clustering?: GeoMapClustering;
  viewport?: GeoMapViewport;
  showZoomControl?: boolean;
  theme?: 'light' | 'dark';
  css?: GeoMapCss;
  style?: GeoMapStyle;
  tooltipClassName?: string;
  popupClassName?: string;
  onMarkerClick?: (marker: GeoMapMarker) => void;
  onRouteClick?: (route: GeoMapRoute) => void;
}

/**
 * GeoMap 的可序列化数据 Schema（别名）
 */
export const SerializableGeoMapSchema = GeoMapPropsSchema;

/**
 * GeoMap 的可序列化数据类型
 * 对应 SerializableGeoMapSchema 的 TypeScript 类型
 */

export type SerializableGeoMap = z.infer<typeof SerializableGeoMapSchema>;

const SerializableGeoMapSchemaContract = defineToolUiContract(
  'GeoMap',
  SerializableGeoMapSchema,
);

export const parseSerializableGeoMap: (input: unknown) => SerializableGeoMap =
  SerializableGeoMapSchemaContract.parse;

export const safeParseSerializableGeoMap: (
  input: unknown,
) => SerializableGeoMap | null = SerializableGeoMapSchemaContract.safeParse;
