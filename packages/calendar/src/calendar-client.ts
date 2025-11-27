import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import {
  type Calendar,
  CreateCalendarResponseSchema,
  GetCalendarResponseSchema,
  ListCalendarsResponseSchema,
  parseResponse,
} from '@lark-kit/shared'

export interface CreateCalendarPayload {
  data: {
    summary?: string
    description?: string
    permissions?: 'private' | 'show_only_free_busy' | 'public'
    color?: number
    summary_alias?: string
  }
}

export interface GetCalendarPayload {
  path: {
    calendar_id: string
  }
}

export interface ListCalendarsPayload {
  params?: {
    page_size?: number
    page_token?: string
    sync_token?: string
  }
}

export interface ListCalendarsResult {
  items: Calendar[]
  has_more: boolean
  page_token?: string
}

export interface UpdateCalendarPayload {
  path: {
    calendar_id: string
  }
  data: {
    summary?: string
    description?: string
    permissions?: 'private' | 'show_only_free_busy' | 'public'
    color?: number
    summary_alias?: string
  }
}

export interface DeleteCalendarPayload {
  path: {
    calendar_id: string
  }
}

export class CalendarResourceClient {
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
   * Create a calendar
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar/create
   */
  async create(payload: CreateCalendarPayload): Promise<Calendar> {
    const { data } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.post('/open-apis/calendar/v4/calendars', {
      headers,
      data,
    })

    const parsed = parseResponse(CreateCalendarResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to create calendar: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.calendar ?? {}
  }

  /**
   * Get a calendar by ID
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar/get
   */
  async get(payload: GetCalendarPayload): Promise<Calendar> {
    const { path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/calendar/v4/calendars/:calendar_id', {
      headers,
      path,
    })

    const parsed = parseResponse(GetCalendarResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to get calendar: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data ?? {}
  }

  /**
   * List calendars
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar/list
   */
  async list(payload?: ListCalendarsPayload): Promise<ListCalendarsResult> {
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.get('/open-apis/calendar/v4/calendars', {
      headers,
      params: payload?.params,
    })

    const parsed = parseResponse(ListCalendarsResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to list calendars: ${parsed.msg}`, parsed.code || 0)
    }

    return {
      items: parsed.data?.calendar_list ?? [],
      has_more: parsed.data?.has_more ?? false,
      page_token: parsed.data?.page_token,
    }
  }

  /**
   * List all calendars with automatic pagination
   */
  async *listAll(
    payload?: Omit<ListCalendarsPayload, 'params'> & {
      params?: Omit<NonNullable<ListCalendarsPayload['params']>, 'page_token'>
    }
  ): AsyncGenerator<Calendar, void, unknown> {
    let pageToken: string | undefined

    do {
      const result = await this.list({
        params: { ...payload?.params, page_token: pageToken },
      })

      for (const calendar of result.items) {
        yield calendar
      }

      pageToken = result.has_more ? result.page_token : undefined
    } while (pageToken)
  }

  /**
   * Update a calendar
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar/patch
   */
  async update(payload: UpdateCalendarPayload): Promise<Calendar> {
    const { path, data } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.patch('/open-apis/calendar/v4/calendars/:calendar_id', {
      headers,
      path,
      data,
    })

    const parsed = parseResponse(GetCalendarResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to update calendar: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data ?? {}
  }

  /**
   * Delete a calendar
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/calendar-v4/calendar/delete
   */
  async delete(payload: DeleteCalendarPayload): Promise<void> {
    const { path } = payload
    const headers = await this.getAuthHeaders()

    const response = await this.httpClient.delete('/open-apis/calendar/v4/calendars/:calendar_id', {
      headers,
      path,
    })

    const parsed = parseResponse(GetCalendarResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to delete calendar: ${parsed.msg}`, parsed.code || 0)
    }
  }
}
