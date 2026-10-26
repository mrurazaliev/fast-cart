import { createBrowserRouter } from 'react-router-dom'
import App from '@/app/App'
import Home from '@/pages/Home'
import RouteError from '@/pages/RouteError'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteError />,
    children: [{ index: true, element: <Home /> }],
  },
])
