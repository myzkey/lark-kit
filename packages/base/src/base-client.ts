import type { HttpClient, TokenManager } from '@lark-kit/core'
import { AppTableRecordClient } from './record-client'
import { AppTableFieldClient } from './field-client'

export class BitableClient {
  public readonly appTableRecord: AppTableRecordClient
  public readonly appTableField: AppTableFieldClient

  constructor(httpClient: HttpClient, tokenManager: TokenManager) {
    this.appTableRecord = new AppTableRecordClient(httpClient, tokenManager)
    this.appTableField = new AppTableFieldClient(httpClient, tokenManager)
  }
}
