export default function MacroDonut({ protein = 0, fat = 0, carbs = 0, targetProtein = 1, targetFat = 1, targetCarbs = 1 }) {
  const macros = [
    { label: 'Protein', value: protein, target: targetProtein, color: 'var(--emerald)', bg: 'var(--emerald-glow)' },
    { label: 'Fat', value: fat, target: targetFat, color: 'var(--amber)', bg: 'rgba(245, 158, 11, 0.25)' },
    { label: 'Carbs', value: carbs, target: targetCarbs, color: 'var(--violet)', bg: 'var(--violet-glow)' },
  ];

  return (
    <div className="macro-bars">
      {macros.map(macro => {
        const pct = macro.target > 0 ? Math.min((macro.value / macro.target) * 100, 100) : 0;
        return (
          <div key={macro.label} className="macro-bar-item">
            <div className="macro-bar-header">
              <span className="macro-bar-label" style={{ color: macro.color }}>{macro.label}</span>
              <span className="macro-bar-value">{Math.round(macro.value)}g / {Math.round(macro.target)}g</span>
            </div>
            <div className="macro-bar-track">
              <div
                className={`macro-bar-fill ${macro.label.toLowerCase()}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
