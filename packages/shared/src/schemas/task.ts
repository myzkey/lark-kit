import { z } from 'zod'

// Due date schema
export const TaskDueSchema = z.object({
  time: z.string().optional(),
  timezone: z.string().optional(),
  is_all_day: z.boolean().optional(),
})
export type TaskDue = z.infer<typeof TaskDueSchema>

// Origin href schema
export const TaskOriginHrefSchema = z.object({
  url: z.string().optional(),
  title: z.string().optional(),
})
export type TaskOriginHref = z.infer<typeof TaskOriginHrefSchema>

// Origin schema
export const TaskOriginSchema = z.object({
  platform_i18n_name: z.string(),
  href: TaskOriginHrefSchema.optional(),
})
export type TaskOrigin = z.infer<typeof TaskOriginSchema>

// Member schema (for followers/collaborators)
export const TaskMemberSchema = z.object({
  id: z.string().optional(),
  id_list: z.array(z.string()).optional(),
})
export type TaskMember = z.infer<typeof TaskMemberSchema>

// Task schema
export const TaskSchema = z.object({
  id: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  complete_time: z.string().optional(),
  creator_id: z.string().optional(),
  extra: z.string().optional(),
  create_time: z.string().optional(),
  update_time: z.string().optional(),
  due: TaskDueSchema.optional(),
  origin: TaskOriginSchema.optional(),
  can_edit: z.boolean().optional(),
  custom: z.string().optional(),
  source: z.number().optional(),
  followers: z.array(TaskMemberSchema).optional(),
  collaborators: z.array(TaskMemberSchema).optional(),
  collaborator_ids: z.array(z.string()).optional(),
  follower_ids: z.array(z.string()).optional(),
  repeat_rule: z.string().optional(),
  rich_summary: z.string().optional(),
  rich_description: z.string().optional(),
})
export type Task = z.infer<typeof TaskSchema>

// Response schemas
export const CreateTaskResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      task: TaskSchema.optional(),
    })
    .optional(),
})

export const GetTaskResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      task: TaskSchema.optional(),
    })
    .optional(),
})

export const ListTasksResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      items: z.array(TaskSchema).optional(),
      page_token: z.string().optional(),
      has_more: z.boolean().optional(),
    })
    .optional(),
})

export const UpdateTaskResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      task: TaskSchema.optional(),
    })
    .optional(),
})

export const DeleteTaskResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
})

export const CompleteTaskResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
})

export const UncompleteTaskResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
})
