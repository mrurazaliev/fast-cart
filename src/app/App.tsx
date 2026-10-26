import { Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import RequestState from '@/shared/components/RequestState'
import Header from '@/shared/components/Header'
import Footer from '@/shared/components/Footer'

const App = () => {
  const loading = useAppSelector((state) => state.requests.pending > 0)
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="container flex-1 py-6 sm:py-10">
        <Outlet />
        <div className="mt-6">
          <RequestState loading={loading} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
