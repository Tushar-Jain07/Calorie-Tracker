import api from './api';

export const foodService = {
  async getEntries(date) {
    const params = date ? { date } : {};
    const { data } = await api.get('/food', { params });
    return data;
  },

  async getSummary(start, end) {
    const { data } = await api.get('/food/summary', { params: { start, end } });
    return data;
  },

  async addEntry(entry) {
    const { data } = await api.post('/food', entry);
    return data;
  },

  async updateEntry(id, updates) {
    const { data } = await api.put(`/food/${id}`, updates);
    return data;
  },

  async deleteEntry(id) {
    const { data } = await api.delete(`/food/${id}`);
    return data;
  },

  async searchFood(query) {
    const { data } = await api.get('/search/food', { params: { q: query } });
    return data;
  }
};
