import { useEffect, useId, useState } from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCategories } from '@/features/categories/categoriesSlice'
import { Button } from '@/components/ui/button'
import RequestState from '@/shared/components/RequestState'

const CategoryMenu = () => {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((state) => state.categories)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const menuId = useId()

  useEffect(() => {
    void dispatch(fetchCategories())
  }, [dispatch])

  const handleRetry = () => {
    void dispatch(fetchCategories())
  }

  return (
    <nav aria-label="Product categories" className="min-w-0">
      <RequestState
        loading={status === 'idle' || status === 'pending'}
        error={error}
        onRetry={handleRetry}
      />
      {status === 'succeeded' && items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No categories available yet.
        </p>
      )}
      {status === 'succeeded' && items.length > 0 && (
        <ul className="max-h-80 overflow-y-auto overscroll-contain pr-2 [scrollbar-width:thin] lg:max-h-86">
          {items.map((category) => (
            <li key={category.id}>
              <div className="flex min-w-0 items-center gap-2">
                <Link
                  to={{
                    pathname: '/products',
                    search: createSearchParams({
                      CategoryId: String(category.id),
                    }).toString(),
                  }}
                  className="min-w-0 flex-1 rounded-sm py-2.5 text-sm break-words hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {category.categoryName}
                </Link>
                {category.subCategories.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Subcategories of ${category.categoryName}`}
                    aria-expanded={expandedId === category.id}
                    aria-controls={`${menuId}-subcategories-${category.id}`}
                    className="size-8 shrink-0"
                    onClick={() =>
                      setExpandedId(
                        expandedId === category.id ? null : category.id,
                      )
                    }
                  >
                    {expandedId === category.id ? (
                      <ChevronDown className="size-4" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                )}
              </div>
              {category.subCategories.length > 0 && (
                <ul
                  id={`${menuId}-subcategories-${category.id}`}
                  hidden={expandedId !== category.id}
                  className="mb-2 space-y-1 border-l pl-3"
                >
                  {category.subCategories.map((subcategory) => (
                    <li key={subcategory.id}>
                      <Link
                        to={{
                          pathname: '/products',
                          search: createSearchParams({
                            SubcategoryId: String(subcategory.id),
                          }).toString(),
                        }}
                        className="block rounded-sm py-2 text-sm break-words text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        {subcategory.subCategoryName}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default CategoryMenu
