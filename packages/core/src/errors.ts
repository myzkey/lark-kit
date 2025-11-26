export class LarkApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown
  ) {
    super(message)
    this.name = 'LarkApiError'
  }
}

export class LarkAuthError extends Error {
  constructor(
    message: string,
    public readonly code?: number
  ) {
    super(message)
    this.name = 'LarkAuthError'
  }
}

export class LarkValidationError extends Error {
  constructor(
    message: string,
    public readonly errors?: unknown
  ) {
    super(message)
    this.name = 'LarkValidationError'
  }
}
