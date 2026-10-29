const adminPaths = [
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
  if (!adminPaths.includes(path.split('?')[0] || '')) return '/products'
  return path
}
