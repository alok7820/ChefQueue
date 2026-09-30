import { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/tables/DataTable';
import { useFetch } from '../../hooks/useFetch';
import { useOrderSocket } from '../../hooks/useOrderSocket';
import { useDebounce } from '../../hooks/useDebounce';
import { orderService } from '../../services/orderService';
import { orderCode, formatCurrency, timeAgo } from '../../utils/format';

const STATUS_OPTIONS = ['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export default function CashierOrders() {
  const { data: orders, loading, refetch } = useFetch(() => orderService.getAll(), []);
  useOrderSocket(refetch);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => (status === 'All' || o.status === status) && o.customer.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [orders, status, debouncedSearch]);

  const columns = [
    { key: 'id', header: 'Order #', render: (r) => <span className="font-mono-ticket font-medium">{orderCode(r.id)}</span> },
    { key: 'customer', header: 'Customer' },
    { key: 'table', header: 'Table' },
    { key: 'status', header: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    { key: 'paymentStatus', header: 'Payment', render: (r) => <Badge>{r.paymentStatus}</Badge> },
    { key: 'total', header: 'Total', render: (r) => formatCurrency(r.total) },
    { key: 'createdAt', header: 'Time', render: (r) => timeAgo(r.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-secondary-900">Orders</h1>
        <p className="mt-1 text-sm text-secondary-500">Track every order placed today.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by customer..." className="sm:max-w-xs" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} className="sm:max-w-[180px]" />
      </div>
      <Card padded={false} className="p-4">
        <DataTable columns={columns} data={filtered} loading={loading} pageSize={8} />
      </Card>
    </div>
  );
}
