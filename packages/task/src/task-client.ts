import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  type Task,
  type TaskDue,
  type TaskOrigin,
  CreateTaskResponseSchema,
  GetTaskResponseSchema,
  ListTasksResponseSchema,
  UpdateTaskResponseSchema,
  DeleteTaskResponseSchema,
  CompleteTaskResponseSchema,
  UncompleteTaskResponseSchema,
  parseResponse,
} from '@lark-kit/shared'

export interface CreateTaskPayload {
  data: {
    summary?: string
    description?: string
    extra?: string
    due?: TaskDue
    origin: TaskOrigin
    can_edit?: boolean
    custom?: string
    collaborator_ids?: string[]
    follower_ids?: string[]
    repeat_rule?: string
    rich_summary?: string
    rich_description?: string
  }
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export interface GetTaskPayload {
  path: {
    task_id: string
  }
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export interface ListTasksPayload {
  params?: {
    page_size?: number
    page_token?: string
    start_create_time?: string
    end_create_time?: string
    task_completed?: boolean
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export interface ListTasksResult {
  items: Task[]
  has_more: boolean
  page_token?: string
}

export interface UpdateTaskPayload {
  path: {
    task_id: string
  }
  data: {
    summary?: string
    description?: string
    extra?: string
    due?: TaskDue
    origin?: TaskOrigin
    can_edit?: boolean
    custom?: string
    follower_ids?: string[]
    collaborator_ids?: string[]
    repeat_rule?: string
    rich_summary?: string
    rich_description?: string
  }
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export interface DeleteTaskPayload {
  path: {
    task_id: string
  }
}

export interface CompleteTaskPayload {
  path: {
    task_id: string
  }
}

export interface UncompleteTaskPayload {
  path: {
    task_id: string
  }
}

export type ListAllTasksPayload = Omit<ListTasksPayload, 'params'> & {
  params?: Omit<NonNullable<ListTasksPayload['params']>, 'page_token'>
}

export class TaskResourceClient {
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
   * Create a task
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/task-v1/task/create
   */
  async create(payload: CreateTaskPayload): Promise<Task> {
    const { data, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/task/v1/tasks', {
      headers,
      data,
      params,
    })

    const parsed = parseResponse(CreateTaskResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to create task: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.task ?? {}
  }

  /**
   * Get a task by ID
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/task-v1/task/get
   */
  async get(payload: GetTaskPayload): Promise<Task> {
    const { path, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/task/v1/tasks/:task_id', {
      headers,
      path,
      params,
    })

    const parsed = parseResponse(GetTaskResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to get task: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.task ?? {}
  }

  /**
   * List tasks
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/task-v1/task/list
   */
  async list(payload?: ListTasksPayload): Promise<ListTasksResult> {
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/task/v1/tasks', {
      headers,
      params: payload?.params,
    })

    const parsed = parseResponse(ListTasksResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to list tasks: ${parsed.msg}`, parsed.code || 0)
    }

    return {
      items: parsed.data?.items ?? [],
      has_more: parsed.data?.has_more ?? false,
      page_token: parsed.data?.page_token,
    }
  }

  /**
   * List all tasks with automatic pagination
   */
  async *listAll(payload?: ListAllTasksPayload): AsyncGenerator<Task, void, unknown> {
    let pageToken: string | undefined

    do {
      const result = await this.list({
        params: { ...payload?.params, page_token: pageToken },
      })

      for (const task of result.items) {
        yield task
      }

      pageToken = result.has_more ? result.page_token : undefined
    } while (pageToken)
  }

  /**
   * Update a task
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/task-v1/task/patch
   */
  async update(payload: UpdateTaskPayload): Promise<Task> {
    const { path, data, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.patch('/open-apis/task/v1/tasks/:task_id', {
      headers,
      path,
      data,
      params,
    })

    const parsed = parseResponse(UpdateTaskResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to update task: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.task ?? {}
  }

  /**
   * Delete a task
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/task-v1/task/delete
   */
  async delete(payload: DeleteTaskPayload): Promise<void> {
    const { path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.delete('/open-apis/task/v1/tasks/:task_id', {
      headers,
      path,
    })

    const parsed = parseResponse(DeleteTaskResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to delete task: ${parsed.msg}`, parsed.code || 0)
    }
  }

  /**
   * Complete a task
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/task-v1/task/complete
   */
  async complete(payload: CompleteTaskPayload): Promise<void> {
    const { path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/task/v1/tasks/:task_id/complete', {
      headers,
      path,
    })

    const parsed = parseResponse(CompleteTaskResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to complete task: ${parsed.msg}`, parsed.code || 0)
    }
  }

  /**
   * Uncomplete a task (reopen)
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/task-v1/task/uncomplete
   */
  async uncomplete(payload: UncompleteTaskPayload): Promise<void> {
    const { path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/task/v1/tasks/:task_id/uncomplete', {
      headers,
      path,
    })

    const parsed = parseResponse(UncompleteTaskResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to uncomplete task: ${parsed.msg}`, parsed.code || 0)
    }
  }
}
