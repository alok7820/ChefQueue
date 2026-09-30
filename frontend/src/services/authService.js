import api from './api';

// Re-throws with the backend's own message (e.g. "Invalid email or password") instead of
// axios's generic "Request failed with status code 401", since Login/Register read err.message.
function apiError(err) {
  const message = err.response?.data?.message || err.message || 'Something went wrong';
  return new Error(message);
}

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      localStorage.setItem('chefqueue_token', token);
      localStorage.setItem('chefqueue_user', JSON.stringify(user));
      return { token, user };
    } catch (err) {
      throw apiError(err);
    }
  },

  async register(payload) {
    try {
      const response = await api.post('/auth/register', payload);
      const { token, user } = response.data.data;
      localStorage.setItem('chefqueue_token', token);
      localStorage.setItem('chefqueue_user', JSON.stringify(user));
      return { token, user };
    } catch (err) {
      throw apiError(err);
    }
  },

  async fetchMe() {
    const response = await api.get('/auth/me');
    const user = response.data.data;
    localStorage.setItem('chefqueue_user', JSON.stringify(user));
    return user;
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
