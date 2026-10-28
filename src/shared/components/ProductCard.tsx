import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Heart, ImageOff, Trash2 } from 'lucide-react'
import type { Product } from '@/features/products/productsApi'
import { getImageUrl } from '@/shared/api/imageUrl'
import { formatPrice, hasValidDiscount } from '@/shared/productPrice'
import { Button } from '@/components/ui/button'
import ProductRating from '@/shared/components/ProductRating'
import AddToCartButton from '@/features/cart/AddToCartButton'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  toggleWishlist,
  removeFromWishlist,
} from '@/features/wishlist/wishlistSlice'

type ProductCardProps = { product: Product; wishlist?: boolean }

const ProductCard = ({ product, wishlist = false }: ProductCardProps) => {
  const dispatch = useAppDispatch()
  const saved = useAppSelector((state) =>
    state.wishlist.ids.includes(product.id),
  )
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const imageUrl = getImageUrl(product.image)
  const discounted = hasValidDiscount(product)
  const detailsUrl = `/products/${product.id}`

  return (
    <article
      aria-label={product.productName}
      className="relative min-w-0 space-y-3"
    >
      <div className="relative overflow-hidden rounded-sm bg-secondary">
        <Link
          to={detailsUrl}
          aria-label={`View ${product.productName}`}
          className="flex h-64 items-center justify-center p-8 pb-12 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        >
          {imageUrl && failedImage !== imageUrl ? (
            <img
              src={imageUrl}
              alt={product.productName}
              loading="lazy"
              width="220"
              height="200"
              onError={() => setFailedImage(imageUrl)}
              className="size-full object-contain mix-blend-multiply"
            />
          ) : (
            <span className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
              <ImageOff className="size-8" aria-hidden="true" />
              Image unavailable
            </span>
          )}
        </Link>
        {discounted && (
          <span className="absolute top-3 left-3 rounded-sm bg-primary px-3 py-1 text-xs text-white">
            Sale
          </span>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              dispatch(
                wishlist
                  ? removeFromWishlist(product.id)
                  : toggleWishlist(product),
              )
            }
            aria-label={`${saved ? 'Remove from' : 'Add to'} wishlist: ${product.productName}`}
            aria-pressed={saved}
            className="size-9 rounded-full bg-white aria-pressed:text-primary"
          >
            {wishlist ? (
              <Trash2 className="size-5" aria-hidden="true" />
            ) : (
              <Heart
                className={`size-5 ${saved ? 'fill-current' : ''}`}
                aria-hidden="true"
              />
            )}
          </Button>
          {!wishlist && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-9 rounded-full bg-white hover:bg-white/90"
            >
              <Link
                to={detailsUrl}
                aria-label={`Quick view ${product.productName}`}
              >
                <Eye className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
        <AddToCartButton
          productId={product.id}
          disabled={product.quantity === 0}
          moveFromWishlist={wishlist}
          wrapperClassName="absolute inset-x-0 bottom-0"
          className="h-10 w-full rounded-none bg-black text-white hover:bg-black/90 disabled:opacity-70"
        />
      </div>
      <h3 className="line-clamp-2 min-h-12 text-base leading-6 font-medium">
        <Link
          to={detailsUrl}
          className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {product.productName}
        </Link>
      </h3>
      <p className="flex flex-wrap gap-3 text-base font-medium">
        <span className="text-primary">
          <span className="sr-only">
            {discounted ? 'Discount price: ' : 'Price: '}
          </span>
          {formatPrice(discounted ? product.discountPrice : product.price)}
        </span>
        {discounted && (
          <span className="text-muted-foreground">
            <span className="sr-only">Original price: </span>
            <del>{formatPrice(product.price)}</del>
          </span>
        )}
      </p>
      <ProductRating />
    </article>
  )
}

export default ProductCard
