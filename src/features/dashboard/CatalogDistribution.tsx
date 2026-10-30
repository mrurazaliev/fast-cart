import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { CategoryDistribution } from './dashboardApi'

const CatalogDistribution = ({ items }: { items: CategoryDistribution[] }) => {
  const maximum = Math.max(1, ...items.map((item) => item.count))
  return (
    <section
      aria-labelledby="catalog-distribution-heading"
      className="min-w-0 space-y-5 rounded-sm border p-5"
    >
      <div className="space-y-1">
        <h2 id="catalog-distribution-heading" className="font-semibold">
          Products by category
        </h2>
        <p className="text-sm text-muted-foreground">
          Product counts across the complete catalog.
        </p>
      </div>
      {items.length > 0 ? (
        <ul
          tabIndex={0}
          aria-label="Product counts by category"
          className="max-h-80 space-y-5 overflow-y-auto pr-2 focus-visible:outline-2 focus-visible:outline-primary"
        >
          {items.map((item) => (
            <li key={item.id ?? 'unknown'} className="space-y-2">
              <div className="flex items-start justify-between gap-4 text-sm">
                <span className="min-w-0 break-words">{item.name}</span>
                <span className="shrink-0 font-medium">
                  {item.count.toLocaleString('en-US')}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="h-2 overflow-hidden rounded-full bg-primary/10"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(item.count / maximum) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div role="status" className="space-y-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No products to group yet.
          </p>
          <Button asChild>
            <Link to="/products/new">Add product</Link>
          </Button>
        </div>
      )}
    </section>
  )
}
export default CatalogDistribution
