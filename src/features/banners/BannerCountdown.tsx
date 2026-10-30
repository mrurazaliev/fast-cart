import { useEffect, useState } from 'react'
import { getBannerCountdown } from './bannerDraft'

const BannerCountdown = ({ endsAt }: { endsAt: string | null }) => {
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
        Choose a fixed end date to preview the countdown.
      </p>
    )
  return (
    <div className="space-y-2 text-sm">
      <p>Ends at {new Date(endsAt).toLocaleString()}</p>
      <p
        role="timer"
        aria-label="Banner preview countdown"
        className="font-medium tabular-nums"
      >
        {Date.parse(endsAt) <= now
          ? 'Preview ended'
          : `${remaining.days}d / ${remaining.hours}h / ${remaining.minutes}m / ${remaining.seconds}s`}
      </p>
    </div>
  )
}
export default BannerCountdown
