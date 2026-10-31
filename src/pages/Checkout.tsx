import { useText } from '@/shared/i18n/useText'
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCart } from '@/features/cart/cartSlice'
import CheckoutForm from '@/features/checkout/CheckoutForm'
import CheckoutSummary from '@/features/checkout/CheckoutSummary'
import RequestState from '@/shared/components/RequestState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { store } from '@/app/store'
import {
  createLocalOrder,
  deleteLocalOrder,
  readLocalOrder,
  saveLocalOrder,
} from '@/features/checkout/localOrder'
import LocalOrderConfirmation from '@/features/checkout/LocalOrderConfirmation'
import type { CheckoutValues } from '@/features/checkout/checkoutSchema'

const CheckoutContent = ({ userName }: { userName: string }) => {
  const { t } = useText()

  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.auth.session)
  const cart = useAppSelector((state) => state.cart)
  const loading = cart.status === 'idle' || cart.status === 'pending'
  const [order, setOrder] = useState(() => readLocalOrder(userName))
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const saved = useRef(!!order)

  useEffect(() => {
    if (session && !order) void dispatch(fetchCart())
  }, [dispatch, session, order])

  const handleSave = (values: CheckoutValues) => {
    if (saved.current) return
    const current = store.getState()
    if (
      !session ||
      current.auth.session?.token !== session.token ||
      (session.expiresAt !== null && session.expiresAt <= Date.now())
    )
      throw new Error('Your session has ended. Please sign in again.')
    if (
      current.cart.status !== 'succeeded' ||
      current.cart.mutating ||
      current.cart.items.length === 0
    )
      throw new Error('Wait for your cart to finish updating, then try again.')
    const nextOrder = createLocalOrder(values, current.cart)
    saveLocalOrder(userName, nextOrder)
    saved.current = true
    setOrder(nextOrder)
  }

  const handleDelete = () => {
    try {
      deleteLocalOrder(userName)
      saved.current = false
      setDeleteError(null)
      setOrder(null)
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Unable to delete locally. Please try again.',
      )
    }
  }

  if (order)
    return (
      <div className="py-6 sm:py-10">
        <LocalOrderConfirmation
          order={order}
          onDelete={handleDelete}
          error={deleteError}
        />
      </div>
    )

  return (
    <div className="py-4 sm:py-8">
      <nav
        aria-label={t('Breadcrumb')}
        className="mb-10 flex flex-wrap gap-3 text-sm sm:mb-12"
      >
        <Link to="/products" className="text-muted-foreground hover:underline">
          {t('Products')}
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/cart" className="text-muted-foreground hover:underline">
          {t('View Cart')}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{t('Checkout')}</span>
      </nav>
      <h1 className="mb-7 text-3xl font-medium tracking-wide sm:text-4xl">
        {t('Billing Details')}
      </h1>
      <div
        role="note"
        id="checkout-availability-note"
        className="mb-8 space-y-2 rounded-sm border border-primary/25 bg-primary/5 p-4 text-sm"
      >
        <p className="font-medium">{t('Local demo checkout')}</p>
        <p>
          {t(
            'Save a demo order in this browser and review its confirmation. Billing details stay on this device. No real order, delivery or payment is created, and your server cart is unchanged.',
          )}
        </p>
      </div>
      <div className="space-y-6">
        {loading && cart.items.length === 0 && (
          <div
            role="status"
            aria-busy="true"
            className="grid gap-10 lg:grid-cols-2 lg:gap-28"
          >
            <span className="sr-only">{t('Loading your cart')}</span>
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
            <p className="text-xl">{t('Your cart is empty.')}</p>
            <p className="text-sm text-muted-foreground">
              {t('Add products to your cart before checking billing details.')}
            </p>
            <Button asChild className="h-12 rounded-sm px-8">
              <Link to="/products">{t('Return To Shop')}</Link>
            </Button>
          </div>
        )}
        {cart.items.length > 0 && (
          <div className="grid min-w-0 grid-cols-1 items-start gap-10 pb-8 lg:grid-cols-2 lg:gap-28 lg:pb-16">
            <CheckoutForm
              key={userName}
              disabled={cart.status !== 'succeeded' || cart.mutating}
              onSave={handleSave}
            />
            <CheckoutSummary
              cart={cart}
              current={cart.status === 'succeeded' && !cart.mutating}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const Checkout = () => {
  const session = useAppSelector((state) => state.auth.session)
  if (!session)
    return <Navigate to="/login" replace state={{ returnTo: '/checkout' }} />
  return <CheckoutContent key={session.userName} userName={session.userName} />
}

export default Checkout
