import type { ComponentProps } from 'react'
import { cn } from '@/shared/utils'

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-sm bg-secondary motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
