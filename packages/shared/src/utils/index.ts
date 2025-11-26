import type { ZodSchema } from 'zod'

export class LarkValidationError extends Error {
  constructor(
    message: string,
    public readonly errors?: unknown
  ) {
    super(message)
    this.name = 'LarkValidationError'
  }
}

export function parseResponse<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new LarkValidationError(
      `Response validation failed: ${result.error.message}`,
      result.error.errors
    )
  }
  return result.data
}
