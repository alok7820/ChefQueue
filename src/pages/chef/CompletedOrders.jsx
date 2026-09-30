import Card from '../../components/ui/Card';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/ui/Badge';
import { useFetch } from '../../hooks/useFetch';
import { orderService } from '../../services/orderService';
import { orderCode, formatCurrency, timeAgo } from '../../utils/format';

export default function CompletedOrders() {
  const { data: orders, loading } = useFetch(() => orderService.getAll(), []);
  const completed = orders?.filter((o) => o.status === 'Completed') || [];

  const columns = [
    { key: 'id', header: 'Order #', render: (r) => <span className="font-mono-ticket font-medium">{orderCode(r.id)}</span> },
    { key: 'table', header: 'Table' },
    { key: 'items', header: 'Items', render: (r) => `${r.items.length} item${r.items.length > 1 ? 's' : ''}` },
    { key: 'status', header: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    { key: 'total', header: 'Total', render: (r) => formatCurrency(r.total) },
    { key: 'createdAt', header: 'Completed', render: (r) => timeAgo(r.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-secondary-900">Completed Orders</h1>
        <p className="mt-1 text-sm text-secondary-500">{completed.length} orders wrapped up so far.</p>
      </div>
      <Card padded={false} className="p-4">
        <DataTable columns={columns} data={completed} loading={loading} pageSize={8} emptyTitle="No completed orders yet" />
      </Card>
    </div>
  );
}
