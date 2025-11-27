import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { DeleteTableResponseSchema, parseResponse } from '@lark-kit/shared'
import type { DeleteTablePayload } from './types'

export async function deleteTable(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: DeleteTablePayload
): Promise<void> {
  const { path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.delete(
    '/open-apis/bitable/v1/apps/:app_token/tables/:table_id',
    {
      headers,
      path,
    }
  )

  const parsed = parseResponse(DeleteTableResponseSchema, response)
  if (parsed.code !== 0) {
    throw new LarkApiError(`Failed to delete table: ${parsed.msg}`, parsed.code || 0)
  }
}
