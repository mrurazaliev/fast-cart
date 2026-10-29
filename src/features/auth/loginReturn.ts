const adminPaths = [
  '/dashboard',
  '/orders',
  '/products',
  '/categories',
  '/subcategories',
  '/brands',
  '/colors',
]

export const getAdminReturnPath = (state: unknown): string => {
  if (
    typeof state !== 'object' ||
    state === null ||
    !('returnTo' in state) ||
    typeof state.returnTo !== 'string'
  )
    return '/products'
  const path = state.returnTo
  if (path.split('?')[0] === '/products/new') return path
  const edit = path.split('?')[0]?.match(/^\/products\/([1-9]\d*)\/edit$/)
  if (edit && Number(edit[1]) <= 2147483647) return path
  if (!adminPaths.includes(path.split('?')[0] || '')) return '/products'
  return path
}
