import { api } from '@/shared/api/client'
import { z } from 'zod'
import { ApiError } from '@/shared/api/types'
import { createAuthSession } from '@/features/auth/authSession'
import type { LoginValues, RegisterValues } from '@/features/auth/authSchemas'

const accountResponseSchema = z.object({
  data: z.string(),
  errors: z.array(z.unknown()).length(0),
  statusCode: z.literal(200),
})

export const loginAccount = async (values: LoginValues) => {
  const response = await api.post<unknown>('/Account/login', values)
  const result = accountResponseSchema.safeParse(response.data)
  if (!result.success)
    throw new Error('Unable to read the sign-in response. Please try again.')
  return createAuthSession(result.data.data, values.userName)
}

export const registerAccount = async (values: RegisterValues) => {
  const response = await api.post<unknown>('/Account/register', values)
  const result = accountResponseSchema.safeParse(response.data)
  if (!result.success)
    throw new Error('Unable to confirm registration. Please try again.')
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
