import {
  FolderTree,
  House,
  Layers,
  List,
  Palette,
  Tag,
  Tags,
} from 'lucide-react'

export const adminNavigation = [
  { path: '/dashboard', label: 'Dashboard', icon: House },
  { path: '/orders', label: 'Orders', icon: List },
  { path: '/products', label: 'Products', icon: Tag },
]

export const otherNavigation = [
  { path: '/categories', label: 'Categories', icon: FolderTree },
  { path: '/subcategories', label: 'Subcategories', icon: Layers },
  { path: '/brands', label: 'Brands', icon: Tags },
  { path: '/colors', label: 'Colors', icon: Palette },
]
