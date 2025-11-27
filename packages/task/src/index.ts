import type { HttpClient, TokenManager } from '@lark-kit/core'
import { TaskResourceClient } from './task-client'

export class TaskClient {
  public readonly task: TaskResourceClient

  constructor(httpClient: HttpClient, tokenManager: TokenManager) {
    this.task = new TaskResourceClient(httpClient, tokenManager)
  }
}

export { TaskResourceClient } from './task-client'
export type {
  CreateTaskPayload,
  GetTaskPayload,
  ListTasksPayload,
  ListTasksResult,
  ListAllTasksPayload,
  UpdateTaskPayload,
  DeleteTaskPayload,
  CompleteTaskPayload,
  UncompleteTaskPayload,
} from './task-client'
