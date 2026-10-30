import { FolderTree, House, Images, List, Tag, Tags } from 'lucide-react'

export const adminNavigation = [
  { path: '/dashboard', label: 'Dashboard', icon: House },
  { path: '/orders', label: 'Orders', icon: List },
  { path: '/products', label: 'Products', icon: Tag },
]

export const otherNavigation = [
  { path: '/categories', label: 'Categories', icon: FolderTree },
  { path: '/brands', label: 'Brands', icon: Tags },
  { path: '/banners', label: 'Banners', icon: Images },
]
