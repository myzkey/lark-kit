import { z } from 'zod'

// Approval definition status
export const ApprovalStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'DELETED', 'UNKNOWN'])
export type ApprovalStatus = z.infer<typeof ApprovalStatusSchema>

// Instance status
export const InstanceStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'DELETED'])
export type InstanceStatus = z.infer<typeof InstanceStatusSchema>

// Task status
export const TaskStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'TRANSFERRED', 'DONE'])
export type TaskStatus = z.infer<typeof TaskStatusSchema>

// Viewer schema
export const ApprovalViewerSchema = z.object({
  type: z.enum(['TENANT', 'DEPARTMENT', 'USER', 'ROLE', 'USER_GROUP', 'NONE']).optional(),
  id: z.string().optional(),
  user_id: z.string().optional(),
})
export type ApprovalViewer = z.infer<typeof ApprovalViewerSchema>

// Node schema
export const ApprovalNodeSchema = z.object({
  name: z.string(),
  need_approver: z.boolean(),
  node_id: z.string(),
  custom_node_id: z.string().optional(),
  node_type: z.enum(['AND', 'OR', 'SEQUENTIAL', 'CC_NODE']),
  approver_chosen_multi: z.boolean(),
  approver_chosen_range: z
    .array(
      z.object({
        approver_range_type: z.number().optional(),
        approver_range_ids: z.array(z.string()).optional(),
      })
    )
    .optional(),
  require_signature: z.boolean().optional(),
})
export type ApprovalNode = z.infer<typeof ApprovalNodeSchema>

// Approval definition schema
export const ApprovalDefinitionSchema = z.object({
  approval_name: z.string(),
  approval_code: z.string().optional(),
  status: ApprovalStatusSchema.optional(),
  form: z.string().optional(),
  node_list: z.array(ApprovalNodeSchema).optional(),
  viewers: z.array(ApprovalViewerSchema).optional(),
  approval_admin_ids: z.array(z.string()).optional(),
  form_widget_relation: z.string().optional(),
})
export type ApprovalDefinition = z.infer<typeof ApprovalDefinitionSchema>

// Task schema
export const ApprovalTaskSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  open_id: z.string().optional(),
  status: TaskStatusSchema,
  node_id: z.string().optional(),
  node_name: z.string().optional(),
  custom_node_id: z.string().optional(),
  type: z.enum(['AND', 'OR', 'AUTO_PASS', 'AUTO_REJECT', 'SEQUENTIAL']).optional(),
  start_time: z.string(),
  end_time: z.string().optional(),
})
export type ApprovalTask = z.infer<typeof ApprovalTaskSchema>

// Comment file schema
export const CommentFileSchema = z.object({
  url: z.string().optional(),
  file_size: z.number().optional(),
  title: z.string().optional(),
  type: z.string().optional(),
})
export type CommentFile = z.infer<typeof CommentFileSchema>

// Comment schema
export const ApprovalCommentSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  open_id: z.string(),
  comment: z.string(),
  create_time: z.string(),
  files: z.array(CommentFileSchema).optional(),
})
export type ApprovalComment = z.infer<typeof ApprovalCommentSchema>

// Timeline CC user
export const CcUserSchema = z.object({
  user_id: z.string().optional(),
  cc_id: z.string().optional(),
  open_id: z.string().optional(),
})
export type CcUser = z.infer<typeof CcUserSchema>

// Timeline schema
export const ApprovalTimelineSchema = z.object({
  type: z.enum([
    'START',
    'PASS',
    'REJECT',
    'AUTO_PASS',
    'AUTO_REJECT',
    'REMOVE_REPEAT',
    'TRANSFER',
    'ADD_APPROVER_BEFORE',
    'ADD_APPROVER',
    'ADD_APPROVER_AFTER',
    'DELETE_APPROVER',
    'ROLLBACK_SELECTED',
    'ROLLBACK',
    'CANCEL',
    'DELETE',
    'CC',
  ]),
  create_time: z.string(),
  user_id: z.string().optional(),
  open_id: z.string().optional(),
  user_id_list: z.array(z.string()).optional(),
  open_id_list: z.array(z.string()).optional(),
  task_id: z.string().optional(),
  comment: z.string().optional(),
  cc_user_list: z.array(CcUserSchema).optional(),
  ext: z.string(),
  node_key: z.string().optional(),
  files: z.array(CommentFileSchema).optional(),
})
export type ApprovalTimeline = z.infer<typeof ApprovalTimelineSchema>

// Approval instance schema
export const ApprovalInstanceSchema = z.object({
  approval_name: z.string(),
  approval_code: z.string(),
  instance_code: z.string(),
  start_time: z.string().optional(),
  end_time: z.string(),
  user_id: z.string(),
  open_id: z.string(),
  serial_number: z.string(),
  department_id: z.string(),
  status: InstanceStatusSchema,
  uuid: z.string(),
  form: z.string(),
  task_list: z.array(ApprovalTaskSchema),
  comment_list: z.array(ApprovalCommentSchema),
  timeline: z.array(ApprovalTimelineSchema),
  modified_instance_code: z.string().optional(),
  reverted_instance_code: z.string().optional(),
  reverted: z.boolean().optional(),
})
export type ApprovalInstance = z.infer<typeof ApprovalInstanceSchema>

// Response schemas
export const GetApprovalDefinitionResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: ApprovalDefinitionSchema.omit({ approval_code: true })
    .extend({
      approval_name: z.string(),
      status: ApprovalStatusSchema,
      form: z.string(),
      node_list: z.array(ApprovalNodeSchema),
      viewers: z.array(ApprovalViewerSchema),
    })
    .optional(),
})

export const CreateInstanceResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      instance_code: z.string().optional(),
    })
    .optional(),
})

export const GetInstanceResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: ApprovalInstanceSchema.optional(),
})

export const ListInstancesResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      instance_code_list: z.array(z.string()).optional(),
      has_more: z.boolean().optional(),
      page_token: z.string().optional(),
    })
    .optional(),
})

export const CancelInstanceResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
})

export const ApproveTaskResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
})

export const RejectTaskResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
})

export const TransferTaskResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
})
