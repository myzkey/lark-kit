import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  type ApprovalInstance,
  CreateInstanceResponseSchema,
  GetInstanceResponseSchema,
  ListInstancesResponseSchema,
  CancelInstanceResponseSchema,
  ApproveTaskResponseSchema,
  RejectTaskResponseSchema,
  TransferTaskResponseSchema,
  parseResponse,
} from '@lark-kit/shared'

export interface CreateInstancePayload {
  data: {
    approval_code: string
    user_id?: string
    open_id?: string
    department_id?: string
    form: string
    node_approver_user_id_list?: Array<{ key?: string; value?: string[] }>
    node_approver_open_id_list?: Array<{ key?: string; value?: string[] }>
    node_cc_user_id_list?: Array<{ key?: string; value?: string[] }>
    node_cc_open_id_list?: Array<{ key?: string; value?: string[] }>
    uuid?: string
    allow_resubmit?: boolean
    allow_submit_again?: boolean
    cancel_bot_notification?: string
    forbid_revoke?: boolean
    title?: string
    title_display_method?: number
  }
}

export interface GetInstancePayload {
  path: {
    instance_id: string
  }
  params?: {
    locale?: string
    user_id?: string
    user_id_type?: 'user_id' | 'open_id' | 'union_id'
  }
}

export interface ListInstancesPayload {
  params: {
    approval_code: string
    start_time: string
    end_time: string
    page_size?: number
    page_token?: string
  }
}

export interface ListInstancesResult {
  instance_code_list: string[]
  has_more: boolean
  page_token?: string
}

export interface CancelInstancePayload {
  data: {
    approval_code: string
    instance_code: string
    user_id: string
  }
}

export interface ApproveTaskPayload {
  data: {
    approval_code: string
    instance_code: string
    user_id: string
    comment?: string
    task_id: string
    form?: string
  }
}

export interface RejectTaskPayload {
  data: {
    approval_code: string
    instance_code: string
    user_id: string
    comment?: string
    task_id: string
  }
}

export interface TransferTaskPayload {
  data: {
    approval_code: string
    instance_code: string
    user_id: string
    comment?: string
    transfer_user_id: string
    task_id: string
  }
}

export type ListAllInstancesPayload = Omit<ListInstancesPayload, 'params'> & {
  params: Omit<ListInstancesPayload['params'], 'page_token'>
}

export class ApprovalInstanceClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenManager: TokenManager
  ) {}

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.tokenManager.getTenantAccessToken()
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  /**
   * Create an approval instance
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/approval-v4/instance/create
   */
  async create(payload: CreateInstancePayload): Promise<string> {
    const { data } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/approval/v4/instances', {
      headers,
      data,
    })

    const parsed = parseResponse(CreateInstanceResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to create approval instance: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.instance_code ?? ''
  }

  /**
   * Get an approval instance by ID
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/approval-v4/instance/get
   */
  async get(payload: GetInstancePayload): Promise<ApprovalInstance> {
    const { path, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/approval/v4/instances/:instance_id', {
      headers,
      path,
      params,
    })

    const parsed = parseResponse(GetInstanceResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to get approval instance: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data ?? ({} as ApprovalInstance)
  }

  /**
   * List approval instances
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/approval-v4/instance/list
   */
  async list(payload: ListInstancesPayload): Promise<ListInstancesResult> {
    const { params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/approval/v4/instances', {
      headers,
      params,
    })

    const parsed = parseResponse(ListInstancesResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to list approval instances: ${parsed.msg}`, parsed.code || 0)
    }

    return {
      instance_code_list: parsed.data?.instance_code_list ?? [],
      has_more: parsed.data?.has_more ?? false,
      page_token: parsed.data?.page_token,
    }
  }

  /**
   * List all approval instances with automatic pagination
   */
  async *listAll(payload: ListAllInstancesPayload): AsyncGenerator<string, void, unknown> {
    let pageToken: string | undefined

    do {
      const result = await this.list({
        params: { ...payload.params, page_token: pageToken },
      })

      for (const instanceCode of result.instance_code_list) {
        yield instanceCode
      }

      pageToken = result.has_more ? result.page_token : undefined
    } while (pageToken)
  }

  /**
   * Cancel an approval instance
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/approval-v4/instance/cancel
   */
  async cancel(payload: CancelInstancePayload): Promise<void> {
    const { data } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/approval/v4/instances/cancel', {
      headers,
      data,
    })

    const parsed = parseResponse(CancelInstanceResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to cancel approval instance: ${parsed.msg}`, parsed.code || 0)
    }
  }

  /**
   * Approve a task
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/approval-v4/task/approve
   */
  async approve(payload: ApproveTaskPayload): Promise<void> {
    const { data } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/approval/v4/tasks/approve', {
      headers,
      data,
    })

    const parsed = parseResponse(ApproveTaskResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to approve task: ${parsed.msg}`, parsed.code || 0)
    }
  }

  /**
   * Reject a task
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/approval-v4/task/reject
   */
  async reject(payload: RejectTaskPayload): Promise<void> {
    const { data } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/approval/v4/tasks/reject', {
      headers,
      data,
    })

    const parsed = parseResponse(RejectTaskResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to reject task: ${parsed.msg}`, parsed.code || 0)
    }
  }

  /**
   * Transfer a task to another user
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/approval-v4/task/transfer
   */
  async transfer(payload: TransferTaskPayload): Promise<void> {
    const { data } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/approval/v4/tasks/transfer', {
      headers,
      data,
    })

    const parsed = parseResponse(TransferTaskResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to transfer task: ${parsed.msg}`, parsed.code || 0)
    }
  }
}
