import chart from './index.vue'
export { chart }
export default chart

export type { ChartProps, SerializableChart, ChartSeries, ChartDataPoint, ChartClientProps } from './schema';
export { SerializableChartSchema, ChartSeriesSchema, parseSerializableChart, safeParseSerializableChart } from './schema';
