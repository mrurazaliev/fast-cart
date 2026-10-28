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

export type CartQuantityIntent = { productId: number; quantity: number }

export const getCartQuantityIntent = (
  state: unknown,
  productId?: number,
): CartQuantityIntent | null => {
  if (
    typeof state !== 'object' ||
    state === null ||
    !('cartQuantity' in state) ||
    typeof state.cartQuantity !== 'object' ||
    state.cartQuantity === null
  )
    return null
  const intent = state.cartQuantity
  if (
    !('productId' in intent) ||
    !('quantity' in intent) ||
    typeof intent.productId !== 'number' ||
    typeof intent.quantity !== 'number' ||
    !Number.isSafeInteger(intent.productId) ||
    !Number.isSafeInteger(intent.quantity) ||
    intent.productId < 1 ||
    intent.productId > 2147483647 ||
    intent.quantity < 1 ||
    intent.quantity > 2147483647 ||
    (productId !== undefined && intent.productId !== productId)
  )
    return null
  return { productId: intent.productId, quantity: intent.quantity }
}
