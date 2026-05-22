import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';
import useProfileStore from '../store/profileStore';
import { profileService } from '../services/profileService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const { logout, updateUser } = useAuthStore();
  const { stats, fetchStats } = useProfileStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    waterGoal: user?.preferences?.dailyWaterGoal || 8,
    weightUnit: user?.preferences?.units?.weight || 'kg',
    heightUnit: user?.preferences?.units?.height || 'cm',
  });

  useEffect(() => { fetchStats(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await profileService.updateProfile(null, {
        dailyWaterGoal: parseInt(form.waterGoal),
        units: {
          weight: form.weightUnit,
          height: form.heightUnit
        }
      });
      if (data?.user) updateUser(data.user);
      toast.success('Preferences saved');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.username?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account and preferences</p>
      </div>

      {/* Profile Header */}
      <motion.div className="card" style={{ marginBottom: 'var(--space-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-header">
          <div className="profile-avatar">{initial}</div>
          <div className="profile-info">
            <h2>{user?.username}</h2>
            <p>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}</p>
            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value" style={{ color: 'var(--emerald-light)' }}>{stats?.totalEntries || 0}</div>
                <div className="profile-stat-label">Entries</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value" style={{ color: 'var(--amber-light)' }}>{user?.streak?.current || 0}</div>
                <div className="profile-stat-label">Streak</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value" style={{ color: 'var(--cyan-light)' }}>{stats?.daysLogged || 0}</div>
                <div className="profile-stat-label">Days</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="dashboard-grid">
        {/* Current Targets */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-title">Current Targets</div>
          {user?.profile?.targetCalories ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Target Calories', value: `${user.profile.targetCalories} kcal` },
                { label: 'BMR', value: `${user.profile.bmr || '—'} kcal` },
                { label: 'TDEE', value: `${user.profile.tdee || '—'} kcal` },
                { label: 'Protein', value: `${user.profile.targetMacros?.protein || '—'}g` },
                { label: 'Fat', value: `${user.profile.targetMacros?.fat || '—'}g` },
                { label: 'Carbs', value: `${user.profile.targetMacros?.carbs || '—'}g` },
                { label: 'Goal', value: user.profile.goal ? user.profile.goal.charAt(0).toUpperCase() + user.profile.goal.slice(1) : '—' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-tertiary)' }}>No targets set yet</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/calculator')}>
                Set Up Calculator
              </button>
            </div>
          )}
        </motion.div>

        {/* Preferences */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="card-title">Preferences</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Daily Water Goal (glasses)</label>
              <input className="input" type="number" min="1" max="20" value={form.waterGoal} onChange={e => { setForm({ ...form, waterGoal: e.target.value }); setEditing(true); }} />
            </div>
            <div className="input-group">
              <label className="input-label">Weight Unit</label>
              <select className="input" value={form.weightUnit} onChange={e => { setForm({ ...form, weightUnit: e.target.value }); setEditing(true); }}>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Height Unit</label>
              <select className="input" value={form.heightUnit} onChange={e => { setForm({ ...form, heightUnit: e.target.value }); setEditing(true); }}>
                <option value="cm">Centimeters (cm)</option>
                <option value="ft">Feet / Inches (ft)</option>
              </select>
            </div>

            {editing && (
              <button className="btn btn-primary btn-full" onClick={handleSave} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Account Actions */}
      <motion.div className="card" style={{ marginTop: 'var(--space-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="card-title">Account</div>
        <button className="btn btn-danger btn-full" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </motion.div>
    </div>
  );
}
