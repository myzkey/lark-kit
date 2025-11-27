import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  BatchGetUsersResponseSchema,
  GetUserResponseSchema,
  ListUsersResponseSchema,
  type User,
  type UserIdType,
  parseResponse,
} from '@lark-kit/shared'

export interface GetUserPayload {
  path: {
    user_id: string
  }
  params?: {
    user_id_type?: UserIdType
    department_id_type?: 'department_id' | 'open_department_id'
  }
}

export interface BatchGetUsersPayload {
  params: {
    user_ids: string[]
    user_id_type?: UserIdType
    department_id_type?: 'department_id' | 'open_department_id'
  }
}

export interface ListUsersPayload {
  params: {
    department_id: string
    user_id_type?: UserIdType
    department_id_type?: 'department_id' | 'open_department_id'
    page_token?: string
    page_size?: number
  }
}

export interface ListUsersResult {
  items: User[]
  has_more: boolean
  page_token?: string
}

export interface ListAllUsersPayload {
  params: Omit<ListUsersPayload['params'], 'page_token'>
}

export class UserClient {
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
   * Get a user by ID
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/get
   */
  async get(payload: GetUserPayload): Promise<User> {
    const { path, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/contact/v3/users/:user_id', {
      headers,
      path,
      params,
    })

    const parsed = parseResponse(GetUserResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to get user: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.user ?? {}
  }

  /**
   * Get multiple users by IDs
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/batch
   */
  async batchGet(payload: BatchGetUsersPayload): Promise<User[]> {
    const { params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/contact/v3/users/batch', {
      headers,
      params: {
        ...params,
        user_ids: params.user_ids.join(','),
      },
    })

    const parsed = parseResponse(BatchGetUsersResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to batch get users: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.items ?? []
  }

  /**
   * List users in a department
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/list
   */
  async list(payload: ListUsersPayload): Promise<ListUsersResult> {
    const { params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/contact/v3/users', {
      headers,
      params,
    })

    const parsed = parseResponse(ListUsersResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to list users: ${parsed.msg}`, parsed.code || 0)
    }

    return {
      items: parsed.data?.items ?? [],
      has_more: parsed.data?.has_more ?? false,
      page_token: parsed.data?.page_token,
    }
  }

  /**
   * List all users in a department with automatic pagination
   * @example
   * for await (const user of client.contact.user.listAll({
   *   params: { department_id: '0' }
   * })) {
   *   console.log(user)
   * }
   */
  async *listAll(payload: ListAllUsersPayload): AsyncGenerator<User, void, unknown> {
    let pageToken: string | undefined
    const { params } = payload

    do {
      const result = await this.list({
        params: { ...params, page_token: pageToken },
      })

      for (const user of result.items) {
        yield user
      }

      pageToken = result.has_more ? result.page_token : undefined
    } while (pageToken)
  }
}
