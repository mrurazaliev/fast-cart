import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchProducts } from '@/features/products/productsSlice'
import { hasValidDiscount } from '@/shared/productPrice'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/shared/components/ProductCard'
import RequestState from '@/shared/components/RequestState'
import FlashSaleCountdown from './FlashSaleCountdown'

const carouselLayout =
  'grid auto-cols-[82%] grid-flow-col gap-6 sm:auto-cols-[calc((100%_-_24px)/2)] lg:auto-cols-[calc((100%_-_72px)/4)]'

const FlashSales = () => {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((state) => state.products)
  const products = items.filter(hasValidDiscount).slice(0, 12)
  const rowRef = useRef<HTMLUListElement>(null)
  const rowId = useId()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [visibleFraction, setVisibleFraction] = useState(1)
  const ready = status === 'succeeded' && products.length > 0

  useEffect(() => {
    void dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const updateScroll = () => {
      const distance = row.scrollWidth - row.clientWidth
      setCanScrollLeft(row.scrollLeft > 1)
      setCanScrollRight(row.scrollLeft < distance - 1)
      setScrollPosition(
        distance > 0 ? Math.min(1, Math.max(0, row.scrollLeft / distance)) : 0,
      )
      setVisibleFraction(Math.min(1, row.clientWidth / row.scrollWidth))
    }
    updateScroll()
    const observer = new ResizeObserver(updateScroll)
    observer.observe(row)
    row.addEventListener('scroll', updateScroll)
    return () => {
      observer.disconnect()
      row.removeEventListener('scroll', updateScroll)
    }
  }, [status, products.length])

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

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      handleScroll(event.key === 'ArrowRight' ? 1 : -1)
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      event.currentTarget.scrollTo({
        left: event.key === 'Home' ? 0 : event.currentTarget.scrollWidth,
        behavior: 'instant',
      })
    }
  }

  return (
    <section
      aria-labelledby="flash-sales-title"
      className="mt-16 scroll-mt-40 space-y-6 border-b pb-12 sm:mt-20 sm:pb-16 lg:scroll-mt-28"
    >
      <p className="flex items-center gap-4 text-sm font-semibold text-primary">
        <span className="h-10 w-5 rounded-sm bg-primary" aria-hidden="true" />
        Today's
      </p>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-12">
        <h2
          id="flash-sales-title"
          className="text-2xl font-semibold tracking-wide min-[360px]:text-3xl sm:text-4xl"
        >
          Flash Sales
        </h2>
        <div className="col-span-2 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
          <FlashSaleCountdown />
        </div>
        <div className="col-start-2 row-start-1 flex shrink-0 gap-2 lg:col-start-3">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-11 rounded-full"
            aria-label="Previous products"
            aria-controls={ready ? rowId : undefined}
            disabled={!ready || !canScrollLeft}
            onClick={() => handleScroll(-1)}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-11 rounded-full"
            aria-label="Next products"
            aria-controls={ready ? rowId : undefined}
            disabled={!ready || !canScrollRight}
            onClick={() => handleScroll(1)}
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
      {(status === 'idle' || status === 'pending') && (
        <div role="status" aria-busy="true">
          <span className="sr-only">Loading products…</span>
          <div
            aria-hidden="true"
            className={`${carouselLayout} overflow-hidden p-1 pb-4`}
          >
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="min-w-0 space-y-3">
                <Skeleton className="h-56 w-full rounded-md sm:h-60" />
                <div className="h-10 sm:h-12">
                  <Skeleton className="h-5 w-4/5" />
                </div>
                <Skeleton className="h-6 w-2/5" />
              </div>
            ))}
          </div>
        </div>
      )}
      <RequestState
        error={error}
        onRetry={() => {
          void dispatch(fetchProducts())
        }}
      />
      {status === 'succeeded' && products.length === 0 && (
        <p role="status" className="py-8 text-muted-foreground">
          No discounted products in this selection.
        </p>
      )}
      {ready && (
        <>
          <ul
            ref={rowRef}
            id={rowId}
            aria-label="Discounted products"
            aria-describedby={`${rowId}-instructions`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={`${carouselLayout} snap-x snap-mandatory scroll-px-1 overflow-x-auto overscroll-x-contain rounded-md p-1 pb-4 focus-visible:outline-2 focus-visible:outline-primary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
          >
            {products.map((product) => (
              <li key={product.id} className="min-w-0 snap-start">
                <ProductCard product={product} carousel />
              </li>
            ))}
          </ul>
          <p id={`${rowId}-instructions`} className="sr-only">
            Swipe or use the previous and next buttons to browse. When the list
            is focused, use the arrow keys, Home or End.
          </p>
          <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>{products.length} discounted products in this selection</span>
            {visibleFraction < 1 && (
              <div
                aria-hidden="true"
                className="h-1 w-24 shrink-0 overflow-hidden rounded-full bg-secondary sm:w-32"
              >
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{
                    width: `${visibleFraction * 100}%`,
                    marginLeft: `${scrollPosition * (1 - visibleFraction) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
      <div className="pt-2 text-center">
        <Button asChild className="h-12 rounded-sm px-10">
          <Link to="/products">View All Products</Link>
        </Button>
      </div>
    </section>
  )
}

export default FlashSales
