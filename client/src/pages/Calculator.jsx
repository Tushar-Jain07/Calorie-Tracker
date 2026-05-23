import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Activity, Dumbbell, Bike, Zap, Armchair } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Calculator() {
  const { user } = useAuth();
  const updateUser = useAuthStore(s => s.updateUser);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState(null);

  const [form, setForm] = useState({
    age: user?.profile?.age || '',
    sex: user?.profile?.sex || '',
    heightCm: user?.profile?.heightCm || '',
    weightKg: user?.profile?.weightKg || '',
    activityLevel: user?.profile?.activityLevel || '',
    goal: user?.profile?.goal || '',
    deficitPercent: user?.profile?.deficitPercent || 20,
    surplusPercent: user?.profile?.surplusPercent || 10,
    heightUnit: 'cm',
    heightFt: '', heightIn: ''
  });

  const steps = ['Profile', 'Activity', 'Goal', 'Results'];

  const activityLevels = [
    { value: 1.2, label: 'Sedentary', desc: 'Little to no exercise', icon: Armchair },
    { value: 1.375, label: 'Light', desc: '1-3 workouts/week', icon: Activity },
    { value: 1.55, label: 'Moderate', desc: '3-5 workouts/week', icon: Bike },
    { value: 1.725, label: 'Very Active', desc: '6-7 workouts/week', icon: Dumbbell },
    { value: 1.9, label: 'Athlete', desc: '2x daily training', icon: Zap },
  ];

  const goals = [
    { value: 'loss', label: 'Fat Loss', emoji: '🔥', desc: 'Lose fat while preserving muscle' },
    { value: 'maintenance', label: 'Maintain', emoji: '⚖️', desc: 'Keep your current weight' },
    { value: 'gain', label: 'Muscle Gain', emoji: '💪', desc: 'Build lean muscle mass' },
  ];

  const calculate = () => {
    const { age, sex, weightKg, heightCm, activityLevel, goal, deficitPercent, surplusPercent } = form;
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    const a = parseInt(age);
    const act = parseFloat(activityLevel);

    if (!a || !sex || !w || !h || !act || !goal) {
      toast.error('Please fill in all fields');
      return;
    }

    const base = (10 * w) + (6.25 * h) - (5 * a);
    const bmr = sex === 'male' ? base + 5 : base - 161;
    const tdee = bmr * act;

    let target = tdee;
    if (goal === 'loss') target = tdee * (1 - (deficitPercent || 20) / 100);
    if (goal === 'gain') target = tdee * (1 + (surplusPercent || 10) / 100);

    const minCal = sex === 'male' ? 1500 : 1200;
    if (target < minCal) target = minCal;

    const protein = Math.round(w * 1.8);
    const fat = Math.round(Math.max(w * 0.8, target * 0.25 / 9));
    const carbs = Math.round((target - (protein * 4) - (fat * 9)) / 4);

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(target),
      macros: { protein, fat, carbs }
    });
    setStep(3);
  };

  const saveResults = async () => {
    if (!results) return;
    setSaving(true);
    try {
      const data = await profileService.updateProfile({
        age: parseInt(form.age),
        sex: form.sex,
        heightCm: parseFloat(form.heightCm),
        weightKg: parseFloat(form.weightKg),
        activityLevel: parseFloat(form.activityLevel),
        goal: form.goal,
        deficitPercent: form.deficitPercent,
        surplusPercent: form.surplusPercent,
        bmr: results.bmr,
        tdee: results.tdee,
        targetCalories: results.target,
        targetMacros: results.macros
      });
      if (data?.user) updateUser(data.user);
      toast.success('Targets saved to your profile!');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const canNext = () => {
    if (step === 0) return form.age && form.sex && form.heightCm && form.weightKg;
    if (step === 1) return form.activityLevel;
    if (step === 2) return form.goal;
    return false;
  };

  const handleNext = () => {
    if (step === 2) { calculate(); return; }
    if (step < 3) setStep(step + 1);
  };

  return (
    <div>
      <div className="page-header">
        <h1>TDEE Calculator</h1>
        <p>Calculate your daily calorie and macro targets</p>
      </div>

      {/* Progress Dots */}
      <div className="calc-progress">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`calc-progress-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
            title={s}
          />
        ))}
      </div>

      <div className="calc-step">
        <AnimatePresence mode="wait">
          {/* Step 0: Profile */}
          {step === 0 && (
            <motion.div key="profile" className="card" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <div className="card-title">Your Profile</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Age</label>
                  <input className="input" type="number" placeholder="25" min="13" max="100" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Sex</label>
                  <select className="input" value={form.sex} onChange={e => setForm({ ...form, sex: e.target.value })}>
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Height (cm)</label>
                  <input className="input" type="number" placeholder="170" value={form.heightCm} onChange={e => setForm({ ...form, heightCm: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Weight (kg)</label>
                  <input className="input" type="number" placeholder="70" value={form.weightKg} onChange={e => setForm({ ...form, weightKg: e.target.value })} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Activity */}
          {step === 1 && (
            <motion.div key="activity" className="card" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <div className="card-title">Activity Level</div>
              <div className="activity-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                {activityLevels.map(level => (
                  <div
                    key={level.value}
                    className={`activity-card ${parseFloat(form.activityLevel) === level.value ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, activityLevel: level.value })}
                  >
                    <level.icon size={28} />
                    <h4>{level.label}</h4>
                    <p>{level.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <motion.div key="goal" className="card" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <div className="card-title">Your Goal</div>
              <div className="goal-cards">
                {goals.map(g => (
                  <div
                    key={g.value}
                    className={`goal-card ${form.goal === g.value ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, goal: g.value })}
                  >
                    <div className="goal-emoji">{g.emoji}</div>
                    <h4>{g.label}</h4>
                    <p>{g.desc}</p>
                  </div>
                ))}
              </div>
              {form.goal === 'loss' && (
                <div className="input-group" style={{ marginTop: 16 }}>
                  <label className="input-label">Deficit: {form.deficitPercent}%</label>
                  <input type="range" min="10" max="25" value={form.deficitPercent} onChange={e => setForm({ ...form, deficitPercent: parseInt(e.target.value) })} style={{ width: '100%' }} />
                </div>
              )}
              {form.goal === 'gain' && (
                <div className="input-group" style={{ marginTop: 16 }}>
                  <label className="input-label">Surplus: {form.surplusPercent}%</label>
                  <input type="range" min="5" max="15" value={form.surplusPercent} onChange={e => setForm({ ...form, surplusPercent: parseInt(e.target.value) })} style={{ width: '100%' }} />
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Results */}
          {step === 3 && results && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="results-grid">
                {[
                  { label: 'BMR', value: results.bmr, color: 'var(--text-secondary)' },
                  { label: 'TDEE', value: results.tdee, color: 'var(--cyan-light)' },
                  { label: 'Target', value: results.target, color: 'var(--emerald-light)' },
                ].map((r, i) => (
                  <motion.div key={i} className="card result-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                    <div className="result-value" style={{ color: r.color }}>{r.value}</div>
                    <div className="result-label">{r.label} (kcal)</div>
                  </motion.div>
                ))}
              </div>
              <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <div className="card-title">Daily Macro Targets</div>
                <div className="results-grid" style={{ marginBottom: 0 }}>
                  <div className="result-card">
                    <div className="result-value" style={{ color: 'var(--emerald-light)' }}>{results.macros.protein}g</div>
                    <div className="result-label">Protein</div>
                  </div>
                  <div className="result-card">
                    <div className="result-value" style={{ color: 'var(--amber-light)' }}>{results.macros.fat}g</div>
                    <div className="result-label">Fat</div>
                  </div>
                  <div className="result-card">
                    <div className="result-value" style={{ color: 'var(--violet-light)' }}>{results.macros.carbs}g</div>
                    <div className="result-label">Carbs</div>
                  </div>
                </div>
              </motion.div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn btn-secondary" onClick={() => setStep(0)} style={{ flex: 1 }}>Recalculate</button>
                <button className="btn btn-primary" onClick={saveResults} disabled={saving} style={{ flex: 1 }}>
                  {saving ? 'Saving...' : 'Save Targets'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ChevronLeft size={16} /> Back
            </button>
            <button className="btn btn-primary" onClick={handleNext} disabled={!canNext()}>
              {step === 2 ? 'Calculate' : 'Next'} <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
