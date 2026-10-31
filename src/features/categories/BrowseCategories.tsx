import { useText } from '@/shared/i18n/useText'
import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCategories } from '@/features/categories/categoriesSlice'
import CategoryTile from '@/features/categories/CategoryTile'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import RequestState from '@/shared/components/RequestState'
import SectionHeading from '@/shared/components/home/SectionHeading'

const BrowseCategories = () => {
  const { t } = useText()

  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((state) => state.categories)
  const rowRef = useRef<HTMLUListElement>(null)
  const rowId = useId()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const loading = status === 'idle' || status === 'pending'
  const hasCategories = status === 'succeeded' && items.length > 0

  useEffect(() => {
    void dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const updateScroll = () => {
      setCanScrollLeft(row.scrollLeft > 1)
      setCanScrollRight(row.scrollLeft + row.clientWidth < row.scrollWidth - 1)
    }
    updateScroll()
    const observer = new ResizeObserver(updateScroll)
    observer.observe(row)
    row.addEventListener('scroll', updateScroll)
    return () => {
      observer.disconnect()
      row.removeEventListener('scroll', updateScroll)
    }
  }, [status, items.length])

  const handleScroll = (direction: number) => {
    const row = rowRef.current
    if (!row) return
    row.scrollBy({
      left: direction * row.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }

  return (
    <section
      aria-labelledby="browse-categories-title"
      className="mt-12 space-y-8 border-b pb-12 sm:mt-16 sm:pb-16"
    >
      <SectionHeading
        id="browse-categories-title"
        label={t('Categories')}
        title={t('Browse By Category')}
      >
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="rounded-full"
            aria-label={t('Previous categories')}
            aria-controls={hasCategories ? rowId : undefined}
            disabled={!hasCategories || !canScrollLeft}
            onClick={() => handleScroll(-1)}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="rounded-full"
            aria-label={t('Next categories')}
            aria-controls={hasCategories ? rowId : undefined}
            disabled={!hasCategories || !canScrollRight}
            onClick={() => handleScroll(1)}
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </SectionHeading>
      {loading && (
        <div role="status" aria-busy="true" className="relative">
          <span className="sr-only">{t('Loading categories…')}</span>
          <div
            aria-hidden="true"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-36" />
            ))}
          </div>
        </div>
      )}
      <RequestState
        error={error}
        onRetry={() => {
          void dispatch(fetchCategories())
        }}
      />
      {status === 'succeeded' && items.length === 0 && (
        <p role="status" className="py-6 text-muted-foreground">
          {t('No categories available yet.')}
        </p>
      )}
      {hasCategories && (
        <ul
          ref={rowRef}
          id={rowId}
          aria-label={t('Browse categories')}
          tabIndex={0}
          className="flex snap-x snap-mandatory scroll-px-1 gap-4 overflow-x-auto overscroll-x-contain p-1 pb-4 focus-visible:outline-2 focus-visible:outline-primary [scrollbar-width:thin] sm:gap-6"
        >
          {items.map((category) => (
            <li
              key={category.id}
              className="w-36 shrink-0 snap-start sm:w-[calc((100%_-_48px)/3)] lg:w-[calc((100%_-_120px)/6)]"
            >
              <CategoryTile category={category} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default BrowseCategories
