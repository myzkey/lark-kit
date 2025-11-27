import type { BitableTable } from '@lark-kit/shared'

export interface ListTablesPayload {
  params?: {
    page_token?: string
    page_size?: number
  }
  path: {
    app_token: string
  }
}

export interface ListTablesResult {
  items: BitableTable[]
  has_more: boolean
  page_token?: string
  total?: number
}

export interface ListAllTablesPayload {
  params?: Omit<ListTablesPayload['params'], 'page_token'>
  path: {
    app_token: string
  }
}

export interface CreateTablePayload {
  path: {
    app_token: string
  }
  data: {
    table: {
      name: string
      default_view_name?: string
      fields?: Array<{
        field_name: string
        type: number
        property?: Record<string, unknown>
      }>
    }
  }
}

export interface CreateTableResult {
  table_id: string
  default_view_id?: string
  field_id_list?: string[]
}

export interface DeleteTablePayload {
  path: {
    app_token: string
    table_id: string
  }
}
