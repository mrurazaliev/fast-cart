import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { parseProductId } from '@/features/products/productDetailsApi'
import { fetchProductDetails } from '@/features/products/productDetailsSlice'
import ProductDetailsContent from '@/features/products/ProductDetailsContent'
import RequestState from '@/shared/components/RequestState'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

const ProductDetails = () => {
  const { id } = useParams()
  const productId = parseProductId(id)
  const dispatch = useAppDispatch()
  const details = useAppSelector((state) => state.productDetails)
  const current = details.productId === productId
  const loading =
    !current || details.status === 'idle' || details.status === 'pending'

  useEffect(() => {
    if (!productId) return
    const request = dispatch(fetchProductDetails(productId))
    return () => request.abort()
  }, [dispatch, productId])

  return (
    <div className="py-4 sm:py-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex min-w-0 flex-wrap gap-3 text-sm sm:mb-12"
      >
        <Link to="/" className="text-muted-foreground hover:underline">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/products" className="text-muted-foreground hover:underline">
          Products
        </Link>
        <span aria-hidden="true">/</span>
        <span className="break-words">
          {productId && current && details.item
            ? details.item.productName
            : 'Product details'}
        </span>
      </nav>
      {!productId ? (
        <div role="alert" className="space-y-5 py-10">
          <h1 className="text-2xl font-semibold">Invalid product ID</h1>
          <p className="text-muted-foreground">
            Check the product link or return to the catalog.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <>
          {loading && (
            <div role="status" aria-busy="true">
              <span className="sr-only">Loading product details</span>
              <div
                aria-hidden="true"
                className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
              >
                <Skeleton className="h-80 sm:h-[460px] lg:h-[560px]" />
                <div className="space-y-6">
                  <Skeleton className="h-10 w-4/5" />
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-28" />
                  <Skeleton className="h-48" />
                </div>
              </div>
            </div>
          )}
          {current && (
            <RequestState
              error={details.error}
              onRetry={() => void dispatch(fetchProductDetails(productId))}
            />
          )}
          {current &&
            details.status === 'succeeded' &&
            (details.item ? (
              <ProductDetailsContent
                key={details.item.id}
                product={details.item}
              />
            ) : (
              <div role="status" className="space-y-5 py-10">
                <h1 className="text-2xl font-semibold">Product not found</h1>
                <p className="text-muted-foreground">
                  This product is no longer available.
                </p>
                <Button asChild>
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
            ))}
        </>
      )}
    </div>
  )
}

export default ProductDetails
