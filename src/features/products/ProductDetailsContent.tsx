import { useState } from 'react'
import { Heart, Minus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import type { ProductDetails } from '@/features/products/productDetailsApi'
import { toggleWishlist } from '@/features/wishlist/wishlistSlice'
import { formatPrice, hasValidDiscount } from '@/shared/productPrice'
import ProductGallery from '@/features/products/ProductGallery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductRating from '@/shared/components/ProductRating'
import ProductDelivery from '@/features/products/ProductDelivery'
import { getColorSwatch } from '@/shared/productColor'

const ProductDetailsContent = ({ product }: { product: ProductDetails }) => {
  const dispatch = useAppDispatch()
  const saved = useAppSelector((state) =>
    state.wishlist.ids.includes(product.id),
  )
  const discounted = hasValidDiscount(product)
  const [quantity, setQuantity] = useState(1)
  const stock = product.quantity
  const quantityAvailable = stock !== null && stock !== undefined && stock > 0
  const colorSwatch = product.color ? getColorSwatch(product.color) : null
  const changeQuantity = (value: number) => {
    if (!quantityAvailable || !Number.isFinite(value)) return
    setQuantity(Math.max(1, Math.min(stock, Math.trunc(value))))
  }
  const fields = [
    ['Brand', product.brand],
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
          <ProductRating />
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
          {product.description?.trim() && (
            <p className="text-sm leading-7 whitespace-pre-line">
              {product.description}
            </p>
          )}
        </div>
        {product.color?.trim() && (
          <div className="flex flex-wrap items-center gap-3 border-t pt-6 text-sm">
            <span className="text-muted-foreground">Colour:</span>
            <span
              aria-hidden="true"
              title={
                colorSwatch
                  ? `Illustrative sample: ${product.color}`
                  : 'Color sample unavailable'
              }
              className={`size-6 rounded-full border ${colorSwatch ? 'border-neutral-400' : 'border-dashed'}`}
              style={colorSwatch ? { backgroundColor: colorSwatch } : undefined}
            />
            <span>{product.color}</span>
          </div>
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
          <div className="flex flex-wrap items-center gap-4">
            <label htmlFor="product-quantity" className="text-sm font-medium">
              Quantity
            </label>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!quantityAvailable || quantity <= 1}
                aria-label="Decrease quantity"
                onClick={() => changeQuantity(quantity - 1)}
                className="size-11 rounded-r-none"
              >
                <Minus className="size-4" aria-hidden="true" />
              </Button>
              <Input
                id="product-quantity"
                type="number"
                min={1}
                max={quantityAvailable ? stock : undefined}
                step={1}
                value={quantity}
                disabled={!quantityAvailable}
                onChange={(event) => changeQuantity(event.target.valueAsNumber)}
                className="h-11 w-20 rounded-none border-x-0 text-center shadow-none"
              />
              <Button
                type="button"
                size="icon"
                disabled={!quantityAvailable || quantity >= stock}
                aria-label="Increase quantity"
                onClick={() => changeQuantity(quantity + 1)}
                className="size-11 rounded-l-none"
              >
                <Plus className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          {!quantityAvailable && (
            <p className="text-sm text-muted-foreground">
              {stock === 0
                ? 'This product is out of stock and cannot be purchased.'
                : 'Availability has not been confirmed.'}
            </p>
          )}
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
        <ProductDelivery />
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
