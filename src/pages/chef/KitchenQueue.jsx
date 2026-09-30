import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { orderCode, timeAgo } from '../../utils/format';
import { useFetch } from '../../hooks/useFetch';
import { orderService } from '../../services/orderService';
import { Clock, Flame, GripVertical } from 'lucide-react';
import { cn } from '../../utils/cn';
import Spinner from '../../components/ui/Spinner';

const COLUMNS = [
  { key: 'Pending', label: 'Pending', accent: 'bg-warning-500' },
  { key: 'Preparing', label: 'Preparing', accent: 'bg-primary-500' },
  { key: 'Ready', label: 'Ready', accent: 'bg-blue-500' },
];

function KanbanCard({ order, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, order.id)}
      className={cn(
        'ticket-edge cursor-grab rounded-xl border border-secondary-100 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing',
        order.priority === 'High' && 'ring-1 ring-danger-200'
      )}
    >
      <div className="flex items-start justify-between">
        <p className="font-mono-ticket text-sm font-semibold text-secondary-800">{orderCode(order.id)}</p>
        <GripVertical size={14} className="text-secondary-300" />
      </div>
      <p className="mt-0.5 text-xs text-secondary-400">Table {order.table}</p>
      <ul className="mt-2 space-y-0.5">
        {order.items.slice(0, 2).map((it, i) => (
          <li key={i} className="text-xs text-secondary-600">{it.qty}× {it.name}</li>
        ))}
        {order.items.length > 2 && <li className="text-xs text-secondary-400">+{order.items.length - 2} more</li>}
      </ul>
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-secondary-400">
        <span className="flex items-center gap-1"><Clock size={11} /> {order.cookingTime}m · {timeAgo(order.createdAt)}</span>
        {order.priority === 'High' && <span className="flex items-center gap-0.5 text-danger-500"><Flame size={11} /> High</span>}
      </div>
    </div>
  );
}

export default function KitchenQueue() {
  const { data: allOrders, loading, refetch } = useFetch(() => orderService.getAll(), []);
  const [localOrders, setLocalOrders] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const orders = localOrders || allOrders;

  const columns = useMemo(() => {
    if (!orders) return {};
    return COLUMNS.reduce((acc, col) => {
      acc[col.key] = orders.filter((o) => o.status === col.key);
      return acc;
    }, {});
  }, [orders]);

  const onDragStart = (e, id) => e.dataTransfer.setData('orderId', id);

  const onDrop = async (e, status) => {
    e.preventDefault();
    setDragOverCol(null);
    const id = Number(e.dataTransfer.getData('orderId'));
    setLocalOrders((prev) => (prev || allOrders).map((o) => (o.id === id ? { ...o, status } : o)));
    await orderService.updateStatus(id, status);
    toast.success(`Order moved to ${status}`);
  };

  if (loading || !orders) return <Spinner full label="Loading kitchen queue..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-secondary-900">Kitchen Queue</h1>
        <p className="mt-1 text-sm text-secondary-500">Drag tickets between columns as they move through the kitchen.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => onDrop(e, col.key)}
            className={cn(
              'rounded-2xl border-2 border-dashed p-3 transition-colors',
              dragOverCol === col.key ? 'border-primary-300 bg-primary-50/40' : 'border-transparent bg-secondary-50/60'
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', col.accent)} />
                <p className="text-sm font-semibold text-secondary-800">{col.label}</p>
              </div>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-secondary-500">{columns[col.key]?.length || 0}</span>
            </div>
            <div className="space-y-3 min-h-[120px]">
              {columns[col.key]?.map((o) => <KanbanCard key={o.id} order={o} onDragStart={onDragStart} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
