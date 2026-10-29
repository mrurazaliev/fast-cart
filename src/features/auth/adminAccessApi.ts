import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'

const claimsSchema = z.object({ sid: z.uuid() })
const profileSchema = z.object({
  data: z.object({
    userId: z.uuid(),
    userRoles: z.array(z.object({ name: z.string().min(1) })),
  }),
})

export const getAdminAccess = async (
  token: string,
  signal: AbortSignal,
): Promise<'allowed' | 'denied'> => {
  let userId: string
  try {
    const payload = token.split('.')[1]
    if (!payload) throw new Error()
    const claims: unknown = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
    )
    userId = claimsSchema.parse(claims).sid
  } catch {
    throw new Error(
      'Unable to identify this session. Please sign out and try again.',
    )
  }

  try {
    const response = await api.get<unknown>(
      '/UserProfile/get-user-profile-by-id',
      { params: { id: userId }, signal },
    )
    const result = profileSchema.safeParse(response.data)
    if (!result.success || result.data.data.userId !== userId)
      throw new Error('Unable to confirm admin access. Please try again.')
    return result.data.data.userRoles.some(
      (role) => role.name.toLowerCase() === 'admin',
    )
      ? 'allowed'
      : 'denied'
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) return 'denied'
    throw error
  }
}
