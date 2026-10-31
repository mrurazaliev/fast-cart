import { getLocale } from '@/shared/i18n/i18n'
import { useText } from '@/shared/i18n/useText'
import { useEffect, useState } from 'react'
import { getBannerCountdown } from './bannerDraft'

const BannerCountdown = ({ endsAt }: { endsAt: string | null }) => {
  const { t } = useText()

  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (!endsAt) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [endsAt])
  const remaining = getBannerCountdown(endsAt, now)
  if (!endsAt || !remaining)
    return (
      <p className="text-sm">
        {t('Choose a fixed end date to preview the countdown.')}
      </p>
    )
  return (
    <div className="space-y-2 text-sm">
      <p>
        {t('Ends at')} {new Date(endsAt).toLocaleString(getLocale())}
      </p>
      <p
        role="timer"
        aria-label={t('Banner preview countdown')}
        className="font-medium tabular-nums"
      >
        {Date.parse(endsAt) <= now
          ? t('Preview ended')
          : t('{{value0}}d / {{value1}}h / {{value2}}m / {{value3}}s', {
              value0: remaining.days,
              value1: remaining.hours,
              value2: remaining.minutes,
              value3: remaining.seconds,
            })}
      </p>
    </div>
  )
}
export default BannerCountdown
