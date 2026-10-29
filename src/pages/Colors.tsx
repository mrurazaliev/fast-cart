import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import RequestState from '@/shared/components/RequestState'
import { fetchColors } from '@/features/colors/colorsSlice'
import type { Color } from '@/features/colors/colorsApi'
import ColorForm from '@/features/colors/ColorForm'
import ColorDeleteDialog from '@/features/colors/ColorDeleteDialog'

const Colors = () => {
  const dispatch = useAppDispatch()
  const colors = useAppSelector((state) => state.colors)
  const [form, setForm] = useState<{ color?: Color } | null>(null)
  const [deleting, setDeleting] = useState<Color | null>(null)
  const [search, setSearch] = useState('')
  const items = colors.items.filter((color) =>
    color.colorName.toLowerCase().includes(search.trim().toLowerCase()),
  )
  useEffect(() => {
    const request = dispatch(fetchColors())
    return () => request.abort()
  }, [dispatch])
  return (
    <section aria-labelledby="colors-heading" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="colors-heading" className="text-2xl font-semibold">
          Colors
        </h1>
        <Button
          disabled={colors.status !== 'succeeded'}
          onClick={() => setForm({})}
        >
          <Plus aria-hidden="true" />
          Add color
        </Button>
      </div>
      <nav aria-label="Other sections" className="flex flex-wrap gap-2">
        <Button asChild variant="ghost">
          <NavLink to="/categories">Categories</NavLink>
        </Button>
        <Button asChild variant="ghost">
          <NavLink to="/brands">Brands</NavLink>
        </Button>
        <Button asChild variant="secondary">
          <NavLink to="/colors">Colors</NavLink>
        </Button>
      </nav>
      <p className="text-sm text-muted-foreground">
        Colors are stored by name. Exact color values are unavailable.
      </p>
      <div className="max-w-xs">
        <label htmlFor="color-search" className="sr-only">
          Search colors
        </label>
        <Input
          id="color-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search colors…"
          className="h-12 rounded-sm"
        />
      </div>
      {(colors.status === 'idle' || colors.status === 'pending') && (
        <RequestState loading />
      )}
      {colors.status === 'failed' && (
        <RequestState
          error={colors.error}
          onRetry={() => void dispatch(fetchColors())}
        />
      )}
      {colors.status === 'succeeded' && (
        <>
          {items.length ? (
            <ul className="max-w-3xl divide-y border-y">
              {items.map((color) => (
                <li
                  key={color.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="min-w-0 break-words">{color.colorName}</span>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${color.colorName}`}
                      className="text-primary"
                      onClick={() => setForm({ color })}
                    >
                      <Pencil aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${color.colorName}`}
                      className="text-destructive"
                      onClick={() => setDeleting(color)}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div role="status" className="space-y-3 py-12">
              <h2 className="text-xl font-semibold">
                {colors.items.length ? 'No colors found' : 'No colors yet'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {colors.items.length
                  ? 'Try another color name or clear the search.'
                  : 'Add a color to make it available for products.'}
              </p>
              {search && (
                <Button variant="outline" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              )}
            </div>
          )}
          <p role="status" className="text-sm text-muted-foreground">
            {items.length.toLocaleString('en-US')} colors
          </p>
        </>
      )}
      {form && <ColorForm color={form.color} onClose={() => setForm(null)} />}
      {deleting && (
        <ColorDeleteDialog color={deleting} onClose={() => setDeleting(null)} />
      )}
    </section>
  )
}
export default Colors
