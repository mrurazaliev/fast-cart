import { createSearchParams } from 'react-router-dom'
import type { Category } from '@/features/categories/categoriesApi'

export const getCategoryLink = (categories: Category[], name: string) => {
  const category = categories.find(
    (item) => item.categoryName.toLowerCase() === name.toLowerCase(),
  )
  return {
    pathname: '/products',
    search: category
      ? createSearchParams({ CategoryId: String(category.id) }).toString()
      : '',
  }
}
