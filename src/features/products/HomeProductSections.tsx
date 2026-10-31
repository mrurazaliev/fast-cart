import { useText } from '@/shared/i18n/useText'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchProducts } from '@/features/products/productsSlice'
import { selectHomeProducts } from '@/features/products/homeProductSelectors'
import HomeProductSection from '@/features/products/HomeProductSection'
import MusicBanner from '@/shared/components/home/MusicBanner'

const HomeProductSections = () => {
  const { t } = useText()

  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.products)
  const { bestSelling, explore } = useAppSelector(selectHomeProducts)
  const loading = status === 'idle' || status === 'pending'

  useEffect(() => {
    void dispatch(fetchProducts())
  }, [dispatch])

  const handleRetry = () => {
    void dispatch(fetchProducts())
  }

  return (
    <>
      <HomeProductSection
        id="best-selling-title"
        label={t('This Month')}
        title={t('Best Selling Products')}
        products={bestSelling}
        loading={loading}
        error={error}
        skeletonCount={4}
        onRetry={handleRetry}
        actionInHeader
      />
      <MusicBanner />
      <HomeProductSection
        id="explore-products-title"
        label={t('Our Products')}
        title={t('Explore Our Products')}
        products={explore}
        loading={loading}
        error={error}
        skeletonCount={8}
        onRetry={handleRetry}
      />
    </>
  )
}

export default HomeProductSections
