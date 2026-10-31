import { useText } from '@/shared/i18n/useText'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const AdminLayout = () => {
  const { t } = useText()
  return (
    <div className="min-h-svh bg-background lg:pl-[254px]">
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-md bg-background p-3 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t('Skip to content')}
      </a>
      <Sidebar />
      <Header />
      <main
        id="admin-main"
        tabIndex={-1}
        className="min-w-0 space-y-6 p-5 outline-none sm:p-7"
      >
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
