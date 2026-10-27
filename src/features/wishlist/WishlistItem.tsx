import { Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { removeFromWishlist } from '@/features/wishlist/wishlistSlice'
import { fetchWishlistProduct } from '@/features/wishlist/fetchWishlistProduct'
import ProductCard from '@/shared/components/ProductCard'
import RequestState from '@/shared/components/RequestState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const WishlistItem = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch()
  const product = useAppSelector(
    (state) =>
      state.wishlist.products[id] ||
      state.products.items.find((item) => item.id === id) ||
      state.catalog.items.find((item) => item.id === id),
  )
  const request = useAppSelector((state) => state.wishlist.requests[id])

  if (product) return <ProductCard product={product} wishlist />

  const unavailable = request?.status === 'unavailable'
  const failed = request?.status === 'failed'

  return (
    <article aria-label={`Saved product ${id}`} className="space-y-3">
      <div className="relative flex h-64 items-center justify-center rounded-sm bg-secondary p-6">
        {!unavailable && !failed ? (
          <div role="status" className="w-full space-y-3">
            <span className="sr-only">Loading saved product {id}</span>
            <Skeleton className="h-32" />
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            {unavailable
              ? 'This product is no longer available.'
              : 'Product details could not be loaded.'}
          </p>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Remove saved product ${id} from wishlist`}
          onClick={() => dispatch(removeFromWishlist(id))}
          className="absolute top-3 right-3 size-9 rounded-full bg-white"
        >
          <Trash2 className="size-5" aria-hidden="true" />
        </Button>
      </div>
      <p className="text-sm">Saved product #{id}</p>
      <RequestState
        error={request?.error}
        onRetry={() => void dispatch(fetchWishlistProduct({ id, retry: true }))}
      />
    </article>
  )
}

export default WishlistItem
