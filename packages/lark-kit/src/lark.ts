import {
  HttpClient,
  TokenManager,
  InMemoryTokenStorage,
  Domain,
  type LarkConfig,
} from '@lark-kit/core'
import { BitableClient } from '@lark-kit/bitable'
import { ImClient } from '@lark-kit/chat'

export class Client {
  public readonly bitable: BitableClient
  public readonly im: ImClient

  private readonly httpClient: HttpClient
  private readonly tokenManager: TokenManager

  constructor(config: LarkConfig) {
    const { appId, appSecret, storage, domain } = config

    const tokenStorage = storage ?? new InMemoryTokenStorage()
    const apiDomain = domain ?? Domain.Feishu

    this.httpClient = new HttpClient(apiDomain)
    this.tokenManager = new TokenManager(appId, appSecret, tokenStorage, apiDomain)

    this.bitable = new BitableClient(this.httpClient, this.tokenManager)
    this.im = new ImClient(this.httpClient, this.tokenManager)
  }
}
