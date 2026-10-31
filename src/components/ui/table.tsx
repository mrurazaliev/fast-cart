import { useText } from '@/shared/i18n/useText'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/utils'

function Table({ className, ...props }: ComponentProps<'table'>) {
  const { t } = useText()

  return (
    <div
      data-slot="table-container"
      role="region"
      aria-label={t('Scrollable table')}
      tabIndex={0}
      className="relative w-full overflow-x-auto focus-visible:outline-2 focus-visible:outline-primary"
    >
      <table
        data-slot="table"
        className={cn('w-full text-sm', className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('border-b-2 border-primary/20', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b border-primary/20 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted/70',
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-12 px-3 text-left font-normal text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn('px-3 py-3 align-middle', className)}
      {...props}
    />
  )
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
