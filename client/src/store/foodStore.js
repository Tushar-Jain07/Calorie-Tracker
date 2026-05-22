import { create } from 'zustand';
import { foodService } from '../services/foodService';

const useFoodStore = create((set, get) => ({
  entries: [],
  loading: false,
  searchResults: [],
  searching: false,

  fetchEntries: async (date) => {
    set({ loading: true });
    try {
      const data = await foodService.getEntries(date);
      set({ entries: data.entries, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  addEntry: async (entry) => {
    const data = await foodService.addEntry(entry);
    set(state => ({ entries: [...state.entries, data.entry] }));
    return data.entry;
  },

  deleteEntry: async (id) => {
    await foodService.deleteEntry(id);
    set(state => ({ entries: state.entries.filter(e => e._id !== id) }));
  },

  updateEntry: async (id, updates) => {
    const data = await foodService.updateEntry(id, updates);
    set(state => ({
      entries: state.entries.map(e => e._id === id ? data.entry : e)
    }));
    return data.entry;
  },

  searchFood: async (query) => {
    if (!query || query.length < 2) {
      set({ searchResults: [] });
      return;
    }
    set({ searching: true });
    try {
      const data = await foodService.searchFood(query);
      set({ searchResults: data.foods || [], searching: false });
    } catch (error) {
      set({ searchResults: [], searching: false });
    }
  },

  clearSearch: () => set({ searchResults: [] }),

  getTodayEntries: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().entries.filter(e => e.date === today);
  },

  getTodayTotals: () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = get().entries.filter(e => e.date === today);
    return todayEntries.reduce((acc, e) => ({
      calories: acc.calories + (e.calories || 0),
      protein: acc.protein + (e.protein || 0),
      fat: acc.fat + (e.fat || 0),
      carbs: acc.carbs + (e.carbs || 0)
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
  }
}));

export default useFoodStore;
