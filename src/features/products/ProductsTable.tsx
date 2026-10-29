import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Product } from './productsApi'
import ProductImage from './ProductImage'

const priceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const getStockLabel = (quantity: Product['quantity']) => {
  if (quantity === null || quantity === undefined) return 'Stock unknown'
  if (quantity === 0) return 'Out of stock'
  return `${quantity} in stock`
}

const ProductsTable = ({
  products,
  unavailableId,
}: {
  products: Product[]
  unavailableId: string
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const location = useLocation()
  const allSelected =
    products.length > 0 && selectedIds.length === products.length
  let pageSelection: boolean | 'indeterminate' = false
  if (allSelected) pageSelection = true
  else if (selectedIds.length > 0) pageSelection = 'indeterminate'
  const handleSelect = (id: number, selected: boolean) => {
    setSelectedIds((ids) =>
      selected
        ? [...ids.filter((item) => item !== id), id]
        : ids.filter((item) => item !== id),
    )
  }
  return (
    <div className="space-y-3">
      <Table className="min-w-[760px]">
        <caption className="sr-only">Products on the current page</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-10">
              <Checkbox
                aria-label="Select all products on this page"
                checked={pageSelection}
                onCheckedChange={(checked) =>
                  setSelectedIds(
                    checked === true
                      ? products.map((product) => product.id)
                      : [],
                  )
                }
              />
            </TableHead>
            <TableHead scope="col">Product</TableHead>
            <TableHead scope="col">Inventory</TableHead>
            <TableHead scope="col">Category</TableHead>
            <TableHead scope="col">Price</TableHead>
            <TableHead scope="col" className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              data-state={
                selectedIds.includes(product.id) ? 'selected' : undefined
              }
            >
              <TableCell>
                <Checkbox
                  aria-label={`Select ${product.productName}`}
                  checked={selectedIds.includes(product.id)}
                  onCheckedChange={(checked) =>
                    handleSelect(product.id, checked === true)
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex min-w-56 max-w-sm items-center gap-4">
                  <ProductImage
                    image={product.image}
                    name={product.productName}
                  />
                  <span className="break-words">{product.productName}</span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <span
                  className={
                    product.quantity === 0
                      ? 'rounded-sm bg-secondary px-2 py-1 text-xs text-muted-foreground'
                      : undefined
                  }
                >
                  {getStockLabel(product.quantity)}
                </span>
              </TableCell>
              <TableCell>
                {product.categoryName?.trim() || 'Category unavailable'}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {priceFormatter.format(product.price)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-primary"
                  >
                    <Link
                      to={`/products/${product.id}/edit`}
                      state={{
                        returnTo: `${location.pathname}${location.search}`,
                      }}
                      aria-label={`Edit ${product.productName}`}
                    >
                      <Pencil aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled
                    aria-label={`Delete ${product.productName}`}
                    aria-describedby={unavailableId}
                    title="Deleting products is unavailable at this stage"
                    className="text-destructive"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {selectedIds.length > 0
          ? `${selectedIds.length} selected on this page`
          : 'Select products using the checkboxes.'}
      </p>
    </div>
  )
}

export default ProductsTable
