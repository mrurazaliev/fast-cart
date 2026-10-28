import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import NotFound from '@/pages/NotFound'

const RouteError = () => {
  const error = useRouteError()
  const notFound =
    !error || (isRouteErrorResponse(error) && error.status === 404)
  if (notFound) return <NotFound />
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Unable to open this page.</h1>
      <Button asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </section>
  )
}

export default RouteError
