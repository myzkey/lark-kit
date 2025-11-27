import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  type BitableRecord,
  GetRecordResponseSchema,
  ListRecordsResponseSchema,
  parseResponse,
} from '@lark-kit/shared'
import type {
  GetRecordPayload,
  ListRecordsPayload,
  ListRecordsResult,
  ListAllRecordsPayload,
} from './types'

export async function getRecord(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: GetRecordPayload
): Promise<BitableRecord> {
  const { params, path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.get(
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

export async function listRecords(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: ListRecordsPayload
): Promise<ListRecordsResult> {
  const { params, path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.get(
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

export async function* listAllRecords(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: ListAllRecordsPayload
): AsyncGenerator<BitableRecord, void, unknown> {
  let pageToken: string | undefined
  const { params, path } = payload

  do {
    const result = await listRecords(httpClient, tokenManager, {
      params: { ...params, page_token: pageToken },
      path,
    })

    for (const record of result.items) {
      yield record
    }

    pageToken = result.has_more ? result.page_token : undefined
  } while (pageToken)
}
