import { api } from '@/shared/api/client'

export const getImageUrl = (filename: string | null): string | null => {
  if (!filename?.trim()) return null
  if (/^https?:\/\//i.test(filename)) return filename
  const baseURL = api.defaults.baseURL
  if (!baseURL) return null
  return new URL(`/images/${encodeURIComponent(filename)}`, baseURL).href
}
