import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchProducts } from '@/features/products/productsSlice'
import { hasValidDiscount } from '@/shared/productPrice'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/shared/components/ProductCard'
import RequestState from '@/shared/components/RequestState'

const FlashSales = () => {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((state) => state.products)
  const products = items.filter(hasValidDiscount).slice(0, 12)
  const rowRef = useRef<HTMLUListElement>(null)
  const rowId = useId()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    void dispatch(fetchProducts())
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

  return (
    <section
      aria-labelledby="flash-sales-title"
      className="mt-16 space-y-6 border-b pb-12 sm:mt-20 sm:pb-16"
    >
      <p className="flex items-center gap-4 text-sm font-semibold text-primary">
        <span className="h-10 w-5 rounded-sm bg-primary" aria-hidden="true" />
        Today's
      </p>
      <div className="flex items-end justify-between gap-4">
        <h2
          id="flash-sales-title"
          className="text-3xl font-semibold tracking-wide sm:text-4xl"
        >
          Flash Sales
        </h2>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="rounded-full"
            aria-label="Previous products"
            aria-controls={
              status === 'succeeded' && products.length > 0 ? rowId : undefined
            }
            disabled={!canScrollLeft}
            onClick={() => handleScroll(-1)}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="rounded-full"
            aria-label="Next products"
            aria-controls={
              status === 'succeeded' && products.length > 0 ? rowId : undefined
            }
            disabled={!canScrollRight}
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
            className="flex gap-5 overflow-hidden p-1 pb-4 sm:gap-7"
          >
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="w-[min(270px,80vw)] shrink-0 space-y-3 sm:w-[calc((100%_-_28px)/2)] lg:w-[calc((100%_-_84px)/4)]"
              >
                <Skeleton className="h-64 w-full" />
                <div className="h-12">
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
      {status === 'succeeded' && products.length > 0 && (
        <>
          <ul
            ref={rowRef}
            id={rowId}
            aria-label="Discounted products"
            tabIndex={0}
            className="flex snap-x snap-mandatory scroll-px-1 gap-5 overflow-x-auto overscroll-x-contain p-1 pb-4 focus-visible:outline-2 focus-visible:outline-primary [scrollbar-width:thin] sm:gap-7"
          >
            {products.map((product) => (
              <li
                key={product.id}
                className="w-[min(270px,80vw)] shrink-0 snap-start sm:w-[calc((100%_-_28px)/2)] lg:w-[calc((100%_-_84px)/4)]"
              >
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Cart and wishlist are not available yet.
          </p>
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
