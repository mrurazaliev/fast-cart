import { useEffect, useRef, useState } from 'react'
import { Dialog } from 'radix-ui'
import { X } from 'lucide-react'
import { store } from '@/app/store'
import { Button } from '@/components/ui/button'
import { productSaveNoticeSet } from './productsSlice'
import { deleteProducts } from './productDeletionApi'
import type {
  DeletionProduct,
  ProductDeletionResult,
} from './productDeletionApi'

const ProductDeletion = ({
  products,
  bulk,
  contextKey,
  expectedKey,
  onClose,
  onDeleted,
}: {
  products: DeletionProduct[]
  bulk: boolean
  contextKey: string
  expectedKey: string
  onClose: () => void
  onDeleted: (
    result: ProductDeletionResult,
    signal: AbortSignal,
  ) => Promise<void>
}) => {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<ProductDeletionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const controller = useRef<AbortController | null>(null)
  const submitted = useRef(false)
  const initialSession = useRef(store.getState().auth.session)
  useEffect(() => () => controller.current?.abort(), [contextKey])

  const handleConfirm = async () => {
    if (submitted.current) return
    submitted.current = true
    setPending(true)
    setError(null)
    const session = store.getState().auth.session
    const operation = new AbortController()
    controller.current = operation
    const unsubscribe = store.subscribe(() => {
      if (store.getState().auth.session !== session) operation.abort()
    })
    try {
      if (
        !session ||
        session !== initialSession.current ||
        contextKey !== expectedKey
      )
        throw new Error(
          'The session or product page changed. Close this dialog and select products again.',
        )
      const outcome = await deleteProducts(products, operation.signal)
      setResult(outcome)
      if (!operation.signal.aborted) await onDeleted(outcome, operation.signal)
      if (
        operation.signal.aborted &&
        store.getState().auth.session !== session
      ) {
        store.dispatch(
          productSaveNoticeSet(
            `Product deletion stopped. Confirmed deletions: ${outcome.deleted.length}. Confirmed absent: ${outcome.absent.length}. Errors: ${outcome.failed.length}. Unverified: ${outcome.uncertain.length}. Not attempted: ${outcome.notAttempted.length}. Reload products before continuing.`,
          ),
        )
      }
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : 'Unable to complete deletion. Reload products before continuing.',
      )
    } finally {
      unsubscribe()
      controller.current = null
      setPending(false)
    }
  }

  const handleClose = () => {
    if (!pending && !controller.current) onClose()
  }

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content
          aria-busy={pending}
          onEscapeKeyDown={(event) => {
            if (pending) event.preventDefault()
          }}
          onInteractOutside={(event) => event.preventDefault()}
          className="fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%_-_32px)] max-w-[524px] -translate-x-1/2 -translate-y-1/2 space-y-5 overflow-y-auto rounded-md border bg-background p-7 shadow-xl"
        >
          <Dialog.Title className="pr-8 text-xl font-semibold">
            {bulk ? 'Delete items' : 'Delete product'}
          </Dialog.Title>
          <Dialog.Description className="break-words text-sm">
            {bulk
              ? `Are you sure you want to delete ${products.length} selected products from this page?`
              : `Are you sure you want to delete “${products[0]?.productName}”?`}
          </Dialog.Description>
          {pending && (
            <p role="status" className="text-sm">
              Deleting products and refreshing the list…
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {result && (
            <div role="status" className="space-y-3 text-sm">
              <p>
                Confirmed deletions: {result.deleted.length}. Confirmed absent:{' '}
                {result.absent.length}. Errors: {result.failed.length}.
                Unverified: {result.uncertain.length}. Not attempted:{' '}
                {result.notAttempted.length}.
              </p>
              {result.deleted.length > 0 && (
                <p>
                  Deleted:{' '}
                  {result.deleted.map((item) => item.productName).join(', ')}.
                </p>
              )}
              {result.absent.length > 0 && (
                <p>
                  Verified absent on the server:{' '}
                  {result.absent.map((item) => item.productName).join(', ')}.
                  These are not counted as confirmed delete responses.
                </p>
              )}
              {result.failed.length > 0 && (
                <ul className="space-y-2 text-destructive">
                  {result.failed.map(({ product, message }) => (
                    <li key={product.id}>
                      {product.productName}: {message}
                    </li>
                  ))}
                </ul>
              )}
              {result.uncertain.length > 0 && (
                <p className="text-destructive">
                  Could not verify:{' '}
                  {result.uncertain.map((item) => item.productName).join(', ')}.
                  No further deletions were started. Before any new deletion,
                  the server state will be checked again.
                </p>
              )}
              {result.notAttempted.length > 0 && (
                <p>
                  Not attempted:{' '}
                  {result.notAttempted
                    .map((item) => item.productName)
                    .join(', ')}
                  .
                </p>
              )}
              {result.stopReason && (
                <p role="alert" className="text-destructive">
                  {result.stopReason}
                </p>
              )}
              <p>
                Successful items will not be retried. Close this dialog to
                review the refreshed list and select remaining items.
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button disabled={pending} onClick={handleClose}>
              {result || error ? 'Close' : 'Cancel'}
            </Button>
            {!result && !error && (
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={pending}
                onClick={() => void handleConfirm()}
              >
                {pending ? 'Deleting…' : 'Delete'}
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            disabled={pending}
            aria-label="Close deletion dialog"
            onClick={handleClose}
            className="absolute top-2 right-2"
          >
            <X aria-hidden="true" />
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ProductDeletion
