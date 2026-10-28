import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import type { ProductDetails } from '@/features/products/productDetailsApi'
import { toggleWishlist } from '@/features/wishlist/wishlistSlice'
import { formatPrice, hasValidDiscount } from '@/shared/productPrice'
import ProductGallery from '@/features/products/ProductGallery'
import { Button } from '@/components/ui/button'

const ProductDetailsContent = ({ product }: { product: ProductDetails }) => {
  const dispatch = useAppDispatch()
  const saved = useAppSelector((state) =>
    state.wishlist.ids.includes(product.id),
  )
  const discounted = hasValidDiscount(product)
  const fields = [
    ['Brand', product.brand],
    ['Colour', product.color],
    ['Size', product.size],
    ['Weight', product.weight],
    ['Product code', product.code],
  ].filter(([, value]) => value?.trim())

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
      <ProductGallery
        key={product.id}
        images={product.images.map((image) => image.images)}
        name={product.productName}
      />
      <section aria-labelledby="product-title" className="min-w-0 space-y-6">
        <div className="space-y-3">
          <h1
            id="product-title"
            className="text-2xl font-semibold break-words sm:text-3xl"
          >
            {product.productName}
          </h1>
          {product.quantity !== null && product.quantity !== undefined && (
            <p
              className={`text-sm ${product.quantity > 0 ? 'text-green-700' : 'text-muted-foreground'}`}
            >
              {product.quantity > 0
                ? `In stock: ${product.quantity}`
                : 'Out of stock'}
            </p>
          )}
          <p className="flex flex-wrap items-center gap-4 text-2xl font-medium">
            <span>
              <span className="sr-only">
                {discounted ? 'Discount price: ' : 'Price: '}
              </span>
              {formatPrice(discounted ? product.discountPrice : product.price)}
            </span>
            {discounted && (
              <del className="text-lg text-muted-foreground">
                <span className="sr-only">Original price: </span>
                {formatPrice(product.price)}
              </del>
            )}
          </p>
        </div>
        {product.description?.trim() && (
          <p className="text-sm leading-7 whitespace-pre-line">
            {product.description}
          </p>
        )}
        {fields.length > 0 && (
          <dl className="space-y-4 border-t pt-6 text-sm">
            {fields.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[120px_minmax(0,1fr)] gap-3"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="break-words">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="space-y-3 border-t pt-6">
          <div className="flex gap-4">
            <Button
              disabled
              aria-describedby="product-cart-note"
              className="h-12 flex-1 rounded-sm"
            >
              Add to Cart unavailable
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`${saved ? 'Remove from' : 'Add to'} wishlist: ${product.productName}`}
              aria-pressed={saved}
              onClick={() => dispatch(toggleWishlist(product))}
              className="size-12 rounded-sm aria-pressed:text-primary"
            >
              <Heart
                className={`size-6 ${saved ? 'fill-current' : ''}`}
                aria-hidden="true"
              />
            </Button>
          </div>
          <p id="product-cart-note" className="text-sm text-muted-foreground">
            Add to Cart is unavailable until the server cart is connected.
          </p>
        </div>
        {product.subCategoryId && (
          <Link
            to={`/products?SubcategoryId=${product.subCategoryId}`}
            className="inline-block text-sm underline underline-offset-4"
          >
            Browse this subcategory
          </Link>
        )}
      </section>
    </div>
  )
}

export default ProductDetailsContent
