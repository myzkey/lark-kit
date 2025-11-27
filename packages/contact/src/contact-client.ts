import type { HttpClient, TokenManager } from '@lark-kit/core'
import { UserClient } from './user-client'

export class ContactClient {
  public readonly user: UserClient

  constructor(httpClient: HttpClient, tokenManager: TokenManager) {
    this.user = new UserClient(httpClient, tokenManager)
  }
}
