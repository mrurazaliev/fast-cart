import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import RequestState from '@/shared/components/RequestState'
import { fetchCategories } from '@/features/categories/categoriesSlice'
import { deleteCategory } from '@/features/categories/categoriesApi'
import type { Category } from '@/features/categories/categoriesApi'
import CategoryForm from '@/features/categories/CategoryForm'
import CategoryDeleteDialog from '@/features/categories/CategoryDeleteDialog'
import CategoryImage from '@/features/categories/CategoryImage'
import CategoryPagination from '@/features/categories/CategoryPagination'
import OtherTabs from '@/shared/components/admin/OtherTabs'

const Categories = () => {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.categories)
  const [params, setParams] = useSearchParams()
  const [form, setForm] = useState<{ category?: Category } | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const search = params.get('search') || ''
  const filtered = categories.items.filter((item) =>
    item.categoryName.toLowerCase().includes(search.trim().toLowerCase()),
  )
  const totalPages = Math.ceil(filtered.length / 15)
  const requestedPage = Number(params.get('page'))
  const page = Math.min(
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1,
    Math.max(1, totalPages),
  )
  const visible = filtered.slice((page - 1) * 15, page * 15)
  useEffect(() => {
    const request = dispatch(fetchCategories())
    return () => request.abort()
  }, [dispatch])
  const handleSearch = (value: string) => {
    const next = new URLSearchParams(params)
    next.delete('page')
    if (value) next.set('search', value)
    else next.delete('search')
    setParams(next, { replace: true })
  }
  return (
    <section aria-labelledby="categories-heading" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="categories-heading" className="text-2xl font-semibold">
          Categories
        </h1>
        <Button
          disabled={categories.status !== 'succeeded'}
          onClick={() => setForm({})}
        >
          <Plus aria-hidden="true" />
          Add category
        </Button>
      </div>
      <OtherTabs />
      <div className="max-w-xs space-y-2">
        <label htmlFor="category-search" className="sr-only">
          Search categories
        </label>
        <Input
          id="category-search"
          type="search"
          value={search}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search categories…"
          className="h-14 rounded-sm"
        />
      </div>
      {(categories.status === 'idle' || categories.status === 'pending') && (
        <RequestState loading />
      )}
      {categories.status === 'failed' && (
        <RequestState
          error={categories.error}
          onRetry={() => void dispatch(fetchCategories())}
        />
      )}
      {categories.status === 'succeeded' && (
        <>
          {visible.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {visible.map((category) => (
                <article
                  key={category.id}
                  className="relative min-w-0 space-y-4 rounded-sm border p-5"
                >
                  <div className="pr-12">
                    <CategoryImage
                      image={category.categoryImage}
                      name={category.categoryName}
                    />
                  </div>
                  <h2 className="break-words font-medium">
                    {category.categoryName}
                  </h2>
                  <div className="absolute top-3 right-2 flex flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${category.categoryName}`}
                      className="text-primary"
                      onClick={() => setForm({ category })}
                    >
                      <Pencil aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${category.categoryName}`}
                      className="text-destructive"
                      onClick={() => setDeleting(category)}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                  <Button
                    asChild
                    variant="link"
                    className="h-auto whitespace-normal p-0 text-left"
                  >
                    <Link to={`/subcategories?CategoryId=${category.id}`}>
                      {category.subCategories.length} subcategories
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <div role="status" className="space-y-3 py-16 text-center">
              <h2 className="text-xl font-semibold">
                {categories.items.length
                  ? 'No categories found'
                  : 'No categories yet'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {categories.items.length
                  ? 'Try another name or clear the search.'
                  : 'Add a category to start organizing products.'}
              </p>
              {search && (
                <Button variant="outline" onClick={() => handleSearch('')}>
                  Clear search
                </Button>
              )}
            </div>
          )}
          <CategoryPagination
            page={page}
            totalPages={totalPages}
            totalResults={filtered.length}
            onChange={(value) => {
              const next = new URLSearchParams(params)
              if (value > 1) next.set('page', String(value))
              else next.delete('page')
              setParams(next)
            }}
          />
        </>
      )}
      {form && (
        <CategoryForm category={form.category} onClose={() => setForm(null)} />
      )}
      {deleting && (
        <CategoryDeleteDialog
          name={deleting.categoryName}
          subject="category"
          onDelete={(signal) => deleteCategory(deleting.id, signal)}
          onClose={() => setDeleting(null)}
        />
      )}
    </section>
  )
}
export default Categories
