export type ApiResponseStatus = {
  statusCode?: number
  errors?: unknown[]
}

export class ApiError extends Error {
  readonly status: number | undefined

  constructor(message: string, status?: number, cause?: unknown) {
    super(message, { cause })
    this.name = 'ApiError'
    this.status = status
  }
}
