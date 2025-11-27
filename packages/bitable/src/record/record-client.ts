import type { HttpClient, TokenManager } from '@lark-kit/core'
import type { BitableRecord } from '@lark-kit/shared'
import { batchCreateRecords, createRecord } from './create'
import { batchDeleteRecords, deleteRecord } from './delete'
import { getRecord, listRecords, listAllRecords } from './read'
import type {
  BatchCreateRecordsPayload,
  BatchDeleteRecordsPayload,
  BatchUpdateRecordsPayload,
  CreateRecordPayload,
  DeleteRecordPayload,
  GetRecordPayload,
  ListRecordsPayload,
  ListRecordsResult,
  ListAllRecordsPayload,
  UpdateRecordPayload,
} from './types'
import { batchUpdateRecords, updateRecord } from './update'

export class AppTableRecordClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenManager: TokenManager
  ) {}

  /**
   * Create a record in a bitable table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/create
   */
  create(payload: CreateRecordPayload): Promise<BitableRecord> {
    return createRecord(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Get a record by ID
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/get
   */
  get(payload: GetRecordPayload): Promise<BitableRecord> {
    return getRecord(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Update a record
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/update
   */
  update(payload: UpdateRecordPayload): Promise<BitableRecord> {
    return updateRecord(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Delete a record
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/delete
   */
  delete(payload: DeleteRecordPayload): Promise<{ deleted: boolean; record_id: string }> {
    return deleteRecord(this.httpClient, this.tokenManager, payload)
  }

  /**
   * List records in a table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/list
   */
  list(payload: ListRecordsPayload): Promise<ListRecordsResult> {
    return listRecords(this.httpClient, this.tokenManager, payload)
  }

  /**
   * List all records in a table with automatic pagination
   * @example
   * for await (const record of client.bitable.appTableRecord.listAll({ path: { app_token, table_id } })) {
   *   console.log(record)
   * }
   */
  listAll(payload: ListAllRecordsPayload): AsyncGenerator<BitableRecord, void, unknown> {
    return listAllRecords(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Batch create records in a table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/batch_create
   */
  batchCreate(payload: BatchCreateRecordsPayload): Promise<BitableRecord[]> {
    return batchCreateRecords(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Batch update records in a table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/batch_update
   */
  batchUpdate(payload: BatchUpdateRecordsPayload): Promise<BitableRecord[]> {
    return batchUpdateRecords(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Batch delete records from a table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/batch_delete
   */
  batchDelete(
    payload: BatchDeleteRecordsPayload
  ): Promise<Array<{ deleted: boolean; record_id: string }>> {
    return batchDeleteRecords(this.httpClient, this.tokenManager, payload)
  }
}
