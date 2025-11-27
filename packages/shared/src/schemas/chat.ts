import { z } from 'zod'

export const ReceiveIdTypeSchema = z.enum(['open_id', 'user_id', 'union_id', 'email', 'chat_id'])

export const SenderSchema = z.object({
  id: z.string(),
  id_type: z.string(),
  sender_type: z.string(),
  tenant_key: z.string().optional(),
})

export const MentionSchema = z.object({
  key: z.string(),
  id: z.string(),
  id_type: z.string(),
  name: z.string(),
  tenant_key: z.string().optional(),
})

export const MessageSchema = z.object({
  message_id: z.string().optional(),
  root_id: z.string().optional(),
  parent_id: z.string().optional(),
  thread_id: z.string().optional(),
  msg_type: z.string().optional(),
  create_time: z.string().optional(),
  update_time: z.string().optional(),
  deleted: z.boolean().optional(),
  updated: z.boolean().optional(),
  chat_id: z.string().optional(),
  sender: SenderSchema.optional(),
  body: z.object({ content: z.string() }).optional(),
  mentions: z.array(MentionSchema).optional(),
  upper_message_id: z.string().optional(),
})

export const CreateMessageResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: MessageSchema.optional(),
})

export const ReplyMessageResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: MessageSchema.optional(),
})

export const ChatSchema = z.object({
  chat_id: z.string().optional(),
  avatar: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  owner_id: z.string().optional(),
  owner_id_type: z.string().optional(),
  external: z.boolean().optional(),
  tenant_key: z.string().optional(),
  chat_status: z.string().optional(),
})

export const ListChatsResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      items: z.array(ChatSchema).optional(),
      page_token: z.string().optional(),
      has_more: z.boolean().optional(),
    })
    .optional(),
})

export type ReceiveIdType = z.infer<typeof ReceiveIdTypeSchema>
export type Sender = z.infer<typeof SenderSchema>
export type Mention = z.infer<typeof MentionSchema>
export type Message = z.infer<typeof MessageSchema>
export type CreateMessageResponse = z.infer<typeof CreateMessageResponseSchema>
export type ReplyMessageResponse = z.infer<typeof ReplyMessageResponseSchema>
export type Chat = z.infer<typeof ChatSchema>
export type ListChatsResponse = z.infer<typeof ListChatsResponseSchema>

export const UploadImageResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      image_key: z.string().optional(),
    })
    .optional(),
})

export const UploadFileResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      file_key: z.string().optional(),
    })
    .optional(),
})

export type UploadImageResponse = z.infer<typeof UploadImageResponseSchema>
export type UploadFileResponse = z.infer<typeof UploadFileResponseSchema>

export const GetMessageResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      items: z.array(MessageSchema).optional(),
    })
    .optional(),
})

export const ListMessagesResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      items: z.array(MessageSchema).optional(),
      has_more: z.boolean().optional(),
      page_token: z.string().optional(),
    })
    .optional(),
})

export type GetMessageResponse = z.infer<typeof GetMessageResponseSchema>
export type ListMessagesResponse = z.infer<typeof ListMessagesResponseSchema>

// Card types for interactive messages
export interface CardHeader {
  title: {
    tag: 'plain_text' | 'lark_md'
    content: string
  }
  template?:
    | 'blue'
    | 'wathet'
    | 'turquoise'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'red'
    | 'carmine'
    | 'violet'
    | 'purple'
    | 'indigo'
    | 'grey'
}

export interface CardTextElement {
  tag: 'plain_text' | 'lark_md'
  content: string
}

export interface CardDivElement {
  tag: 'div'
  text?: CardTextElement
  fields?: Array<{
    is_short: boolean
    text: CardTextElement
  }>
}

export interface CardHrElement {
  tag: 'hr'
}

export interface CardButtonAction {
  tag: 'button'
  text: CardTextElement
  type?: 'default' | 'primary' | 'danger'
  url?: string
  value?: Record<string, unknown>
}

export interface CardActionElement {
  tag: 'action'
  actions: CardButtonAction[]
}

export interface CardNoteElement {
  tag: 'note'
  elements: CardTextElement[]
}

export type CardElement = CardDivElement | CardHrElement | CardActionElement | CardNoteElement

export interface CardConfig {
  wide_screen_mode?: boolean
  enable_forward?: boolean
}

export interface Card {
  config?: CardConfig
  header?: CardHeader
  elements: CardElement[]
}
