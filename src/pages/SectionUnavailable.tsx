import { Construction } from 'lucide-react'

const SectionUnavailable = ({
  title,
  description,
}: {
  title: string
  description: string
}) => (
  <>
    <h1 className="text-2xl font-semibold">{title}</h1>
    <section
      aria-label={`${title} status`}
      className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-lg border bg-background px-6 py-12 text-center"
    >
      <span className="rounded-full bg-primary/10 p-4 text-primary">
        <Construction className="size-7" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-medium">This section is not available yet</h2>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  </>
)

export default SectionUnavailable
