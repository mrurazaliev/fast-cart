import { useEffect, useState } from 'react'
import { flashSaleEndsAt, getFlashSaleTime } from './flashSaleTime'

const FlashSaleCountdown = () => {
  const [now, setNow] = useState(Date.now)
  const remaining = getFlashSaleTime(now)
  const ended = now >= Date.parse(flashSaleEndsAt)

  useEffect(() => {
    const interval = window.setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current >= Date.parse(flashSaleEndsAt)) window.clearInterval(interval)
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2">
      <dl
        aria-label="Flash Sales countdown"
        className="flex items-end gap-3 sm:gap-4"
      >
        {Object.entries(remaining).map(([label, value], index) => (
          <div key={label} className="flex items-end gap-3 sm:gap-4">
            {index > 0 && (
              <span
                aria-hidden="true"
                className="pb-1 text-2xl font-semibold text-primary"
              >
                :
              </span>
            )}
            <div className="space-y-1">
              <dt className="text-xs font-medium">{label}</dt>
              <dd className="text-2xl leading-none font-bold tabular-nums sm:text-3xl">
                {String(value).padStart(2, '0')}
              </dd>
            </div>
          </div>
        ))}
      </dl>
      {ended && (
        <p className="text-xs text-muted-foreground">Countdown ended</p>
      )}
    </div>
  )
}

export default FlashSaleCountdown
