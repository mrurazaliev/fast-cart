import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const AdminLayout = () => (
  <div className="min-h-svh bg-secondary lg:pl-64">
    <a
      href="#admin-main"
      className="sr-only z-50 rounded-md bg-background p-3 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
    <Sidebar />
    <Header />
    <main
      id="admin-main"
      tabIndex={-1}
      className="mx-auto max-w-7xl space-y-6 p-5 outline-none sm:p-8 lg:p-10"
    >
      <Outlet />
    </main>
  </div>
)

export default AdminLayout
