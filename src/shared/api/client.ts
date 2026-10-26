import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { ApiError } from '@/shared/api/types'
import type { ApiResponseStatus } from '@/shared/api/types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://store-api.softclub.tj',
  timeout: 15000,
})

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
      return Promise.reject(
        new ApiError(
          'The server could not complete the request.',
          status.statusCode,
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
    return Promise.reject(new ApiError(getErrorMessage(error), status, error))
  },
)
