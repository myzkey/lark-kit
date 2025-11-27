import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  type Card,
  CreateMessageResponseSchema,
  GetMessageResponseSchema,
  ListMessagesResponseSchema,
  type Message,
  type ReceiveIdType,
  ReplyMessageResponseSchema,
  parseResponse,
} from '@lark-kit/shared'

export interface CreateMessagePayload {
  data: {
    receive_id: string
    msg_type: string
    content: string
    uuid?: string
  }
  params: {
    receive_id_type: ReceiveIdType
  }
}

export interface ReplyMessagePayload {
  data: {
    content: string
    msg_type: string
    reply_in_thread?: boolean
    uuid?: string
  }
  path: {
    message_id: string
  }
}

export interface GetMessagePayload {
  path: {
    message_id: string
  }
}

export interface ListMessagesPayload {
  params: {
    container_id_type: 'chat'
    container_id: string
    start_time?: string
    end_time?: string
    sort_type?: 'ByCreateTimeAsc' | 'ByCreateTimeDesc'
    page_token?: string
    page_size?: number
  }
}

export interface ListMessagesResult {
  items: Message[]
  has_more: boolean
  page_token?: string
}

export interface ListAllMessagesPayload {
  params: Omit<ListMessagesPayload['params'], 'page_token'>
}

export class MessageClient {
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
   * Send a message
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/create
   */
  async create(payload: CreateMessagePayload): Promise<Message> {
    const { data, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/im/v1/messages', {
      headers,
      data,
      params,
    })

    const parsed = parseResponse(CreateMessageResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to send message: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data!
  }

  /**
   * Reply to a message
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/reply
   */
  async reply(payload: ReplyMessagePayload): Promise<Message> {
    const { data, path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/im/v1/messages/:message_id/reply', {
      headers,
      data,
      path,
    })

    const parsed = parseResponse(ReplyMessageResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to reply message: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data!
  }

  /**
   * Convenience method to send a text message
   */
  async sendText(receiveIdType: ReceiveIdType, receiveId: string, text: string): Promise<Message> {
    return this.create({
      params: { receive_id_type: receiveIdType },
      data: {
        receive_id: receiveId,
        msg_type: 'text',
        content: JSON.stringify({ text }),
      },
    })
  }

  /**
   * Convenience method to reply with a text message
   */
  async replyText(messageId: string, text: string): Promise<Message> {
    return this.reply({
      path: { message_id: messageId },
      data: {
        msg_type: 'text',
        content: JSON.stringify({ text }),
      },
    })
  }

  /**
   * Convenience method to send an interactive card message
   */
  async sendCard(receiveIdType: ReceiveIdType, receiveId: string, card: Card): Promise<Message> {
    return this.create({
      params: { receive_id_type: receiveIdType },
      data: {
        receive_id: receiveId,
        msg_type: 'interactive',
        content: JSON.stringify(card),
      },
    })
  }

  /**
   * Convenience method to send an image message
   */
  async sendImage(
    receiveIdType: ReceiveIdType,
    receiveId: string,
    imageKey: string
  ): Promise<Message> {
    return this.create({
      params: { receive_id_type: receiveIdType },
      data: {
        receive_id: receiveId,
        msg_type: 'image',
        content: JSON.stringify({ image_key: imageKey }),
      },
    })
  }

  /**
   * Convenience method to send a file message
   */
  async sendFile(
    receiveIdType: ReceiveIdType,
    receiveId: string,
    fileKey: string
  ): Promise<Message> {
    return this.create({
      params: { receive_id_type: receiveIdType },
      data: {
        receive_id: receiveId,
        msg_type: 'file',
        content: JSON.stringify({ file_key: fileKey }),
      },
    })
  }

  /**
   * Get a message by ID
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/get
   */
  async get(payload: GetMessagePayload): Promise<Message> {
    const { path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/im/v1/messages/:message_id', {
      headers,
      path,
    })

    const parsed = parseResponse(GetMessageResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to get message: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.items?.[0] ?? {}
  }

  /**
   * List messages in a chat
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/list
   */
  async list(payload: ListMessagesPayload): Promise<ListMessagesResult> {
    const { params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/im/v1/messages', {
      headers,
      params,
    })

    const parsed = parseResponse(ListMessagesResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to list messages: ${parsed.msg}`, parsed.code || 0)
    }

    return {
      items: parsed.data?.items ?? [],
      has_more: parsed.data?.has_more ?? false,
      page_token: parsed.data?.page_token,
    }
  }

  /**
   * List all messages in a chat with automatic pagination
   * @example
   * for await (const message of client.im.message.listAll({
   *   params: { container_id_type: 'chat', container_id: 'oc_xxx' }
   * })) {
   *   console.log(message)
   * }
   */
  async *listAll(payload: ListAllMessagesPayload): AsyncGenerator<Message, void, unknown> {
    let pageToken: string | undefined
    const { params } = payload

    do {
      const result = await this.list({
        params: { ...params, page_token: pageToken },
      })

      for (const message of result.items) {
        yield message
      }

      pageToken = result.has_more ? result.page_token : undefined
    } while (pageToken)
  }
}
