import { useText } from '@/shared/i18n/useText'
import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/utils'
import { useAppSelector } from '@/app/hooks'

type NavigationProps = {
  mobile?: boolean
  onNavigate?: () => void
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/contact', label: 'Contact' },
  { to: '/about', label: 'About' },
  { to: '/register', label: 'Sign Up' },
]

const Navigation = ({ mobile = false, onNavigate }: NavigationProps) => {
  const { t } = useText()

  const signedIn = useAppSelector((state) => !!state.auth.session)
  return (
    <nav
      aria-label={mobile ? t('Mobile navigation') : t('Main navigation')}
      className={cn(
        'flex',
        mobile ? 'flex-col gap-2' : 'items-center gap-7 xl:gap-10',
      )}
    >
      {links
        .filter((link) => !signedIn || link.to !== '/register')
        .map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'w-fit border-b text-base transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
                mobile ? 'px-1 py-3' : 'py-1',
                isActive ? 'border-foreground' : 'border-transparent',
              )
            }
          >
            {t(label || '')}
          </NavLink>
        ))}
    </nav>
  )
}

export default Navigation
