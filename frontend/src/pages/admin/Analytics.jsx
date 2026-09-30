import Card from '../../components/ui/Card';
import RevenueChart from '../../components/charts/RevenueChart';
import OrdersChart from '../../components/charts/OrdersChart';
import StatusPieChart from '../../components/charts/StatusPieChart';
import { useFetch } from '../../hooks/useFetch';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency } from '../../utils/format';
import Spinner from '../../components/ui/Spinner';

export default function Analytics() {
  const { data, loading } = useFetch(() => dashboardService.getAdminStats(), []);

  if (loading || !data) return <Spinner full label="Crunching the numbers..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-secondary-900">Analytics</h1>
        <p className="mt-1 text-sm text-secondary-500">Performance overview for the current week.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <p className="mb-1 font-display font-semibold text-secondary-900">Orders per day</p>
          <p className="mb-2 text-xs text-secondary-400">Volume trend across the week</p>
          <OrdersChart data={data.revenueTrend} />
        </Card>
        <Card>
          <p className="mb-1 font-display font-semibold text-secondary-900">Revenue</p>
          <p className="mb-2 text-xs text-secondary-400">Daily revenue, last 7 days</p>
          <RevenueChart data={data.revenueTrend} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <p className="mb-1 font-display font-semibold text-secondary-900">Order status distribution</p>
          <p className="mb-2 text-xs text-secondary-400">Share of orders by current status</p>
          <StatusPieChart data={data.statusDistribution} />
        </Card>
        <Card>
          <p className="mb-3 font-display font-semibold text-secondary-900">Top foods</p>
          <div className="space-y-4">
            {data.topItems.map((item) => {
              const pct = Math.round((item.sold / data.topItems[0].sold) * 100);
              return (
                <div key={item.name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-secondary-700">{item.name}</span>
                    <span className="text-secondary-400">{item.sold} sold · {formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary-100">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
