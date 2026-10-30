import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import RequestState from '@/shared/components/RequestState'
import { fetchBrands } from '@/features/brands/brandsSlice'
import type { Brand } from '@/features/brands/brandsApi'
import BrandForm from '@/features/brands/BrandForm'
import BrandDeleteDialog from '@/features/brands/BrandDeleteDialog'
import OtherTabs from '@/shared/components/admin/OtherTabs'

const Brands = () => {
  const dispatch = useAppDispatch()
  const brands = useAppSelector((state) => state.brands)
  const [editing, setEditing] = useState<Brand | undefined>()
  const [formKey, setFormKey] = useState(0)
  const [formPending, setFormPending] = useState(false)
  const [deleting, setDeleting] = useState<Brand | null>(null)
  const [search, setSearch] = useState('')
  const items = brands.items.filter((brand) =>
    brand.brandName.toLowerCase().includes(search.trim().toLowerCase()),
  )
  useEffect(() => {
    const request = dispatch(fetchBrands())
    return () => request.abort()
  }, [dispatch])
  const handleCancel = () => {
    setEditing(undefined)
    setFormKey((value) => value + 1)
  }
  return (
    <section aria-labelledby="brands-heading" className="space-y-7">
      <h1 id="brands-heading" className="text-2xl font-semibold">
        Brands
      </h1>
      <OtherTabs />
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0 space-y-4">
          <label htmlFor="brand-search" className="sr-only">
            Search brands
          </label>
          <Input
            id="brand-search"
            type="search"
            placeholder="Search brands…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-12 rounded-sm"
          />
          {(brands.status === 'idle' || brands.status === 'pending') && (
            <RequestState loading />
          )}
          {brands.status === 'failed' && (
            <RequestState
              error={brands.error}
              onRetry={() => void dispatch(fetchBrands())}
            />
          )}
          {brands.status === 'succeeded' && (
            <>
              <div className="flex justify-between border-b pb-3 text-sm text-muted-foreground">
                <span>Brands</span>
                <span>Actions</span>
              </div>
              {items.length > 0 ? (
                <ul
                  aria-label="Brand list"
                  className="max-h-[36rem] divide-y overflow-y-auto pr-2"
                >
                  {items.map((brand) => (
                    <li
                      key={brand.id}
                      className={`flex min-h-14 items-center justify-between gap-3 py-2 ${editing?.id === brand.id ? 'bg-primary/5' : ''}`}
                    >
                      <span className="min-w-0 break-words">
                        {brand.brandName}
                      </span>
                      <div className="flex shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={formPending}
                          className="text-primary"
                          aria-label={`Edit ${brand.brandName}`}
                          onClick={() => {
                            setEditing(brand)
                            setFormKey((value) => value + 1)
                          }}
                        >
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={formPending}
                          className="text-destructive"
                          aria-label={`Delete ${brand.brandName}`}
                          onClick={() => setDeleting(brand)}
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div role="status" className="space-y-3 py-10 text-center">
                  <h2 className="font-semibold">
                    {brands.items.length ? 'No brands found' : 'No brands yet'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {brands.items.length
                      ? 'Try another name or clear the search.'
                      : 'Create a brand using the form.'}
                  </p>
                  {search && (
                    <Button variant="outline" onClick={() => setSearch('')}>
                      Clear search
                    </Button>
                  )}
                </div>
              )}
              <p role="status" className="text-sm text-muted-foreground">
                {items.length} brands
              </p>
            </>
          )}
        </div>
        <BrandForm
          key={formKey}
          brand={editing}
          onCancel={handleCancel}
          onPendingChange={setFormPending}
        />
      </div>
      {deleting && (
        <BrandDeleteDialog
          brand={deleting}
          onDeleted={() => {
            if (editing?.id === deleting.id) handleCancel()
          }}
          onClose={() => {
            setDeleting(null)
          }}
        />
      )}
    </section>
  )
}
export default Brands
