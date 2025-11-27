import { BitableClient } from '@lark-kit/bitable'
import { ImClient } from '@lark-kit/chat'
import { ContactClient } from '@lark-kit/contact'
import {
  Domain,
  HttpClient,
  InMemoryTokenStorage,
  type LarkConfig,
  TokenManager,
} from '@lark-kit/core'

export class Client {
  public readonly bitable: BitableClient
  public readonly im: ImClient
  public readonly contact: ContactClient

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
    this.contact = new ContactClient(this.httpClient, this.tokenManager)
  }
}
