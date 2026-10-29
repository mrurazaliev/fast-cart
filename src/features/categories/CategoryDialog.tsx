import type { ReactNode } from 'react'
import { Dialog } from 'radix-ui'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CategoryDialog = ({
  title,
  description,
  pending,
  onClose,
  children,
}: {
  title: string
  description: string
  pending: boolean
  onClose: () => void
  children: ReactNode
}) => (
  <Dialog.Root
    open
    onOpenChange={(open) => {
      if (!open && !pending) onClose()
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
        className="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%_-_32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 space-y-5 overflow-y-auto rounded-md border bg-background p-7 shadow-xl"
      >
        <Dialog.Title className="pr-8 text-xl font-semibold">
          {title}
        </Dialog.Title>
        <Dialog.Description className="text-sm text-muted-foreground">
          {description}
        </Dialog.Description>
        {children}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={pending}
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute top-2 right-2"
        >
          <X aria-hidden="true" />
        </Button>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)
export default CategoryDialog
