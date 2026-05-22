import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeightTrend({ data = [] }) {
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
        <p style={{ color: 'var(--cyan-light)', fontWeight: 600 }}>{payload[0].value} kg</p>
      </div>
    );
  };

  if (!data.length) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No weight data yet</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--border-subtle)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--cyan)" />
              <stop offset="100%" stopColor="var(--violet)" />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="weight"
            stroke="url(#weightGradient)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--cyan)', strokeWidth: 0, r: 4 }}
            activeDot={{ fill: 'var(--cyan-light)', strokeWidth: 0, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
