import { useText } from '@/shared/i18n/useText'
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
  const { t } = useText()

  const mutation = useCategoryMutation()
  return (
    <CategoryDialog
      title={t('Delete {{value0}}', { value0: subject })}
      description={t(
        'Are you sure you want to delete “{{value0}}”? Deletion may be blocked by related records.',
        { value0: name },
      )}
      pending={mutation.pending}
      onClose={onClose}
    >
      {mutation.error && (
        <p role="alert" className="text-sm text-destructive">
          {t(mutation.error || '')}
        </p>
      )}
      {mutation.confirmed && (
        <p role="status" className="text-sm">
          {t('The server confirmed deletion.')}
        </p>
      )}
      {mutation.refreshError && (
        <div role="alert" className="space-y-2 text-sm">
          <p>{t(mutation.refreshError || '')}</p>
          <Button onClick={() => void mutation.reload()} variant="outline">
            {t('Reload list')}
          </Button>
        </div>
      )}
      <div className="flex justify-end gap-3">
        <Button disabled={mutation.pending} onClick={onClose}>
          {mutation.locked ? t('Close') : t('Cancel')}
        </Button>
        {!mutation.locked && (
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
            disabled={mutation.pending}
            onClick={() => void mutation.run(onDelete)}
          >
            {mutation.pending ? t('Deleting…') : t('Delete')}
          </Button>
        )}
      </div>
    </CategoryDialog>
  )
}
export default CategoryDeleteDialog
