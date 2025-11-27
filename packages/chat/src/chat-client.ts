import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  type Card,
  type Chat,
  CreateMessageResponseSchema,
  ListChatsResponseSchema,
  type Message,
  type ReceiveIdType,
  ReplyMessageResponseSchema,
  UploadFileResponseSchema,
  UploadImageResponseSchema,
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

export type ImageType = 'message' | 'avatar'
export type FileType = 'opus' | 'mp4' | 'pdf' | 'doc' | 'xls' | 'ppt' | 'stream'

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

export class ImageClient {
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
   * Upload an image to Lark
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/image/create
   */
  async upload(image: Blob | Buffer, imageType: ImageType = 'message'): Promise<string> {
    const headers = await this.getAuthHeaders()

    const formData = new FormData()
    formData.append('image_type', imageType)
    formData.append('image', image)

    const response = await this.httpClient.post('/open-apis/im/v1/images', {
      headers,
      formData,
    })

    const parsed = parseResponse(UploadImageResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to upload image: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.image_key ?? ''
  }
}

export class FileClient {
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
   * Upload a file to Lark
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/file/create
   */
  async upload(file: Blob | Buffer, fileName: string, fileType: FileType): Promise<string> {
    const headers = await this.getAuthHeaders()

    const formData = new FormData()
    formData.append('file_type', fileType)
    formData.append('file_name', fileName)
    formData.append('file', file)

    const response = await this.httpClient.post('/open-apis/im/v1/files', {
      headers,
      formData,
    })

    const parsed = parseResponse(UploadFileResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to upload file: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.file_key ?? ''
  }
}

export class ImClient {
  public readonly message: MessageClient
  public readonly chat: ChatClient
  public readonly image: ImageClient
  public readonly file: FileClient

  constructor(httpClient: HttpClient, tokenManager: TokenManager) {
    this.message = new MessageClient(httpClient, tokenManager)
    this.chat = new ChatClient(httpClient, tokenManager)
    this.image = new ImageClient(httpClient, tokenManager)
    this.file = new FileClient(httpClient, tokenManager)
  }
}
