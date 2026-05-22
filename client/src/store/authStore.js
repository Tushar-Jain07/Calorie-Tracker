import { create } from 'zustand';
import { authService } from '../services/authService';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('macrosnap_token'),
  isAuthenticated: !!localStorage.getItem('macrosnap_token'),
  loading: true,

  login: async (username, password) => {
    const data = await authService.login(username, password);
    localStorage.setItem('macrosnap_token', data.token);
    set({ user: data.user, token: data.token, isAuthenticated: true });
    return data;
  },

  register: async (username, password, email) => {
    const data = await authService.register(username, password, email);
    localStorage.setItem('macrosnap_token', data.token);
    set({ user: data.user, token: data.token, isAuthenticated: true });
    return data;
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('macrosnap_token');
      if (!token) {
        set({ loading: false, isAuthenticated: false });
        return;
      }
      const data = await authService.getMe();
      set({ user: data.user, isAuthenticated: true, loading: false });
    } catch (error) {
      localStorage.removeItem('macrosnap_token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('macrosnap_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    set({ user });
  }
}));

export default useAuthStore;
