import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'
import type { LoginValues, RegisterValues } from '@/features/auth/authSchemas'

export const loginAccount = async (values: LoginValues) => {
  await api.post<unknown>('/Account/login', values)
  throw new Error(
    'The sign-in response format has not been verified. You are not signed in.',
  )
}

export const registerAccount = async (values: RegisterValues) => {
  await api.post<unknown>('/Account/register', values)
}

export const getAuthErrors = (error: unknown) => {
  const fields: Record<string, string> = {}
  let message =
    error instanceof Error
      ? error.message
      : 'Unable to complete this request. Please try again.'
  const body = error instanceof ApiError ? error.details : undefined
  if (typeof body === 'object' && body !== null && 'errors' in body) {
    const errors = body.errors
    if (Array.isArray(errors)) {
      const messages = errors.filter(
        (item): item is string => typeof item === 'string',
      )
      if (messages.length) message = messages.join(' ')
    } else if (typeof errors === 'object' && errors !== null) {
      for (const [key, value] of Object.entries(errors)) {
        const text = Array.isArray(value)
          ? value
              .filter((item): item is string => typeof item === 'string')
              .join(' ')
          : typeof value === 'string'
            ? value
            : ''
        if (text) fields[key.charAt(0).toLowerCase() + key.slice(1)] = text
      }
    }
  }
  return { message, fields }
}
