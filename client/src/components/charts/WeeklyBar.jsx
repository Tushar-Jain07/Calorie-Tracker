import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function WeeklyBar({ data = [], target = 0 }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        fontSize: '0.82rem'
      }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>{payload[0].value} kcal</p>
      </div>
    );
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border-subtle)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          {target > 0 && (
            <ReferenceLine
              y={target}
              stroke="var(--amber)"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              label={{ value: 'Target', fill: 'var(--amber)', fontSize: 11, position: 'right' }}
            />
          )}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--emerald)" stopOpacity={0.9} />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <Bar dataKey="calories" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
