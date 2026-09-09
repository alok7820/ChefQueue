import { delay } from './api';
import { USERS } from '../data/mockData';

let users = [...USERS];

export const userService = {
  async getAll() {
    await delay(450);
    return [...users];
  },
  async update(id, patch) {
    await delay(350);
    users = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    return users.find((u) => u.id === id);
  },
  async remove(id) {
    await delay(300);
    users = users.filter((u) => u.id !== id);
    return { success: true };
  },
};
