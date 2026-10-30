import { z } from 'zod'

const storageKey = 'fastcart-admin-banner-preview'
const draftSchema = z.object({
  sliderTitle: z.string(),
  sliderSubtitle: z.string(),
  bannerTitle: z.string(),
  categoryId: z.number().int().positive().max(2147483647).nullable(),
  endsAt: z.iso.datetime({ offset: true }).nullable(),
})
export type BannerDraft = z.infer<typeof draftSchema>
export const emptyBannerDraft: BannerDraft = {
  sliderTitle: '',
  sliderSubtitle: '',
  bannerTitle: '',
  categoryId: null,
  endsAt: null,
}

export const readBannerDraft = (): BannerDraft => {
  try {
    const parsed = draftSchema.safeParse(
      JSON.parse(localStorage.getItem(storageKey) || 'null'),
    )
    if (parsed.success) return parsed.data
  } catch {
    return { ...emptyBannerDraft }
  }
  return { ...emptyBannerDraft }
}
export const saveBannerDraft = (draft: BannerDraft) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(draftSchema.parse(draft)))
    return true
  } catch {
    return false
  }
}
export const toBannerDateInput = (iso: string | null) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (!Number.isFinite(date.getTime())) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${String(date.getFullYear()).padStart(4, '0')}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
export const parseBannerEndDate = (value: string): string | null => {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return null
  const iso = date.toISOString()
  return toBannerDateInput(iso) === value ? iso : null
}
export const getBannerCountdown = (iso: string | null, now = Date.now()) => {
  if (!iso || !Number.isFinite(Date.parse(iso))) return null
  const seconds = Math.max(0, Math.ceil((Date.parse(iso) - now) / 1000))
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  }
}
