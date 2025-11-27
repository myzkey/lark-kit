import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  type CalendarEvent,
  type CalendarEventAttendee,
  CreateCalendarEventResponseSchema,
  GetCalendarEventResponseSchema,
  ListCalendarEventAttendeesResponseSchema,
  ListCalendarEventsResponseSchema,
  parseResponse,
} from '@lark-kit/shared'

export interface TimeInfo {
  date?: string
  timestamp?: string
  timezone?: string
}

export interface CreateCalendarEventPayload {
  path: {
    calendar_id: string
  }
  data: {
    summary?: string
    description?: string
    need_notification?: boolean
    start_time: TimeInfo
    end_time: TimeInfo
    vchat?: {
      vc_type?: 'vc' | 'third_party' | 'no_meeting' | 'lark_live' | 'unknown'
      icon_type?: 'vc' | 'live' | 'default'
      description?: string
      meeting_url?: string
    }
    visibility?: 'default' | 'public' | 'private'
    attendee_ability?: 'none' | 'can_see_others' | 'can_invite_others' | 'can_modify_event'
    free_busy_status?: 'busy' | 'free'
    location?: {
      name?: string
      address?: string
      latitude?: number
      longitude?: number
    }
    color?: number
    recurrence?: string
    schemas?: Array<{
      ui_name?: string
      ui_status?: string
      app_link?: string
    }>
  }
  params?: {
    idempotency_key?: string
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export interface GetCalendarEventPayload {
  path: {
    calendar_id: string
    event_id: string
  }
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export interface ListCalendarEventsPayload {
  path: {
    calendar_id: string
  }
  params?: {
    page_size?: number
    page_token?: string
    sync_token?: string
    start_time?: string
    end_time?: string
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export interface ListCalendarEventsResult {
  items: CalendarEvent[]
  has_more: boolean
  page_token?: string
}

export interface UpdateCalendarEventPayload {
  path: {
    calendar_id: string
    event_id: string
  }
  data: {
    summary?: string
    description?: string
    need_notification?: boolean
    start_time?: TimeInfo
    end_time?: TimeInfo
    vchat?: {
      vc_type?: 'vc' | 'third_party' | 'no_meeting' | 'lark_live' | 'unknown'
      icon_type?: 'vc' | 'live' | 'default'
      description?: string
      meeting_url?: string
    }
    visibility?: 'default' | 'public' | 'private'
    attendee_ability?: 'none' | 'can_see_others' | 'can_invite_others' | 'can_modify_event'
    free_busy_status?: 'busy' | 'free'
    location?: {
      name?: string
      address?: string
      latitude?: number
      longitude?: number
    }
    color?: number
  }
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export interface DeleteCalendarEventPayload {
  path: {
    calendar_id: string
    event_id: string
  }
  params?: {
    need_notification?: boolean
  }
}

export interface ListCalendarEventAttendeesPayload {
  path: {
    calendar_id: string
    event_id: string
  }
  params?: {
    page_size?: number
    page_token?: string
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export interface ListCalendarEventAttendeesResult {
  items: CalendarEventAttendee[]
  has_more: boolean
  page_token?: string
}

export interface CreateCalendarEventAttendeesPayload {
  path: {
    calendar_id: string
    event_id: string
  }
  data: {
    attendees: Array<{
      type?: 'user' | 'chat' | 'resource' | 'third_party'
      is_optional?: boolean
      user_id?: string
      chat_id?: string
      room_id?: string
      third_party_email?: string
    }>
    need_notification?: boolean
  }
  params?: {
    user_id_type?: 'user_id' | 'union_id' | 'open_id'
  }
}

export class CalendarEventClient {
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
   * Create a calendar event
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar-event/create
   */
  async create(payload: CreateCalendarEventPayload): Promise<CalendarEvent> {
    const { path, data, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post(
      '/open-apis/calendar/v4/calendars/:calendar_id/events',
      {
        headers,
        path,
        data,
        params,
      }
    )

    const parsed = parseResponse(CreateCalendarEventResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to create calendar event: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.event ?? {}
  }

  /**
   * Get a calendar event by ID
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar-event/get
   */
  async get(payload: GetCalendarEventPayload): Promise<CalendarEvent> {
    const { path, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get(
      '/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id',
      {
        headers,
        path,
        params,
      }
    )

    const parsed = parseResponse(GetCalendarEventResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to get calendar event: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.event ?? {}
  }

  /**
   * List calendar events
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar-event/list
   */
  async list(payload: ListCalendarEventsPayload): Promise<ListCalendarEventsResult> {
    const { path, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get(
      '/open-apis/calendar/v4/calendars/:calendar_id/events',
      {
        headers,
        path,
        params,
      }
    )

    const parsed = parseResponse(ListCalendarEventsResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to list calendar events: ${parsed.msg}`, parsed.code || 0)
    }

    return {
      items: parsed.data?.items ?? [],
      has_more: parsed.data?.has_more ?? false,
      page_token: parsed.data?.page_token,
    }
  }

  /**
   * List all calendar events with automatic pagination
   */
  async *listAll(payload: {
    path: { calendar_id: string }
    params?: Omit<NonNullable<ListCalendarEventsPayload['params']>, 'page_token'>
  }): AsyncGenerator<CalendarEvent, void, unknown> {
    let pageToken: string | undefined
    const { path, params } = payload

    do {
      const result = await this.list({
        path,
        params: { ...params, page_token: pageToken },
      })

      for (const event of result.items) {
        yield event
      }

      pageToken = result.has_more ? result.page_token : undefined
    } while (pageToken)
  }

  /**
   * Update a calendar event
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar-event/patch
   */
  async update(payload: UpdateCalendarEventPayload): Promise<CalendarEvent> {
    const { path, data, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.patch(
      '/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id',
      {
        headers,
        path,
        data,
        params,
      }
    )

    const parsed = parseResponse(GetCalendarEventResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to update calendar event: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.event ?? {}
  }

  /**
   * Delete a calendar event
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar-event/delete
   */
  async delete(payload: DeleteCalendarEventPayload): Promise<void> {
    const { path, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.delete(
      '/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id',
      {
        headers,
        path,
        params,
      }
    )

    const parsed = parseResponse(GetCalendarEventResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to delete calendar event: ${parsed.msg}`, parsed.code || 0)
    }
  }

  /**
   * List attendees for a calendar event
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar-event-attendee/list
   */
  async listAttendees(
    payload: ListCalendarEventAttendeesPayload
  ): Promise<ListCalendarEventAttendeesResult> {
    const { path, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get(
      '/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id/attendees',
      {
        headers,
        path,
        params,
      }
    )

    const parsed = parseResponse(ListCalendarEventAttendeesResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(
        `Failed to list calendar event attendees: ${parsed.msg}`,
        parsed.code || 0
      )
    }

    return {
      items: parsed.data?.items ?? [],
      has_more: parsed.data?.has_more ?? false,
      page_token: parsed.data?.page_token,
    }
  }

  /**
   * Create attendees for a calendar event
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar-event-attendee/create
   */
  async createAttendees(
    payload: CreateCalendarEventAttendeesPayload
  ): Promise<CalendarEventAttendee[]> {
    const { path, data, params } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post(
      '/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id/attendees',
      {
        headers,
        path,
        data,
        params,
      }
    )

    const parsed = parseResponse(ListCalendarEventAttendeesResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(
        `Failed to create calendar event attendees: ${parsed.msg}`,
        parsed.code || 0
      )
    }

    return parsed.data?.items ?? []
  }
}
