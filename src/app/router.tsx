import { createBrowserRouter } from 'react-router-dom'
import App from '@/app/App'
import Products from '@/pages/Products'
import ProductDetails from '@/pages/ProductDetails'
import Wishlist from '@/pages/Wishlist'
import Cart from '@/pages/Cart'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Account from '@/pages/Account'
import Home from '@/pages/Home'
import RouteError from '@/pages/RouteError'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetails /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'cart', element: <Cart /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'account', element: <Account /> },
      { path: '*', element: <RouteError /> },
    ],
  },
])
