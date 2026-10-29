import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ProductsPagination = ({
  page,
  totalPages,
  totalResults,
  onChange,
}: {
  page: number
  totalPages: number
  totalResults: number
  onChange: (page: number) => void
}) => {
  const current = Math.min(page, totalPages)
  const pages = [...new Set([1, current - 1, current, current + 1, totalPages])]
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b)
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
      {totalPages > 1 && (
        <nav
          aria-label="Product pages"
          className="flex flex-wrap items-center gap-1"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          {pages.map((item, index) => (
            <span key={item} className="flex items-center gap-1">
              {index > 0 && item - (pages[index - 1] || 0) > 1 && (
                <span aria-hidden="true" className="px-2 text-muted-foreground">
                  …
                </span>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Page ${item}`}
                aria-current={page === item ? 'page' : undefined}
                className={
                  page === item
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground'
                }
                onClick={() => onChange(item)}
              >
                {item}
              </Button>
            </span>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
          >
            <ArrowRight aria-hidden="true" />
          </Button>
        </nav>
      )}
      <p role="status" className="text-sm text-muted-foreground">
        {totalResults.toLocaleString('en-US')} results
      </p>
    </div>
  )
}

export default ProductsPagination
