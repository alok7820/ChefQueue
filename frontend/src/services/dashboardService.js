import api from './api';

export const dashboardService = {
  async getAdminStats() {
    const response = await api.get('/dashboard/admin');
    return response.data.data;
  },
  async getCashierStats() {
    const response = await api.get('/dashboard/cashier');
    return response.data.data;
  },
  async getChefStats() {
    const response = await api.get('/dashboard/chef');
    return response.data.data;
  },
};
