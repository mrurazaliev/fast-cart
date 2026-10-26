import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const RequestState = ({ loading, error, onRetry }) => {
  if (loading)
    return (
      <p
        role="status"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        Loading…
      </p>
    )
  if (!error) return null
  return (
    <div role="alert" className="space-y-3">
      <p className="text-sm text-destructive">{error}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  )
}

export default RequestState
