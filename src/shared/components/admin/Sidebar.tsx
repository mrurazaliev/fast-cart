import Logo from '@/shared/components/Logo'
import AdminNavigation from './AdminNavigation'

const Sidebar = () => (
  <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background lg:flex lg:flex-col">
    <div className="flex h-[76px] items-center border-b px-6">
      <Logo />
    </div>
    <div className="space-y-4 px-4 py-7">
      <p className="px-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        Administration
      </p>
      <AdminNavigation />
    </div>
  </aside>
)

export default Sidebar
