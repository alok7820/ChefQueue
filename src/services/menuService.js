import { delay } from './api';
import { MENU_ITEMS } from '../data/mockData';

let items = [...MENU_ITEMS];

export const menuService = {
  async getAll() {
    await delay(500);
    return [...items];
  },
  async create(item) {
    await delay(400);
    const newItem = { ...item, id: Date.now() };
    items = [newItem, ...items];
    return newItem;
  },
  async update(id, patch) {
    await delay(400);
    items = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
    return items.find((it) => it.id === id);
  },
  async remove(id) {
    await delay(300);
    items = items.filter((it) => it.id !== id);
    return { success: true };
  },
};
