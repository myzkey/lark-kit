import type { HttpClient, TokenManager } from '@lark-kit/core'
import { ChatClient } from './chat-client'
import { FileClient } from './file-client'
import { ImageClient } from './image-client'
import { MessageClient } from './message-client'

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
