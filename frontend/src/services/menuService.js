import api from './api';


export const menuService = {
  async getAll() {
    const response = await api.get('/menu');
    return response.data.data;
  },
  async create(item) {
    const response = await api.post('/menu', item);
    return response.data.data;
  },
  async update(id, patch) {
    const response = await api.put(`/menu/${id}`, patch);
    return response.data.data;
  },
  async updateAvailability(id, available) {
  const response = await api.patch(`/menu/${id}/availability`, { available });
  return response.data.data;
},
  async remove(id) {
    await api.delete(`/menu/${id}`);
    return { success: true };
  },
};
