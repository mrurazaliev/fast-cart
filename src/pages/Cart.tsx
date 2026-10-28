import { useEffect, useState } from 'react'
import { ImageOff, Minus, Plus, X } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCart, mutateCart } from '@/features/cart/cartSlice'
import type { CartLine } from '@/features/cart/cartApi'
import { getImageUrl } from '@/shared/api/imageUrl'
import { formatPrice, hasValidDiscount } from '@/shared/productPrice'
import RequestState from '@/shared/components/RequestState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

const CartImage = ({ line }: { line: CartLine }) => {
  const url = getImageUrl(line.product.image)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  return (
    <span className="flex size-16 shrink-0 items-center justify-center bg-secondary p-2">
      {url && failedUrl !== url ? (
        <img
          src={url}
          alt=""
          onError={() => setFailedUrl(url)}
          className="size-full object-contain"
        />
      ) : (
        <ImageOff className="size-6 text-muted-foreground" aria-hidden="true" />
      )}
    </span>
  )
}

const Cart = () => {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.auth.session)
  const cart = useAppSelector((state) => state.cart)
  const loading = cart.status === 'idle' || cart.status === 'pending'
  const busy = cart.mutating || cart.status === 'pending'
  const discount = Math.max(0, cart.totalPrice - cart.total)

  useEffect(() => {
    if (session) void dispatch(fetchCart())
  }, [dispatch, session])

  if (!session)
    return <Navigate to="/login" replace state={{ returnTo: '/cart' }} />

  return (
    <div className="py-4 sm:py-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-10 flex gap-3 text-sm sm:mb-14"
      >
        <Link to="/" className="text-muted-foreground hover:underline">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span>Cart</span>
      </nav>
      <h1 className="sr-only">Shopping cart</h1>
      <div className="space-y-6">
        {loading && cart.items.length === 0 && (
          <div role="status" aria-busy="true" className="space-y-5">
            <span className="sr-only">Loading cart</span>
            <Skeleton className="h-12" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        )}
        {loading && cart.items.length > 0 && <RequestState loading />}
        <RequestState
          error={cart.error}
          onRetry={() => void dispatch(fetchCart())}
        />
        {cart.mutationError && (
          <p
            role="alert"
            className="text-sm whitespace-pre-line text-destructive"
          >
            {cart.mutationError}
          </p>
        )}
        {cart.message && (
          <p role="status" className="text-sm">
            {cart.message}
          </p>
        )}
        {cart.mutating && (
          <p role="status" className="text-sm text-muted-foreground">
            Updating cart. Please wait…
          </p>
        )}
        {cart.status === 'succeeded' && cart.items.length === 0 && (
          <div role="status" className="space-y-5 py-12 text-center">
            <p className="text-xl">Your cart is empty.</p>
            <Button asChild className="h-12 rounded-sm px-8">
              <Link to="/products">Return To Shop</Link>
            </Button>
          </div>
        )}
        {cart.items.length > 0 && (
          <>
            <div
              aria-hidden="true"
              className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_32px] items-center gap-5 px-6 py-4 text-sm text-muted-foreground md:grid"
            >
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
              <span />
            </div>
            <ul aria-label="Cart products" className="space-y-5">
              {cart.items.map((line) => {
                const discounted = hasValidDiscount(line.product)
                const price = discounted
                  ? line.product.discountPrice
                  : line.product.price
                const stock = line.product.quantity
                const outOfStock = stock === 0
                const atStockLimit =
                  typeof stock === 'number' && line.quantity >= stock

                return (
                  <li
                    key={line.id}
                    className="relative grid min-w-0 grid-cols-2 items-center gap-5 rounded-sm border px-5 py-6 shadow-sm md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_32px] md:border-0 md:px-6"
                  >
                    <div className="col-span-2 min-w-0 pr-8 md:col-span-1 md:pr-0">
                      <Link
                        to={`/products/${line.product.id}`}
                        className="flex min-w-0 items-center gap-4 hover:underline"
                      >
                        <CartImage line={line} />
                        <span className="min-w-0 break-words text-sm font-medium">
                          {line.product.productName}
                        </span>
                      </Link>
                      {outOfStock && (
                        <p className="mt-2 text-xs text-destructive">
                          This product is out of stock. Remove it or reduce the
                          quantity.
                        </p>
                      )}
                      {typeof stock === 'number' &&
                        stock > 0 &&
                        line.quantity > stock && (
                          <p className="mt-2 text-xs text-destructive">
                            Only {stock} available. Reduce the quantity.
                          </p>
                        )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <span className="block text-xs text-muted-foreground md:hidden">
                        Price
                      </span>
                      <span>{formatPrice(price)}</span>
                      {discounted && (
                        <del className="ml-2 text-xs text-muted-foreground">
                          {formatPrice(line.product.price)}
                        </del>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="block text-xs text-muted-foreground md:hidden">
                        Quantity
                      </span>
                      <div className="flex w-fit items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={busy || line.quantity <= 1}
                          aria-label={`Decrease quantity of ${line.product.productName}`}
                          onClick={() =>
                            void dispatch(
                              mutateCart({ type: 'reduce', lineId: line.id }),
                            )
                          }
                          className="size-8 rounded-r-none"
                        >
                          <Minus className="size-3" aria-hidden="true" />
                        </Button>
                        <Input
                          readOnly
                          type="number"
                          value={line.quantity}
                          min={1}
                          aria-label={`Quantity of ${line.product.productName}`}
                          className="h-8 w-12 rounded-none border-x-0 px-1 text-center shadow-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={busy || outOfStock || atStockLimit}
                          aria-label={`Increase quantity of ${line.product.productName}`}
                          onClick={() =>
                            void dispatch(
                              mutateCart({ type: 'increase', lineId: line.id }),
                            )
                          }
                          className="size-8 rounded-l-none"
                        >
                          <Plus className="size-3" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm font-medium">
                      <span className="block text-xs font-normal text-muted-foreground md:hidden">
                        Subtotal
                      </span>
                      {formatPrice(price * line.quantity)}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={busy}
                      aria-label={`Remove ${line.product.productName} from cart`}
                      onClick={() =>
                        void dispatch(
                          mutateCart({ type: 'remove', lineId: line.id }),
                        )
                      }
                      className="absolute top-3 right-3 size-8 rounded-full text-primary md:static"
                    >
                      <X className="size-5" aria-hidden="true" />
                    </Button>
                  </li>
                )
              })}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-sm px-8"
              >
                <Link to="/products">Return To Shop</Link>
              </Button>
              <div className="flex flex-wrap gap-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void dispatch(fetchCart())}
                  className="h-12 rounded-sm px-8"
                >
                  Refresh Cart
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void dispatch(mutateCart({ type: 'clear' }))}
                  className="h-12 rounded-sm border-primary px-8 text-primary"
                >
                  Remove all
                </Button>
              </div>
            </div>
            <div className="mt-10 grid gap-8 pt-8 lg:grid-cols-2 lg:gap-16">
              <p className="text-sm text-muted-foreground">
                Coupons and delivery pricing are not available yet.
              </p>
              <section
                aria-labelledby="cart-total-heading"
                className="space-y-6 rounded-sm border border-foreground p-6"
              >
                <h2 id="cart-total-heading" className="text-xl font-medium">
                  Cart Total
                </h2>
                <dl className="divide-y text-sm">
                  <div className="flex justify-between gap-4 py-4">
                    <dt>Subtotal</dt>
                    <dd>{formatPrice(cart.totalPrice)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between gap-4 py-4">
                      <dt>Discount</dt>
                      <dd>−{formatPrice(discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 py-4 text-base font-medium">
                    <dt>Total</dt>
                    <dd>{formatPrice(cart.total)}</dd>
                  </div>
                </dl>
                <div className="space-y-3 text-center">
                  <Button
                    disabled
                    aria-describedby="checkout-note"
                    className="h-12 w-full rounded-sm"
                  >
                    Proceed to checkout unavailable
                  </Button>
                  <p
                    id="checkout-note"
                    className="text-xs text-muted-foreground"
                  >
                    Checkout is not available yet. No order has been placed.
                  </p>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart
