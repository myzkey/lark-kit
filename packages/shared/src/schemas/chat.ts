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

export type ReceiveIdType = z.infer<typeof ReceiveIdTypeSchema>
export type Sender = z.infer<typeof SenderSchema>
export type Mention = z.infer<typeof MentionSchema>
export type Message = z.infer<typeof MessageSchema>
export type CreateMessageResponse = z.infer<typeof CreateMessageResponseSchema>
export type ReplyMessageResponse = z.infer<typeof ReplyMessageResponseSchema>
