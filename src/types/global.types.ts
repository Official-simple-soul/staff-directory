import type { ReactNode } from 'react'
// import type { Product } from './product.types'

export interface StatusModalTypes {
  visible: boolean
  type?: 'error' | 'success'
  title?: string
  text?: string
  btnText?: string
  btnCallback?: () => void
}

// export type CartItem = {
//   product: Product
//   quantity: number
//   price?: number
//   variationId?: string | null
// }

export type TableRowData = Record<string, any>

export interface ColumnDefinition<T extends TableRowData> {
  accessor: keyof T | string
  header: React.ReactNode
  width?: string | number
  render?: (row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export interface ReusableTableProps<T extends TableRowData> {
  data: T[] | undefined
  columns: ColumnDefinition<T>[]
  totalRecords: number | undefined
  recordsPerPage?: number
  onPageChange: (page: number) => void
  currentPage: number
  isLoading: boolean
  tableTitle: string
  onSearch?: (query: string) => void
  onFilter?: (value: any | undefined) => void
  filterComponent?: ReactNode
  showSearch?: boolean
  showFilter?: boolean
  showPagination?: boolean
  pagination?: PaginationTypes
  noDataMessage?: string
  headerActions?: React.ReactNode
  hasMorePages?: boolean
  searchPlaceholder?: string
  onPerPageChange?: (value: string) => void
}

export interface PaginationTypes {
  nextKey?: string | undefined
  limit?: number
}

export interface SearchParams {
  limit: string
  searchTerm?: string | undefined
  nextKey?: string | undefined
  range?: string
}
