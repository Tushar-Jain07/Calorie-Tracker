import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useProfileStore from '../store/profileStore';
import WeeklyBar from '../components/charts/WeeklyBar';
import WeightTrend from '../components/charts/WeightTrend';
import { foodService } from '../services/foodService';
import toast from 'react-hot-toast';

export default function Progress() {
  const { user } = useAuth();
  const { weightLogs, fetchWeightLogs, logWeight, stats, fetchStats } = useProfileStore();
  const [weeklyData, setWeeklyData] = useState([]);
  const [range, setRange] = useState('7');
  const [weightInput, setWeightInput] = useState('');
  const [summary, setSummary] = useState(null);

  const target = user?.profile?.targetCalories || 0;

  useEffect(() => {
    fetchWeightLogs(90);
    fetchStats();
  }, []);

  useEffect(() => { loadData(); }, [range]);

  const loadData = async () => {
    try {
      const days = parseInt(range);
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - (days - 1));
      const data = await foodService.getSummary(
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      );
      setSummary(data);

      const labels = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        labels.push({
          label: days <= 7
            ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
            : `${d.getMonth() + 1}/${d.getDate()}`,
          calories: data.daily?.[dateStr]?.calories || 0
        });
      }
      setWeeklyData(labels);
    } catch (e) { /* not critical */ }
  };

  const handleLogWeight = async () => {
    const w = parseFloat(weightInput);
    if (!w || w < 20 || w > 500) {
      toast.error('Enter a valid weight (20-500 kg)');
      return;
    }
    try {
      await logWeight(w);
      toast.success(`Weight logged: ${w} kg`);
      setWeightInput('');
      fetchWeightLogs(90);
    } catch (error) {
      toast.error('Failed to log weight');
    }
  };

  const exportCSV = async () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 90);
      const data = await foodService.getSummary(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);

      let csv = 'Date,Calories,Protein,Fat,Carbs,Entries\n';
      Object.entries(data.daily || {}).sort().forEach(([date, vals]) => {
        csv += `${date},${vals.calories},${Math.round(vals.protein)},${Math.round(vals.fat)},${Math.round(vals.carbs)},${vals.count}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `macrosnap-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported!');
    } catch (e) {
      toast.error('Export failed');
    }
  };

  const weightChartData = weightLogs.map(l => ({
    label: l.date.slice(5),
    weight: l.weight
  }));

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Progress</h1>
          <p>Track your nutrition and weight trends</p>
        </div>
        <button className="btn btn-secondary" onClick={exportCSV}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      {summary?.averages && (
        <div className="page-grid page-grid-4" style={{ marginBottom: 'var(--space-lg)' }}>
          {[
            { label: 'Avg Calories', value: summary.averages.calories, color: 'var(--emerald-light)' },
            { label: 'Avg Protein', value: `${summary.averages.protein}g`, color: 'var(--emerald)' },
            { label: 'Days Logged', value: summary.daysLogged, color: 'var(--cyan-light)' },
            { label: 'Compliance', value: target ? `${Math.round(summary.averages.calories / target * 100)}%` : 'N/A', color: 'var(--amber)' },
          ].map((s, i) => (
            <motion.div key={i} className="card metric-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="metric-value" style={{ color: s.color, fontSize: '1.5rem' }}>{s.value}</div>
              <div className="metric-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Date Range */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Calorie Trend</div>
          <div className="tabs" style={{ marginBottom: 0, width: 'auto' }}>
            {[
              { value: '7', label: '7d' },
              { value: '14', label: '14d' },
              { value: '30', label: '30d' },
            ].map(r => (
              <button key={r.value} className={`tab ${range === r.value ? 'active' : ''}`} onClick={() => setRange(r.value)}>{r.label}</button>
            ))}
          </div>
        </div>
        <WeeklyBar data={weeklyData} target={target} />
      </div>

      <div className="dashboard-grid">
        {/* Weight Tracking */}
        <div className="card">
          <div className="card-title">Weight Tracking</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              className="input"
              type="number"
              placeholder="Enter weight (kg)"
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={handleLogWeight}>
              <Scale size={16} /> Log
            </button>
          </div>
          <WeightTrend data={weightChartData} />
        </div>

        {/* Streak & Stats */}
        <div className="card">
          <div className="card-title">Your Stats</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <span className="streak-fire">🔥</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{user?.streak?.current || 0} Day Streak</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                  Longest: {user?.streak?.longest || 0} days
                </div>
              </div>
            </div>

            {stats && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Entries</span>
                  <span style={{ fontWeight: 600 }}>{stats.totalEntries}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Days Logged</span>
                  <span style={{ fontWeight: 600 }}>{stats.daysLogged}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>7-Day Avg</span>
                  <span style={{ fontWeight: 600 }}>{stats.weeklyAvgCalories} kcal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Member Since</span>
                  <span style={{ fontWeight: 600 }}>{stats.memberSince ? new Date(stats.memberSince).toLocaleDateString() : '—'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
