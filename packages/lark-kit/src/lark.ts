import { ApprovalClient } from '@lark-kit/approval'
import { BitableClient } from '@lark-kit/bitable'
import { CalendarClient } from '@lark-kit/calendar'
import { ImClient } from '@lark-kit/chat'
import { ContactClient } from '@lark-kit/contact'
import { DriveClient } from '@lark-kit/drive'
import {
  Domain,
  HttpClient,
  InMemoryTokenStorage,
  type LarkConfig,
  TokenManager,
} from '@lark-kit/core'

export class Client {
  public readonly approval: ApprovalClient
  public readonly bitable: BitableClient
  public readonly calendar: CalendarClient
  public readonly im: ImClient
  public readonly contact: ContactClient
  public readonly drive: DriveClient

  private readonly httpClient: HttpClient
  private readonly tokenManager: TokenManager

  constructor(config: LarkConfig) {
    const { appId, appSecret, storage, domain } = config

    const tokenStorage = storage ?? new InMemoryTokenStorage()
    const apiDomain = domain ?? Domain.Feishu

    this.httpClient = new HttpClient(apiDomain)
    this.tokenManager = new TokenManager(appId, appSecret, tokenStorage, apiDomain)

    this.approval = new ApprovalClient(this.httpClient, this.tokenManager)
    this.bitable = new BitableClient(this.httpClient, this.tokenManager)
    this.calendar = new CalendarClient(this.httpClient, this.tokenManager)
    this.im = new ImClient(this.httpClient, this.tokenManager)
    this.contact = new ContactClient(this.httpClient, this.tokenManager)
    this.drive = new DriveClient(this.tokenManager)
  }
}
