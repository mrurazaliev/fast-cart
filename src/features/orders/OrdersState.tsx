import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RequestState from '@/shared/components/RequestState'

const OrdersState = ({
  kind,
  message,
  onRetry,
  onClear,
  unavailableId,
}: {
  kind: 'unavailable' | 'loading' | 'error' | 'empty' | 'no-results'
  message?: string
  onRetry?: () => void
  onClear?: () => void
  unavailableId: string
}) => {
  if (kind === 'loading')
    return (
      <div
        aria-busy="true"
        className="flex min-h-[440px] items-center justify-center"
      >
        <RequestState loading />
      </div>
    )
  if (kind === 'error')
    return (
      <div className="flex min-h-[440px] items-center justify-center p-6">
        <RequestState
          error={message || 'Unable to load orders.'}
          onRetry={onRetry}
        />
      </div>
    )
  let title = 'No Orders Yet'
  let description = 'Orders will appear here when they are available.'
  if (kind === 'unavailable') {
    title = 'Orders API unavailable'
    description =
      'The current API does not provide order operations. The number of orders is unknown.'
  } else if (kind === 'no-results') {
    title = 'No results found'
    description = 'Try another search or clear it to see the available orders.'
  }
  return (
    <div
      role="status"
      className="flex min-h-[440px] flex-col items-center justify-center gap-5 px-5 py-12 text-center"
    >
      <svg
        viewBox="0 0 100 120"
        aria-hidden="true"
        className="h-28 w-24 shrink-0"
      >
        <path d="M12 0h76v104H12z" fill="#D7DBED" />
        <path
          d="M6 8h88v112l-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6V8z"
          fill="#404B91"
        />
        <path
          d="m19 34 4 4 7-8m-11 22 4 4 7-8m-11 22 4 4 7-8M40 34h40M40 52h40M40 70h40"
          fill="none"
          stroke="white"
          strokeWidth="4"
        />
      </svg>
      <div className="max-w-xl space-y-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-base leading-6 text-[#5A6384]">{description}</p>
      </div>
      {kind === 'unavailable' && (
        <p className="max-w-xl text-sm leading-6 text-[#5A6384]">
          Search, sorting, selection and order actions are unavailable until an
          Orders API is connected.
        </p>
      )}
      {kind === 'empty' && (
        <Button
          type="button"
          disabled
          aria-describedby={unavailableId}
          className="h-10 rounded-sm px-4"
        >
          <Plus aria-hidden="true" />
          Add order
        </Button>
      )}
      {kind === 'no-results' && onClear && (
        <Button type="button" variant="outline" onClick={onClear}>
          Clear search
        </Button>
      )}
    </div>
  )
}
export default OrdersState
