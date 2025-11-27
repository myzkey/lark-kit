import { z } from 'zod'

// Calendar schema
export const CalendarSchema = z.object({
  calendar_id: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  permissions: z.enum(['private', 'show_only_free_busy', 'public']).optional(),
  color: z.number().optional(),
  type: z.enum(['unknown', 'primary', 'shared', 'google', 'resource', 'exchange']).optional(),
  summary_alias: z.string().optional(),
  is_deleted: z.boolean().optional(),
  is_third_party: z.boolean().optional(),
  role: z.enum(['unknown', 'free_busy_reader', 'reader', 'writer', 'owner']).optional(),
})

// Calendar Event schema
export const CalendarEventSchema = z.object({
  event_id: z.string().optional(),
  organizer_calendar_id: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  need_notification: z.boolean().optional(),
  start_time: z
    .object({
      date: z.string().optional(),
      timestamp: z.string().optional(),
      timezone: z.string().optional(),
    })
    .optional(),
  end_time: z
    .object({
      date: z.string().optional(),
      timestamp: z.string().optional(),
      timezone: z.string().optional(),
    })
    .optional(),
  vchat: z
    .object({
      vc_type: z.enum(['vc', 'third_party', 'no_meeting', 'lark_live', 'unknown']).optional(),
      icon_type: z.enum(['vc', 'live', 'default']).optional(),
      description: z.string().optional(),
      meeting_url: z.string().optional(),
    })
    .optional(),
  visibility: z.enum(['default', 'public', 'private']).optional(),
  attendee_ability: z.enum(['none', 'can_see_others', 'can_invite_others', 'can_modify_event']).optional(),
  free_busy_status: z.enum(['busy', 'free']).optional(),
  location: z
    .object({
      name: z.string().optional(),
      address: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  color: z.number().optional(),
  status: z.enum(['tentative', 'confirmed', 'cancelled']).optional(),
  is_exception: z.boolean().optional(),
  recurring_event_id: z.string().optional(),
  create_time: z.string().optional(),
  app_link: z.string().optional(),
})

// Calendar Event Attendee schema
export const CalendarEventAttendeeSchema = z.object({
  type: z.enum(['user', 'chat', 'resource', 'third_party']).optional(),
  attendee_id: z.string().optional(),
  rsvp_status: z.enum(['needs_action', 'accept', 'tentative', 'decline', 'removed']).optional(),
  is_optional: z.boolean().optional(),
  is_organizer: z.boolean().optional(),
  is_external: z.boolean().optional(),
  display_name: z.string().optional(),
  chat_members: z
    .array(
      z.object({
        rsvp_status: z.string().optional(),
        is_optional: z.boolean().optional(),
        display_name: z.string().optional(),
        is_organizer: z.boolean().optional(),
        is_external: z.boolean().optional(),
      })
    )
    .optional(),
  user_id: z.string().optional(),
  chat_id: z.string().optional(),
  room_id: z.string().optional(),
  third_party_email: z.string().optional(),
  operate_id: z.string().optional(),
  resource_customization: z.array(z.unknown()).optional(),
})

// FreeBusy schema
export const FreeBusySchema = z.object({
  user_id: z.string().optional(),
  room_id: z.string().optional(),
  free_busy_list: z
    .array(
      z.object({
        start_time: z.string().optional(),
        end_time: z.string().optional(),
      })
    )
    .optional(),
})

// Response schemas
export const GetCalendarResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: CalendarSchema.optional(),
})

export const ListCalendarsResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      has_more: z.boolean().optional(),
      page_token: z.string().optional(),
      calendar_list: z.array(CalendarSchema).optional(),
    })
    .optional(),
})

export const CreateCalendarResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      calendar: CalendarSchema.optional(),
    })
    .optional(),
})

export const GetCalendarEventResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      event: CalendarEventSchema.optional(),
    })
    .optional(),
})

export const ListCalendarEventsResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      has_more: z.boolean().optional(),
      page_token: z.string().optional(),
      items: z.array(CalendarEventSchema).optional(),
    })
    .optional(),
})

export const CreateCalendarEventResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      event: CalendarEventSchema.optional(),
    })
    .optional(),
})

export const ListCalendarEventAttendeesResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      items: z.array(CalendarEventAttendeeSchema).optional(),
      has_more: z.boolean().optional(),
      page_token: z.string().optional(),
    })
    .optional(),
})

export const FreeBusyResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      freebusy_list: z.array(FreeBusySchema).optional(),
    })
    .optional(),
})

// Types
export type Calendar = z.infer<typeof CalendarSchema>
export type CalendarEvent = z.infer<typeof CalendarEventSchema>
export type CalendarEventAttendee = z.infer<typeof CalendarEventAttendeeSchema>
export type FreeBusy = z.infer<typeof FreeBusySchema>
