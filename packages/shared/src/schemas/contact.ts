import { z } from 'zod'

export const UserIdTypeSchema = z.enum(['open_id', 'union_id', 'user_id'])

export const UserAvatarSchema = z.object({
  avatar_72: z.string().optional(),
  avatar_240: z.string().optional(),
  avatar_640: z.string().optional(),
  avatar_origin: z.string().optional(),
})

export const UserStatusSchema = z.object({
  is_frozen: z.boolean().optional(),
  is_resigned: z.boolean().optional(),
  is_activated: z.boolean().optional(),
  is_exited: z.boolean().optional(),
  is_unjoin: z.boolean().optional(),
})

export const UserSchema = z.object({
  union_id: z.string().optional(),
  user_id: z.string().optional(),
  open_id: z.string().optional(),
  name: z.string().optional(),
  en_name: z.string().optional(),
  nickname: z.string().optional(),
  email: z.string().optional(),
  mobile: z.string().optional(),
  mobile_visible: z.boolean().optional(),
  gender: z.number().optional(),
  avatar: UserAvatarSchema.optional(),
  status: UserStatusSchema.optional(),
  department_ids: z.array(z.string()).optional(),
  leader_user_id: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  work_station: z.string().optional(),
  join_time: z.number().optional(),
  employee_no: z.string().optional(),
  employee_type: z.number().optional(),
  enterprise_email: z.string().optional(),
  job_title: z.string().optional(),
  geo: z.string().optional(),
})

export const GetUserResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      user: UserSchema.optional(),
    })
    .optional(),
})

export const BatchGetUsersResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      items: z.array(UserSchema).optional(),
    })
    .optional(),
})

export const ListUsersResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      items: z.array(UserSchema).optional(),
      has_more: z.boolean().optional(),
      page_token: z.string().optional(),
    })
    .optional(),
})

export type UserIdType = z.infer<typeof UserIdTypeSchema>
export type UserAvatar = z.infer<typeof UserAvatarSchema>
export type UserStatus = z.infer<typeof UserStatusSchema>
export type User = z.infer<typeof UserSchema>
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>
export type BatchGetUsersResponse = z.infer<typeof BatchGetUsersResponseSchema>
export type ListUsersResponse = z.infer<typeof ListUsersResponseSchema>
