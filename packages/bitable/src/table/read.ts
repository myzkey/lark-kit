import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { ListTablesResponseSchema, parseResponse, type BitableTable } from '@lark-kit/shared'
import type { ListTablesPayload, ListTablesResult, ListAllTablesPayload } from './types'

export async function listTables(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: ListTablesPayload
): Promise<ListTablesResult> {
  const { params, path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.get('/open-apis/bitable/v1/apps/:app_token/tables', {
    headers,
    params,
    path,
  })

  const parsed = parseResponse(ListTablesResponseSchema, response)
  if (parsed.code !== 0) {
    throw new LarkApiError(`Failed to list tables: ${parsed.msg}`, parsed.code || 0)
  }

  return {
    items: parsed.data?.items ?? [],
    has_more: parsed.data?.has_more ?? false,
    page_token: parsed.data?.page_token,
    total: parsed.data?.total,
  }
}

export async function* listAllTables(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: ListAllTablesPayload
): AsyncGenerator<BitableTable, void, unknown> {
  let pageToken: string | undefined
  const { params, path } = payload

  do {
    const result = await listTables(httpClient, tokenManager, {
      params: { ...params, page_token: pageToken },
      path,
    })

    for (const table of result.items) {
      yield table
    }

    pageToken = result.has_more ? result.page_token : undefined
  } while (pageToken)
}
