import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loggedOut } from '@/features/auth/authSlice'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Logo from '@/shared/components/Logo'
import AdminNavigation from './AdminNavigation'
import { adminNavigation } from './navigationItems'

const Header = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const dispatch = useAppDispatch()
  const userName = useAppSelector((state) => state.auth.session?.userName)
  const loading = useAppSelector((state) => state.requests.pending > 0)
  const title =
    adminNavigation.find((item) => item.path === location.pathname)?.label ||
    'Administration'

  return (
    <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-4 border-b bg-background px-5 py-3 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              className="lg:hidden"
            >
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(280px,90vw)]">
            <SheetHeader>
              <SheetTitle>FastCart Admin</SheetTitle>
              <SheetDescription>Manage the product catalog.</SheetDescription>
            </SheetHeader>
            <div className="space-y-8 px-4 pb-6">
              <Logo />
              <AdminNavigation onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <p className="truncate font-semibold">{title}</p>
        {loading && (
          <span role="status" className="sr-only">
            Loading…
          </span>
        )}
      </div>
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:block">
          {userName}
        </span>
        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch(loggedOut())}
        >
          <LogOut aria-hidden="true" />
          <span>Sign out</span>
        </Button>
      </div>
    </header>
  )
}

export default Header
