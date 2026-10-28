import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCart } from '@/features/cart/cartSlice'
import CheckoutForm from '@/features/checkout/CheckoutForm'
import CheckoutSummary from '@/features/checkout/CheckoutSummary'
import RequestState from '@/shared/components/RequestState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const Checkout = () => {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.auth.session)
  const cart = useAppSelector((state) => state.cart)
  const loading = cart.status === 'idle' || cart.status === 'pending'

  useEffect(() => {
    if (session) void dispatch(fetchCart())
  }, [dispatch, session])

  if (!session)
    return <Navigate to="/login" replace state={{ returnTo: '/checkout' }} />

  return (
    <div className="py-4 sm:py-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-10 flex flex-wrap gap-3 text-sm sm:mb-12"
      >
        <Link to="/products" className="text-muted-foreground hover:underline">
          Products
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/cart" className="text-muted-foreground hover:underline">
          View Cart
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Checkout</span>
      </nav>
      <h1 className="mb-7 text-3xl font-medium tracking-wide sm:text-4xl">
        Billing Details
      </h1>
      <div className="space-y-6">
        {loading && cart.items.length === 0 && (
          <div
            role="status"
            aria-busy="true"
            className="grid gap-10 lg:grid-cols-2 lg:gap-28"
          >
            <span className="sr-only">Loading your cart</span>
            <Skeleton className="h-96" />
            <Skeleton className="h-72" />
          </div>
        )}
        {(loading || cart.mutating) && cart.items.length > 0 && (
          <RequestState loading />
        )}
        <RequestState
          error={cart.error}
          onRetry={() => void dispatch(fetchCart())}
        />
        {cart.status === 'succeeded' && cart.items.length === 0 && (
          <div role="status" className="space-y-5 py-12 text-center">
            <p className="text-xl">Your cart is empty.</p>
            <p className="text-sm text-muted-foreground">
              Add products to your cart before checking billing details.
            </p>
            <Button asChild className="h-12 rounded-sm px-8">
              <Link to="/products">Return To Shop</Link>
            </Button>
          </div>
        )}
        {cart.items.length > 0 && (
          <div className="grid items-start gap-10 pb-8 lg:grid-cols-2 lg:gap-28 lg:pb-16">
            <CheckoutForm
              key={session.userName}
              disabled={cart.status !== 'succeeded' || cart.mutating}
            />
            <CheckoutSummary cart={cart} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout
