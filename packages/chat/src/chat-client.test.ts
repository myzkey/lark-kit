import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MessageClient, ImClient } from './chat-client'
import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'

describe('MessageClient', () => {
  let mockHttpClient: HttpClient
  let mockTokenManager: TokenManager
  let client: MessageClient

  beforeEach(() => {
    vi.restoreAllMocks()

    mockTokenManager = {
      getTenantAccessToken: vi.fn().mockResolvedValue('test-token'),
    } as unknown as TokenManager

    mockHttpClient = {
      post: vi.fn(),
    } as unknown as HttpClient

    client = new MessageClient(mockHttpClient, mockTokenManager)
  })

  describe('create', () => {
    it('should send a message', async () => {
      const mockMessage = {
        message_id: 'msg123',
        root_id: '',
        parent_id: '',
        msg_type: 'text',
        create_time: '1234567890',
        update_time: '1234567890',
        deleted: false,
      }
      vi.mocked(mockHttpClient.post).mockResolvedValue({
        code: 0,
        data: mockMessage,
      })

      const result = await client.create({
        params: { receive_id_type: 'chat_id' },
        data: {
          receive_id: 'oc_123',
          msg_type: 'text',
          content: JSON.stringify({ text: 'Hello' }),
        },
      })

      expect(result).toEqual(mockMessage)
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/open-apis/im/v1/messages',
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
          params: { receive_id_type: 'chat_id' },
        })
      )
    })

    it('should throw LarkApiError on failure', async () => {
      vi.mocked(mockHttpClient.post).mockResolvedValue({
        code: 230001,
        msg: 'Bot not in chat',
      })

      await expect(
        client.create({
          params: { receive_id_type: 'chat_id' },
          data: {
            receive_id: 'oc_123',
            msg_type: 'text',
            content: JSON.stringify({ text: 'Hello' }),
          },
        })
      ).rejects.toThrow(LarkApiError)
    })
  })

  describe('reply', () => {
    it('should reply to a message', async () => {
      const mockMessage = {
        message_id: 'msg456',
        root_id: 'msg123',
        parent_id: 'msg123',
        msg_type: 'text',
        create_time: '1234567890',
        update_time: '1234567890',
        deleted: false,
      }
      vi.mocked(mockHttpClient.post).mockResolvedValue({
        code: 0,
        data: mockMessage,
      })

      const result = await client.reply({
        path: { message_id: 'msg123' },
        data: {
          msg_type: 'text',
          content: JSON.stringify({ text: 'Reply' }),
        },
      })

      expect(result).toEqual(mockMessage)
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/open-apis/im/v1/messages/:message_id/reply',
        expect.objectContaining({
          path: { message_id: 'msg123' },
        })
      )
    })
  })

  describe('sendText', () => {
    it('should send a text message using convenience method', async () => {
      vi.mocked(mockHttpClient.post).mockResolvedValue({
        code: 0,
        data: { message_id: 'msg123' },
      })

      await client.sendText('chat_id', 'oc_123', 'Hello World')

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/open-apis/im/v1/messages',
        expect.objectContaining({
          params: { receive_id_type: 'chat_id' },
          data: {
            receive_id: 'oc_123',
            msg_type: 'text',
            content: JSON.stringify({ text: 'Hello World' }),
          },
        })
      )
    })
  })

  describe('replyText', () => {
    it('should reply with text using convenience method', async () => {
      vi.mocked(mockHttpClient.post).mockResolvedValue({
        code: 0,
        data: { message_id: 'msg456' },
      })

      await client.replyText('msg123', 'Reply text')

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/open-apis/im/v1/messages/:message_id/reply',
        expect.objectContaining({
          path: { message_id: 'msg123' },
          data: {
            msg_type: 'text',
            content: JSON.stringify({ text: 'Reply text' }),
          },
        })
      )
    })
  })
})

describe('ImClient', () => {
  it('should expose message client', () => {
    const mockHttpClient = {} as HttpClient
    const mockTokenManager = {} as TokenManager

    const client = new ImClient(mockHttpClient, mockTokenManager)

    expect(client.message).toBeInstanceOf(MessageClient)
  })
})
