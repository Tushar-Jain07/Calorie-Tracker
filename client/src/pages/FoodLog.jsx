import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import useFoodStore from '../store/foodStore';
import toast from 'react-hot-toast';

export default function FoodLog() {
  const { user } = useAuth();
  const { entries, fetchEntries, addEntry, deleteEntry, searchFood, searchResults, searching, clearSearch } = useFoodStore();
  const today = new Date().toISOString().split('T')[0];

  const [mealTab, setMealTab] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [form, setForm] = useState({
    name: '', servingGrams: '', calories: '', protein: '', fat: '', carbs: '', mealType: 'lunch'
  });

  useEffect(() => { fetchEntries(today); }, []);
  useEffect(() => { if (debouncedSearch.length >= 2) searchFood(debouncedSearch); }, [debouncedSearch]);

  const todayEntries = entries.filter(e => e.date === today);
  const filteredEntries = mealTab === 'all' ? todayEntries : todayEntries.filter(e => e.mealType === mealTab);

  const totals = todayEntries.reduce((acc, e) => ({
    calories: acc.calories + e.calories,
    protein: acc.protein + e.protein,
    fat: acc.fat + e.fat,
    carbs: acc.carbs + e.carbs
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

  const selectFromSearch = (food) => {
    const scale = (food.servingSize || 100) / 100;
    setForm({
      name: food.name,
      servingGrams: food.servingSize || 100,
      calories: Math.round((food.nutrients?.calories || 0) * scale),
      protein: Math.round((food.nutrients?.protein || 0) * scale * 10) / 10,
      fat: Math.round((food.nutrients?.fat || 0) * scale * 10) / 10,
      carbs: Math.round((food.nutrients?.carbs || 0) * scale * 10) / 10,
      mealType: form.mealType
    });
    setSearchQuery('');
    clearSearch();
  };

  const handleAdd = async () => {
    if (!form.name || !form.calories || !form.servingGrams) {
      toast.error('Name, calories, and serving are required');
      return;
    }
    try {
      await addEntry({
        date: today,
        mealType: form.mealType,
        name: form.name,
        servingGrams: parseFloat(form.servingGrams),
        calories: parseFloat(form.calories),
        protein: parseFloat(form.protein) || 0,
        fat: parseFloat(form.fat) || 0,
        carbs: parseFloat(form.carbs) || 0
      });
      toast.success(`${form.name} added!`);
      setForm({ name: '', servingGrams: '', calories: '', protein: '', fat: '', carbs: '', mealType: form.mealType });
      setShowAddForm(false);
    } catch (error) {
      toast.error('Failed to add food');
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await deleteEntry(id);
      toast.success(`${name} removed`);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const mealEmoji = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍿' };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Food Log</h1>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus size={18} /> Add Food
        </button>
      </div>

      {/* Day Totals */}
      <div className="page-grid page-grid-4" style={{ marginBottom: 'var(--space-lg)' }}>
        {[
          { label: 'Calories', value: Math.round(totals.calories), color: 'var(--emerald)' },
          { label: 'Protein', value: `${Math.round(totals.protein)}g`, color: 'var(--emerald-light)' },
          { label: 'Fat', value: `${Math.round(totals.fat)}g`, color: 'var(--amber)' },
          { label: 'Carbs', value: `${Math.round(totals.carbs)}g`, color: 'var(--violet)' },
        ].map((s, i) => (
          <div key={i} className="card metric-card">
            <div className="metric-value" style={{ color: s.color, fontSize: '1.5rem' }}>{s.value}</div>
            <div className="metric-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Meal Type Tabs */}
      <div className="tabs">
        {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(t => (
          <button key={t} className={`tab ${mealTab === t ? 'active' : ''}`} onClick={() => setMealTab(t)}>
            {t === 'all' ? '📋 All' : `${mealEmoji[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Food Entries */}
      <AnimatePresence>
        {filteredEntries.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <UtensilsCrossed size={48} />
              <h3>No entries yet</h3>
              <p>Start logging your meals to track your nutrition</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {filteredEntries.map(entry => (
              <motion.div
                key={entry._id}
                className="food-entry"
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className={`food-entry-icon ${entry.mealType}`}>
                  {mealEmoji[entry.mealType] || '🍽️'}
                </div>
                <div className="food-entry-info">
                  <div className="food-entry-name">{entry.name}</div>
                  <div className="food-entry-meta">
                    <span>{entry.servingGrams}g</span>
                    <span>P: {Math.round(entry.protein)}g</span>
                    <span>F: {Math.round(entry.fat)}g</span>
                    <span>C: {Math.round(entry.carbs)}g</span>
                  </div>
                </div>
                <div className="food-entry-calories">{Math.round(entry.calories)} kcal</div>
                <div className="food-entry-actions">
                  <button className="btn btn-ghost" onClick={() => handleDelete(entry._id, entry.name)} title="Delete">
                    <Trash2 size={16} color="var(--rose)" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Add Food Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowAddForm(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="modal-header">
                <h3>Add Food</h3>
                <button className="btn btn-ghost" onClick={() => setShowAddForm(false)}>✕</button>
              </div>
              <div className="modal-body">
                {/* Search */}
                <div className="input-group" style={{ position: 'relative' }}>
                  <label className="input-label">Search Food Database</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                      className="input"
                      style={{ paddingLeft: 42 }}
                      type="text"
                      placeholder="Search USDA database..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)', maxHeight: 200, overflowY: 'auto', marginTop: 4
                    }}>
                      {searchResults.map((food, i) => (
                        <div
                          key={i}
                          onClick={() => selectFromSearch(food)}
                          style={{
                            padding: '10px 14px', cursor: 'pointer', fontSize: '0.82rem',
                            borderBottom: '1px solid var(--border-subtle)',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => e.target.style.background = 'var(--bg-tertiary)'}
                          onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                          <div style={{ fontWeight: 500 }}>{food.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                            {food.nutrients?.calories || 0} kcal per {food.servingSize || 100}{food.servingUnit || 'g'}
                            {food.brand && ` — ${food.brand}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {searching && <div style={{ fontSize: '0.75rem', color: 'var(--emerald-light)', marginTop: 4 }}>Searching...</div>}
                </div>

                {/* Meal Type */}
                <div className="input-group">
                  <label className="input-label">Meal Type</label>
                  <div className="tabs" style={{ marginBottom: 0 }}>
                    {['breakfast', 'lunch', 'dinner', 'snack'].map(t => (
                      <button key={t} className={`tab ${form.mealType === t ? 'active' : ''}`} onClick={() => setForm({ ...form, mealType: t })}>
                        {mealEmoji[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual entry fields */}
                <div className="input-group">
                  <label className="input-label">Food Name</label>
                  <input className="input" type="text" placeholder="e.g. Chicken Breast" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="input-group">
                    <label className="input-label">Serving (g)</label>
                    <input className="input" type="number" placeholder="100" value={form.servingGrams} onChange={e => setForm({ ...form, servingGrams: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Calories</label>
                    <input className="input" type="number" placeholder="165" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Protein (g)</label>
                    <input className="input" type="number" placeholder="31" value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Fat (g)</label>
                    <input className="input" type="number" placeholder="3.6" value={form.fat} onChange={e => setForm({ ...form, fat: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Carbs (g)</label>
                    <input className="input" type="number" placeholder="0" value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAdd}>
                  <Plus size={16} /> Add Food
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
