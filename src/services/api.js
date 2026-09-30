import axios from 'axios';

// Central axios instance. Not actually called anywhere yet since this build
// uses mock services below, but wired up so a real backend can be dropped in
// by pointing baseURL at your API and swapping the mock calls for these.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chefqueue_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('chefqueue_token');
    }
    return Promise.reject(err);
  }
);

export default api;

// Simulates real network latency for the mock services.
export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
