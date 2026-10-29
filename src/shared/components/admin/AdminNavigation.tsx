import { NavLink, useLocation } from 'react-router-dom'
import type { NavLinkRenderProps } from 'react-router-dom'
import { ChevronDown, Folder } from 'lucide-react'
import { adminNavigation, otherNavigation } from './navigationItems'

const getLinkClassName = ({ isActive }: NavLinkRenderProps) =>
  `flex min-h-11 items-center gap-4 rounded-sm px-4 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isActive ? 'bg-white text-admin-surface' : 'text-white/90 hover:bg-white/10 hover:text-white'}`

const AdminNavigation = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation()
  const pathname = location.pathname.replace(/\/+$/, '')
  const otherActive = otherNavigation.some((item) => item.path === pathname)

  return (
    <nav aria-label="Admin navigation" className="space-y-2">
      {adminNavigation.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          onClick={onNavigate}
          className={getLinkClassName}
        >
          <Icon className="size-5" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
      <details open={otherActive} className="group space-y-2">
        <summary
          className={`flex min-h-11 w-full cursor-pointer list-none items-center gap-4 rounded-sm px-4 py-3 text-left text-sm text-white/90 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden ${otherActive ? 'bg-white/10 text-white' : ''}`}
        >
          <Folder className="size-5" aria-hidden="true" />
          <span className="flex-1">Other</span>
          <ChevronDown
            className="size-4 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="ml-6 space-y-1 border-l border-white/20 pl-3">
          {otherNavigation.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onNavigate}
              className={getLinkClassName}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </div>
      </details>
    </nav>
  )
}

export default AdminNavigation
