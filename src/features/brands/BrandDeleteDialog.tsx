import { Button } from '@/components/ui/button'
import AdminDialog from '@/shared/components/admin/AdminDialog'
import { deleteBrand } from './brandsApi'
import type { Brand } from './brandsApi'
import useBrandMutation from './useBrandMutation'

const BrandDeleteDialog = ({
  brand,
  onClose,
  onDeleted,
}: {
  brand: Brand
  onClose: () => void
  onDeleted?: () => void
}) => {
  const mutation = useBrandMutation()
  const handleDelete = async () => {
    const confirmed = await mutation.run((signal) =>
      deleteBrand(brand.id, signal),
    )
    if (confirmed) onDeleted?.()
  }
  return (
    <AdminDialog
      title="Delete brand"
      description={`Delete “${brand.brandName}”? Deletion may be blocked by related products.`}
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
          Brand deleted.
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
            onClick={() => void handleDelete()}
          >
            {mutation.pending ? 'Deleting…' : 'Delete'}
          </Button>
        )}
      </div>
    </AdminDialog>
  )
}
export default BrandDeleteDialog
