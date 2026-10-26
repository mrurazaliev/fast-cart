import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import RequestState from '@/shared/components/RequestState'

const App = () => {
  const loading = useSelector((state) => state.requests.pending > 0)
  return (
    <main className="container py-16 sm:py-24">
      <Outlet />
      <div className="mt-6">
        <RequestState loading={loading} />
      </div>
    </main>
  )
}

export default App
