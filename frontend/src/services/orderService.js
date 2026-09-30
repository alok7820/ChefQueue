import api from './api';

export const orderService = {
  async getAll() {
    const response = await api.get('/orders');
    return response.data.data;
  },
  async getById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },
  async updateStatus(id, status) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data.data;
  },
  async create(order) {
    const response = await api.post('/orders', order);
    return response.data.data;
  },
  async update(id, patch) {
    const response = await api.put(`/orders/${id}`, patch);
    return response.data.data;
  },
  async remove(id) {
    await api.delete(`/orders/${id}`);
    return { success: true };
  },
};
