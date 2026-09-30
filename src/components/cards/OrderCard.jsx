import { Clock, Flame } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { orderCode, timeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';

const NEXT_ACTION = {
  Pending: { label: 'Start Cooking', next: 'Preparing' },
  Preparing: { label: 'Mark Ready', next: 'Ready' },
  Ready: { label: 'Complete', next: 'Completed' },
};

export default function OrderCard({ order, onAdvance, draggableProps }) {
  const action = NEXT_ACTION[order.status];

  return (
    <div
      {...draggableProps}
      className={cn(
        'ticket-edge relative rounded-xl border border-secondary-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        order.priority === 'High' && 'ring-1 ring-danger-200'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono-ticket text-sm font-semibold text-secondary-800">{orderCode(order.id)}</p>
          <p className="text-xs text-secondary-400">Table {order.table} · {order.customer}</p>
        </div>
        {order.priority === 'High' && (
          <span className="flex items-center gap-1 rounded-full bg-danger-100 px-2 py-0.5 text-[11px] font-medium text-danger-600">
            <Flame size={11} /> High
          </span>
        )}
      </div>

      <ul className="mt-3 space-y-1">
        {order.items.map((it, i) => (
          <li key={i} className="flex justify-between text-sm text-secondary-600">
            <span>{it.qty}× {it.name}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between text-xs text-secondary-400">
        <span className="flex items-center gap-1"><Clock size={12} /> {order.cookingTime} min · {timeAgo(order.createdAt)}</span>
        <Badge>{order.status}</Badge>
      </div>

      {action && (
        <Button size="sm" className="mt-3 w-full" onClick={() => onAdvance(order.id, action.next)}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
