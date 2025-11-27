import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { CreateTableResponseSchema, parseResponse } from '@lark-kit/shared'
import type { CreateTablePayload, CreateTableResult } from './types'

export async function createTable(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: CreateTablePayload
): Promise<CreateTableResult> {
  const { path, data } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.post('/open-apis/bitable/v1/apps/:app_token/tables', {
    headers,
    path,
    data,
  })

  const parsed = parseResponse(CreateTableResponseSchema, response)
  if (parsed.code !== 0) {
    throw new LarkApiError(`Failed to create table: ${parsed.msg}`, parsed.code || 0)
  }

  return {
    table_id: parsed.data?.table_id ?? '',
    default_view_id: parsed.data?.default_view_id,
    field_id_list: parsed.data?.field_id_list,
  }
}
