export type ApiResponseStatus = {
  statusCode?: number
  errors?: unknown[]
}

export class ApiError extends Error {
  readonly status: number | undefined
  readonly details: unknown

  constructor(
    message: string,
    status?: number,
    cause?: unknown,
    details?: unknown,
  ) {
    super(message, { cause })
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}
