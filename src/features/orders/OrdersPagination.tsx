import { getLocale } from '@/shared/i18n/i18n'
import { useText } from '@/shared/i18n/useText'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const OrdersPagination = ({
  page,
  totalPages,
  totalResults,
  onChange,
  unavailableId,
}: {
  page: number | null
  totalPages: number | null
  totalResults: number | null
  onChange?: (page: number) => void
  unavailableId: string
}) => {
  const { t } = useText()

  const current =
    page === null || totalPages === null ? null : Math.min(page, totalPages)
  const pages =
    current === null || totalPages === null
      ? []
      : [...new Set([1, current - 1, current, current + 1, totalPages])]
          .filter((value) => value > 0 && value <= totalPages)
          .sort((a, b) => a - b)
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
      <nav
        aria-label={t('Order pages')}
        className="flex flex-wrap items-center gap-1"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t('Previous order page')}
          disabled={!onChange || page === null || page <= 1}
          aria-describedby={!onChange ? unavailableId : undefined}
          onClick={() => {
            if (page !== null) onChange?.(page - 1)
          }}
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
        {pages.length ? (
          pages.map((value, index) => (
            <span key={value} className="flex items-center gap-1">
              {index > 0 && value - (pages[index - 1] || 0) > 1 && (
                <span aria-hidden="true" className="px-2 text-muted-foreground">
                  …
                </span>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t('Order page {{value0}}', { value0: value })}
                aria-current={page === value ? 'page' : undefined}
                disabled={!onChange}
                className={
                  page === value
                    ? 'bg-primary/10 text-primary'
                    : 'text-admin-muted'
                }
                onClick={() => onChange?.(value)}
              >
                {value}
              </Button>
            </span>
          ))
        ) : (
          <span
            aria-label={t('Order page unavailable')}
            className="px-3 text-admin-muted"
          >
            —
          </span>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t('Next order page')}
          disabled={
            !onChange ||
            page === null ||
            totalPages === null ||
            page >= totalPages
          }
          aria-describedby={!onChange ? unavailableId : undefined}
          onClick={() => {
            if (page !== null) onChange?.(page + 1)
          }}
        >
          <ArrowRight aria-hidden="true" />
        </Button>
      </nav>
      <p role="status" className="text-sm text-admin-muted">
        {totalResults === null
          ? t('Results unavailable')
          : t('{{value0}} Results', {
              value0: totalResults.toLocaleString(getLocale()),
            })}
      </p>
    </div>
  )
}
export default OrdersPagination
