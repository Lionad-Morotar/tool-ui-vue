import DataTable from './index.vue'
export { DataTable }
export default DataTable

export type { DataTableProps, SerializableDataTable, Column, RowData } from './schema';
export { SerializableDataTableSchema, serializableColumnSchema, serializableDataSchema, parseSerializableDataTable, safeParseSerializableDataTable } from './schema';
