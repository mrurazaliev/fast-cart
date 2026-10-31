import { useText } from '@/shared/i18n/useText'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const { t } = useText()

  return (
    <section
      aria-labelledby="not-found-title"
      className="flex min-h-[55vh] flex-col items-center justify-center gap-8 py-16 text-center sm:gap-10 sm:py-24"
    >
      <h1
        id="not-found-title"
        className="text-4xl leading-tight font-medium tracking-wide sm:text-6xl lg:text-8xl"
      >
        {t('404 Not Found')}
      </h1>
      <p className="max-w-xl text-sm leading-7 sm:text-base">
        {t(
          'We couldn’t find the page you’re looking for. Return to the home page or explore our products.',
        )}
      </p>
      <div className="mt-4 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-5">
        <Button asChild className="h-12 rounded-sm px-10">
          <Link to="/">{t('Back to Home Page')}</Link>
        </Button>
        <Button asChild variant="outline" className="h-12 rounded-sm px-8">
          <Link to="/products">{t('Browse Products')}</Link>
        </Button>
      </div>
    </section>
  )
}

export default NotFound
