import { Button } from '@/components/ui/button'
import CategoryDialog from './CategoryDialog'
import useCategoryMutation from './useCategoryMutation'

const CategoryDeleteDialog = ({
  name,
  subject,
  onDelete,
  onClose,
}: {
  name: string
  subject: 'category' | 'subcategory'
  onDelete: (signal: AbortSignal) => Promise<boolean>
  onClose: () => void
}) => {
  const mutation = useCategoryMutation()
  return (
    <CategoryDialog
      title={`Delete ${subject}`}
      description={`Are you sure you want to delete “${name}”? Deletion may be blocked by related records.`}
      pending={mutation.pending}
      onClose={onClose}
    >
      {mutation.error && (
        <p role="alert" className="text-sm text-destructive">
          {mutation.error}
        </p>
      )}
      {mutation.confirmed && (
        <p role="status" className="text-sm">
          The server confirmed deletion.
        </p>
      )}
      {mutation.refreshError && (
        <div role="alert" className="space-y-2 text-sm">
          <p>{mutation.refreshError}</p>
          <Button onClick={() => void mutation.reload()} variant="outline">
            Reload list
          </Button>
        </div>
      )}
      <div className="flex justify-end gap-3">
        <Button disabled={mutation.pending} onClick={onClose}>
          {mutation.locked ? 'Close' : 'Cancel'}
        </Button>
        {!mutation.locked && (
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
            disabled={mutation.pending}
            onClick={() => void mutation.run(onDelete)}
          >
            {mutation.pending ? 'Deleting…' : 'Delete'}
          </Button>
        )}
      </div>
    </CategoryDialog>
  )
}
export default CategoryDeleteDialog
