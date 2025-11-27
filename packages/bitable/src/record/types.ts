import type { BitableRecord } from '@lark-kit/shared'

export interface CreateRecordPayload {
  data: {
    fields: Record<string, unknown>
  }
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
    client_token?: string
  }
  path: {
    app_token: string
    table_id: string
  }
}

export interface GetRecordPayload {
  params?: {
    text_field_as_array?: boolean
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
    display_formula_ref?: boolean
    with_shared_url?: boolean
    automatic_fields?: boolean
  }
  path: {
    app_token: string
    table_id: string
    record_id: string
  }
}

export interface UpdateRecordPayload {
  data: {
    fields: Record<string, unknown>
  }
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
  path: {
    app_token: string
    table_id: string
    record_id: string
  }
}

export interface DeleteRecordPayload {
  path: {
    app_token: string
    table_id: string
    record_id: string
  }
}

export interface ListRecordsPayload {
  params?: {
    view_id?: string
    filter?: string
    sort?: string
    field_names?: string
    text_field_as_array?: boolean
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
    display_formula_ref?: boolean
    automatic_fields?: boolean
    page_token?: string
    page_size?: number
  }
  path: {
    app_token: string
    table_id: string
  }
}

export interface ListRecordsResult {
  items: BitableRecord[]
  has_more: boolean
  page_token?: string
  total?: number
}

export interface ListAllRecordsPayload {
  params?: Omit<ListRecordsPayload['params'], 'page_token'>
  path: {
    app_token: string
    table_id: string
  }
}

export interface BatchCreateRecordsPayload {
  data: {
    records: Array<{ fields: Record<string, unknown> }>
  }
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
    client_token?: string
  }
  path: {
    app_token: string
    table_id: string
  }
}

export interface BatchUpdateRecordsPayload {
  data: {
    records: Array<{ record_id: string; fields: Record<string, unknown> }>
  }
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
  path: {
    app_token: string
    table_id: string
  }
}

export interface BatchDeleteRecordsPayload {
  data: {
    records: string[]
  }
  path: {
    app_token: string
    table_id: string
  }
}
