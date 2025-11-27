import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  BatchCreateRecordsResponseSchema,
  type BitableRecord,
  CreateRecordResponseSchema,
  parseResponse,
} from '@lark-kit/shared'
import type { BatchCreateRecordsPayload, CreateRecordPayload } from './types'

export async function createRecord(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: CreateRecordPayload
): Promise<BitableRecord> {
  const { data, params, path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.post(
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

export async function batchCreateRecords(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: BatchCreateRecordsPayload
): Promise<BitableRecord[]> {
  const { data, params, path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.post(
    '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/batch_create',
    {
      headers,
      data,
      params,
      path,
    }
  )

  const parsed = parseResponse(BatchCreateRecordsResponseSchema, response)
  if (parsed.code !== 0) {
    throw new LarkApiError(`Failed to batch create records: ${parsed.msg}`, parsed.code || 0)
  }
  return parsed.data?.records ?? []
}
