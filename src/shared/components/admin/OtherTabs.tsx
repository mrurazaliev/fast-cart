import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { otherNavigation } from './navigationItems'

const OtherTabs = () => {
  const location = useLocation()
  const pathname = location.pathname.replace(/\/+$/, '')
  const current = pathname === '/subcategories' ? '/categories' : pathname
  return (
    <nav aria-label="Other sections" className="flex flex-wrap gap-2">
      {otherNavigation.map((item) => (
        <Button
          key={item.path}
          asChild
          variant={current === item.path ? 'secondary' : 'ghost'}
          className={
            current === item.path ? 'bg-primary/10 text-primary' : undefined
          }
        >
          <Link
            to={item.path}
            aria-current={current === item.path ? 'page' : undefined}
          >
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
export default OtherTabs
