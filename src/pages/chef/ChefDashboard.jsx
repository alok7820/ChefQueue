import { Clock, Flame, CheckCircle2 } from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import OrderCard from '../../components/cards/OrderCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { useFetch } from '../../hooks/useFetch';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

export default function ChefDashboard() {
  const { data: orders, loading, refetch } = useFetch(() => orderService.getAll(), []);

  const pending = orders?.filter((o) => o.status === 'Pending') || [];
  const preparing = orders?.filter((o) => o.status === 'Preparing') || [];
  const completed = orders?.filter((o) => o.status === 'Completed') || [];

  const advance = async (id, next) => {
    await orderService.updateStatus(id, next);
    toast.success(`Order moved to ${next}`);
    refetch();
  };

  const activeOrders = [...pending, ...preparing].slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-secondary-900">Kitchen Dashboard</h1>
        <p className="mt-1 text-sm text-secondary-500">Your live view of what needs firing next.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={Clock} label="Pending Orders" value={pending.length} tone="warning" />
            <StatCard icon={Flame} label="Preparing Orders" value={preparing.length} tone="primary" />
            <StatCard icon={CheckCircle2} label="Completed Today" value={completed.length} tone="success" />
          </>
        )}
      </div>

      <div>
        <p className="mb-3 font-display font-semibold text-secondary-900">Needs attention</p>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : activeOrders.length === 0 ? (
          <EmptyState title="Kitchen is clear" description="No pending or in-progress orders right now." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {activeOrders.map((o) => <OrderCard key={o.id} order={o} onAdvance={advance} />)}
          </div>
        )}
      </div>
    </div>
  );
}
