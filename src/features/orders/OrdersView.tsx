import { useId, useState } from 'react'
import { ChevronDown, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { OrdersViewState } from './orderDisplay'
import OrderStatusBadge from './OrderStatusBadge'
import OrdersState from './OrdersState'
import OrdersPagination from './OrdersPagination'

const OrdersSearch = ({
  query,
  onSearch,
  unavailableId,
}: {
  query: string
  onSearch?: (query: string) => void
  unavailableId: string
}) => {
  const [value, setValue] = useState(query)
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch?.(value.trim())
      }}
      className="relative w-full sm:w-[250px]"
    >
      <label htmlFor="orders-search" className="sr-only">
        Search orders
      </label>
      <Input
        id="orders-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={!onSearch}
        aria-describedby={!onSearch ? unavailableId : undefined}
        placeholder="Search…"
        className="h-14 rounded-sm pr-12 shadow-none"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label="Search orders"
        disabled={!onSearch}
        aria-describedby={!onSearch ? unavailableId : undefined}
        className="absolute top-2 right-2 text-muted-foreground"
      >
        <Search aria-hidden="true" />
      </Button>
    </form>
  )
}

const OrdersView = ({
  state,
  onRetry,
  onSearch,
  onPageChange,
}: {
  state: OrdersViewState
  onRetry?: () => void
  onSearch?: (query: string) => void
  onPageChange?: (page: number) => void
}) => {
  const unavailableId = useId()
  const ready = state.status === 'ready' ? state : null
  const rows = ready?.rows || []
  const scope = ready
    ? JSON.stringify([ready.page, ready.query, rows.map((row) => row.id)])
    : state.status
  const [selection, setSelection] = useState<{ scope: string; ids: string[] }>({
    scope: '',
    ids: [],
  })
  const selected =
    selection.scope === scope
      ? selection.ids.filter((id) => rows.some((row) => row.id === id))
      : []
  let checked: boolean | 'indeterminate' = false
  if (selected.length > 0)
    checked = selected.length === rows.length ? true : 'indeterminate'
  const selectRow = (id: string, value: boolean) =>
    setSelection({
      scope,
      ids: value
        ? [...selected.filter((item) => item !== id), id]
        : selected.filter((item) => item !== id),
    })
  let content = <OrdersState kind="unavailable" unavailableId={unavailableId} />
  if (state.status === 'loading')
    content = <OrdersState kind="loading" unavailableId={unavailableId} />
  else if (state.status === 'error')
    content = (
      <OrdersState
        kind="error"
        message={state.message}
        onRetry={onRetry}
        unavailableId={unavailableId}
      />
    )
  else if (ready)
    content = (
      <OrdersState
        kind={ready.query ? 'no-results' : 'empty'}
        onClear={onSearch ? () => onSearch('') : undefined}
        unavailableId={unavailableId}
      />
    )
  return (
    <section aria-labelledby="orders-heading" className="min-w-0">
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-4">
        <h1 id="orders-heading" className="text-[26px] leading-9 font-semibold">
          Orders
        </h1>
        <Button
          type="button"
          disabled
          aria-describedby={unavailableId}
          className="h-10 rounded-sm px-4"
        >
          <Plus aria-hidden="true" />
          Add order
        </Button>
      </div>
      <div className="mt-10 flex flex-wrap items-start justify-between gap-4">
        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <OrdersSearch
            key={ready?.query || ''}
            query={ready?.query || ''}
            onSearch={ready ? onSearch : undefined}
            unavailableId={unavailableId}
          />
          <div className="relative w-[150px]">
            <label
              htmlFor="orders-sort"
              className="absolute -top-2 left-3 z-10 bg-background px-1 text-xs text-muted-foreground"
            >
              Filter
            </label>
            <select
              id="orders-sort"
              value="newest"
              disabled
              aria-describedby={unavailableId}
              className="h-14 w-full appearance-none rounded-sm border bg-background px-4 pr-9 text-sm disabled:opacity-60"
            >
              <option value="newest">Newest</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-5 right-4 size-4 text-muted-foreground"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled
            aria-label="Edit selected orders"
            aria-describedby={unavailableId}
            className="size-10 rounded-sm text-primary"
          >
            <Pencil aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled
            aria-label="Delete selected orders"
            aria-describedby={unavailableId}
            className="size-10 rounded-sm text-primary"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>
      <p id={unavailableId} className="sr-only">
        Search, selection, sorting and order actions require a confirmed Orders
        API. These actions are unavailable.
      </p>
      <div className="mt-6 min-w-0 space-y-3">
        <Table className="min-w-[850px]">
          <caption className="sr-only">Orders</caption>
          <TableHeader className="border-b border-[#DDE1F0]">
            <TableRow>
              <TableHead scope="col" className="h-11 w-7 pr-0 pl-2">
                <Checkbox
                  aria-label="Select all orders on this page"
                  checked={checked}
                  disabled={!ready || !rows.length}
                  aria-describedby={!ready ? unavailableId : undefined}
                  onCheckedChange={(value) =>
                    setSelection({
                      scope,
                      ids: value === true ? rows.map((row) => row.id) : [],
                    })
                  }
                />
              </TableHead>
              <TableHead scope="col" className="h-11 w-[17%] text-[#5A6384]">
                Order
              </TableHead>
              <TableHead scope="col" className="h-11 w-[15%] text-[#5A6384]">
                Date
              </TableHead>
              <TableHead scope="col" className="h-11 w-[15%] text-[#5A6384]">
                Customer
              </TableHead>
              <TableHead scope="col" className="h-11 w-[17%] text-[#5A6384]">
                Payment status
              </TableHead>
              <TableHead scope="col" className="h-11 w-[19%] text-[#5A6384]">
                Order Status
              </TableHead>
              <TableHead scope="col" className="h-11 w-[13%] text-[#5A6384]">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ready && rows.length
              ? rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={
                      selected.includes(row.id) ? 'selected' : undefined
                    }
                    className="h-[52px]"
                  >
                    <TableCell className="pr-0 pl-2">
                      <Checkbox
                        aria-label={`Select order ${row.order}`}
                        checked={selected.includes(row.id)}
                        onCheckedChange={(value) =>
                          selectRow(row.id, value === true)
                        }
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      {row.order}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {row.date}
                    </TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>
                      <OrderStatusBadge value={row.paymentStatus} payment />
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge value={row.orderStatus} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {row.total}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
        {(!ready || !rows.length) && content}
        {selected.length > 0 && (
          <p role="status" className="text-sm text-muted-foreground">
            {selected.length} selected on this page
          </p>
        )}
        <OrdersPagination
          page={ready?.page ?? null}
          totalPages={ready?.totalPages ?? null}
          totalResults={ready?.totalResults ?? null}
          onChange={ready ? onPageChange : undefined}
          unavailableId={unavailableId}
        />
      </div>
    </section>
  )
}
export default OrdersView
