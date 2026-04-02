// DataTable component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

export {
  useSort,
  type UseSortOptions,
  type SortReturns,
  type SortState,
} from './useSort';

export {
  useFormat,
  type FormatOptions as UseFormatOptions,
  type FormatReturns,
} from './useFormat';

export {
  useLayout,
  type UseLayoutOptions,
  type LayoutReturns,
  type CategorizedColumns,
} from './useLayout';
