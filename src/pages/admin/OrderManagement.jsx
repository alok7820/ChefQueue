import { useState, useMemo } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useFetch } from '../../hooks/useFetch';
import { useDebounce } from '../../hooks/useDebounce';
import { orderService } from '../../services/orderService';
import { orderCode, formatCurrency, timeAgo } from '../../utils/format';

const STATUS_OPTIONS = ['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export default function OrderManagement() {
  const { data: orders, loading, refetch } = useFetch(() => orderService.getAll(), []);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [status, setStatus] = useState('All');
  const [viewOrder, setViewOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) =>
      (status === 'All' || o.status === status) &&
      (o.customer.toLowerCase().includes(debouncedSearch.toLowerCase()) || orderCode(o.id).includes(debouncedSearch))
    );
  }, [orders, status, debouncedSearch]);

  const handleDelete = async () => {
    await orderService.remove(deleteTarget.id);
    toast.success('Order deleted');
    setDeleteTarget(null);
    refetch();
  };

  const columns = [
    { key: 'id', header: 'Order #', render: (r) => <span className="font-mono-ticket font-medium">{orderCode(r.id)}</span> },
    { key: 'customer', header: 'Customer' },
    { key: 'items', header: 'Items', render: (r) => `${r.items.length} item${r.items.length > 1 ? 's' : ''}` },
    { key: 'status', header: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    { key: 'paymentStatus', header: 'Payment', render: (r) => <Badge>{r.paymentStatus}</Badge> },
    { key: 'total', header: 'Total', render: (r) => formatCurrency(r.total) },
    { key: 'createdAt', header: 'Created', render: (r) => timeAgo(r.createdAt) },
    {
      key: 'actions', header: 'Actions', render: (r) => (
        <div className="flex gap-1.5">
          <button onClick={() => setViewOrder(r)} className="rounded-lg p-1.5 text-secondary-500 hover:bg-secondary-100"><Eye size={15} /></button>
          <button onClick={() => setDeleteTarget(r)} className="rounded-lg p-1.5 text-danger-500 hover:bg-danger-50"><Trash2 size={15} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-secondary-900">Order Management</h1>
        <p className="mt-1 text-sm text-secondary-500">{orders?.length || 0} total orders across all tables.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by customer or order #..." className="sm:max-w-xs" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} className="sm:max-w-[180px]" />
      </div>

      <Card padded={false} className="p-4">
        <DataTable columns={columns} data={filtered} loading={loading} pageSize={8} />
      </Card>

      <Modal open={!!viewOrder} onClose={() => setViewOrder(null)} title={viewOrder ? orderCode(viewOrder.id) : ''}>
        {viewOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-secondary-400">Customer</p><p className="text-secondary-800">{viewOrder.customer}</p></div>
              <div><p className="text-xs text-secondary-400">Table</p><p className="text-secondary-800">{viewOrder.table}</p></div>
              <div><p className="text-xs text-secondary-400">Status</p><Badge>{viewOrder.status}</Badge></div>
              <div><p className="text-xs text-secondary-400">Payment</p><Badge>{viewOrder.paymentStatus}</Badge></div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-secondary-400">Items</p>
              <div className="space-y-2">
                {viewOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-secondary-700">{it.qty}× {it.name}</span>
                    <span className="font-medium text-secondary-800">{formatCurrency(it.qty * it.price)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-secondary-100 pt-3 text-sm font-semibold text-secondary-900">
                <span>Total</span><span>{formatCurrency(viewOrder.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete this order?" description={`This will permanently remove ${deleteTarget ? orderCode(deleteTarget.id) : ''}.`} />
    </div>
  );
}
