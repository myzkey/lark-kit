import type { BitableField } from '@lark-kit/shared'

/**
 * Field types for Bitable
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-field/guide
 */
export const FieldType = {
  Text: 1,
  Number: 2,
  SingleSelect: 3,
  MultiSelect: 4,
  DateTime: 5,
  Checkbox: 7,
  Person: 11,
  Phone: 13,
  Url: 15,
  Attachment: 17,
  SingleLink: 18,
  Lookup: 19,
  Formula: 20,
  DuplexLink: 21,
  Location: 22,
  GroupChat: 23,
  CreatedTime: 1001,
  ModifiedTime: 1002,
  CreatedUser: 1003,
  ModifiedUser: 1004,
  AutoNumber: 1005,
} as const

export type FieldTypeValue = (typeof FieldType)[keyof typeof FieldType]

export interface ListFieldsPayload {
  params?: {
    view_id?: string
    text_field_as_array?: boolean
    page_token?: string
    page_size?: number
  }
  path: {
    app_token: string
    table_id: string
  }
}

export interface ListFieldsResult {
  items: BitableField[]
  has_more: boolean
  page_token?: string
  total?: number
}

export interface CreateFieldPayload {
  path: {
    app_token: string
    table_id: string
  }
  data: {
    field_name: string
    type: FieldTypeValue
    property?: Record<string, unknown>
    description?: string
    ui_type?: string
  }
}

export interface UpdateFieldPayload {
  path: {
    app_token: string
    table_id: string
    field_id: string
  }
  data: {
    field_name?: string
    type?: FieldTypeValue
    property?: Record<string, unknown>
    description?: string
    ui_type?: string
  }
}

export interface DeleteFieldPayload {
  path: {
    app_token: string
    table_id: string
    field_id: string
  }
}
