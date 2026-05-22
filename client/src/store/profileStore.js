import { create } from 'zustand';
import { profileService } from '../services/profileService';

const useProfileStore = create((set) => ({
  stats: null,
  weightLogs: [],
  waterLog: { glasses: 0 },
  loading: false,

  fetchStats: async () => {
    try {
      const data = await profileService.getStats();
      set({ stats: data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  fetchWeightLogs: async (limit) => {
    try {
      const data = await profileService.getWeightLogs(limit);
      set({ weightLogs: data.logs });
    } catch (error) {
      console.error('Failed to fetch weight logs:', error);
    }
  },

  logWeight: async (weight, date) => {
    const data = await profileService.logWeight(weight, date);
    set(state => {
      const existing = state.weightLogs.findIndex(l => l.date === data.log.date);
      if (existing >= 0) {
        const logs = [...state.weightLogs];
        logs[existing] = data.log;
        return { weightLogs: logs };
      }
      return { weightLogs: [...state.weightLogs, data.log] };
    });
    return data.log;
  },

  fetchWater: async (date) => {
    try {
      const data = await profileService.getWater(date);
      set({ waterLog: data.log });
    } catch (error) {
      console.error('Failed to fetch water:', error);
    }
  },

  incrementWater: async () => {
    try {
      const data = await profileService.incrementWater();
      set({ waterLog: data.log });
    } catch (error) {
      console.error('Failed to increment water:', error);
    }
  },

  decrementWater: async () => {
    try {
      const data = await profileService.decrementWater();
      set({ waterLog: data.log });
    } catch (error) {
      console.error('Failed to decrement water:', error);
    }
  }
}));

export default useProfileStore;
