import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const RouteError = () => {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404
  return (
    <main className="container space-y-6 py-24">
      <h1 className="text-3xl font-semibold">
        {notFound
          ? 'This admin page does not exist.'
          : 'Unable to open this page.'}
      </h1>
      <Button asChild>
        <Link to="/">Back to admin</Link>
      </Button>
    </main>
  )
}

export default RouteError
