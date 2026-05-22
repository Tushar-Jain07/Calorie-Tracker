import api from './api';

export const authService = {
  async login(username, password) {
    const { data } = await api.post('/auth/login', { username, password });
    return data;
  },

  async register(username, password, email) {
    const { data } = await api.post('/auth/register', { username, password, email });
    return data;
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async changePassword(currentPassword, newPassword) {
    const { data } = await api.put('/auth/password', { currentPassword, newPassword });
    return data;
  }
};
