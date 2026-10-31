import { useText } from '@/shared/i18n/useText'
import { ChartNoAxesColumnIncreasing, ReceiptText } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const DashboardTable = ({ kind }: { kind: 'transactions' | 'products' }) => {
  const { t } = useText()

  const transactions = kind === 'transactions'
  const heading = transactions
    ? 'Recent Transactions'
    : 'Top Products by Units Sold'
  const columns = transactions
    ? ['Name', 'Date', 'Amount', 'Status']
    : ['Name', 'Price', 'Units']
  const Icon = transactions ? ReceiptText : ChartNoAxesColumnIncreasing
  return (
    <section
      aria-labelledby={`${kind}-heading`}
      className="flex min-h-[340px] min-w-0 flex-col rounded-[3px] border border-border p-5 lg:h-[381px]"
    >
      <h2 id={`${kind}-heading`} className="text-base leading-6 font-semibold">
        {t(heading || '')}
      </h2>
      <div className="mt-1 min-h-0 min-w-0 flex-1 overflow-y-auto">
        <Table
          aria-label={t(heading || '')}
          className={transactions ? 'min-w-[340px]' : 'min-w-[310px]'}
        >
          <TableHeader className="border-b border-border">
            <TableRow className="hover:bg-transparent">
              {columns.map((column, index) => (
                <TableHead
                  key={column}
                  scope="col"
                  className={`h-10 px-0 text-sm text-admin-muted ${!transactions && index > 0 ? 'text-right' : ''}`}
                >
                  {t(column || '')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-0 hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="h-[260px] px-2 py-8 text-center align-middle"
              >
                <div role="status" className="mx-auto max-w-64 space-y-3">
                  <Icon
                    aria-hidden="true"
                    className="mx-auto size-9 text-admin-muted/70"
                  />
                  <p className="text-sm font-medium">
                    {transactions
                      ? t('Transaction data unavailable')
                      : t('Units-sold data unavailable')}
                  </p>
                  <p className="text-xs leading-5 text-admin-muted">
                    {transactions
                      ? t(
                          'The current API does not provide transactions or payment statuses.',
                        )
                      : t(
                          'Products cannot be ranked by sales without confirmed units-sold data.',
                        )}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
export default DashboardTable
