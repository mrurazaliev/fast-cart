import { Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import RequestState from '@/shared/components/RequestState'
import Header from '@/shared/components/Header'

const App = () => {
  const loading = useAppSelector((state) => state.requests.pending > 0)
  return (
    <>
      <Header />
      <main className="container py-16 sm:py-24">
        <Outlet />
        <div className="mt-6">
          <RequestState loading={loading} />
        </div>
      </main>
    </>
  )
}

export default App
