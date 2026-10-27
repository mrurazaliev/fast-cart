import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { readCatalogQuery } from '@/features/products/catalogApi'
import { fetchCatalog } from '@/features/products/catalogSlice'
import { fetchCategories } from '@/features/categories/categoriesSlice'
import ProductCard from '@/shared/components/ProductCard'
import RequestState from '@/shared/components/RequestState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const Products = () => {
  const [params, setParams] = useSearchParams()
  const query = useMemo(() => readCatalogQuery(params), [params])
  const queryKey = JSON.stringify(query)
  const dispatch = useAppDispatch()
  const catalog = useAppSelector((state) => state.catalog)
  const categories = useAppSelector((state) => state.categories)
  const current = catalog.queryKey === queryKey
  const loading =
    !current || catalog.status === 'idle' || catalog.status === 'pending'

  useEffect(() => {
    const request = dispatch(fetchCatalog(query))
    return () => request.abort()
  }, [dispatch, query])

  useEffect(() => {
    void dispatch(fetchCategories())
  }, [dispatch])

  const changeCategory = (id?: number) => {
    const next = new URLSearchParams(params)
    next.delete('PageNumber')
    next.delete('SubcategoryId')
    if (id) next.set('CategoryId', String(id))
    else next.delete('CategoryId')
    setParams(next)
  }

  const changePage = (page: number) => {
    const next = new URLSearchParams(params)
    next.set('PageNumber', String(page))
    setParams(next)
  }

  return (
    <div className="container py-10 sm:py-16">
      <nav
        aria-label="Breadcrumb"
        className="mb-10 flex gap-3 text-sm sm:mb-14"
      >
        <Link to="/" className="text-muted-foreground hover:underline">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span>Explore Our Products</span>
      </nav>
      <div className="grid min-w-0 gap-8 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
        <aside
          aria-label="Product categories"
          className="space-y-4 border-t pt-4"
        >
          <h2 className="font-semibold">Category</h2>
          <Button
            variant="ghost"
            onClick={() => changeCategory()}
            className={
              !query.CategoryId && !query.SubcategoryId ? 'text-primary' : ''
            }
          >
            All products
          </Button>
          <RequestState
            loading={categories.status === 'pending'}
            error={categories.error}
            onRetry={() => void dispatch(fetchCategories())}
          />
          {categories.status === 'succeeded' &&
            categories.items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No categories available.
              </p>
            )}
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
            {categories.items.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => changeCategory(category.id)}
                  aria-pressed={query.CategoryId === category.id}
                  className="rounded-sm px-3 py-2 text-left text-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-primary aria-pressed:text-primary"
                >
                  {category.categoryName}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section
          aria-labelledby="catalog-heading"
          className="min-w-0 space-y-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <h1
                id="catalog-heading"
                className="text-2xl font-semibold break-words"
              >
                {query.ProductName
                  ? `Results for �${query.ProductName}�`
                  : 'Explore Our Products'}
              </h1>
              {current && catalog.status === 'succeeded' && (
                <p role="status" className="text-sm text-muted-foreground">
                  {catalog.totalRecord} products
                </p>
              )}
            </div>
            {(query.ProductName || query.CategoryId || query.SubcategoryId) && (
              <Button variant="outline" onClick={() => setParams({})}>
                Clear search and filters
              </Button>
            )}
          </div>
          {loading && (
            <div role="status" aria-busy="true">
              <span className="sr-only">Loading products</span>
              <div
                aria-hidden="true"
                className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3"
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {current && (
            <RequestState
              error={catalog.error}
              onRetry={() => void dispatch(fetchCatalog(query))}
            />
          )}
          {current && catalog.status === 'succeeded' && (
            <>
              {catalog.items.length === 0 ? (
                <p role="status" className="py-12 text-muted-foreground">
                  No products found. Try a different search or clear the
                  filters.
                </p>
              ) : (
                <ul
                  aria-label="Products"
                  className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {catalog.items.map((product) => (
                    <li key={product.id} className="min-w-0">
                      <ProductCard product={product} />
                    </li>
                  ))}
                </ul>
              )}
              {catalog.totalPage > 1 && (
                <nav
                  aria-label="Catalog pages"
                  className="flex flex-wrap items-center justify-center gap-4 pt-6"
                >
                  <Button
                    variant="outline"
                    disabled={catalog.pageNumber <= 1}
                    onClick={() => changePage(catalog.pageNumber - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {catalog.pageNumber} of {catalog.totalPage}
                  </span>
                  <Button
                    disabled={catalog.pageNumber >= catalog.totalPage}
                    onClick={() => changePage(catalog.pageNumber + 1)}
                  >
                    Next
                  </Button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default Products
