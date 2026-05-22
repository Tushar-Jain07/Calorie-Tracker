import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Zap, Target, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ marginBottom: 16 }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '5px 14px' }}>
              ✨ Version 3.0 — Completely Redesigned
            </span>
          </div>
          <h1>
            Track Smarter.
            <br />
            <span className="text-gradient">Achieve More.</span>
          </h1>
          <p className="hero-subtitle">
            The premium nutrition tracker that makes calorie counting effortless.
            Calculate your macros, log meals, and crush your fitness goals — all in one beautiful app.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="landing-features">
        {[
          {
            icon: <Target size={28} />,
            title: 'Smart TDEE Calculator',
            desc: 'Precision-calibrated BMR and TDEE calculations using the Mifflin-St Jeor equation with personalized macro splits.',
            color: 'var(--emerald)',
            bg: 'rgba(16, 185, 129, 0.12)'
          },
          {
            icon: <Flame size={28} />,
            title: 'Effortless Food Logging',
            desc: 'Search from the USDA food database, log meals by type, and track every macro with a beautiful timeline view.',
            color: 'var(--amber)',
            bg: 'rgba(245, 158, 11, 0.12)'
          },
          {
            icon: <TrendingUp size={28} />,
            title: 'Visual Progress Tracking',
            desc: 'Interactive charts for calories, macros, and weight trends. See your compliance with a GitHub-style heatmap.',
            color: 'var(--violet)',
            bg: 'rgba(139, 92, 246, 0.12)'
          },
          {
            icon: <Zap size={28} />,
            title: 'Daily Streaks',
            desc: 'Stay motivated with streak tracking. Build consistency and watch your streak grow day by day.',
            color: 'var(--cyan)',
            bg: 'rgba(6, 182, 212, 0.12)'
          },
          {
            icon: '💧',
            title: 'Water Tracking',
            desc: 'Never forget hydration. Track your daily water intake with a beautiful glass-by-glass visual tracker.',
            color: 'var(--cyan)',
            bg: 'rgba(6, 182, 212, 0.12)',
            isEmoji: true
          },
          {
            icon: '📊',
            title: 'Full-Stack Persistence',
            desc: 'Your data is stored securely with real JWT authentication and MongoDB. Access from anywhere, anytime.',
            color: 'var(--emerald)',
            bg: 'rgba(16, 185, 129, 0.12)',
            isEmoji: true
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="card feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon" style={{ background: feature.bg, color: feature.color }}>
              {feature.isEmoji ? <span style={{ fontSize: '1.5rem' }}>{feature.icon}</span> : feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      <section style={{ textAlign: 'center', padding: '4rem 2rem 6rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ marginBottom: 8 }}>Ready to <span className="text-gradient">transform</span> your nutrition?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Join now and start tracking for free.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Start Tracking <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)', fontSize: '0.78rem', borderTop: '1px solid var(--border-subtle)' }}>
        © 2026 MacroSnap — Nutrition Tracking Made Premium
      </footer>
    </div>
  );
}
