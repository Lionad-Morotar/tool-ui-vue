import statsdisplay from './index.vue'
export { statsdisplay }
export default statsdisplay

export type { SparklineProps } from './schema';
export type { StatsDisplayProps, SerializableStatsDisplay, StatItem, StatFormat, StatDiff, StatSparkline } from './schema';
export { SerializableStatsDisplaySchema, StatItemSchema, StatFormatSchema, StatDiffSchema, StatSparklineSchema, parseSerializableStatsDisplay, safeParseSerializableStatsDisplay } from './schema';
