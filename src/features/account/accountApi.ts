import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'

const profileSchema = z.object({
  userId: z.string().min(1),
  userName: z.string(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  email: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  dob: z.string().nullish(),
})

const profileResponseSchema = z.object({ data: profileSchema.nullable() })
const profileClaimsSchema = z.object({ sid: z.uuid() })

export type AccountProfile = z.infer<typeof profileSchema>

export const getProfileUserId = (token: string): string | null => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const claims: unknown = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
    )
    const result = profileClaimsSchema.safeParse(claims)
    return result.success ? result.data.sid : null
  } catch {
    return null
  }
}

export const getAccountProfile = async (
  userId: string,
  signal: AbortSignal,
): Promise<AccountProfile | null> => {
  try {
    const response = await api.get<unknown>(
      '/UserProfile/get-user-profile-by-id',
      { params: { id: userId }, signal },
    )
    if (response.status === 204) return null
    const result = profileResponseSchema.safeParse(response.data)
    if (
      !result.success ||
      (result.data.data && result.data.data.userId !== userId)
    )
      throw new Error('Unable to read your profile. Please try again.')
    return result.data.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}
