import { useText } from '@/shared/i18n/useText'
import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type RequestStateProps = {
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

const RequestState = ({ loading, error, onRetry }: RequestStateProps) => {
  const { t } = useText()

  if (loading)
    return (
      <p
        role="status"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        {t('Loading…')}
      </p>
    )
  if (!error) return null
  return (
    <div role="alert" className="space-y-3">
      <p className="text-sm text-destructive">{t(error || '')}</p>
      {onRetry && <Button onClick={onRetry}>{t('Try again')}</Button>}
    </div>
  )
}

export default RequestState
