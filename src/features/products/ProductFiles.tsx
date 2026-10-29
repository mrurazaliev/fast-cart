import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ProductFiles = ({
  files,
  onChange,
  error,
  disabled,
}: {
  files: File[]
  onChange: (files: File[]) => void
  error?: string
  disabled: boolean
}) => {
  const previews = useRef(new Map<File, string>())
  const [entries, setEntries] = useState<{ file: File; url: string }[]>([])
  useEffect(() => {
    const urls = previews.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])
  const handleFiles = (selected: FileList | null) => {
    const added = Array.from(selected || [])
    const next = added.map((file) => ({ file, url: URL.createObjectURL(file) }))
    for (const entry of next) previews.current.set(entry.file, entry.url)
    setEntries((items) => [...items, ...next])
    onChange([...files, ...added])
  }
  const handleRemove = (file: File) => {
    const url = previews.current.get(file)
    if (url) URL.revokeObjectURL(url)
    previews.current.delete(file)
    setEntries((items) => items.filter((item) => item.file !== file))
    onChange(files.filter((item) => item !== file))
  }
  return (
    <section aria-labelledby="new-images-heading" className="space-y-4">
      <h2 id="new-images-heading" className="font-semibold">
        Images
      </h2>
      <div className="space-y-3 rounded-sm border border-dashed border-primary/40 p-5">
        <ImagePlus
          className="mx-auto size-8 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="newImages" className="block text-sm font-medium">
          Choose product images
        </label>
        <Input
          id="newImages"
          name="newImages"
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? 'newImages-error' : undefined}
          className="h-auto p-2"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>
      {error && (
        <p
          id="newImages-error"
          role="alert"
          className="text-xs text-destructive"
        >
          {error}
        </p>
      )}
      <ul className="divide-y rounded-sm border">
        {files.map((file, index) => (
          <li key={index} className="flex items-center gap-3 p-3">
            <img
              src={entries.find((entry) => entry.file === file)?.url}
              alt={`Preview ${file.name}`}
              className="size-14 shrink-0 rounded-sm bg-secondary object-contain"
            />
            <span className="min-w-0 flex-1 break-words text-sm">
              {file.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              aria-label={`Remove selected ${file.name}`}
              onClick={() => handleRemove(file)}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProductFiles
