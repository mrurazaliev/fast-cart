import { useText } from '@/shared/i18n/useText'
import { Link } from 'react-router-dom'

const Logo = () => {
  const { t } = useText()

  return (
    <Link
      to="/"
      aria-label={t('FastCart home')}
      className="inline-flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <svg
        viewBox="0 0 48 40"
        fill="none"
        className="h-8 w-10 sm:h-9 sm:w-11"
        aria-hidden="true"
      >
        <path
          d="M2 4h8l7 25h25M15 10h29l-4 14H19"
          stroke="#F4BC25"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 9h15m-11 6h16m-18 6h12"
          stroke="#2979CB"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="21" cy="35" r="3" stroke="#F4BC25" strokeWidth="2.5" />
        <circle cx="37" cy="35" r="3" stroke="#F4BC25" strokeWidth="2.5" />
      </svg>
      <span className="text-[22px] font-semibold tracking-[-1.2px] sm:text-[28px]">
        fastcart
      </span>
    </Link>
  )
}

export default Logo
