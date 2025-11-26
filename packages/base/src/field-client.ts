import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { ListFieldsResponseSchema, parseResponse, type BitableField } from '@lark-kit/shared'

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

export class AppTableFieldClient {
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
   * List fields in a table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-field/list
   */
  async list(payload: ListFieldsPayload): Promise<ListFieldsResult> {
    const { params, path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get(
      '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/fields',
      {
        headers,
        params,
        path,
      }
    )

    const parsed = parseResponse(ListFieldsResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to list fields: ${parsed.msg}`, parsed.code || 0)
    }

    return {
      items: parsed.data?.items ?? [],
      has_more: parsed.data?.has_more ?? false,
      page_token: parsed.data?.page_token,
      total: parsed.data?.total,
    }
  }
}
