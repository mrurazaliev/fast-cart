import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchProducts } from '@/features/products/productsSlice'
import { fetchWishlistProduct } from '@/features/wishlist/fetchWishlistProduct'
import WishlistItem from '@/features/wishlist/WishlistItem'
import ProductCard from '@/shared/components/ProductCard'
import RequestState from '@/shared/components/RequestState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const Wishlist = () => {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((state) => state.wishlist.ids)
  const products = useAppSelector((state) => state.products)
  const suggestions = products.items
    .filter((product) => !ids.includes(product.id))
    .sort((first, second) => first.id - second.id)
    .slice(0, 4)
  const loading = products.status === 'idle' || products.status === 'pending'

  useEffect(() => {
    void dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    if (products.status === 'idle' || products.status === 'pending') return
    ids.forEach((id) => void dispatch(fetchWishlistProduct({ id })))
  }, [dispatch, ids, products.status])

  return (
    <div className="container py-10 sm:py-16 lg:py-20">
      <section aria-labelledby="wishlist-heading" className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <h1 id="wishlist-heading" className="text-xl">
            Wishlist ({ids.length})
          </h1>
          <Button
            variant="outline"
            disabled
            aria-describedby="wishlist-cart-note"
            className="h-12 rounded-sm px-8"
          >
            Move All To Bag
          </Button>
        </div>
        <p id="wishlist-cart-note" className="text-sm text-muted-foreground">
          Add To Cart and Move All To Bag are unavailable until the server cart
          is connected.
        </p>
        {ids.length === 0 ? (
          <div role="status" className="space-y-5 py-8">
            <p className="text-muted-foreground">
              Your wishlist is empty. Save products using the heart button.
            </p>
            <Button asChild className="h-12 rounded-sm px-8">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <ul
            aria-label="Wishlist products"
            className="grid min-w-0 grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {ids.map((id) => (
              <li key={id} className="min-w-0">
                <WishlistItem id={id} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <section
        aria-labelledby="wishlist-suggestions"
        className="mt-16 space-y-8 sm:mt-20"
      >
        <div className="flex flex-wrap items-center justify-between gap-5">
          <h2
            id="wishlist-suggestions"
            className="flex items-center gap-4 text-xl"
          >
            <span
              aria-hidden="true"
              className="h-10 w-5 rounded-sm bg-primary"
            />
            Just For You
          </h2>
          <Button asChild variant="outline" className="h-12 rounded-sm px-8">
            <Link to="/products">See All</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Explore more from our catalog. This selection is not personalized.
        </p>
        {loading && (
          <div role="status">
            <span className="sr-only">Loading products</span>
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
        <RequestState
          error={products.error}
          onRetry={() => void dispatch(fetchProducts())}
        />
        {products.status === 'succeeded' &&
          (suggestions.length > 0 ? (
            <ul
              aria-label="More products"
              className="grid min-w-0 grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
            >
              {suggestions.map((product) => (
                <li key={product.id} className="min-w-0">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <p role="status" className="py-6 text-muted-foreground">
              No more products available.
            </p>
          ))}
      </section>
    </div>
  )
}

export default Wishlist
