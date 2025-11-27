import {
  type BotAddedEvent,
  BotAddedEventSchema,
  type CardActionEvent,
  CardActionEventSchema,
  EventV2Schema,
  type MessageReadEvent,
  MessageReadEventSchema,
  type MessageReceiveEvent,
  MessageReceiveEventSchema,
  type UrlVerificationEvent,
  UrlVerificationEventSchema,
} from '@lark-kit/shared'
import { decryptEvent, verifySignature } from './verify'

export type EventType =
  | 'url_verification'
  | 'im.message.receive_v1'
  | 'im.message.message_read_v1'
  | 'im.chat.member.bot.added_v1'
  | 'card.action.trigger'

export interface WebhookConfig {
  /** Verification token from Lark app settings */
  verificationToken?: string
  /** Encrypt key for signature verification and decryption */
  encryptKey?: string
}

export interface EventHandlers {
  /** Handle URL verification challenge */
  'url_verification'?: (event: UrlVerificationEvent) => Promise<{ challenge: string } | void>
  /** Handle incoming message */
  'im.message.receive_v1'?: (event: MessageReceiveEvent) => Promise<void>
  /** Handle message read */
  'im.message.message_read_v1'?: (event: MessageReadEvent) => Promise<void>
  /** Handle bot added to chat */
  'im.chat.member.bot.added_v1'?: (event: BotAddedEvent) => Promise<void>
  /** Handle card action */
  'card.action.trigger'?: (event: CardActionEvent) => Promise<Record<string, unknown> | void>
}

export interface HandleResult {
  status: number
  body: unknown
}

export class WebhookHandler {
  private handlers: EventHandlers = {}

  constructor(private readonly config: WebhookConfig = {}) {}

  /**
   * Register event handlers
   */
  on<K extends keyof EventHandlers>(eventType: K, handler: EventHandlers[K]): this {
    this.handlers[eventType] = handler
    return this
  }

  /**
   * Handle incoming webhook request
   * @param request - The incoming request (works with Web standard Request)
   * @returns Response object with status and body
   */
  async handle(request: Request): Promise<HandleResult> {
    try {
      const body = await request.text()
      let eventData: unknown

      // Verify signature if encrypt key is configured
      if (this.config.encryptKey) {
        const timestamp = request.headers.get('X-Lark-Request-Timestamp') || ''
        const nonce = request.headers.get('X-Lark-Request-Nonce') || ''
        const signature = request.headers.get('X-Lark-Signature') || ''

        if (signature) {
          const isValid = await verifySignature(
            timestamp,
            nonce,
            this.config.encryptKey,
            body,
            signature
          )

          if (!isValid) {
            return { status: 401, body: { error: 'Invalid signature' } }
          }
        }

        // Try to decrypt if encrypted
        const parsed = JSON.parse(body)
        if (parsed.encrypt) {
          const decrypted = await decryptEvent(this.config.encryptKey, parsed.encrypt)
          eventData = JSON.parse(decrypted)
        } else {
          eventData = parsed
        }
      } else {
        eventData = JSON.parse(body)
      }

      return await this.processEvent(eventData)
    } catch (error) {
      console.error('Webhook handler error:', error)
      return { status: 500, body: { error: 'Internal server error' } }
    }
  }

  /**
   * Handle raw event data (for custom integrations)
   */
  async handleRaw(eventData: unknown): Promise<HandleResult> {
    return this.processEvent(eventData)
  }

  private async processEvent(eventData: unknown): Promise<HandleResult> {
    // Check for URL verification
    const urlVerification = UrlVerificationEventSchema.safeParse(eventData)
    if (urlVerification.success) {
      const handler = this.handlers['url_verification']
      if (handler) {
        const result = await handler(urlVerification.data)
        if (result) {
          return { status: 200, body: result }
        }
      }
      // Default: return challenge
      return { status: 200, body: { challenge: urlVerification.data.challenge } }
    }

    // Parse as v2 event
    const event = EventV2Schema.safeParse(eventData)
    if (!event.success) {
      return { status: 400, body: { error: 'Invalid event format' } }
    }

    const eventType = event.data.header.event_type as EventType

    // Verify token if configured
    if (this.config.verificationToken) {
      if (event.data.header.token !== this.config.verificationToken) {
        return { status: 401, body: { error: 'Invalid verification token' } }
      }
    }

    // Route to appropriate handler
    switch (eventType) {
      case 'im.message.receive_v1': {
        const parsed = MessageReceiveEventSchema.safeParse(eventData)
        if (parsed.success && this.handlers['im.message.receive_v1']) {
          await this.handlers['im.message.receive_v1'](parsed.data)
        }
        break
      }
      case 'im.message.message_read_v1': {
        const parsed = MessageReadEventSchema.safeParse(eventData)
        if (parsed.success && this.handlers['im.message.message_read_v1']) {
          await this.handlers['im.message.message_read_v1'](parsed.data)
        }
        break
      }
      case 'im.chat.member.bot.added_v1': {
        const parsed = BotAddedEventSchema.safeParse(eventData)
        if (parsed.success && this.handlers['im.chat.member.bot.added_v1']) {
          await this.handlers['im.chat.member.bot.added_v1'](parsed.data)
        }
        break
      }
      case 'card.action.trigger': {
        const parsed = CardActionEventSchema.safeParse(eventData)
        if (parsed.success && this.handlers['card.action.trigger']) {
          const result = await this.handlers['card.action.trigger'](parsed.data)
          if (result) {
            return { status: 200, body: result }
          }
        }
        break
      }
    }

    return { status: 200, body: { ok: true } }
  }
}

/**
 * Create a webhook handler instance
 */
export function createWebhookHandler(config?: WebhookConfig): WebhookHandler {
  return new WebhookHandler(config)
}
