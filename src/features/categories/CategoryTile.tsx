import { Link, createSearchParams } from 'react-router-dom'
import {
  Baby,
  Car,
  Dumbbell,
  Gamepad2,
  HeartPulse,
  House,
  Monitor,
  Pill,
  Shapes,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Watch,
} from 'lucide-react'
import type { Category } from '@/features/categories/categoriesApi'

const getCategoryIcon = (name: string) => {
  const value = name.toLowerCase()
  if (value.includes('watch')) return <Watch />
  if (value.includes('phone')) return <Smartphone />
  if (value.includes('computer') || value.includes('electronic'))
    return <Monitor />
  if (value.includes('gaming')) return <Gamepad2 />
  if (value.includes('fashion')) return <Shirt />
  if (value.includes('home')) return <House />
  if (value.includes('medicine')) return <Pill />
  if (value.includes('car')) return <Car />
  if (value.includes('baby') || value.includes('toys')) return <Baby />
  if (value.includes('sport')) return <Dumbbell />
  if (value.includes('grocer')) return <ShoppingBasket />
  if (value.includes('health') || value.includes('beauty'))
    return <HeartPulse />
  return <Shapes />
}

const CategoryTile = ({ category }: { category: Category }) => {
  return (
    <Link
      to={{
        pathname: '/products',
        search: createSearchParams({
          CategoryId: String(category.id),
        }).toString(),
      }}
      className="flex h-36 flex-col items-center justify-center gap-4 rounded-sm border px-3 text-center transition-colors hover:border-primary hover:bg-primary hover:text-white focus-visible:border-primary focus-visible:bg-primary focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span
        aria-hidden="true"
        className="shrink-0 [&_svg]:size-12 [&_svg]:stroke-[1.25]"
      >
        {getCategoryIcon(category.categoryName)}
      </span>
      <span className="line-clamp-2 text-sm break-words">
        {category.categoryName}
      </span>
    </Link>
  )
}

export default CategoryTile
