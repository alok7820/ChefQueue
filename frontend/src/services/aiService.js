import api from './api';

export const aiService = {
  async ask(message) {
    const response = await api.post('/ai/ask', { message });
    return response.data.data;
  },
};
