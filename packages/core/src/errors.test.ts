import { describe, expect, it } from 'vitest'
import { LarkApiError, LarkAuthError, LarkValidationError } from './errors'

describe('LarkApiError', () => {
  it('should create error with message and status', () => {
    const error = new LarkApiError('Request failed', 401)

    expect(error.message).toBe('Request failed')
    expect(error.status).toBe(401)
    expect(error.name).toBe('LarkApiError')
    expect(error).toBeInstanceOf(Error)
  })

  it('should include optional data', () => {
    const data = { code: 99991663, msg: 'token invalid' }
    const error = new LarkApiError('Request failed', 401, data)

    expect(error.data).toEqual(data)
  })
})

describe('LarkAuthError', () => {
  it('should create error with message', () => {
    const error = new LarkAuthError('Authentication failed')

    expect(error.message).toBe('Authentication failed')
    expect(error.name).toBe('LarkAuthError')
    expect(error).toBeInstanceOf(Error)
  })

  it('should include optional code', () => {
    const error = new LarkAuthError('Token expired', 99991664)

    expect(error.code).toBe(99991664)
  })
})

describe('LarkValidationError', () => {
  it('should create error with message', () => {
    const error = new LarkValidationError('Validation failed')

    expect(error.message).toBe('Validation failed')
    expect(error.name).toBe('LarkValidationError')
    expect(error).toBeInstanceOf(Error)
  })

  it('should include optional errors', () => {
    const errors = [{ path: ['field'], message: 'Required' }]
    const error = new LarkValidationError('Validation failed', errors)

    expect(error.errors).toEqual(errors)
  })
})
