import api from './api';

export const userService = {
  async create(user) {
  const response = await api.post('/users', user);
  return response.data.data;
},
  async getAll() {
    const response = await api.get('/users');
    return response.data.data;
  },
  async update(id, patch) {
    const response = await api.put(`/users/${id}`, patch);
    return response.data.data;
  },
  async remove(id) {
    await api.delete(`/users/${id}`);
    return { success: true };
  },
  async getMyProfile() {
    const response = await api.get('/users/me');
    return response.data.data;
  },
  async updateMyProfile(patch) {
    const response = await api.put('/users/me', patch);
    return response.data.data;
  },
  async changeMyPassword(currentPassword, newPassword) {
    const response = await api.put('/users/me/password', { currentPassword, newPassword });
    return response.data.data;
  },
};
