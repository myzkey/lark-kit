import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  BatchDeleteRecordsResponseSchema,
  DeleteRecordResponseSchema,
  parseResponse,
} from '@lark-kit/shared'
import type { BatchDeleteRecordsPayload, DeleteRecordPayload } from './types'

export async function deleteRecord(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: DeleteRecordPayload
): Promise<{ deleted: boolean; record_id: string }> {
  const { path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.delete(
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

export async function batchDeleteRecords(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: BatchDeleteRecordsPayload
): Promise<Array<{ deleted: boolean; record_id: string }>> {
  const { data, path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.post(
    '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/batch_delete',
    {
      headers,
      data,
      path,
    }
  )

  const parsed = parseResponse(BatchDeleteRecordsResponseSchema, response)
  if (parsed.code !== 0) {
    throw new LarkApiError(`Failed to batch delete records: ${parsed.msg}`, parsed.code || 0)
  }
  return (
    parsed.data?.records?.map((r) => ({
      deleted: r.deleted ?? false,
      record_id: r.record_id ?? '',
    })) ?? []
  )
}
