export { Client } from './lark'

// Re-export from core
export {
  HttpClient,
  TokenManager,
  LarkApiError,
  LarkAuthError,
  LarkValidationError,
  InMemoryTokenStorage,
  Domain,
  AppType,
} from '@lark-kit/core'
export type {
  DomainType,
  AppTypeType,
  TokenStorage,
  LarkConfig,
  LarkResponse,
  RequestOptions,
} from '@lark-kit/core'

// Re-export from bitable
export {
  BitableClient,
  AppTableClient,
  AppTableRecordClient,
  AppTableFieldClient,
  FieldType,
} from '@lark-kit/bitable'
export type {
  CreateRecordPayload,
  GetRecordPayload,
  UpdateRecordPayload,
  DeleteRecordPayload,
  ListRecordsPayload,
  ListRecordsResult,
  ListAllRecordsPayload,
  BatchCreateRecordsPayload,
  BatchUpdateRecordsPayload,
  BatchDeleteRecordsPayload,
  ListFieldsPayload,
  ListFieldsResult,
  ListAllFieldsPayload,
  CreateFieldPayload,
  UpdateFieldPayload,
  DeleteFieldPayload,
  FieldTypeValue,
  ListTablesPayload,
  ListTablesResult,
  ListAllTablesPayload,
  CreateTablePayload,
  CreateTableResult,
  DeleteTablePayload,
} from '@lark-kit/bitable'

// Re-export from chat
export { ImClient, MessageClient, ChatClient, ImageClient, FileClient } from '@lark-kit/chat'
export type {
  CreateMessagePayload,
  ReplyMessagePayload,
  GetMessagePayload,
  ListMessagesPayload,
  ListMessagesResult,
  ListAllMessagesPayload,
  ListChatsPayload,
  ListChatsResult,
  ImageType,
  FileType,
} from '@lark-kit/chat'

// Re-export from contact
export { ContactClient, UserClient } from '@lark-kit/contact'
export type {
  GetUserPayload,
  BatchGetUsersPayload,
  ListUsersPayload,
  ListUsersResult,
  ListAllUsersPayload,
} from '@lark-kit/contact'

// Re-export from webhook
export { WebhookHandler, createWebhookHandler, verifySignature, decryptEvent } from '@lark-kit/webhook'
export type { WebhookConfig, EventHandlers, EventType, HandleResult } from '@lark-kit/webhook'

// Re-export types from shared
export type {
  BitableRecord,
  BitableField,
  BitableTable,
  Message,
  ReceiveIdType,
  Chat,
  Card,
  CardHeader,
  CardElement,
  CardDivElement,
  CardHrElement,
  CardActionElement,
  CardButtonAction,
  CardNoteElement,
  CardTextElement,
  CardConfig,
  User,
  UserAvatar,
  UserStatus,
  UserIdType,
  // Webhook events
  EventHeader,
  UrlVerificationEvent,
  EventSender,
  EventMessage,
  MessageReceiveEvent,
  MessageReadEvent,
  BotAddedEvent,
  CardActionEvent,
  EventV2,
} from '@lark-kit/shared'
