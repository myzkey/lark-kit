import { z } from 'zod'

// Field value types based on official SDK
export const FieldValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.object({ text: z.string().optional(), link: z.string().optional() }),
  z.object({
    location: z.string().optional(),
    pname: z.string().optional(),
    cityname: z.string().optional(),
    adname: z.string().optional(),
    address: z.string().optional(),
    name: z.string().optional(),
    full_address: z.string().optional(),
  }),
  z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      avatar_url: z.string().optional(),
    })
  ),
  z.array(z.string()),
  z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      en_name: z.string().optional(),
      email: z.string().optional(),
      avatar_url: z.string().optional(),
    })
  ),
  z.array(
    z.object({
      file_token: z.string().optional(),
      name: z.string().optional(),
      type: z.string().optional(),
      size: z.number().optional(),
      url: z.string().optional(),
      tmp_url: z.string().optional(),
    })
  ),
])

export const PersonSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  en_name: z.string().optional(),
  email: z.string().optional(),
  avatar_url: z.string().optional(),
})

export const BitableRecordSchema = z.object({
  record_id: z.string().optional(),
  fields: z.record(z.unknown()),
  created_by: PersonSchema.optional(),
  created_time: z.number().optional(),
  last_modified_by: PersonSchema.optional(),
  last_modified_time: z.number().optional(),
  shared_url: z.string().optional(),
  record_url: z.string().optional(),
})

export const CreateRecordResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      record: BitableRecordSchema.optional(),
    })
    .optional(),
})

export const GetRecordResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      record: BitableRecordSchema.optional(),
    })
    .optional(),
})

export const UpdateRecordResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      record: BitableRecordSchema.optional(),
    })
    .optional(),
})

export const DeleteRecordResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      deleted: z.boolean().optional(),
      record_id: z.string().optional(),
    })
    .optional(),
})

export const ListRecordsResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      has_more: z.boolean().optional(),
      page_token: z.string().optional(),
      total: z.number().optional(),
      items: z.array(BitableRecordSchema).optional(),
    })
    .optional(),
})

export const BitableFieldSchema = z.object({
  field_id: z.string().optional(),
  field_name: z.string().optional(),
  type: z.number().optional(),
  property: z.record(z.unknown()).nullable().optional(),
  description: z.string().nullable().optional(),
  is_primary: z.boolean().optional(),
  is_hidden: z.boolean().optional(),
  ui_type: z.string().optional(),
})

export const ListFieldsResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      has_more: z.boolean().optional(),
      page_token: z.string().optional(),
      total: z.number().optional(),
      items: z.array(BitableFieldSchema).optional(),
    })
    .optional(),
})

export const CreateFieldResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      field: BitableFieldSchema.optional(),
    })
    .optional(),
})

export const UpdateFieldResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      field: BitableFieldSchema.optional(),
    })
    .optional(),
})

export const DeleteFieldResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      field_id: z.string().optional(),
      deleted: z.boolean().optional(),
    })
    .optional(),
})

export const BatchCreateRecordsResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      records: z.array(BitableRecordSchema).optional(),
    })
    .optional(),
})

export const BatchUpdateRecordsResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      records: z.array(BitableRecordSchema).optional(),
    })
    .optional(),
})

export const BatchDeleteRecordsResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      records: z
        .array(
          z.object({
            deleted: z.boolean().optional(),
            record_id: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
})

export type FieldValue = z.infer<typeof FieldValueSchema>
export type Person = z.infer<typeof PersonSchema>
export type BitableRecord = z.infer<typeof BitableRecordSchema>
export type CreateRecordResponse = z.infer<typeof CreateRecordResponseSchema>
export type GetRecordResponse = z.infer<typeof GetRecordResponseSchema>
export type UpdateRecordResponse = z.infer<typeof UpdateRecordResponseSchema>
export type DeleteRecordResponse = z.infer<typeof DeleteRecordResponseSchema>
export type ListRecordsResponse = z.infer<typeof ListRecordsResponseSchema>
export type BitableField = z.infer<typeof BitableFieldSchema>
export type ListFieldsResponse = z.infer<typeof ListFieldsResponseSchema>
export type CreateFieldResponse = z.infer<typeof CreateFieldResponseSchema>
export type UpdateFieldResponse = z.infer<typeof UpdateFieldResponseSchema>
export type DeleteFieldResponse = z.infer<typeof DeleteFieldResponseSchema>
export type BatchCreateRecordsResponse = z.infer<typeof BatchCreateRecordsResponseSchema>
export type BatchUpdateRecordsResponse = z.infer<typeof BatchUpdateRecordsResponseSchema>
export type BatchDeleteRecordsResponse = z.infer<typeof BatchDeleteRecordsResponseSchema>

// Table schemas
export const BitableTableSchema = z.object({
  table_id: z.string().optional(),
  revision: z.number().optional(),
  name: z.string().optional(),
})

export const ListTablesResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      has_more: z.boolean().optional(),
      page_token: z.string().optional(),
      total: z.number().optional(),
      items: z.array(BitableTableSchema).optional(),
    })
    .optional(),
})

export const CreateTableResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z
    .object({
      table_id: z.string().optional(),
      default_view_id: z.string().optional(),
      field_id_list: z.array(z.string()).optional(),
    })
    .optional(),
})

export const DeleteTableResponseSchema = z.object({
  code: z.number().optional(),
  msg: z.string().optional(),
  data: z.object({}).optional(),
})

export type BitableTable = z.infer<typeof BitableTableSchema>
export type ListTablesResponse = z.infer<typeof ListTablesResponseSchema>
export type CreateTableResponse = z.infer<typeof CreateTableResponseSchema>
export type DeleteTableResponse = z.infer<typeof DeleteTableResponseSchema>
