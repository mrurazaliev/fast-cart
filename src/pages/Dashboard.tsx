import DashboardMetric from '@/features/dashboard/DashboardMetric'
import SalesRevenue from '@/features/dashboard/SalesRevenue'
import TopSellingProducts from '@/features/dashboard/TopSellingProducts'
import DashboardTable from '@/features/dashboard/DashboardTable'

const Dashboard = () => (
  <section aria-labelledby="dashboard-heading" className="space-y-6">
    <h1 id="dashboard-heading" className="text-[26px] leading-9 font-semibold">
      Dashboard
    </h1>
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2.08fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <DashboardMetric label="Sales" />
          <DashboardMetric label="Cost" />
          <DashboardMetric label="Profit" />
        </div>
        <SalesRevenue />
      </div>
      <TopSellingProducts />
    </div>
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <DashboardTable kind="transactions" />
      <DashboardTable kind="products" />
    </div>
  </section>
)
export default Dashboard
