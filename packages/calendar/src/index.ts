import type { HttpClient, TokenManager } from '@lark-kit/core'
import { CalendarResourceClient } from './calendar-client'
import { CalendarEventClient } from './event-client'

export class CalendarClient {
  public readonly calendar: CalendarResourceClient
  public readonly event: CalendarEventClient

  constructor(httpClient: HttpClient, tokenManager: TokenManager) {
    this.calendar = new CalendarResourceClient(httpClient, tokenManager)
    this.event = new CalendarEventClient(httpClient, tokenManager)
  }
}

export { CalendarResourceClient } from './calendar-client'
export { CalendarEventClient } from './event-client'
export type {
  CreateCalendarPayload,
  GetCalendarPayload,
  ListCalendarsPayload,
  ListCalendarsResult,
  UpdateCalendarPayload,
  DeleteCalendarPayload,
} from './calendar-client'
export type {
  TimeInfo,
  CreateCalendarEventPayload,
  GetCalendarEventPayload,
  ListCalendarEventsPayload,
  ListCalendarEventsResult,
  UpdateCalendarEventPayload,
  DeleteCalendarEventPayload,
  ListCalendarEventAttendeesPayload,
  ListCalendarEventAttendeesResult,
  CreateCalendarEventAttendeesPayload,
} from './event-client'
