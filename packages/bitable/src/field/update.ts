import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { type BitableField, UpdateFieldResponseSchema, parseResponse } from '@lark-kit/shared'
import type { UpdateFieldPayload } from './types'

export async function updateField(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: UpdateFieldPayload
): Promise<BitableField> {
  const { path, data } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.put(
    '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/fields/:field_id',
    {
      headers,
      path,
      data,
    }
  )

  const parsed = parseResponse(UpdateFieldResponseSchema, response)
  if (parsed.code !== 0) {
    throw new LarkApiError(`Failed to update field: ${parsed.msg}`, parsed.code || 0)
  }

  return parsed.data?.field ?? {}
}
