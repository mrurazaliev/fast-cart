import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '@/app/App'
import RouteError from '@/pages/RouteError'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import SectionUnavailable from '@/pages/SectionUnavailable'
import RequireAdmin from '@/features/auth/RequireAdmin'
import AdminLayout from '@/shared/components/admin/AdminLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
