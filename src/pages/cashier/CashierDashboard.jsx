import { Link } from 'react-router-dom';
import { PlusCircle, IndianRupee, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/tables/DataTable';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useFetch } from '../../hooks/useFetch';
import { dashboardService } from '../../services/dashboardService';
import { MENU_ITEMS } from '../../data/mockData';
import { formatCurrency, orderCode, timeAgo } from '../../utils/format';

export default function CashierDashboard() {
  const { data, loading } = useFetch(() => dashboardService.getCashierStats(), []);

  const columns = [
    { key: 'id', header: 'Order', render: (r) => <span className="font-mono-ticket font-medium">{orderCode(r.id)}</span> },
    { key: 'customer', header: 'Customer' },
    { key: 'total', header: 'Total', render: (r) => formatCurrency(r.total) },
    { key: 'status', header: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    { key: 'createdAt', header: 'Time', render: (r) => timeAgo(r.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-bold text-secondary-900">Cashier Dashboard</h1>
          <p className="mt-1 text-sm text-secondary-500">Take new orders and track today's till.</p>
        </div>
        <Link to="/cashier/new-order"><Button icon={PlusCircle}>New Order</Button></Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {loading || !data ? Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={IndianRupee} label="Revenue Today" value={formatCurrency(data.revenueToday)} trend="+6%" tone="success" />
            <StatCard icon={ShoppingCart} label="Orders Today" value={data.ordersToday} trend="+3" tone="primary" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 font-display font-semibold text-secondary-900">Recent orders</p>
          <DataTable columns={columns} data={data?.recentOrders || []} loading={loading} pageSize={5} />
        </Card>
        <Card>
          <p className="mb-3 flex items-center gap-2 font-display font-semibold text-secondary-900">
            <UtensilsCrossed size={16} className="text-primary-500" /> Quick menu access
          </p>
          <div className="space-y-2.5">
            {MENU_ITEMS.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={item.image} className="h-8 w-8 rounded-lg object-cover" alt={item.name} />
                  <p className="text-sm text-secondary-700">{item.name}</p>
                </div>
                <p className="text-sm font-medium text-secondary-500">{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>
          <Link to="/cashier/new-order">
            <Button variant="outline" className="mt-4 w-full">Create order</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
