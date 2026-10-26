import { useState } from 'react'
import type { FormEvent } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const SearchForm = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const productName = query.trim()
    if (!productName) return
    navigate({
      pathname: '/products',
      search: createSearchParams({ ProductName: productName }).toString(),
    })
  }

  return (
    <form
      role="search"
      aria-label="Product search"
      onSubmit={handleSearch}
      className="relative w-full lg:w-[245px]"
    >
      <Input
        aria-label="Search products"
        name="ProductName"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="What are you looking for?"
        className="h-10 rounded-sm border-0 bg-secondary pr-12 pl-4 text-xs shadow-none md:text-xs [&::-webkit-search-cancel-button]:appearance-none"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label="Search"
        className="absolute top-0 right-0 size-10 rounded-sm hover:bg-black/5 [&_svg]:size-5"
      >
        <Search className="size-5" strokeWidth={1.7} aria-hidden="true" />
      </Button>
    </form>
  )
}

export default SearchForm
