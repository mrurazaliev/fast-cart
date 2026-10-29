import { NavLink } from 'react-router-dom'
import { adminNavigation } from './navigationItems'

const AdminNavigation = ({ onNavigate }: { onNavigate?: () => void }) => (
  <nav aria-label="Admin navigation" className="space-y-1">
    {adminNavigation.map(({ path, label, icon: Icon }) => (
      <NavLink
        key={path}
        to={path}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`
        }
      >
        <Icon className="size-5" aria-hidden="true" />
        {label}
      </NavLink>
    ))}
  </nav>
)

export default AdminNavigation
