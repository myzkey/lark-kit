import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  CreateRecordResponseSchema,
  GetRecordResponseSchema,
  UpdateRecordResponseSchema,
  DeleteRecordResponseSchema,
  ListRecordsResponseSchema,
  parseResponse,
  type BitableRecord,
} from '@lark-kit/shared'

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

export class AppTableRecordClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenManager: TokenManager
  ) {}

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.tokenManager.getTenantAccessToken()
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  /**
   * Create a record in a bitable table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/create
   */
  async create(payload: CreateRecordPayload): Promise<BitableRecord> {
    const { data, params, path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post(
      '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records',
      {
        headers,
        data,
        params,
        path,
      }
    )

    const parsed = parseResponse(CreateRecordResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to create record: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data!.record!
  }

  /**
   * Get a record by ID
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/get
   */
  async get(payload: GetRecordPayload): Promise<BitableRecord> {
    const { params, path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get(
      '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/:record_id',
      {
        headers,
        params,
        path,
      }
    )

    const parsed = parseResponse(GetRecordResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to get record: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data!.record!
  }

  /**
   * Update a record
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/update
   */
  async update(payload: UpdateRecordPayload): Promise<BitableRecord> {
    const { data, params, path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.put(
      '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/:record_id',
      {
        headers,
        data,
        params,
        path,
      }
    )

    const parsed = parseResponse(UpdateRecordResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to update record: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data!.record!
  }

  /**
   * Delete a record
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/delete
   */
  async delete(payload: DeleteRecordPayload): Promise<{ deleted: boolean; record_id: string }> {
    const { path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.delete(
      '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/:record_id',
      {
        headers,
        path,
      }
    )

    const parsed = parseResponse(DeleteRecordResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to delete record: ${parsed.msg}`, parsed.code || 0)
    }
    return {
      deleted: parsed.data?.deleted ?? false,
      record_id: parsed.data?.record_id ?? '',
    }
  }

  /**
   * List records in a table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/list
   */
  async list(payload: ListRecordsPayload): Promise<ListRecordsResult> {
    const { params, path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get(
      '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records',
      {
        headers,
        params,
        path,
      }
    )

    const parsed = parseResponse(ListRecordsResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to list records: ${parsed.msg}`, parsed.code || 0)
    }

    return {
      items: parsed.data?.items ?? [],
      has_more: parsed.data?.has_more ?? false,
      page_token: parsed.data?.page_token,
      total: parsed.data?.total,
    }
  }
}
