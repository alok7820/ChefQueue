import { delay } from './api';
import { USERS } from '../data/mockData';

const DEMO_ACCOUNTS = {
  'admin@chefqueue.app': { password: 'admin123', role: 'admin' },
  'chef@chefqueue.app': { password: 'chef123', role: 'chef' },
  'cashier@chefqueue.app': { password: 'cashier123', role: 'cashier' },
};

export const authService = {
  async login(email, password) {
    await delay(600);
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    if (!account || account.password !== password) {
      throw new Error('Invalid email or password');
    }
    const user = USERS.find((u) => u.role === account.role) || USERS[0];
    const token = `mock-jwt-${user.role}-${Date.now()}`;
    localStorage.setItem('chefqueue_token', token);
    localStorage.setItem('chefqueue_user', JSON.stringify(user));
    return { token, user };
  },

  async register(payload) {
    await delay(600);
    const user = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      role: payload.role || 'cashier',
      phone: payload.phone || '',
      status: 'Active',
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(payload.email)}`,
    };
    const token = `mock-jwt-${user.role}-${Date.now()}`;
    localStorage.setItem('chefqueue_token', token);
    localStorage.setItem('chefqueue_user', JSON.stringify(user));
    return { token, user };
  },

  logout() {
    localStorage.removeItem('chefqueue_token');
    localStorage.removeItem('chefqueue_user');
  },

  getCurrentUser() {
    const raw = localStorage.getItem('chefqueue_user');
    return raw ? JSON.parse(raw) : null;
  },

  getToken() {
    return localStorage.getItem('chefqueue_token');
  },
};
