import { useText } from '@/shared/i18n/useText'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ProductSearch = ({
  value,
  onSearch,
}: {
  value: string
  onSearch: (value: string) => void
}) => {
  const { t } = useText()

  const [search, setSearch] = useState(value)
  const id = useId()
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(search.trim())
  }
  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="relative w-full sm:max-w-[250px]"
    >
      <label htmlFor={id} className="sr-only">
        {t('Search products by name')}
      </label>
      <Input
        id={id}
        name="ProductName"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('Search…')}
        className="h-14 rounded-sm pr-12 shadow-none"
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        aria-label={t('Search products')}
        className="absolute top-2 right-2 text-muted-foreground"
      >
        <Search aria-hidden="true" />
      </Button>
    </form>
  )
}

export default ProductSearch
