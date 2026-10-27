import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { ApiError } from '@/shared/api/types'
import type { ApiResponseStatus } from '@/shared/api/types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://store-api.softclub.tj',
  timeout: 15000,
})

let getSessionToken: () => string | null = () => null
let clearSession: () => void = () => {}

export const configureApiSession = (
  getToken: () => string | null,
  onUnauthorized: () => void,
) => {
  getSessionToken = getToken
  clearSession = onUnauthorized
}

api.interceptors.request.use((config) => {
  const token = getSessionToken()
  if (
    token &&
    config.url !== '/Account/login' &&
    config.url !== '/Account/register'
  )
    config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

const handleUnauthorized = (
  status: number | undefined,
  authorization: unknown,
) => {
  const token = getSessionToken()
  if (status === 401 && token && authorization === `Bearer ${token}`)
    clearSession()
}

const getErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError<unknown>(error))
    return 'The request could not be completed. Please try again.'
  if (error.response?.status === 401) return 'Please sign in to continue.'
  if (error.response?.status === 403)
    return 'You do not have access to this action.'
  if (error.code === 'ECONNABORTED')
    return 'The request timed out. Please try again.'
  if (!error.response) return 'Unable to connect. Please try again.'
  return 'The request could not be completed. Please try again.'
}

api.interceptors.response.use(
  (response: AxiosResponse<unknown>) => {
    const body = response.data
    const status: ApiResponseStatus = {}
    if (typeof body === 'object' && body !== null) {
      if ('statusCode' in body && typeof body.statusCode === 'number')
        status.statusCode = body.statusCode
      if ('errors' in body && Array.isArray(body.errors))
        status.errors = body.errors
    }
    if (
      (status.statusCode !== undefined && status.statusCode >= 400) ||
      status.errors?.length
    ) {
      handleUnauthorized(
        status.statusCode,
        response.config.headers.get('Authorization'),
      )
      return Promise.reject(
        new ApiError(
          'The server could not complete the request.',
          status.statusCode,
          undefined,
          body,
        ),
      )
    }
    return response
  },
  (error: unknown) => {
    if (axios.isCancel(error)) return Promise.reject(error)
    const status = axios.isAxiosError<unknown>(error)
      ? error.response?.status
      : undefined
    if (axios.isAxiosError<unknown>(error))
      handleUnauthorized(status, error.config?.headers.get('Authorization'))
    return Promise.reject(
      new ApiError(
        getErrorMessage(error),
        status,
        error,
        axios.isAxiosError<unknown>(error) ? error.response?.data : undefined,
      ),
    )
  },
)
