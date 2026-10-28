import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchRelatedProducts } from '@/features/products/relatedProductsSlice'
import ProductCard from '@/shared/components/ProductCard'
import RequestState from '@/shared/components/RequestState'
import { Skeleton } from '@/components/ui/skeleton'

const RelatedItems = ({
  productId,
  subcategoryId,
}: {
  productId: number
  subcategoryId?: number | null
}) => {
  const dispatch = useAppDispatch()
  const related = useAppSelector((state) => state.relatedProducts)
  const current =
    related.productId === productId && related.subcategoryId === subcategoryId
  const loading =
    !!subcategoryId &&
    (!current || related.status === 'idle' || related.status === 'pending')

  useEffect(() => {
    if (!subcategoryId) return
    const request = dispatch(fetchRelatedProducts({ productId, subcategoryId }))
    return () => request.abort()
  }, [dispatch, productId, subcategoryId])

  return (
    <section
      aria-labelledby="related-items-heading"
      className="mt-14 space-y-8 sm:mt-20"
    >
      <h2
        id="related-items-heading"
        className="flex items-center gap-4 text-lg font-semibold text-primary"
      >
        <span className="h-10 w-5 rounded-sm bg-primary" aria-hidden="true" />
        Related Items
      </h2>
      {loading && (
        <div role="status">
          <span className="sr-only">Loading related products</span>
          <div
            aria-hidden="true"
            className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-64" />
                <Skeleton className="h-12" />
              </div>
            ))}
          </div>
        </div>
      )}
      {subcategoryId && current && (
        <RequestState
          error={related.error}
          onRetry={() =>
            void dispatch(fetchRelatedProducts({ productId, subcategoryId }))
          }
        />
      )}
      {!subcategoryId && (
        <p role="status" className="text-sm text-muted-foreground">
          Related products are unavailable because this product has no confirmed
          subcategory.
        </p>
      )}
      {subcategoryId &&
        current &&
        related.status === 'succeeded' &&
        (related.items.length > 0 ? (
          <ul
            aria-label="Related products"
            className="grid min-w-0 grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {related.items.map((product) => (
              <li key={product.id} className="min-w-0">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" className="text-sm text-muted-foreground">
            No other products available in this subcategory.
          </p>
        ))}
    </section>
  )
}

export default RelatedItems
