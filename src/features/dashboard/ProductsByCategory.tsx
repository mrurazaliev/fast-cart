import { useEffect } from 'react'
import { ChartNoAxesColumnIncreasing, RefreshCw } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCategoryCounts } from './categoryCountsSlice'
import { Button } from '@/components/ui/button'
import RequestState from '@/shared/components/RequestState'

const ProductsByCategory = () => {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.auth.session)
  const { items, status, error, updatedAt } = useAppSelector(
    (state) => state.categoryCounts,
  )
  const loading = status === 'idle' || status === 'pending'
  const maximum = Math.max(1, ...items.map((item) => item.count))

  useEffect(() => {
    const request = dispatch(fetchCategoryCounts())
    return () => request.abort()
  }, [dispatch, session])

  return (
    <section
      aria-labelledby="category-chart-heading"
      aria-busy={loading}
      className="flex min-h-[326px] min-w-0 flex-col rounded-[3px] border border-[#e6e6ec] p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="category-chart-heading"
          className="text-base leading-6 font-semibold"
        >
          Products by category
        </h2>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => void dispatch(fetchCategoryCounts())}
        >
          <RefreshCw
            aria-hidden="true"
            className={`size-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>
      <p
        id="category-chart-note"
        className="mt-2 text-xs leading-5 text-muted-foreground"
      >
        Catalog product counts across all pages. These are not sales or units in
        stock.
      </p>
      <div className="mt-5 min-w-0 flex-1">
        {loading && <RequestState loading />}
        <RequestState
          error={error}
          onRetry={() => void dispatch(fetchCategoryCounts())}
        />
        {status === 'succeeded' && items.length === 0 && (
          <div role="status" className="py-10 text-center">
            <ChartNoAxesColumnIncreasing
              aria-hidden="true"
              className="mx-auto mb-3 size-8 text-primary/40"
            />
            <p className="text-sm text-muted-foreground">
              No categories available.
            </p>
          </div>
        )}
        {status === 'succeeded' && items.length > 0 && (
          <>
            {items.every((item) => item.count === 0) && (
              <p role="status" className="mb-4 text-sm text-muted-foreground">
                No products in these categories yet.
              </p>
            )}
            <dl
              aria-label="Product counts by category"
              aria-describedby="category-chart-note"
              className="max-h-80 space-y-4 overflow-y-auto pr-2"
            >
              {items.map((item) => (
                <div key={item.id} className="min-w-0">
                  <div className="mb-1.5 flex justify-between gap-4 text-sm">
                    <dt className="min-w-0 break-words">
                      {item.name || `Category #${item.id}`}
                    </dt>
                    <dd className="shrink-0 font-medium tabular-nums">
                      {item.count.toLocaleString()}
                    </dd>
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-3 overflow-hidden rounded-sm bg-secondary"
                  >
                    <div
                      className="h-full rounded-sm bg-primary"
                      style={{ width: `${(item.count / maximum) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
      {updatedAt && (
        <p className="mt-4 text-xs text-muted-foreground">
          Updated {new Date(updatedAt).toLocaleTimeString()}
        </p>
      )}
    </section>
  )
}

export default ProductsByCategory
