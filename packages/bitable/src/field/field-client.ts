import type { HttpClient, TokenManager } from '@lark-kit/core'
import type { BitableField } from '@lark-kit/shared'
import { createField } from './create'
import { deleteField } from './delete'
import { listFields, listAllFields } from './read'
import type {
  CreateFieldPayload,
  DeleteFieldPayload,
  ListFieldsPayload,
  ListFieldsResult,
  ListAllFieldsPayload,
  UpdateFieldPayload,
} from './types'
import { updateField } from './update'

export class AppTableFieldClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenManager: TokenManager
  ) {}

  /**
   * List fields in a table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-field/list
   */
  list(payload: ListFieldsPayload): Promise<ListFieldsResult> {
    return listFields(this.httpClient, this.tokenManager, payload)
  }

  /**
   * List all fields in a table with automatic pagination
   * @example
   * for await (const field of client.bitable.appTableField.listAll({ path: { app_token, table_id } })) {
   *   console.log(field)
   * }
   */
  listAll(payload: ListAllFieldsPayload): AsyncGenerator<BitableField, void, unknown> {
    return listAllFields(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Create a field in a table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-field/create
   */
  create(payload: CreateFieldPayload): Promise<BitableField> {
    return createField(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Update a field in a table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-field/update
   */
  update(payload: UpdateFieldPayload): Promise<BitableField> {
    return updateField(this.httpClient, this.tokenManager, payload)
  }

  /**
   * Delete a field from a table
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-field/delete
   */
  delete(payload: DeleteFieldPayload): Promise<{ deleted: boolean; field_id: string }> {
    return deleteField(this.httpClient, this.tokenManager, payload)
  }
}
