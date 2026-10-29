import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getProductLookups } from '@/features/products/productFormApi'
import type { ProductLookups } from '@/features/products/productFormApi'
import { getProductsReturnPath } from '@/features/products/productNavigation'
import ProductForm from '@/features/products/ProductForm'
import RequestState from '@/shared/components/RequestState'

const ProductCreate = () => {
  const location = useLocation()
  const [lookups, setLookups] = useState<ProductLookups | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    getProductLookups(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setLookups(data)
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setError(
            error instanceof Error
              ? error.message
              : 'Unable to load product options.',
          )
      })
    return () => controller.abort()
  }, [attempt])
  if (lookups)
    return (
      <ProductForm
        lookups={lookups}
        backTo={getProductsReturnPath(location.state)}
      />
    )
  return (
    <RequestState
      loading={!error}
      error={error}
      onRetry={() => {
        setError(null)
        setAttempt(attempt + 1)
      }}
    />
  )
}

export default ProductCreate
