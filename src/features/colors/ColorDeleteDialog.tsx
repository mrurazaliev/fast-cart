import { Button } from '@/components/ui/button'
import AdminDialog from '@/shared/components/admin/AdminDialog'
import { deleteColor } from './colorsApi'
import type { Color } from './colorsApi'
import useColorMutation from './useColorMutation'

const ColorDeleteDialog = ({
  color,
  onClose,
}: {
  color: Color
  onClose: () => void
}) => {
  const mutation = useColorMutation()
  return (
    <AdminDialog
      title="Delete color"
      description={`Are you sure you want to delete “${color.colorName}”? Deletion may be blocked by related products.`}
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
          Color deleted.
        </p>
      )}
      {mutation.refreshError && (
        <div role="alert" className="space-y-2 text-sm">
          <p>{mutation.refreshError}</p>
          <Button variant="outline" onClick={() => void mutation.reload()}>
            Reload list
          </Button>
        </div>
      )}
      <div className="flex justify-end gap-3">
        <Button variant="outline" disabled={mutation.pending} onClick={onClose}>
          {mutation.locked ? 'Close' : 'Cancel'}
        </Button>
        {!mutation.locked && (
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
            disabled={mutation.pending}
            onClick={() =>
              void mutation.run((signal) => deleteColor(color.id, signal))
            }
          >
            {mutation.pending ? 'Deleting…' : 'Delete'}
          </Button>
        )}
      </div>
    </AdminDialog>
  )
}
export default ColorDeleteDialog
