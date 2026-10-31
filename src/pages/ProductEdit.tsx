import { useText } from '@/shared/i18n/useText'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getProductLookups } from '@/features/products/productFormApi'
import type { ProductLookups } from '@/features/products/productFormApi'
import {
  getEditableProduct,
  parseEditProductId,
} from '@/features/products/productEditApi'
import type { EditableProduct } from '@/features/products/productEditApi'
import { getProductsReturnPath } from '@/features/products/productNavigation'
import ProductForm from '@/features/products/ProductForm'
import RequestState from '@/shared/components/RequestState'
import { Button } from '@/components/ui/button'

const ProductEdit = () => {
  const { t } = useText()

  const { id } = useParams()
  const productId = parseEditProductId(id)
  const location = useLocation()
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{
    id: number
    product: EditableProduct | null
    lookups: ProductLookups | null
    error: string | null
  } | null>(null)
  useEffect(() => {
    if (!productId) return
    const controller = new AbortController()
    getProductLookups(controller.signal)
      .then(async (lookups) => ({
        lookups,
        product: await getEditableProduct(
          productId,
          lookups,
          controller.signal,
        ),
      }))
      .then((data) => {
        if (!controller.signal.aborted)
          setResult({ id: productId, ...data, error: null })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setResult({
            id: productId,
            product: null,
            lookups: null,
            error:
              error instanceof Error
                ? error.message
                : 'Unable to load this product.',
          })
      })
    return () => controller.abort()
  }, [productId, attempt])
  const handleReload = () => {
    setResult(null)
    setAttempt((value) => value + 1)
  }
  if (!productId) return <p role="alert">{t('Invalid product ID.')}</p>
  if (!result || result.id !== productId) return <RequestState loading />
  if (result.error)
    return <RequestState error={result.error} onRetry={handleReload} />
  if (!result.product || !result.lookups)
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{t('Product not found')}</h1>
        <Button asChild>
          <Link to="/products">{t('Back to products')}</Link>
        </Button>
      </div>
    )
  return (
    <ProductForm
      key={`${productId}:${attempt}`}
      lookups={result.lookups}
      product={result.product}
      onReload={handleReload}
      backTo={getProductsReturnPath(location.state)}
    />
  )
}

export default ProductEdit
