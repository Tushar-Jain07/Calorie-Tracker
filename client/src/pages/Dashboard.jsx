import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Droplets, Plus, TrendingUp, Scale } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useFoodStore from '../store/foodStore';
import useProfileStore from '../store/profileStore';
import CalorieRing from '../components/charts/CalorieRing';
import MacroDonut from '../components/charts/MacroDonut';
import WeeklyBar from '../components/charts/WeeklyBar';
import { useNavigate } from 'react-router-dom';
import { foodService } from '../services/foodService';
import { useState } from 'react';
import { useCountUp } from '../hooks/useCountUp';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { entries, fetchEntries, getTodayTotals } = useFoodStore();
  const { stats, waterLog, fetchStats, fetchWater, incrementWater, decrementWater } = useProfileStore();
  const [weeklyData, setWeeklyData] = useState([]);

  const today = new Date().toISOString().split('T')[0];
  const target = user?.profile?.targetCalories || 0;
  const macroTargets = user?.profile?.targetMacros || { protein: 0, fat: 0, carbs: 0 };
  const totals = getTodayTotals();
  const streak = useCountUp(user?.streak?.current || 0);
  const waterGoal = user?.preferences?.dailyWaterGoal || 8;

  useEffect(() => {
    fetchEntries(today);
    fetchStats();
    fetchWater(today);
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      const data = await foodService.getSummary(
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      );
      const labels = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        labels.push({
          label: dayNames[d.getDay()],
          calories: data.daily?.[dateStr]?.calories || 0
        });
      }
      setWeeklyData(labels);
    } catch (e) {
      // Weekly data not critical
    }
  };

  const todayEntries = entries.filter(e => e.date === today);
  const mealGroups = { breakfast: [], lunch: [], dinner: [], snack: [] };
  todayEntries.forEach(e => {
    const type = e.mealType || 'snack';
    if (mealGroups[type]) mealGroups[type].push(e);
  });

  const mealEmoji = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍿' };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } })
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your nutrition at a glance — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Quick Stats Row */}
      <div className="page-grid page-grid-4" style={{ marginBottom: 'var(--space-lg)' }}>
        {[
          { label: 'Target', value: target, unit: 'kcal', color: 'var(--emerald)', icon: <TrendingUp size={20} /> },
          { label: 'Consumed', value: Math.round(totals.calories), unit: 'kcal', color: 'var(--cyan)', icon: <Flame size={20} /> },
          { label: 'Streak', value: streak, unit: 'days', color: 'var(--amber)', icon: <span style={{ fontSize: '1.2rem' }}>🔥</span> },
          { label: 'Water', value: waterLog.glasses || 0, unit: `/ ${waterGoal}`, color: 'var(--cyan)', icon: <Droplets size={20} /> },
        ].map((stat, i) => (
          <motion.div key={i} className="card metric-card" custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <div className="metric-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="metric-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="metric-label">{stat.label} <span style={{ color: 'var(--text-tertiary)' }}>{stat.unit}</span></div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Calorie Ring */}
        <motion.div className="card" custom={4} variants={cardVariants} initial="hidden" animate="visible">
          <div className="card-title">Today's Calories</div>
          <div className="calorie-ring-container">
            <CalorieRing consumed={totals.calories} target={target || 2000} size={200} />
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={() => navigate('/food-log')}>
            <Plus size={18} /> Log Food
          </button>
        </motion.div>

        {/* Macros */}
        <motion.div className="card" custom={5} variants={cardVariants} initial="hidden" animate="visible">
          <div className="card-title">Macro Breakdown</div>
          <MacroDonut
            protein={totals.protein}
            fat={totals.fat}
            carbs={totals.carbs}
            targetProtein={macroTargets.protein || 150}
            targetFat={macroTargets.fat || 65}
            targetCarbs={macroTargets.carbs || 250}
          />
          {!target && (
            <div style={{ marginTop: 16, padding: '12px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--amber-light)' }}>
              💡 Set up your targets in the <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/calculator')}>Calculator</span>
            </div>
          )}
        </motion.div>

        {/* Water Tracker */}
        <motion.div className="card" custom={6} variants={cardVariants} initial="hidden" animate="visible">
          <div className="card-title">Water Intake</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '20px 0' }}>
            <button className="btn btn-icon" onClick={decrementWater}>−</button>
            <div className="water-glasses">
              {Array.from({ length: waterGoal }, (_, i) => (
                <div key={i} className={`water-glass ${i < (waterLog.glasses || 0) ? 'filled' : ''}`} />
              ))}
            </div>
            <button className="btn btn-icon" onClick={incrementWater} style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-light)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>+</button>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {waterLog.glasses || 0} of {waterGoal} glasses ({(waterLog.glasses || 0) * 250}ml)
          </div>
        </motion.div>

        {/* Today's Meals */}
        <motion.div className="card" custom={7} variants={cardVariants} initial="hidden" animate="visible">
          <div className="card-title">Today's Meals</div>
          {todayEntries.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No food logged yet today</p>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/food-log')}>
                <Plus size={14} /> Add Food
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(mealGroups).map(([type, items]) => {
                if (items.length === 0) return null;
                const mealCals = items.reduce((s, e) => s + e.calories, 0);
                return (
                  <div key={type} style={{ padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'capitalize' }}>
                        {mealEmoji[type]} {type}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--emerald-light)', fontWeight: 600 }}>{Math.round(mealCals)} kcal</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {items.map(e => e.name).join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Weekly Chart */}
        <motion.div className="card card-wide" custom={8} variants={cardVariants} initial="hidden" animate="visible">
          <div className="card-title">Weekly Overview</div>
          <WeeklyBar data={weeklyData} target={target} />
        </motion.div>
      </div>
    </div>
  );
}
