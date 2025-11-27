import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { type BitableField, CreateFieldResponseSchema, parseResponse } from '@lark-kit/shared'
import type { CreateFieldPayload } from './types'

export async function createField(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: CreateFieldPayload
): Promise<BitableField> {
  const { path, data } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.post(
    '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/fields',
    {
      headers,
      path,
      data,
    }
  )

  const parsed = parseResponse(CreateFieldResponseSchema, response)
  if (parsed.code !== 0) {
    throw new LarkApiError(`Failed to create field: ${parsed.msg}`, parsed.code || 0)
  }

  return parsed.data?.field ?? {}
}
