import { api } from '@/shared/api/client'

export const getImageUrl = (
  filename: string | null | undefined,
): string | null => {
  if (!filename?.trim()) return null
  if (/^https?:\/\//i.test(filename)) return filename
  if (!api.defaults.baseURL) return null
  return new URL(
    `/images/${encodeURIComponent(filename)}`,
    api.defaults.baseURL,
  ).href
}
