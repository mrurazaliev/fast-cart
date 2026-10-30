import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ProductImage from '@/features/products/ProductImage'
import type { DashboardProduct } from './dashboardApi'

const priceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const DashboardProducts = ({ products }: { products: DashboardProduct[] }) => {
  const sample = [...products]
    .sort((a, b) => a.productName.localeCompare(b.productName) || a.id - b.id)
    .slice(0, 5)
  return (
    <section
      aria-labelledby="dashboard-products-heading"
      className="min-w-0 space-y-4 rounded-sm border p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="dashboard-products-heading" className="font-semibold">
          Catalog products
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link to="/products">
            See all
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Alphabetical preview of the current catalog.
      </p>
      {sample.length ? (
        <Table className="min-w-[430px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sample.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="flex min-w-44 items-center gap-3 text-sm hover:text-primary"
                  >
                    <ProductImage
                      image={product.image}
                      name={product.productName}
                    />
                    <span className="max-w-64 break-words">
                      {product.productName}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  {priceFormatter.format(product.price)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  {product.quantity === null || product.quantity === undefined
                    ? 'Unknown'
                    : product.quantity.toLocaleString('en-US')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p role="status" className="py-8 text-sm text-muted-foreground">
          No products yet.
        </p>
      )}
    </section>
  )
}
export default DashboardProducts
