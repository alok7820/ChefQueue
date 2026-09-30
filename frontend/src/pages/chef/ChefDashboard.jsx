import {
  Clock,
  Flame,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react';

import StatCard from '../../components/cards/StatCard';
import OrderCard from '../../components/cards/OrderCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

import { useFetch } from '../../hooks/useFetch';
import { useOrderSocket } from '../../hooks/useOrderSocket';

import { orderService } from '../../services/orderService';
import { menuService } from '../../services/menuService';

import toast from 'react-hot-toast';

export default function ChefDashboard() {
  // -----------------------------
  // GET MENU ITEMS
  // -----------------------------
  const {
    data: menuItems,
    loading: menuLoading,
    refetch: refetchMenu,
  } = useFetch(() => menuService.getAll(), []);

  // -----------------------------
  // GET ORDERS
  // -----------------------------
  const {
    data: orders,
    loading,
    refetch,
  } = useFetch(() => orderService.getAll(), []);

  useOrderSocket(refetch);

  // -----------------------------
  // FILTER ORDERS
  // -----------------------------
  const pending =
    orders?.filter((o) => o.status === 'Pending') || [];

  const preparing =
    orders?.filter((o) => o.status === 'Preparing') || [];

  const completed =
    orders?.filter((o) => o.status === 'Completed') || [];

  // -----------------------------
  // MOVE ORDER TO NEXT STATUS
  // -----------------------------
  const advance = async (id, next) => {
    try {
      await orderService.updateStatus(id, next);

      toast.success(`Order moved to ${next}`);

      refetch();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          'Could not update order'
      );
    }
  };

  // -----------------------------
  // TOGGLE MENU AVAILABILITY
  // -----------------------------
  const toggleAvailability = async (item) => {
    try {
      await menuService.updateAvailability(
        item.id,
        !item.available
      );

      toast.success(
        `${item.name} is now ${
          item.available ? 'sold out' : 'available'
        }`
      );

      refetchMenu();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          'Could not update availability'
      );
    }
  };

  // -----------------------------
  // ACTIVE ORDERS
  // -----------------------------
  const activeOrders = [
    ...pending,
    ...preparing,
  ].slice(0, 6);

  // -----------------------------
  // PAGE
  // -----------------------------
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="font-display text-xl font-bold text-secondary-900">
          Kitchen Dashboard
        </h1>

        <p className="mt-1 text-sm text-secondary-500">
          Your live view of what needs firing next.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))
        ) : (
          <>
            <StatCard
              icon={Clock}
              label="Pending Orders"
              value={pending.length}
              tone="warning"
            />

            <StatCard
              icon={Flame}
              label="Preparing Orders"
              value={preparing.length}
              tone="primary"
            />

            <StatCard
              icon={CheckCircle2}
              label="Completed Today"
              value={completed.length}
              tone="success"
            />
          </>
        )}

      </div>

      {/* ORDERS */}
      <div>
        <p className="mb-3 font-display font-semibold text-secondary-900">
          Needs attention
        </p>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : activeOrders.length === 0 ? (
          <EmptyState
            title="Kitchen is clear"
            description="No pending or in-progress orders right now."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {activeOrders.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                onAdvance={advance}
              />
            ))}
          </div>
        )}
      </div>

      {/* MENU AVAILABILITY */}
      <div>
        <p className="mb-3 font-display font-semibold text-secondary-900">
          Menu Availability
        </p>

        {menuLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : !menuItems || menuItems.length === 0 ? (
          <EmptyState
            title="No menu items"
            description="There are no menu items available."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-secondary-100 bg-white p-4"
              >

                {/* ITEM NAME */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-secondary-800">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-secondary-400">
                    {item.category}
                  </p>

                  <p className="mt-1 text-xs text-secondary-500">
                    ₹{item.price}
                  </p>
                </div>

                {/* AVAILABILITY BUTTON */}
                <button
                  onClick={() => toggleAvailability(item)}
                  className={`ml-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                    item.available
                      ? 'bg-success-50 text-success-700'
                      : 'bg-danger-50 text-danger-700'
                  }`}
                >
                  {item.available ? (
                    <Check size={14} />
                  ) : (
                    <X size={14} />
                  )}

                  {item.available
                    ? 'Available'
                    : 'Sold Out'}
                </button>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}