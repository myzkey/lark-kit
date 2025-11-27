import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { type Chat, ListChatsResponseSchema, parseResponse } from '@lark-kit/shared'

export interface ListChatsPayload {
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
    sort_type?: 'ByCreateTimeAsc' | 'ByActiveTimeDesc'
    page_token?: string
    page_size?: number
  }
}

export interface ListChatsResult {
  items: Chat[]
  has_more: boolean
  page_token?: string
}

export class ChatClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenManager: TokenManager
  ) {}

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.tokenManager.getTenantAccessToken()
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  /**
   * List chats that the bot is in
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/chat/list
   */
  async list(payload?: ListChatsPayload): Promise<ListChatsResult> {
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/im/v1/chats', {
      headers,
      params: payload?.params,
    })

    const parsed = parseResponse(ListChatsResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to list chats: ${parsed.msg}`, parsed.code || 0)
    }

    return {
      items: parsed.data?.items ?? [],
      has_more: parsed.data?.has_more ?? false,
      page_token: parsed.data?.page_token,
    }
  }
}
