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
  const defaultMessage = message
  const body = error instanceof ApiError ? error.details : undefined
  if (typeof body === 'string' && body.trim() && !body.trim().startsWith('<'))
    message = body.trim()
  if (typeof body === 'object' && body !== null) {
    const errors = 'errors' in body ? body.errors : undefined
    const readMessage = (value: unknown): string => {
      if (typeof value === 'string') return value
      if (
        typeof value === 'object' &&
        value !== null &&
        'description' in value &&
        typeof value.description === 'string'
      )
        return value.description
      return ''
    }
    if (Array.isArray(errors)) {
      const messages = errors.map(readMessage).filter(Boolean)
      if (messages.length) message = messages.join(' ')
    } else if (typeof errors === 'object' && errors !== null) {
      const messages: string[] = []
      for (const [key, value] of Object.entries(errors)) {
        const text = Array.isArray(value)
          ? value.map(readMessage).filter(Boolean).join(' ')
          : readMessage(value)
        if (text) {
          fields[key.charAt(0).toLowerCase() + key.slice(1)] = text
          messages.push(text)
        }
      }
      if (messages.length) message = messages.join(' ')
    } else if (typeof errors === 'string' && errors) message = errors
    if (message === defaultMessage) {
      for (const value of [
        'message' in body ? body.message : undefined,
        'detail' in body ? body.detail : undefined,
        'title' in body ? body.title : undefined,
      ]) {
        if (typeof value === 'string' && value.trim()) {
          message = value.trim()
          break
        }
      }
    }
  }
  if (error instanceof ApiError && error.status && message === error.message)
    message = `${message} (HTTP ${error.status})`
  return { message, fields }
}
