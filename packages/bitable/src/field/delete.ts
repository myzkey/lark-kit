import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { DeleteFieldResponseSchema, parseResponse } from '@lark-kit/shared'
import type { DeleteFieldPayload } from './types'

export async function deleteField(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: DeleteFieldPayload
): Promise<{ deleted: boolean; field_id: string }> {
  const { path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.delete(
    '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/fields/:field_id',
    {
      headers,
      path,
    }
  )

  const parsed = parseResponse(DeleteFieldResponseSchema, response)
  if (parsed.code !== 0) {
    throw new LarkApiError(`Failed to delete field: ${parsed.msg}`, parsed.code || 0)
  }

  return {
    deleted: parsed.data?.deleted ?? false,
    field_id: parsed.data?.field_id ?? '',
  }
}
