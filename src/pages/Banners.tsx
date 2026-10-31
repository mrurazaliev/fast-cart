import { useText } from '@/shared/i18n/useText'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import OtherTabs from '@/shared/components/admin/OtherTabs'
import RequestState from '@/shared/components/RequestState'
import { fetchCategories } from '@/features/categories/categoriesSlice'
import BannerImages from '@/features/banners/BannerImages'
import type { BannerPreviewImage } from '@/features/banners/BannerImages'
import BannerCountdown from '@/features/banners/BannerCountdown'
import {
  parseBannerEndDate,
  readBannerDraft,
  saveBannerDraft,
  toBannerDateInput,
} from '@/features/banners/bannerDraft'
import type { BannerDraft } from '@/features/banners/bannerDraft'

const Banners = () => {
  const { t } = useText()

  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.categories)
  const [draft, setDraft] = useState(readBannerDraft)
  const [sliders, setSliders] = useState<BannerPreviewImage[]>([])
  const [banner, setBanner] = useState<BannerPreviewImage[]>([])
  const [slide, setSlide] = useState(0)
  const [storageError, setStorageError] = useState(false)
  const [dateError, setDateError] = useState<string | null>(null)
  const category = categories.items.find((item) => item.id === draft.categoryId)
  const currentSlide = sliders[slide % Math.max(1, sliders.length)]
  useEffect(() => {
    const request = dispatch(fetchCategories())
    return () => request.abort()
  }, [dispatch])
  const handleDraft = (values: Partial<BannerDraft>) => {
    const next = { ...draft, ...values }
    setDraft(next)
    setStorageError(!saveBannerDraft(next))
  }
  const handleEndDate = (value: string) => {
    const endsAt = value ? parseBannerEndDate(value) : null
    if (value && !endsAt) {
      setDateError('Choose a valid end date and time.')
      return
    }
    setDateError(null)
    handleDraft({ endsAt })
  }
  return (
    <section aria-labelledby="banners-heading" className="space-y-6">
      <h1 id="banners-heading" className="text-2xl font-semibold">
        {t('Banners')}
      </h1>
      <OtherTabs />
      <div
        id="banner-save-unavailable"
        role="status"
        className="space-y-2 rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm"
      >
        <p className="font-medium">
          {t(
            'Server saving is unavailable: the API does not provide banner management.',
          )}
        </p>
        <p>
          {t(
            'This local preview does not change the marketplace. Text and the fixed end date stay in this browser; images must be selected again after reload.',
          )}
        </p>
      </div>
      {storageError && (
        <p role="alert" className="text-sm text-destructive">
          {t(
            'Local settings could not be stored. Changes will be lost on reload.',
          )}
        </p>
      )}
      <div className="grid items-start gap-8 xl:grid-cols-2">
        <section
          aria-labelledby="sliders-heading"
          className="min-w-0 space-y-4"
        >
          <h2 id="sliders-heading" className="text-xl font-semibold">
            {t('Main sliders')}
          </h2>
          <BannerImages
            label={t('Main slider images')}
            multiple
            onChange={setSliders}
          />
          <div className="space-y-4 rounded-sm border p-5">
            <div className="space-y-2">
              <label htmlFor="sliderSubtitle" className="text-sm font-medium">
                {t('Subtitle')}
              </label>
              <Input
                id="sliderSubtitle"
                value={draft.sliderSubtitle}
                onChange={(event) =>
                  handleDraft({ sliderSubtitle: event.target.value })
                }
                className="h-12 rounded-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="sliderTitle" className="text-sm font-medium">
                {t('Title')}
              </label>
              <Input
                id="sliderTitle"
                value={draft.sliderTitle}
                onChange={(event) =>
                  handleDraft({ sliderTitle: event.target.value })
                }
                className="h-12 rounded-sm"
              />
            </div>
            <div className="flex justify-end">
              <Button disabled aria-describedby="banner-save-unavailable">
                {t('Save')}
              </Button>
            </div>
          </div>
          <div className="space-y-4 rounded-sm border p-5">
            <h3 className="font-medium">{t('Local slider preview')}</h3>
            {currentSlide ? (
              <div className="space-y-3 rounded-sm bg-admin-surface p-5 text-white">
                <img
                  src={currentSlide.url}
                  alt={currentSlide.name}
                  className="aspect-[9/4] w-full object-contain"
                />
                <p className="break-words text-sm">{draft.sliderSubtitle}</p>
                <p className="break-words text-xl font-semibold">
                  {draft.sliderTitle || t('Add a title to preview')}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('Choose slider images to see a preview.')}
              </p>
            )}
            {sliders.length > 1 && (
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    setSlide(
                      (value) => (value + sliders.length - 1) % sliders.length,
                    )
                  }
                >
                  {t('Previous slide')}
                </Button>
                <span className="text-sm">
                  {(slide % sliders.length) + 1} / {sliders.length}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setSlide((value) => (value + 1) % sliders.length)
                  }
                >
                  {t('Next slide')}
                </Button>
              </div>
            )}
          </div>
        </section>
        <section aria-labelledby="banner-heading" className="min-w-0 space-y-4">
          <h2 id="banner-heading" className="text-xl font-semibold">
            {t('Banner')}
          </h2>
          <BannerImages
            label={t('Banner image')}
            multiple={false}
            onChange={setBanner}
          />
          <div className="space-y-4 rounded-sm border p-5">
            {(categories.status === 'idle' ||
              categories.status === 'pending') && <RequestState loading />}
            {categories.status === 'failed' && (
              <RequestState
                error={categories.error}
                onRetry={() => void dispatch(fetchCategories())}
              />
            )}
            <div className="space-y-2">
              <label htmlFor="bannerCategory" className="text-sm font-medium">
                {t('Category')}
              </label>
              <select
                id="bannerCategory"
                value={category ? category.id : ''}
                disabled={categories.status !== 'succeeded'}
                onChange={(event) =>
                  handleDraft({
                    categoryId: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                className="h-12 w-full min-w-0 rounded-sm border bg-background px-3 text-sm"
              >
                <option value="">{t('Choose a category')}</option>
                {categories.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
              {categories.status === 'succeeded' &&
                !categories.items.length && (
                  <p className="text-sm text-muted-foreground">
                    {t('No categories are available.')}
                  </p>
                )}
              {categories.status === 'succeeded' &&
                draft.categoryId !== null &&
                !category && (
                  <p role="alert" className="text-sm text-destructive">
                    {t('The selected category is no longer available.')}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <label htmlFor="bannerEndsAt" className="text-sm font-medium">
                {t('End date and time (local time)')}
              </label>
              <Input
                id="bannerEndsAt"
                type="datetime-local"
                value={toBannerDateInput(draft.endsAt)}
                onChange={(event) => handleEndDate(event.target.value)}
                aria-invalid={!!dateError}
                aria-describedby={dateError ? 'banner-date-error' : undefined}
                className="h-12 rounded-sm"
              />
              {dateError && (
                <p
                  id="banner-date-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {t(dateError || '')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="bannerTitle" className="text-sm font-medium">
                {t('Title')}
              </label>
              <Input
                id="bannerTitle"
                value={draft.bannerTitle}
                onChange={(event) =>
                  handleDraft({ bannerTitle: event.target.value })
                }
                className="h-12 rounded-sm"
              />
            </div>
            <div className="flex justify-end">
              <Button disabled aria-describedby="banner-save-unavailable">
                {t('Save')}
              </Button>
            </div>
          </div>
          <div className="space-y-4 rounded-sm border p-5">
            <h3 className="font-medium">{t('Local banner preview')}</h3>
            <div className="space-y-4 rounded-sm bg-admin-surface p-5 text-white">
              {banner[0] ? (
                <img
                  src={banner[0].url}
                  alt={banner[0].name}
                  className="aspect-[9/4] w-full object-contain"
                />
              ) : (
                <p className="text-sm">
                  {t('Choose an image to preview the banner.')}
                </p>
              )}
              <p className="text-sm">
                {category?.categoryName ||
                  (draft.categoryId === null
                    ? 'No category selected'
                    : 'Category unavailable')}
              </p>
              <p className="break-words text-xl font-semibold">
                {draft.bannerTitle || t('Add a title to preview')}
              </p>
              <BannerCountdown endsAt={draft.endsAt} />
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
export default Banners
