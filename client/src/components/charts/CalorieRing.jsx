import { useCountUp } from '../../hooks/useCountUp';

export default function CalorieRing({ consumed = 0, target = 2000, size = 200 }) {
  const animatedConsumed = useCountUp(consumed);
  const remaining = Math.max(target - consumed, 0);
  const percentage = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage > 100) return 'var(--rose)';
    if (percentage > 85) return 'var(--amber)';
    return 'url(#calorieGradient)';
  };

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--emerald)" />
            <stop offset="100%" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>
        <circle
          className="progress-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={getColor()}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="progress-ring-center">
        <div className="progress-ring-value" style={{ fontSize: size * 0.15, color: 'var(--text-primary)' }}>
          {animatedConsumed}
        </div>
        <div className="progress-ring-label">
          of {target} kcal
        </div>
        <div style={{ fontSize: '0.7rem', color: remaining > 0 ? 'var(--emerald-light)' : 'var(--rose-light)', marginTop: 4 }}>
          {remaining > 0 ? `${remaining} left` : 'Goal reached!'}
        </div>
      </div>
    </div>
  );
}
