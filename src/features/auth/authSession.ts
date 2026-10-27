import { z } from 'zod'

const sessionKey = 'fastcart-session'
const sessionSchema = z.object({
  token: z.string().min(1),
  userName: z.string().min(1),
})
const claimsSchema = z.object({ exp: z.number().finite().optional() })

export type AuthSession = z.infer<typeof sessionSchema> & {
  expiresAt: number | null
}

export const createAuthSession = (
  token: string,
  userName: string,
): AuthSession => {
  const parts = token.split('.')
  if (parts.length !== 3 || !parts[1])
    throw new Error('The server returned an invalid session token.')
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const claims = claimsSchema.parse(JSON.parse(atob(payload)))
    const expiresAt = claims.exp === undefined ? null : claims.exp * 1000
    if (expiresAt !== null && expiresAt <= Date.now())
      throw new Error('This session has expired. Please sign in again.')
    return { token, userName, expiresAt }
  } catch {
    throw new Error('The session is invalid or expired. Please sign in again.')
  }
}

export const readAuthSession = (): AuthSession | null => {
  try {
    const result = sessionSchema.safeParse(
      JSON.parse(sessionStorage.getItem(sessionKey) || 'null'),
    )
    if (!result.success) return null
    return createAuthSession(result.data.token, result.data.userName)
  } catch {
    return null
  }
}

export const saveAuthSession = (session: AuthSession | null) => {
  try {
    if (session)
      sessionStorage.setItem(
        sessionKey,
        JSON.stringify({ token: session.token, userName: session.userName }),
      )
    else sessionStorage.removeItem(sessionKey)
  } catch {
    return
  }
}
