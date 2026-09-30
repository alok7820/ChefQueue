import Order from '../models/Order.js';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STATUS_COLORS = {
  Completed: '#22c55e',
  Preparing: '#F97316',
  Pending: '#f59e0b',
  Ready: '#3b82f6',
  Cancelled: '#ef4444',
};

async function revenueTrendLast7Days() {
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
  ]);
  const byDate = new Map(rows.map((r) => [r._id, r]));

  const trend = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const row = byDate.get(key);
    trend.push({ day: DAY_LABELS[d.getDay()], revenue: row?.revenue || 0, orders: row?.orders || 0 });
  }
  return trend;
}

async function statusDistribution() {
  const rows = await Order.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]);
  return rows.map((r) => ({ name: r._id, value: r.value, color: STATUS_COLORS[r._id] || '#94a3b8' }));
}

async function topItems(limit = 5) {
  const rows = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        sold: { $sum: '$items.qty' },
        revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: limit },
  ]);
  return rows.map((r) => ({ name: r._id, sold: r.sold, revenue: r.revenue }));
}

export async function getAdminDashboard(req, res, next) {
  try {
    const [totalOrders, revenueAgg, pending, completed, recentOrders, revenueTrend, distribution, top] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$total' } } }]),
        Order.countDocuments({ status: 'Pending' }),
        Order.countDocuments({ status: 'Completed' }),
        Order.find().sort({ createdAt: -1 }).limit(8),
        revenueTrendLast7Days(),
        statusDistribution(),
        topItems(5),
      ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        revenue: revenueAgg[0]?.revenue || 0,
        pending,
        completed,
        recentOrders,
        revenueTrend,
        statusDistribution: distribution,
        topItems: top,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getCashierDashboard(req, res, next) {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const filter = { createdAt: { $gte: start, $lt: end } };
    const [revenueAgg, ordersToday, recentOrders] = await Promise.all([
      Order.aggregate([{ $match: filter }, { $group: { _id: null, revenue: { $sum: '$total' } } }]),
      Order.countDocuments(filter),
      Order.find(filter).sort({ createdAt: -1 }).limit(8),
    ]);

    res.json({
      success: true,
      data: {
        revenueToday: revenueAgg[0]?.revenue || 0,
        ordersToday,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getChefDashboard(req, res, next) {
  try {
    const [pending, preparing, ready, completed, cookingTimeAgg, activeOrders] = await Promise.all([
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Preparing' }),
      Order.countDocuments({ status: 'Ready' }),
      Order.countDocuments({ status: 'Completed' }),
      Order.aggregate([{ $group: { _id: null, avg: { $avg: '$cookingTime' } } }]),
      Order.find({ status: { $in: ['Pending', 'Preparing'] } }),
    ]);

    res.json({
      success: true,
      data: {
        pendingOrders: pending,
        preparingOrders: preparing,
        readyOrders: ready,
        completedOrders: completed,
        averageCookingTime: Math.round(cookingTimeAgg[0]?.avg || 0),
        kitchenWorkload: activeOrders.length,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const [revenueTrend, distribution, top, totalOrders, revenueAgg] = await Promise.all([
      revenueTrendLast7Days(),
      statusDistribution(),
      topItems(8),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$total' } } }]),
    ]);
    const revenue = revenueAgg[0]?.revenue || 0;

    res.json({
      success: true,
      data: {
        revenueTrend,
        statusDistribution: distribution,
        topItems: top,
        totalOrders,
        revenue,
        averageOrderValue: totalOrders ? Math.round(revenue / totalOrders) : 0,
      },
    });
  } catch (err) {
    next(err);
  }
}
