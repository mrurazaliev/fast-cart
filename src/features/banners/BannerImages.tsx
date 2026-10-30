import { useEffect, useId, useRef, useState } from 'react'
import { ImageOff, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export type BannerPreviewImage = { name: string; url: string }
type ImageEntry = BannerPreviewImage & { file: File }

const BannerImages = ({
  label,
  multiple,
  onChange,
}: {
  label: string
  multiple: boolean
  onChange: (images: BannerPreviewImage[]) => void
}) => {
  const id = useId()
  const urls = useRef(new Set<string>())
  const [entries, setEntries] = useState<ImageEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [failed, setFailed] = useState<string[]>([])
  useEffect(() => {
    const active = urls.current
    return () => {
      active.forEach((url) => URL.revokeObjectURL(url))
      active.clear()
    }
  }, [])
  const handleFiles = (files: File[]) => {
    if (!files.length) return
    if (
      files.some(
        (file) =>
          !file.size ||
          (file.type
            ? !file.type.startsWith('image/')
            : !/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(file.name)),
      )
    ) {
      setError('Choose non-empty image files.')
      return
    }
    setError(null)
    const added = (multiple ? files : files.slice(0, 1)).map((file) => {
      const url = URL.createObjectURL(file)
      urls.current.add(url)
      return { file, name: file.name, url }
    })
    if (!multiple)
      entries.forEach((entry) => {
        URL.revokeObjectURL(entry.url)
        urls.current.delete(entry.url)
      })
    const next = multiple ? [...entries, ...added] : added
    setEntries(next)
    onChange(next.map(({ name, url }) => ({ name, url })))
  }
  const handleRemove = (url: string) => {
    URL.revokeObjectURL(url)
    urls.current.delete(url)
    const next = entries.filter((entry) => entry.url !== url)
    setEntries(next)
    onChange(next.map(({ name, url }) => ({ name, url })))
  }
  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          handleFiles(Array.from(event.dataTransfer.files))
        }}
        className="space-y-3 rounded-sm border border-dashed border-primary/40 p-5 text-center"
      >
        <Upload
          aria-hidden="true"
          className="mx-auto size-8 rounded-full bg-secondary p-1.5"
        />
        <label htmlFor={id} className="block text-sm font-medium">
          {label}: click to choose or drop images
        </label>
        <Input
          id={id}
          type="file"
          accept="image/*"
          multiple={multiple}
          aria-label={label}
          className="h-auto p-2"
          onChange={(event) => {
            handleFiles(Array.from(event.target.files || []))
            event.target.value = ''
          }}
        />
        <p className="text-xs text-muted-foreground">
          Images are used only for this local preview.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {entries.length ? (
        <div className="overflow-x-auto rounded-sm border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="p-3 font-normal">Image</th>
                <th className="p-3 font-normal">File name</th>
                <th className="p-3 font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.url}>
                  <td className="p-3">
                    {failed.includes(entry.url) ? (
                      <ImageOff
                        aria-label="Preview unavailable"
                        className="size-12 text-muted-foreground"
                      />
                    ) : (
                      <img
                        src={entry.url}
                        alt={`Preview ${entry.name}`}
                        onError={() =>
                          setFailed((items) => [...items, entry.url])
                        }
                        className="size-16 min-w-16 rounded-sm bg-secondary object-contain"
                      />
                    )}
                  </td>
                  <td className="max-w-48 break-words p-3">{entry.name}</td>
                  <td className="p-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${entry.name}`}
                      onClick={() => handleRemove(entry.url)}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No preview images selected.
        </p>
      )}
    </div>
  )
}
export default BannerImages
