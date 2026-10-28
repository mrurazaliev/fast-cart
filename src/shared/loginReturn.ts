export const getLoginReturnPath = (state: unknown): string => {
  if (typeof state !== 'object' || state === null || !('returnTo' in state))
    return '/'
  const path = state.returnTo
  if (
    typeof path !== 'string' ||
    !path.startsWith('/') ||
    path.startsWith('//')
  )
    return '/'
  try {
    const decoded = decodeURIComponent(path)
    if (
      decoded.startsWith('//') ||
      decoded.includes('\\') ||
      [...decoded].some(
        (character) =>
          character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
      )
    )
      return '/'
    const url = new URL(path, 'https://fastcart.local')
    const pathname = decodeURIComponent(url.pathname)
      .toLowerCase()
      .replace(/\/+$/, '')
    if (pathname === '/login' || pathname === '/register') return '/'
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return '/'
  }
}
