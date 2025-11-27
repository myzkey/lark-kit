import { z } from 'zod'

// Event header schema
export const EventHeaderSchema = z.object({
  event_id: z.string(),
  event_type: z.string(),
  create_time: z.string(),
  token: z.string(),
  app_id: z.string(),
  tenant_key: z.string(),
})

// URL verification event
export const UrlVerificationEventSchema = z.object({
  challenge: z.string(),
  token: z.string(),
  type: z.literal('url_verification'),
})

// Message event sender
export const EventSenderSchema = z.object({
  sender_id: z
    .object({
      union_id: z.string().optional(),
      user_id: z.string().optional(),
      open_id: z.string().optional(),
    })
    .optional(),
  sender_type: z.string().optional(),
  tenant_key: z.string().optional(),
})

// Message event message content
export const EventMessageSchema = z.object({
  message_id: z.string().optional(),
  root_id: z.string().optional(),
  parent_id: z.string().optional(),
  create_time: z.string().optional(),
  update_time: z.string().optional(),
  chat_id: z.string().optional(),
  chat_type: z.string().optional(),
  message_type: z.string().optional(),
  content: z.string().optional(),
  mentions: z
    .array(
      z.object({
        key: z.string(),
        id: z
          .object({
            union_id: z.string().optional(),
            user_id: z.string().optional(),
            open_id: z.string().optional(),
          })
          .optional(),
        name: z.string().optional(),
        tenant_key: z.string().optional(),
      })
    )
    .optional(),
})

// im.message.receive_v1 event
export const MessageReceiveEventSchema = z.object({
  schema: z.string().optional(),
  header: EventHeaderSchema,
  event: z.object({
    sender: EventSenderSchema,
    message: EventMessageSchema,
  }),
})

// im.message.message_read_v1 event
export const MessageReadEventSchema = z.object({
  schema: z.string().optional(),
  header: EventHeaderSchema,
  event: z.object({
    reader: z
      .object({
        reader_id: z
          .object({
            union_id: z.string().optional(),
            user_id: z.string().optional(),
            open_id: z.string().optional(),
          })
          .optional(),
        read_time: z.string().optional(),
        tenant_key: z.string().optional(),
      })
      .optional(),
    message_id_list: z.array(z.string()).optional(),
  }),
})

// Bot added to chat event
export const BotAddedEventSchema = z.object({
  schema: z.string().optional(),
  header: EventHeaderSchema,
  event: z.object({
    chat_id: z.string().optional(),
    operator_id: z
      .object({
        union_id: z.string().optional(),
        user_id: z.string().optional(),
        open_id: z.string().optional(),
      })
      .optional(),
    external: z.boolean().optional(),
    operator_tenant_key: z.string().optional(),
    name: z.string().optional(),
    i18n_names: z.record(z.string()).optional(),
  }),
})

// Card action event
export const CardActionEventSchema = z.object({
  schema: z.string().optional(),
  header: EventHeaderSchema,
  event: z.object({
    operator: z
      .object({
        tenant_key: z.string().optional(),
        user_id: z.string().optional(),
        open_id: z.string().optional(),
        union_id: z.string().optional(),
      })
      .optional(),
    token: z.string().optional(),
    action: z
      .object({
        value: z.record(z.unknown()).optional(),
        tag: z.string().optional(),
        option: z.string().optional(),
        timezone: z.string().optional(),
      })
      .optional(),
    host: z.string().optional(),
    delivery_type: z.string().optional(),
    context: z
      .object({
        url: z.string().optional(),
        preview_token: z.string().optional(),
        open_message_id: z.string().optional(),
        open_chat_id: z.string().optional(),
      })
      .optional(),
  }),
})

// Generic event wrapper for v2 events
export const EventV2Schema = z.object({
  schema: z.string().optional(),
  header: EventHeaderSchema,
  event: z.record(z.unknown()),
})

// Types
export type EventHeader = z.infer<typeof EventHeaderSchema>
export type UrlVerificationEvent = z.infer<typeof UrlVerificationEventSchema>
export type EventSender = z.infer<typeof EventSenderSchema>
export type EventMessage = z.infer<typeof EventMessageSchema>
export type MessageReceiveEvent = z.infer<typeof MessageReceiveEventSchema>
export type MessageReadEvent = z.infer<typeof MessageReadEventSchema>
export type BotAddedEvent = z.infer<typeof BotAddedEventSchema>
export type CardActionEvent = z.infer<typeof CardActionEventSchema>
export type EventV2 = z.infer<typeof EventV2Schema>
