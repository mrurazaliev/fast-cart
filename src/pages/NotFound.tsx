import { useText } from '@/shared/i18n/useText'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const { t } = useText()
  return (
    <section className="space-y-5 rounded-lg border bg-background p-8">
      <h1 className="text-2xl font-semibold">{t('Page not found')}</h1>
      <p className="text-muted-foreground">
        {t('This admin page does not exist.')}
      </p>
      <Button asChild>
        <Link to="/products">{t('Back to products')}</Link>
      </Button>
    </section>
  )
}

export default NotFound
