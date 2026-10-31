import { useText } from '@/shared/i18n/useText'
import type { ReactNode } from 'react'

type SectionHeadingProps = {
  id: string
  label: string
  title: string
  children?: ReactNode
}

const SectionHeading = ({
  id,
  label,
  title,
  children,
}: SectionHeadingProps) => {
  const { t } = useText()

  return (
    <div className="space-y-6">
      <p className="flex items-center gap-4 text-sm font-semibold text-primary">
        <span className="h-10 w-5 rounded-sm bg-primary" aria-hidden="true" />
        {t(label || '')}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <h2
          id={id}
          className="text-3xl font-semibold tracking-wide sm:text-4xl"
        >
          {t(title || '')}
        </h2>
        {children}
      </div>
    </div>
  )
}

export default SectionHeading
