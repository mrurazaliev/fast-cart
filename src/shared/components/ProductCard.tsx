import { useText } from '@/shared/i18n/useText'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Heart, ImageOff, Trash2 } from 'lucide-react'
import type { Product } from '@/features/products/productsApi'
import { getImageUrl } from '@/shared/api/imageUrl'
import {
  formatPrice,
  getDiscountPercentage,
  hasValidDiscount,
} from '@/shared/productPrice'
import { Button } from '@/components/ui/button'
import ProductRating from '@/shared/components/ProductRating'
import AddToCartButton from '@/features/cart/AddToCartButton'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  toggleWishlist,
  removeFromWishlist,
} from '@/features/wishlist/wishlistSlice'

type ProductCardProps = {
  product: Product
  wishlist?: boolean
  carousel?: boolean
}

const ProductCard = ({
  product,
  wishlist = false,
  carousel = false,
}: ProductCardProps) => {
  const { t } = useText()

  const dispatch = useAppDispatch()
  const saved = useAppSelector((state) =>
    state.wishlist.ids.includes(product.id),
  )
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const imageUrl = getImageUrl(product.image)
  const discounted = hasValidDiscount(product)
  const discountPercentage = getDiscountPercentage(product)
  const detailsUrl = `/products/${product.id}`

  return (
    <article
      aria-label={product.productName}
      className="product-card relative min-w-0 space-y-3"
    >
      <div
        className={`relative overflow-hidden bg-secondary ${carousel ? 'rounded-md' : 'rounded-sm'}`}
      >
        <Link
          to={detailsUrl}
          aria-label={t('View {{value0}}', { value0: product.productName })}
          className={`flex items-center justify-center focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ${carousel ? 'h-56 p-6 pb-12 sm:h-60' : 'h-64 p-8 pb-12'}`}
        >
          {imageUrl && failedImage !== imageUrl ? (
            <img
              src={imageUrl}
              alt={product.productName}
              loading="lazy"
              width="220"
              height="200"
              onError={() => setFailedImage(imageUrl)}
              className="size-full object-contain mix-blend-multiply dark:mix-blend-normal"
            />
          ) : (
            <span className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
              <ImageOff className="size-8" aria-hidden="true" />
              {t('Image unavailable')}
            </span>
          )}
        </Link>
        {discountPercentage !== null && (
          <span className="absolute top-3 left-3 rounded-sm bg-primary px-3 py-1 text-xs text-white">
            -{discountPercentage}%
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
            aria-label={t(
              saved
                ? 'Remove {{value0}} from wishlist'
                : 'Add {{value0}} to wishlist',
              { value0: product.productName },
            )}
            aria-pressed={saved}
            className="size-9 rounded-full bg-background aria-pressed:text-primary"
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
              className="size-9 rounded-full bg-background hover:bg-accent"
            >
              <Link
                to={detailsUrl}
                aria-label={t('Quick view {{value0}}', {
                  value0: product.productName,
                })}
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
          wrapperClassName="product-card-cart absolute inset-x-0 bottom-0"
          className="h-10 w-full rounded-none bg-black text-white hover:bg-black/90 disabled:opacity-70"
        />
      </div>
      <h3
        className={`line-clamp-2 font-medium ${carousel ? 'min-h-10 text-sm leading-5 sm:min-h-12 sm:text-base sm:leading-6' : 'min-h-12 text-base leading-6'}`}
      >
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
            {discounted ? t('Discount price: ') : t('Price: ')}
          </span>
          {formatPrice(discounted ? product.discountPrice : product.price)}
        </span>
        {discounted && (
          <span className="text-muted-foreground">
            <span className="sr-only">{t('Original price:')} </span>
            <del>{formatPrice(product.price)}</del>
          </span>
        )}
      </p>
      <ProductRating hideLabel />
    </article>
  )
}

export default ProductCard
