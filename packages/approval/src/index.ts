import type { HttpClient, TokenManager } from '@lark-kit/core'
import { ApprovalDefinitionClient } from './definition-client'
import { ApprovalInstanceClient } from './instance-client'

export class ApprovalClient {
  public readonly definition: ApprovalDefinitionClient
  public readonly instance: ApprovalInstanceClient

  constructor(httpClient: HttpClient, tokenManager: TokenManager) {
    this.definition = new ApprovalDefinitionClient(httpClient, tokenManager)
    this.instance = new ApprovalInstanceClient(httpClient, tokenManager)
  }
}

export { ApprovalDefinitionClient } from './definition-client'
export { ApprovalInstanceClient } from './instance-client'
export type { GetDefinitionPayload } from './definition-client'
export type {
  CreateInstancePayload,
  GetInstancePayload,
  ListInstancesPayload,
  ListInstancesResult,
  ListAllInstancesPayload,
  CancelInstancePayload,
  ApproveTaskPayload,
  RejectTaskPayload,
  TransferTaskPayload,
} from './instance-client'
