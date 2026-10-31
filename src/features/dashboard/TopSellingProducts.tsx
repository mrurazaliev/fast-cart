import { useText } from '@/shared/i18n/useText'
import { ArrowRight, PackageSearch } from 'lucide-react'

const TopSellingProducts = () => {
  const { t } = useText()
  return (
    <section
      aria-labelledby="top-selling-heading"
      className="flex min-h-[300px] min-w-0 flex-col rounded-[3px] border border-border p-4 lg:h-[426px]"
    >
      <div className="flex items-start justify-between gap-3">
        <h2
          id="top-selling-heading"
          className="text-base leading-6 font-semibold"
        >
          {t('Top selling products')}
        </h2>
        <button
          type="button"
          disabled
          aria-describedby="top-selling-unavailable"
          title={t('A sales ranking is not available from the API.')}
          className="inline-flex shrink-0 items-center gap-2 pt-0.5 text-xs leading-5 font-medium text-foreground/50 disabled:cursor-not-allowed"
        >
          {t('See All')}
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </div>
      <div
        id="top-selling-unavailable"
        role="status"
        className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-2 py-10 text-center"
      >
        <PackageSearch
          aria-hidden="true"
          className="size-9 text-admin-muted/70"
        />
        <p className="text-sm font-medium">{t('Sales ranking unavailable')}</p>
        <p className="max-w-56 text-xs leading-5 text-admin-muted">
          {t(
            'Sales and units-sold data are not provided. Catalog stock is not a sales ranking.',
          )}
        </p>
      </div>
    </section>
  )
}
export default TopSellingProducts
