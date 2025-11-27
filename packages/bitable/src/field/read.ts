import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { ListFieldsResponseSchema, parseResponse } from '@lark-kit/shared'
import type { BitableField } from '@lark-kit/shared'
import type { ListFieldsPayload, ListFieldsResult, ListAllFieldsPayload } from './types'

export async function listFields(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: ListFieldsPayload
): Promise<ListFieldsResult> {
  const { params, path } = payload
  const token = await tokenManager.getTenantAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  const response = await httpClient.get(
    '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/fields',
    {
      headers,
      params,
      path,
    }
  )

  const parsed = parseResponse(ListFieldsResponseSchema, response)
  if (parsed.code !== 0) {
    throw new LarkApiError(`Failed to list fields: ${parsed.msg}`, parsed.code || 0)
  }

  return {
    items: parsed.data?.items ?? [],
    has_more: parsed.data?.has_more ?? false,
    page_token: parsed.data?.page_token,
    total: parsed.data?.total,
  }
}

export async function* listAllFields(
  httpClient: HttpClient,
  tokenManager: TokenManager,
  payload: ListAllFieldsPayload
): AsyncGenerator<BitableField, void, unknown> {
  let pageToken: string | undefined
  const { params, path } = payload

  do {
    const result = await listFields(httpClient, tokenManager, {
      params: { ...params, page_token: pageToken },
      path,
    })

    for (const field of result.items) {
      yield field
    }

    pageToken = result.has_more ? result.page_token : undefined
  } while (pageToken)
}
