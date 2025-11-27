import type { HttpClient, TokenManager } from '@lark-kit/core'
import { AppTableFieldClient } from './field'
import { AppTableRecordClient } from './record'
import { AppTableClient } from './table'

export class BitableClient {
  public readonly appTable: AppTableClient
  public readonly appTableRecord: AppTableRecordClient
  public readonly appTableField: AppTableFieldClient

  constructor(httpClient: HttpClient, tokenManager: TokenManager) {
    this.appTable = new AppTableClient(httpClient, tokenManager)
    this.appTableRecord = new AppTableRecordClient(httpClient, tokenManager)
    this.appTableField = new AppTableFieldClient(httpClient, tokenManager)
  }
}
