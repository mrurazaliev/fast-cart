import { ChevronDown } from 'lucide-react'
import CategoryMenu from '@/features/categories/CategoryMenu'
import HeroBanner from '@/shared/components/home/HeroBanner'
import FlashSales from '@/features/products/FlashSales'
import BrowseCategories from '@/features/categories/BrowseCategories'
import HomeProductSections from '@/features/products/HomeProductSections'
import NewArrival from '@/features/products/NewArrival'
import ServicesSection from '@/shared/components/home/ServicesSection'

const Home = () => {
  return (
    <>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0 lg:-mt-10 lg:border-r lg:pt-10 lg:pr-6">
          <div className="hidden lg:block">
            <CategoryMenu />
          </div>
          <details className="rounded-sm border lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
              Browse categories
              <ChevronDown className="size-4" aria-hidden="true" />
            </summary>
            <div className="border-t px-4 py-2">
              <CategoryMenu />
            </div>
          </details>
        </aside>
        <HeroBanner />
      </div>
      <FlashSales />
      <BrowseCategories />
      <HomeProductSections />
      <NewArrival />
      <ServicesSection />
    </>
  )
}

export default Home
