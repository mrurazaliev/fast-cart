import { useText } from '@/shared/i18n/useText'
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const RouteError = () => {
  const { t } = useText()

  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404
  return (
    <main className="container space-y-6 py-24">
      <h1 className="text-3xl font-semibold">
        {notFound
          ? t('This admin page does not exist.')
          : t('Unable to open this page.')}
      </h1>
      <Button asChild>
        <Link to="/">{t('Back to admin')}</Link>
      </Button>
    </main>
  )
}

export default RouteError
