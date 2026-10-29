import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { PackageOpen, Pencil, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { store } from '@/app/store'
import { readProductsQuery } from '@/features/products/productsApi'
import {
  fetchProducts,
  productSaveNoticeSet,
} from '@/features/products/productsSlice'
import ProductSearch from '@/features/products/ProductSearch'
import ProductsTable from '@/features/products/ProductsTable'
import ProductsPagination from '@/features/products/ProductsPagination'
import ProductDeletion from '@/features/products/ProductDeletion'
import type {
  DeletionProduct,
  ProductDeletionResult,
} from '@/features/products/productDeletionApi'
import RequestState from '@/shared/components/RequestState'
import { Button } from '@/components/ui/button'

const Products = () => {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const query = useMemo(() => readProductsQuery(params), [params])
  const queryKey = JSON.stringify(query)
  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.products)
  const current = products.queryKey === queryKey
  const loading =
    !current || products.status === 'idle' || products.status === 'pending'
  const unavailableId = useId()
  const deletedPage = useRef<string | null>(null)
  const [selection, setSelection] = useState<{
    requestId: string | null
    ids: number[]
  }>({ requestId: null, ids: [] })
  const [deletion, setDeletion] = useState<{
    queryKey: string
    products: DeletionProduct[]
    bulk: boolean
  } | null>(null)
  const selectedIds =
    current &&
    products.status === 'succeeded' &&
    selection.requestId === products.requestId
      ? selection.ids.filter((id) =>
          products.items.some((product) => product.id === id),
        )
      : []
  let emptyTitle = 'No products yet'
  if (query.PageNumber > 1) emptyTitle = 'No products on this page'
  else if (query.ProductName) emptyTitle = 'No products found'

  useEffect(() => {
    const request = dispatch(fetchProducts(query))
    return () => request.abort()
  }, [dispatch, query])

  useEffect(() => {
    if (deletedPage.current !== queryKey) {
      deletedPage.current = null
      return
    }
    if (!current || products.status !== 'succeeded') return
    deletedPage.current = null
    if (products.items.length > 0 || query.PageNumber <= 1) return
    const page = Math.max(
      1,
      Math.min(
        query.PageNumber - 1,
        products.totalPage || query.PageNumber - 1,
      ),
    )
    const next = new URLSearchParams(params)
    if (page > 1) next.set('PageNumber', String(page))
    else next.delete('PageNumber')
    setParams(next)
  }, [
    current,
    products.status,
    products.items.length,
    products.totalPage,
    query.PageNumber,
    queryKey,
    params,
    setParams,
  ])

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

  const handleDeleted = async (
    result: ProductDeletionResult,
    signal: AbortSignal,
  ) => {
    if (signal.aborted || store.getState().products.queryKey !== queryKey)
      return
    const remainingIds = [
      ...result.failed.map((item) => item.product.id),
      ...result.uncertain.map((item) => item.id),
      ...result.notAttempted.map((item) => item.id),
    ]
    if (result.deleted.length + result.absent.length > 0)
      deletedPage.current = queryKey
    const request = dispatch(fetchProducts(query))
    const abort = () => request.abort()
    signal.addEventListener('abort', abort, { once: true })
    try {
      const refreshed = await request
      if (
        signal.aborted ||
        store.getState().products.requestId !== refreshed.meta.requestId
      )
        return
      if (!fetchProducts.fulfilled.match(refreshed))
        throw new Error(
          'Deletion results are shown below. The list could not be refreshed; close this dialog and use Try again before continuing.',
        )
      setSelection({
        requestId: refreshed.meta.requestId,
        ids: remainingIds.filter((id) =>
          refreshed.payload.data.products.some((product) => product.id === id),
        ),
      })
    } finally {
      signal.removeEventListener('abort', abort)
    }
  }

  return (
    <section aria-labelledby="products-heading" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="products-heading" className="text-2xl font-semibold">
          Products
        </h1>
        <Button asChild>
          <Link
            to="/products/new"
            state={{ returnTo: `${location.pathname}${location.search}` }}
          >
            <Plus aria-hidden="true" />
            Add product
          </Link>
        </Button>
      </div>
      <p id={unavailableId} className="text-sm text-muted-foreground">
        Bulk editing is unavailable. Use a row's Edit action to edit one
        product.
      </p>
      {products.saveNotice && (
        <div
          role="alert"
          className="space-y-3 rounded-sm border border-amber-300 p-4 text-sm"
        >
          <p>{products.saveNotice}</p>
          <Button
            variant="outline"
            onClick={() => dispatch(productSaveNoticeSet(null))}
          >
            Dismiss save notice
          </Button>
        </div>
      )}
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
            disabled={selectedIds.length === 0}
            aria-label="Delete selected products"
            onClick={() =>
              setDeletion({
                queryKey,
                products: products.items.filter((product) =>
                  selectedIds.includes(product.id),
                ),
                bulk: true,
              })
            }
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
              selectedIds={selectedIds}
              onSelectionChange={(ids) =>
                setSelection({ requestId: products.requestId, ids })
              }
              onDelete={(product) =>
                setDeletion({ queryKey, products: [product], bulk: false })
              }
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
      {deletion && (
        <ProductDeletion
          key={deletion.queryKey}
          products={deletion.products}
          bulk={deletion.bulk}
          contextKey={queryKey}
          expectedKey={deletion.queryKey}
          onClose={() => setDeletion(null)}
          onDeleted={handleDeleted}
        />
      )}
    </section>
  )
}

export default Products
