import { z } from 'zod'

export const FileUploadResponseSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z
    .object({
      file_token: z.string(),
    })
    .optional(),
})

export const FileMetaSchema = z.object({
  file_token: z.string(),
  name: z.string(),
  type: z.string(),
  parent_token: z.string().optional(),
  created_time: z.number().optional(),
  modified_time: z.number().optional(),
})

export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>
export type FileMeta = z.infer<typeof FileMetaSchema>
