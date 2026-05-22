import api from './api';

export const profileService = {
  async getProfile() {
    const { data } = await api.get('/profile');
    return data;
  },

  async updateProfile(profile, preferences) {
    const { data } = await api.put('/profile', { profile, preferences });
    return data;
  },

  async getStats() {
    const { data } = await api.get('/profile/stats');
    return data;
  },

  async getWeightLogs(limit = 30) {
    const { data } = await api.get('/weight', { params: { limit } });
    return data;
  },

  async logWeight(weight, date) {
    const { data } = await api.post('/weight', { weight, date });
    return data;
  },

  async deleteWeightLog(id) {
    const { data } = await api.delete(`/weight/${id}`);
    return data;
  },

  async getWater(date) {
    const { data } = await api.get('/water', { params: { date } });
    return data;
  },

  async incrementWater() {
    const { data } = await api.put('/water/increment');
    return data;
  },

  async decrementWater() {
    const { data } = await api.put('/water/decrement');
    return data;
  }
};
