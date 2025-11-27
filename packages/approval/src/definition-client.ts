import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  type ApprovalDefinition,
  GetApprovalDefinitionResponseSchema,
  parseResponse,
} from '@lark-kit/shared'

export interface GetDefinitionPayload {
  path: {
    approval_code: string
  }
  params?: {
    locale?: string
    with_admin_id?: boolean
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export class ApprovalDefinitionClient {
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
   * Get an approval definition by approval_code
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/approval-v4/approval/get
   */
  async get(payload: GetDefinitionPayload): Promise<ApprovalDefinition> {
    const { path, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/approval/v4/approvals/:approval_code', {
      headers,
      path,
      params,
    })

    const parsed = parseResponse(GetApprovalDefinitionResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to get approval definition: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data ?? ({} as ApprovalDefinition)
  }
}
