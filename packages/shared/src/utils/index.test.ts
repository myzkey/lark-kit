import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { parseResponse, LarkValidationError } from './index'

describe('parseResponse', () => {
  const TestSchema = z.object({
    code: z.number(),
    data: z.object({
      id: z.string(),
      name: z.string(),
    }),
  })

  it('should parse valid response', () => {
    const data = {
      code: 0,
      data: { id: '123', name: 'Test' },
    }

    const result = parseResponse(TestSchema, data)

    expect(result).toEqual(data)
  })

  it('should throw LarkValidationError on invalid response', () => {
    const data = {
      code: 0,
      data: { id: 123, name: 'Test' }, // id should be string
    }

    expect(() => parseResponse(TestSchema, data)).toThrow(LarkValidationError)
  })

  it('should include error details in LarkValidationError', () => {
    const data = {
      code: 'not a number',
      data: { id: '123' }, // missing name
    }

    try {
      parseResponse(TestSchema, data)
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(LarkValidationError)
      expect((error as LarkValidationError).errors).toBeDefined()
    }
  })

  it('should work with optional fields', () => {
    const OptionalSchema = z.object({
      code: z.number(),
      msg: z.string().optional(),
    })

    const data = { code: 0 }
    const result = parseResponse(OptionalSchema, data)

    expect(result).toEqual({ code: 0 })
  })
})
