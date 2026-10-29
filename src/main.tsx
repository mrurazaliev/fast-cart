import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { store } from '@/app/store'
import RouteError from '@/pages/RouteError'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import SectionUnavailable from '@/pages/SectionUnavailable'
import RequireAdmin from '@/features/auth/RequireAdmin'
import AdminLayout from '@/shared/components/admin/AdminLayout'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <RouteError />,
    children: [
      { path: 'login', element: <Login /> },
      {
        element: <RequireAdmin />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="/products" replace /> },
              {
                path: 'products',
                element: (
                  <SectionUnavailable
                    title="Products"
                    description="Product management is not implemented in this stage."
                  />
                ),
              },
              {
                path: 'categories',
                element: (
                  <SectionUnavailable
                    title="Categories"
                    description="Category management is not implemented in this stage."
                  />
                ),
              },
              {
                path: 'subcategories',
                element: (
                  <SectionUnavailable
                    title="Subcategories"
                    description="Subcategory management is not implemented in this stage."
                  />
                ),
              },
              {
                path: 'brands',
                element: (
                  <SectionUnavailable
                    title="Brands"
                    description="Brand management is not implemented in this stage."
                  />
                ),
              },
              {
                path: 'colors',
                element: (
                  <SectionUnavailable
                    title="Colors"
                    description="Color management is not implemented in this stage."
                  />
                ),
              },
              { path: '*', element: <NotFound /> },
            ],
          },
        ],
      },
    ],
  },
])

const root = document.getElementById('root')

if (!root) throw new Error('Root element was not found.')

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
