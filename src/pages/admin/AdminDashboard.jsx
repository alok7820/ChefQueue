import { ClipboardList, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import Card from '../../components/ui/Card';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useFetch } from '../../hooks/useFetch';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency, timeAgo, orderCode } from '../../utils/format';

export default function AdminDashboard() {
  const { data, loading } = useFetch(() => dashboardService.getAdminStats(), []);

  const orderColumns = [
    { key: 'id', header: 'Order', render: (r) => <span className="font-mono-ticket font-medium">{orderCode(r.id)}</span> },
    { key: 'customer', header: 'Customer' },
    { key: 'total', header: 'Total', render: (r) => formatCurrency(r.total) },
    { key: 'status', header: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    { key: 'createdAt', header: 'Time', render: (r) => timeAgo(r.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-secondary-900">Dashboard</h1>
        <p className="mt-1 text-sm text-secondary-500">Here's what's happening across the restaurant today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading || !data ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={ClipboardList} label="Total Orders" value={data.totalOrders} trend="+12%" tone="primary" />
            <StatCard icon={IndianRupee} label="Revenue" value={formatCurrency(data.revenue)} trend="+8.4%" tone="success" />
            <StatCard icon={Clock} label="Pending Orders" value={data.pending} trend="-3%" trendUp={false} tone="warning" />
            <StatCard icon={CheckCircle2} label="Completed Orders" value={data.completed} trend="+5%" tone="secondary" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 font-display font-semibold text-secondary-900">Recent orders</p>
          <DataTable columns={orderColumns} data={data?.recentOrders || []} loading={loading} pageSize={5} />
        </Card>
        <Card>
          <p className="mb-3 font-display font-semibold text-secondary-900">Top selling items</p>
          <div className="space-y-3">
            {data?.topItems.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary-100 text-xs font-semibold text-secondary-500">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-secondary-800">{item.name}</p>
                    <p className="text-xs text-secondary-400">{item.sold} sold</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-secondary-700">{formatCurrency(item.revenue)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
