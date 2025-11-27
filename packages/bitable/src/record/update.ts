import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  BatchUpdateRecordsResponseSchema,
  type BitableRecord,
  UpdateRecordResponseSchema,
  parseResponse,
} from '@lark-kit/shared'
import type { BatchUpdateRecordsPayload, UpdateRecordPayload } from './types'

export async function updateRecord(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: UpdateRecordPayload
): Promise<BitableRecord> {
  const { data, params, path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.put(
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

export async function batchUpdateRecords(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: BatchUpdateRecordsPayload
): Promise<BitableRecord[]> {
  const { data, params, path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.post(
    '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/batch_update',
    {
      headers,
      data,
      params,
      path,
    }
  )

  const parsed = parseResponse(BatchUpdateRecordsResponseSchema, response)
  if (parsed.code !== 0) {
    throw new LarkApiError(`Failed to batch update records: ${parsed.msg}`, parsed.code || 0)
  }
  return parsed.data?.records ?? []
}
