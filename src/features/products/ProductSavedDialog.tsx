import { useText } from '@/shared/i18n/useText'
import { Dialog } from 'radix-ui'
import { Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const ProductSavedDialog = ({
  message,
  backTo,
}: {
  message: string
  backTo: string
}) => {
  const { t } = useText()
  return (
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%_-_32px)] max-w-[524px] -translate-x-1/2 -translate-y-1/2 space-y-5 rounded-md border bg-background p-7 text-center shadow-xl">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="size-8" aria-hidden="true" />
          </span>
          <Dialog.Title className="text-xl font-semibold">
            {t(message || '')}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground">
            {t(
              'The server confirmed the save. Return to the updated product list.',
            )}
          </Dialog.Description>
          <Button asChild>
            <Link to={backTo}>{t('Back to products')}</Link>
          </Button>
          <Dialog.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('Close confirmation')}
              className="absolute top-2 right-2"
            >
              <X aria-hidden="true" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ProductSavedDialog
