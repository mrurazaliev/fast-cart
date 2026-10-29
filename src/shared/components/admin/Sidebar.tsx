import Logo from '@/shared/components/Logo'
import AdminNavigation from './AdminNavigation'

const Sidebar = () => (
  <aside className="fixed inset-y-0 left-0 hidden w-[254px] bg-admin-surface text-white lg:flex lg:flex-col">
    <div className="flex h-[67px] shrink-0 items-center px-7">
      <Logo />
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8">
      <AdminNavigation />
    </div>
  </aside>
)

export default Sidebar
