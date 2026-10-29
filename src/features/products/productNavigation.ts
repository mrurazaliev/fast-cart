export const getProductsReturnPath = (state: unknown): string => {
  if (
    typeof state !== 'object' ||
    state === null ||
    !('returnTo' in state) ||
    typeof state.returnTo !== 'string'
  )
    return '/products'
  const path = state.returnTo
  return path === '/products' || path.startsWith('/products?')
    ? path
    : '/products'
}
