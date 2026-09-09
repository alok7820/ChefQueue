import { delay } from './api';
import { ORDERS } from '../data/mockData';

let orders = [...ORDERS];

export const orderService = {
  async getAll() {
    await delay(500);
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async getById(id) {
    await delay(250);
    return orders.find((o) => o.id === Number(id));
  },
  async updateStatus(id, status) {
    await delay(350);
    orders = orders.map((o) => (o.id === id ? { ...o, status } : o));
    return orders.find((o) => o.id === id);
  },
  async create(order) {
    await delay(500);
    const newOrder = { ...order, id: Date.now(), createdAt: new Date().toISOString(), status: 'Pending' };
    orders = [newOrder, ...orders];
    return newOrder;
  },
  async remove(id) {
    await delay(300);
    orders = orders.filter((o) => o.id !== id);
    return { success: true };
  },
};
