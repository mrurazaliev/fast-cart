import { useEffect, useId, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PackageOpen, Pencil, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { readProductsQuery } from '@/features/products/productsApi'
import { fetchProducts } from '@/features/products/productsSlice'
import ProductSearch from '@/features/products/ProductSearch'
import ProductsTable from '@/features/products/ProductsTable'
import ProductsPagination from '@/features/products/ProductsPagination'
import RequestState from '@/shared/components/RequestState'
import { Button } from '@/components/ui/button'

const Products = () => {
  const [params, setParams] = useSearchParams()
  const query = useMemo(() => readProductsQuery(params), [params])
  const queryKey = JSON.stringify(query)
  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.products)
  const current = products.queryKey === queryKey
  const loading =
    !current || products.status === 'idle' || products.status === 'pending'
  const unavailableId = useId()
  let emptyTitle = 'No products yet'
  if (query.PageNumber > 1) emptyTitle = 'No products on this page'
  else if (query.ProductName) emptyTitle = 'No products found'

  useEffect(() => {
    const request = dispatch(fetchProducts(query))
    return () => request.abort()
  }, [dispatch, query])

  const handleSearch = (value: string) => {
    const next = new URLSearchParams(params)
    next.delete('PageNumber')
    if (value) next.set('ProductName', value)
    else next.delete('ProductName')
    setParams(next)
  }

  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(params)
    if (page > 1) next.set('PageNumber', String(page))
    else next.delete('PageNumber')
    setParams(next)
  }

  return (
    <section aria-labelledby="products-heading" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="products-heading" className="text-2xl font-semibold">
          Products
        </h1>
        <Button type="button" disabled aria-describedby={unavailableId}>
          <Plus aria-hidden="true" />
          Add product
        </Button>
      </div>
      <p id={unavailableId} className="text-sm text-muted-foreground">
        Adding, editing and deleting products are unavailable at this stage.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <ProductSearch
            key={query.ProductName || ''}
            value={query.ProductName || ''}
            onSearch={handleSearch}
          />
          {query.ProductName && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleSearch('')}
            >
              Clear search
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled
            aria-label="Edit selected products"
            aria-describedby={unavailableId}
            className="text-primary"
          >
            <Pencil aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled
            aria-label="Delete selected products"
            aria-describedby={unavailableId}
            className="text-destructive"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>
      {loading && (
        <div aria-busy="true" className="min-h-64 py-12">
          <RequestState loading />
        </div>
      )}
      {current && products.status === 'failed' && (
        <div className="py-8">
          <RequestState
            error={products.error}
            onRetry={() => void dispatch(fetchProducts(query))}
          />
        </div>
      )}
      {current && products.status === 'succeeded' && (
        <>
          {products.items.length > 0 ? (
            <ProductsTable
              key={products.requestId}
              products={products.items}
              unavailableId={unavailableId}
            />
          ) : (
            <div
              role="status"
              className="flex min-h-80 flex-col items-center justify-center gap-4 py-12 text-center"
            >
              <PackageOpen
                className="size-16 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="text-xl font-semibold">{emptyTitle}</h2>
              <p className="text-sm text-muted-foreground">
                {query.ProductName
                  ? 'Try another product name or clear the search.'
                  : 'The catalog has no products to display on this page.'}
              </p>
              {query.PageNumber > 1 && (
                <Button variant="outline" onClick={() => handlePageChange(1)}>
                  Go to first page
                </Button>
              )}
            </div>
          )}
          <ProductsPagination
            page={products.pageNumber}
            totalPages={products.totalPage}
            totalResults={products.totalRecord}
            onChange={handlePageChange}
          />
        </>
      )}
    </section>
  )
}

export default Products
