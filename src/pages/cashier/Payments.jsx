import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/tables/DataTable';
import StatCard from '../../components/cards/StatCard';
import { Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { orderService } from '../../services/orderService';
import { orderCode, formatCurrency, timeAgo } from '../../utils/format';

export default function Payments() {
  const { data: orders, loading } = useFetch(() => orderService.getAll(), []);
  const paid = orders?.filter((o) => o.paymentStatus === 'Paid') || [];
  const unpaid = orders?.filter((o) => o.paymentStatus === 'Unpaid') || [];
  const totalCollected = paid.reduce((s, o) => s + o.total, 0);

  const columns = [
    { key: 'id', header: 'Order #', render: (r) => <span className="font-mono-ticket font-medium">{orderCode(r.id)}</span> },
    { key: 'customer', header: 'Customer' },
    { key: 'total', header: 'Amount', render: (r) => formatCurrency(r.total) },
    { key: 'paymentStatus', header: 'Payment', render: (r) => <Badge>{r.paymentStatus}</Badge> },
    { key: 'createdAt', header: 'Time', render: (r) => timeAgo(r.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-secondary-900">Payments</h1>
        <p className="mt-1 text-sm text-secondary-500">Track collections and pending payments.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total Collected" value={formatCurrency(totalCollected)} tone="success" />
        <StatCard icon={CheckCircle2} label="Paid Orders" value={paid.length} tone="primary" />
        <StatCard icon={AlertCircle} label="Unpaid Orders" value={unpaid.length} tone="warning" />
      </div>
      <Card padded={false} className="p-4">
        <DataTable columns={columns} data={orders || []} loading={loading} pageSize={8} />
      </Card>
    </div>
  );
}
