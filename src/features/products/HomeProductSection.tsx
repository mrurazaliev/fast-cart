import { useText } from '@/shared/i18n/useText'
import { Link } from 'react-router-dom'
import type { Product } from '@/features/products/productsApi'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/shared/components/ProductCard'
import RequestState from '@/shared/components/RequestState'
import SectionHeading from '@/shared/components/home/SectionHeading'

type HomeProductSectionProps = {
  id: string
  label: string
  title: string
  products: Product[]
  loading: boolean
  error: string | null
  skeletonCount: number
  onRetry: () => void
  actionInHeader?: boolean
}

const HomeProductSection = ({
  id,
  label,
  title,
  products,
  loading,
  error,
  skeletonCount,
  onRetry,
  actionInHeader = false,
}: HomeProductSectionProps) => {
  const { t } = useText()

  return (
    <section aria-labelledby={id} className="mt-12 space-y-8 sm:mt-16">
      <SectionHeading id={id} label={t(label || '')} title={t(title || '')}>
        {actionInHeader && (
          <Button asChild className="h-12 rounded-sm px-8">
            <Link to="/products">{t('View All')}</Link>
          </Button>
        )}
      </SectionHeading>
      {actionInHeader && (
        <p className="text-sm text-muted-foreground">
          {t('A curated selection from our catalog.')}
        </p>
      )}
      {loading && (
        <div role="status" aria-busy="true" className="relative">
          <span className="sr-only">{t('Loading products…')}</span>
          <div
            aria-hidden="true"
            className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {Array.from({ length: skeletonCount }, (_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-64" />
                <div className="h-12">
                  <Skeleton className="h-5 w-4/5" />
                </div>
                <Skeleton className="h-6 w-2/5" />
              </div>
            ))}
          </div>
        </div>
      )}
      <RequestState error={error} onRetry={onRetry} />
      {!loading && !error && products.length === 0 && (
        <p role="status" className="py-6 text-muted-foreground">
          {t('No products available in this selection.')}
        </p>
      )}
      {!loading && !error && products.length > 0 && (
        <ul
          aria-label={t(title || '')}
          className="grid min-w-0 grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((product) => (
            <li key={product.id} className="min-w-0">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
      {!actionInHeader && (
        <div className="pt-2 text-center">
          <Button asChild className="h-12 rounded-sm px-10">
            <Link to="/products">{t('View All Products')}</Link>
          </Button>
        </div>
      )}
    </section>
  )
}

export default HomeProductSection
