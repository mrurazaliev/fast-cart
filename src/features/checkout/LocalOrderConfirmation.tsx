import { getLocale } from '@/shared/i18n/i18n'
import { useText } from '@/shared/i18n/useText'
import { useEffect, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/shared/productPrice'
import type { LocalOrder } from './localOrder'

const LocalOrderConfirmation = ({
  order,
  onDelete,
  error,
}: {
  order: LocalOrder
  onDelete: () => void
  error: string | null
}) => {
  const { t } = useText()
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    heading.current?.focus()
  }, [])

  return (
    <section
      aria-labelledby="local-order-heading"
      className="mx-auto max-w-3xl space-y-7 rounded-sm border p-5 sm:p-8"
    >
      <div role="status" className="space-y-3">
        <CheckCircle2 aria-hidden="true" className="size-10 text-primary" />
        <p className="text-sm font-medium text-primary">
          {t('Local demo only')}
        </p>
        <h1
          id="local-order-heading"
          tabIndex={-1}
          ref={heading}
          className="text-2xl font-medium outline-none sm:text-3xl"
        >
          {t('Local order saved')}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {t(
            'Your checkout is saved only in this browser. No real order was sent, no payment was taken, and your server cart is unchanged.',
          )}
        </p>
      </div>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-muted-foreground">{t('Local reference')}</dt>
          <dd className="mt-1 break-all font-medium">{order.id}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('Saved on')}</dt>
          <dd className="mt-1">
            {new Date(order.createdAt).toLocaleString(getLocale())}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-muted-foreground">{t('Billing details')}</dt>
          <dd className="mt-1 break-words">
            {order.billing.firstName} {order.billing.lastName}
            <br />
            {order.billing.streetAddress}
            {order.billing.apartment && `, ${order.billing.apartment}`}
            <br />
            {order.billing.city}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-muted-foreground">{t('Contact')}</dt>
          <dd className="mt-1 break-words">
            {order.billing.email}
            <br />
            {order.billing.phoneNumber}
          </dd>
        </div>
      </dl>
      <div className="space-y-4 border-y py-5">
        <h2 className="font-medium">{t('Saved products')}</h2>
        <ul className="space-y-4">
          {order.items.map((item, index) => (
            <li
              key={`${item.productId}:${index}`}
              className="flex flex-wrap justify-between gap-x-5 gap-y-1 text-sm"
            >
              <span className="min-w-0 flex-1 basis-44 break-words">
                {item.name}
                <span className="mt-1 block text-xs text-muted-foreground">
                  {t('Quantity:')} {item.quantity} ·{' '}
                  {formatPrice(item.unitPrice)} {t('each')}
                </span>
              </span>
              <span className="break-all">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-between gap-3 pt-2 font-medium">
          <span>{t('Products total')}</span>
          <span className="break-all">{formatPrice(order.total)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {t(
            'Shipping and payment are not included. Prices reflect the cart at the time of saving.',
          )}
        </p>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        {t(
          'Billing details and this snapshot stay on this device until you delete the local order or clear browser data. They are not synced to another device or the admin application.',
        )}
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {t(error || '')}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button
          asChild
          className="h-auto min-h-12 max-w-full rounded-sm whitespace-normal"
        >
          <Link to="/products">{t('Continue shopping')}</Link>
        </Button>
        <Button
          variant="outline"
          onClick={onDelete}
          className="h-auto min-h-12 max-w-full rounded-sm whitespace-normal"
        >
          {t('Delete local order & return to checkout')}
        </Button>
      </div>
    </section>
  )
}

export default LocalOrderConfirmation
