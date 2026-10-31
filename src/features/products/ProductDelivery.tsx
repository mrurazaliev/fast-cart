import { useText } from '@/shared/i18n/useText'
import { RotateCcw, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ProductDelivery = () => {
  const { t } = useText()
  return (
    <div className="divide-y rounded-sm border">
      <section
        aria-labelledby="product-delivery-heading"
        className="flex gap-4 p-5"
      >
        <Truck className="mt-1 size-7 shrink-0" aria-hidden="true" />
        <div className="min-w-0 space-y-2">
          <h2 id="product-delivery-heading" className="font-medium">
            {t('Free Delivery')}
          </h2>
          <p
            id="product-delivery-note"
            className="text-xs leading-5 text-muted-foreground"
          >
            {t(
              'Delivery eligibility and pricing have not been confirmed. Delivery checking is unavailable.',
            )}
          </p>
          <Button
            disabled
            variant="link"
            aria-describedby="product-delivery-note"
            className="h-auto p-0 text-xs"
          >
            {t('Check delivery unavailable')}
          </Button>
        </div>
      </section>
      <section
        aria-labelledby="product-return-heading"
        className="flex gap-4 p-5"
      >
        <RotateCcw className="mt-1 size-7 shrink-0" aria-hidden="true" />
        <div className="min-w-0 space-y-2">
          <h2 id="product-return-heading" className="font-medium">
            {t('Return Delivery')}
          </h2>
          <p
            id="product-return-note"
            className="text-xs leading-5 text-muted-foreground"
          >
            {t(
              'Return terms and time limits have not been confirmed. Details are unavailable.',
            )}
          </p>
          <Button
            disabled
            variant="link"
            aria-describedby="product-return-note"
            className="h-auto p-0 text-xs"
          >
            {t('Details unavailable')}
          </Button>
        </div>
      </section>
    </div>
  )
}

export default ProductDelivery
