import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Layers, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchCategories } from '@/features/categories/categoriesSlice'
import SubcategoryForm from '@/features/categories/SubcategoryForm'
import CategoryDeleteDialog from '@/features/categories/CategoryDeleteDialog'
import { deleteSubcategory } from '@/features/categories/subcategoriesApi'
import type { Subcategory } from '@/features/categories/subcategoriesApi'
import RequestState from '@/shared/components/RequestState'
import CategoryPagination from '@/features/categories/CategoryPagination'
import OtherTabs from '@/shared/components/admin/OtherTabs'

const Subcategories = () => {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.categories)
  const [params, setParams] = useSearchParams()
  const rawCategoryId = params.get('CategoryId') || ''
  const categoryId =
    /^[1-9]\d*$/.test(rawCategoryId) && Number(rawCategoryId) <= 2147483647
      ? Number(rawCategoryId)
      : null
  const selectedCategory = categories.items.find(
    (category) => category.id === categoryId,
  )
  const search = params.get('Search') || ''
  const rawPage = Number(params.get('Page') || 1)
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1
  const [form, setForm] = useState<{
    subcategoryId?: number
    categoryId: number | null
  } | null>(null)
  const [deleting, setDeleting] = useState<Subcategory | null>(null)
  const items = (selectedCategory?.subCategories || []).filter((subcategory) =>
    subcategory.subCategoryName
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  )
  const totalPages = Math.ceil(items.length / 10)
  const currentPage = Math.min(page, Math.max(1, totalPages))
  const pageItems = items.slice((currentPage - 1) * 10, currentPage * 10)
  useEffect(() => {
    const request = dispatch(fetchCategories())
    return () => request.abort()
  }, [dispatch])
  const handleCategoryChange = (value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set('CategoryId', value)
    else next.delete('CategoryId')
    next.delete('Search')
    next.delete('Page')
    setParams(next)
  }
  const handleSearch = (value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set('Search', value)
    else next.delete('Search')
    next.delete('Page')
    setParams(next)
  }
  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(params)
    if (value > 1) next.set('Page', String(value))
    else next.delete('Page')
    setParams(next)
  }
  return (
    <section aria-labelledby="subcategories-heading" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <OtherTabs />
        <Button
          onClick={() => setForm({ categoryId })}
          disabled={
            categories.status !== 'succeeded' || categories.items.length === 0
          }
        >
          <Plus aria-hidden="true" />
          Add subcategory
        </Button>
      </div>
      <h1 id="subcategories-heading" className="text-2xl font-semibold">
        Subcategories
      </h1>
      {categories.status === 'idle' || categories.status === 'pending' ? (
        <RequestState loading />
      ) : null}
      {categories.status === 'failed' && (
        <RequestState
          error={categories.error}
          onRetry={() => void dispatch(fetchCategories())}
        />
      )}
      {categories.status === 'succeeded' && (
        <>
          {categories.items.length === 0 ? (
            <div className="space-y-4 py-10">
              <p>
                No categories yet. Create a category before adding
                subcategories.
              </p>
              <Button asChild>
                <Link to="/categories">Go to categories</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-end gap-4">
                <div className="w-full space-y-2 sm:max-w-sm">
                  <label
                    htmlFor="subcategory-parent"
                    className="text-sm font-medium"
                  >
                    Category
                  </label>
                  <select
                    id="subcategory-parent"
                    value={categoryId || ''}
                    onChange={(event) =>
                      handleCategoryChange(event.target.value)
                    }
                    className="h-12 w-full min-w-0 rounded-sm border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <option value="">Choose a category</option>
                    {categories.items.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCategory && (
                  <div className="relative w-full sm:max-w-[250px]">
                    <label htmlFor="subcategory-search" className="sr-only">
                      Search subcategories
                    </label>
                    <Input
                      id="subcategory-search"
                      type="search"
                      value={search}
                      onChange={(event) => handleSearch(event.target.value)}
                      placeholder="Search subcategories…"
                      className="h-12 rounded-sm pr-10 shadow-none"
                    />
                    <Search
                      aria-hidden="true"
                      className="pointer-events-none absolute top-4 right-3 size-4 text-muted-foreground"
                    />
                  </div>
                )}
              </div>
              {!selectedCategory && (
                <p
                  role="status"
                  className="py-10 text-sm text-muted-foreground"
                >
                  {categoryId
                    ? 'This category is no longer available. Choose another category.'
                    : 'Choose a category to view its subcategories.'}
                </p>
              )}
              {selectedCategory && (
                <section
                  aria-labelledby="selected-category-heading"
                  className="space-y-4"
                >
                  <h2
                    id="selected-category-heading"
                    className="text-lg font-semibold"
                  >
                    {selectedCategory.categoryName}
                  </h2>
                  {pageItems.length > 0 ? (
                    <ul className="divide-y rounded-sm border">
                      {pageItems.map((subcategory) => (
                        <li
                          key={subcategory.id}
                          className="flex items-center justify-between gap-4 p-4"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <Layers
                              aria-hidden="true"
                              className="size-5 shrink-0 text-muted-foreground"
                            />
                            <span className="break-words">
                              {subcategory.subCategoryName}
                            </span>
                          </span>
                          <div className="flex shrink-0 gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary"
                              aria-label={`Edit ${subcategory.subCategoryName}`}
                              onClick={() =>
                                setForm({
                                  subcategoryId: subcategory.id,
                                  categoryId: selectedCategory.id,
                                })
                              }
                            >
                              <Pencil aria-hidden="true" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              aria-label={`Delete ${subcategory.subCategoryName}`}
                              onClick={() => setDeleting(subcategory)}
                            >
                              <Trash2 aria-hidden="true" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div role="status" className="space-y-3 py-10 text-center">
                      <h3 className="font-semibold">
                        {selectedCategory.subCategories.length > 0
                          ? 'No matching subcategories'
                          : 'No subcategories yet'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedCategory.subCategories.length > 0
                          ? 'Try another name or clear the search.'
                          : 'Add a subcategory to this category.'}
                      </p>
                      {search && (
                        <Button
                          variant="outline"
                          onClick={() => handleSearch('')}
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  )}
                  <CategoryPagination
                    page={currentPage}
                    totalPages={totalPages}
                    totalResults={items.length}
                    onChange={handlePageChange}
                  />
                </section>
              )}
            </>
          )}
        </>
      )}
      {form && (
        <SubcategoryForm
          subcategoryId={form.subcategoryId}
          categoryId={form.categoryId}
          onClose={() => setForm(null)}
        />
      )}
      {deleting && (
        <CategoryDeleteDialog
          name={deleting.subCategoryName}
          subject="subcategory"
          onDelete={(signal) => deleteSubcategory(deleting.id, signal)}
          onClose={() => setDeleting(null)}
        />
      )}
    </section>
  )
}

export default Subcategories
