import { useText } from '@/shared/i18n/useText'
import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Cart, CartLine } from '@/features/cart/cartApi'
import { getImageUrl } from '@/shared/api/imageUrl'
import { formatPrice, hasValidDiscount } from '@/shared/productPrice'

const CheckoutImage = ({ line }: { line: CartLine }) => {
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

const CheckoutSummary = ({
  cart,
  current,
}: {
  cart: Cart
  current: boolean
}) => {
  const { t } = useText()

  const discount = Math.max(0, cart.totalPrice - cart.total)

  return (
    <section
      aria-labelledby="checkout-summary-heading"
      className="min-w-0 space-y-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="checkout-summary-heading" className="text-lg font-medium">
          {t('Cart summary')}
        </h2>
        <Link to="/cart" className="text-sm underline underline-offset-4">
          {t('Edit cart')}
        </Link>
      </div>
      {!current && (
        <p role="status" className="text-sm text-muted-foreground">
          {t(
            'These are the last confirmed cart amounts. Refresh the cart before relying on them.',
          )}
        </p>
      )}
      <ul aria-label={t('Products in your cart')} className="space-y-5">
        {cart.items.map((line) => {
          const price = hasValidDiscount(line.product)
            ? line.product.discountPrice
            : line.product.price
          return (
            <li key={line.id} className="flex items-center gap-4 text-sm">
              <Link
                to={`/products/${line.product.id}`}
                className="flex min-w-0 flex-1 items-center gap-4 hover:underline"
              >
                <CheckoutImage line={line} />
                <span className="min-w-0 break-words">
                  {line.product.productName}
                  <span className="mt-1 block text-muted-foreground">
                    {t('Quantity:')} {line.quantity}
                  </span>
                </span>
              </Link>
              <span className="shrink-0">
                {formatPrice(price * line.quantity)}
              </span>
            </li>
          )
        })}
      </ul>
      <dl className="divide-y text-sm">
        <div className="flex justify-between gap-4 py-4">
          <dt>{t('Subtotal')}</dt>
          <dd>{formatPrice(cart.totalPrice)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between gap-4 py-4">
            <dt>{t('Discount')}</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4 py-4">
          <dt>{t('Shipping')}</dt>
          <dd>{t('Not calculated')}</dd>
        </div>
        <div className="flex justify-between gap-4 py-4 text-base font-medium">
          <dt>{t('Products total')}</dt>
          <dd>{formatPrice(cart.total)}</dd>
        </div>
      </dl>
      <fieldset disabled aria-describedby="checkout-payment-note">
        <legend className="mb-4 font-medium">{t('Payment options')}</legend>
        <div className="space-y-4 text-sm text-muted-foreground">
          <label className="flex min-h-6 items-center gap-3">
            <input type="radio" name="payment" className="size-5" />
            {t('Bank payment unavailable')}
          </label>
          <label className="flex min-h-6 items-center gap-3">
            <input type="radio" name="payment" className="size-5" />
            {t('Cash on delivery unavailable')}
          </label>
        </div>
      </fieldset>
      <p id="checkout-payment-note" className="text-sm text-muted-foreground">
        {t(
          'Payment, delivery pricing and coupons are not connected. No payment method has been selected.',
        )}
      </p>
      <p className="text-sm text-muted-foreground">
        {t(
          'Use “Save local order” to keep a demo checkout on this device. Your server cart will be kept.',
        )}
      </p>
    </section>
  )
}

export default CheckoutSummary
