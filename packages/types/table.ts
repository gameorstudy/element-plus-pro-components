import type { TableColumnCtx } from "element-plus"

export type DefaultRow = Record<string | number | symbol, any>

export interface TableEmits<T extends DefaultRow> {
  /**
   * triggers when user clicks the checkbox in a row
   */
  select: (selection: T[], row: any) => void

  /**
   * triggers when user clicks the checkbox in table header
   */
  selectAll: (selection: any[]) => void

  /**
   * triggers when selection changes
   */
  selectionChange: (newSelection: any[]) => void

  /**
   * triggers when hovering into a cell
   */
  cellMouseEnter: (row: any, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: Event) => void

  /**
   * triggers when hovering out of a cell
   */
  cellMouseLeave: (row: any, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: Event) => void

  /**
   * triggers when clicking a cell
   */
  cellClick: (row: any, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: Event) => void

  /**
   * triggers when double clicking a cell
   */
  cellDblclick: (row: any, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: Event) => void

  /**
   * triggers when user right clicks on a cell
   */
  cellContextmenu: (row: any, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: Event) => void

  /**
   * triggers when clicking a row
   */
  rowClick: (row: any, column: TableColumnCtx<T>, event: Event) => void

  /**
   * triggers when user right clicks on a row
   */
  rowContextmenu: (row: any, column: TableColumnCtx<T>, event: Event) => void

  /**
   * triggers when double clicking a row
   */
  rowDblclick: (row: any, column: TableColumnCtx<T>, event: Event) => void

  /**
   * triggers when clicking a column header
   */
  headerClick: (column: TableColumnCtx<T>, event: Event) => void

  /**
   * triggers when user right clicks on a column header
   */
  headerContextmenu: (column: TableColumnCtx<T>, event: Event) => void

  /**
   * triggers when Table's sorting changes
   */
  sortChange: (data: { column: TableColumnCtx<T>; prop: string; order: any }) => void

  /**
   * triggers when the table's filter changes
   */
  filterChange: (newFilters: Record<string, any>) => void

  /**
   * triggers when current row changes
   */
  currentChange: (currentRow: T | null, oldCurrentRow: T | null) => void

  /**
   * triggers after changing a column's width by dragging the column header's border
   */
  headerDragend: (newWidth: number, oldWidth: number, column: TableColumnCtx<T>, event: MouseEvent) => void

  /**
   * triggers when user expands or collapses a row
   * (for expandable table, second param is expandedRows; for tree Table, second param is expanded)
   */
  expandChange: (row: any, expandedRowsOrExpanded: T[] | boolean) => void

  /**
   * Invoked after scrolled (since 2.9.0)
   */
  scroll: (data: { scrollLeft: number; scrollTop: number }) => void
}

export type RecordKey = string | number