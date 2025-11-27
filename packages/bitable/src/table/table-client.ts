import type { HttpClient, TokenManager } from '@lark-kit/core'
import type { BitableTable } from '@lark-kit/shared'
import { createTable } from './create'
import { deleteTable } from './delete'
import { listTables, listAllTables } from './read'
import type {
  ListTablesPayload,
  ListTablesResult,
  ListAllTablesPayload,
  CreateTablePayload,
  CreateTableResult,
  DeleteTablePayload,
} from './types'

export class AppTableClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenManager: TokenManager
  ) {}

  /**
   * List tables in a bitable app
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table/list
   */
  list(payload: ListTablesPayload): Promise<ListTablesResult> {
    return listTables(this.httpClient, this.tokenManager, payload)
  }

  /**
   * List all tables in a bitable app with automatic pagination
   * @example
   * for await (const table of client.bitable.appTable.listAll({ path: { app_token } })) {
   *   console.log(table)
   * }
   */
  listAll(payload: ListAllTablesPayload): AsyncGenerator<BitableTable, void, unknown> {
    return listAllTables(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Create a table in a bitable app
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table/create
   */
  create(payload: CreateTablePayload): Promise<CreateTableResult> {
    return createTable(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Delete a table from a bitable app
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table/delete
   */
  delete(payload: DeleteTablePayload): Promise<void> {
    return deleteTable(this.httpClient, this.tokenManager, payload)
  }
}
