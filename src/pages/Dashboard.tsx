import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FolderTree,
  Package,
  Tags,
  ChartNoAxesCombined,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { fetchDashboard } from '@/features/dashboard/dashboardSlice'
import CatalogDistribution from '@/features/dashboard/CatalogDistribution'
import DashboardProducts from '@/features/dashboard/DashboardProducts'
import ProductImage from '@/features/products/ProductImage'
import RequestState from '@/shared/components/RequestState'

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const { status, error, data } = useAppSelector((state) => state.dashboard)
  useEffect(() => {
    const request = dispatch(fetchDashboard())
    return () => request.abort()
  }, [dispatch])
  const categories = data
    ? [...data.categories]
        .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
        .slice(0, 5)
    : []
  return (
    <section aria-labelledby="dashboard-heading" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="dashboard-heading" className="text-2xl font-semibold">
          Dashboard
        </h1>
        <Button asChild variant="outline">
          <Link to="/products">
            Manage products
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
      {(status === 'idle' || status === 'pending') && (
        <div aria-busy="true" className="min-h-72 py-12">
          <RequestState loading />
        </div>
      )}
      {status === 'failed' && (
        <RequestState
          error={error}
          onRetry={() => void dispatch(fetchDashboard())}
        />
      )}
      {status === 'succeeded' && data && (
        <>
          <p className="text-sm text-muted-foreground">
            Current catalog overview. Figures describe catalog records and stock
            availability.
          </p>
          {data.totalProducts === 0 && (
            <div
              role="status"
              className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-primary/20 bg-primary/5 p-4"
            >
              <p>The product catalog is empty.</p>
              <Button asChild>
                <Link to="/products/new">Add product</Link>
              </Button>
            </div>
          )}
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(250px,1fr)]">
            <div className="min-w-0 space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Link
                  to="/products"
                  className="flex min-w-0 items-center gap-4 rounded-sm bg-rose-50 p-5 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Package
                    aria-hidden="true"
                    className="size-9 shrink-0 text-rose-400"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="text-2xl font-semibold">
                      {data.totalProducts.toLocaleString('en-US')}
                    </p>
                  </div>
                </Link>
                <Link
                  to="/categories"
                  className="flex min-w-0 items-center gap-4 rounded-sm bg-amber-50 p-5 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <FolderTree
                    aria-hidden="true"
                    className="size-9 shrink-0 text-amber-400"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <p className="text-2xl font-semibold">
                      {data.categories.length.toLocaleString('en-US')}
                    </p>
                  </div>
                </Link>
                <Link
                  to="/brands"
                  className="flex min-w-0 items-center gap-4 rounded-sm bg-emerald-50 p-5 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Tags
                    aria-hidden="true"
                    className="size-9 shrink-0 text-emerald-400"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">Brands</p>
                    <p className="text-2xl font-semibold">
                      {data.brands.length.toLocaleString('en-US')}
                    </p>
                  </div>
                </Link>
              </div>
              <CatalogDistribution items={data.distribution} />
            </div>
            <section
              aria-labelledby="dashboard-categories-heading"
              className="min-w-0 space-y-5 rounded-sm border p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="dashboard-categories-heading" className="font-semibold">
                  Categories
                </h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/categories">
                    See all
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              {categories.length > 0 ? (
                <ul className="space-y-5">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/subcategories?CategoryId=${category.id}`}
                        className="flex items-center gap-3 hover:text-primary"
                      >
                        <ProductImage
                          image={category.categoryImage}
                          name={category.categoryName}
                        />
                        <div className="min-w-0">
                          <p className="break-words text-sm font-medium">
                            {category.categoryName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {category.subCategories.length} subcategories
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p role="status" className="text-sm text-muted-foreground">
                  No categories yet.
                </p>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link to="/banners">Banner previews</Link>
              </Button>
            </section>
          </div>
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div className="space-y-5">
              <section
                aria-labelledby="stock-overview-heading"
                className="space-y-4 rounded-sm border p-5"
              >
                <h2 id="stock-overview-heading" className="font-semibold">
                  Stock availability
                </h2>
                <dl className="divide-y text-sm">
                  <div className="flex justify-between gap-4 py-3">
                    <dt>Products in stock</dt>
                    <dd className="font-semibold">
                      {data.stock.available.toLocaleString('en-US')}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt>Out of stock</dt>
                    <dd className="font-semibold">
                      {data.stock.outOfStock.toLocaleString('en-US')}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt>Stock unknown</dt>
                    <dd className="font-semibold">
                      {data.stock.unknown.toLocaleString('en-US')}
                    </dd>
                  </div>
                </dl>
                <p className="text-xs text-muted-foreground">
                  Availability uses the catalog quantity. Missing quantities
                  remain unknown.
                </p>
              </section>
              <section
                aria-labelledby="financial-overview-heading"
                className="space-y-3 rounded-sm border bg-secondary/40 p-5"
              >
                <ChartNoAxesCombined
                  aria-hidden="true"
                  className="size-7 text-muted-foreground"
                />
                <h2 id="financial-overview-heading" className="font-semibold">
                  Financial analytics unavailable
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Sales, revenue, profit, orders, transactions and sales
                  rankings are not available from the current API. Monthly
                  trends cannot be shown.
                </p>
              </section>
            </div>
            <DashboardProducts products={data.products} />
          </div>
        </>
      )}
    </section>
  )
}
export default Dashboard
