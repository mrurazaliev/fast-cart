import { getLocale } from '@/shared/i18n/i18n'
import { useText } from '@/shared/i18n/useText'
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

const getStockLabel = (quantity: Product['quantity']) => {
  if (quantity === null || quantity === undefined) return 'Stock unknown'
  if (quantity === 0) return 'Out of stock'
  return `${quantity} in stock`
}

const ProductsTable = ({
  products,
  selectedIds,
  onSelectionChange,
  onDelete,
}: {
  products: Product[]
  selectedIds: number[]
  onSelectionChange: (ids: number[]) => void
  onDelete: (product: Product) => void
}) => {
  const { t } = useText()
  const priceFormatter = new Intl.NumberFormat(getLocale(), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const location = useLocation()
  const allSelected =
    products.length > 0 && selectedIds.length === products.length
  let pageSelection: boolean | 'indeterminate' = false
  if (allSelected) pageSelection = true
  else if (selectedIds.length > 0) pageSelection = 'indeterminate'
  const handleSelect = (id: number, selected: boolean) => {
    onSelectionChange(
      selected
        ? [...selectedIds.filter((item) => item !== id), id]
        : selectedIds.filter((item) => item !== id),
    )
  }
  return (
    <div className="space-y-3">
      <Table className="min-w-[760px]">
        <caption className="sr-only">
          {t('Products on the current page')}
        </caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-10">
              <Checkbox
                aria-label={t('Select all products on this page')}
                checked={pageSelection}
                onCheckedChange={(checked) =>
                  onSelectionChange(
                    checked === true
                      ? products.map((product) => product.id)
                      : [],
                  )
                }
              />
            </TableHead>
            <TableHead scope="col">{t('Product')}</TableHead>
            <TableHead scope="col">{t('Inventory')}</TableHead>
            <TableHead scope="col">{t('Category')}</TableHead>
            <TableHead scope="col">{t('Price')}</TableHead>
            <TableHead scope="col" className="text-right">
              {t('Actions')}
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
                  aria-label={t('Select {{value0}}', {
                    value0: product.productName,
                  })}
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
                  {t(getStockLabel(product.quantity))}
                </span>
              </TableCell>
              <TableCell>
                {product.categoryName?.trim() || t('Category unavailable')}
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
                      aria-label={t('Edit {{value0}}', {
                        value0: product.productName,
                      })}
                    >
                      <Pencil aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t('Delete {{value0}}', {
                      value0: product.productName,
                    })}
                    onClick={() => onDelete(product)}
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
          ? t('{{value0}} selected on this page', {
              value0: selectedIds.length,
            })
          : t('Select products using the checkboxes.')}
      </p>
    </div>
  )
}

export default ProductsTable
