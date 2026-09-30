import { delay } from './api';
import { REVENUE_TREND, STATUS_DISTRIBUTION, TOP_ITEMS, ORDERS } from '../data/mockData';

export const dashboardService = {
  async getAdminStats() {
    await delay(450);
    const totalOrders = ORDERS.length;
    const revenue = ORDERS.reduce((s, o) => s + o.total, 0);
    const pending = ORDERS.filter((o) => o.status === 'Pending').length;
    const completed = ORDERS.filter((o) => o.status === 'Completed').length;
    const recentOrders = [...ORDERS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
    return { totalOrders, revenue, pending, completed, revenueTrend: REVENUE_TREND, statusDistribution: STATUS_DISTRIBUTION, topItems: TOP_ITEMS, recentOrders };
  },
  async getCashierStats() {
    await delay(400);
    const today = ORDERS.slice(0, 12);
    return {
      revenueToday: today.reduce((s, o) => s + o.total, 0),
      ordersToday: today.length,
      recentOrders: today,
    };
  },
};
