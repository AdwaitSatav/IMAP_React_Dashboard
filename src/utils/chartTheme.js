// Shared Recharts styling so every chart uses the design tokens from index.css.
export const axisProps = {
  stroke: 'var(--border)',
  tick: { fill: 'var(--text-muted)', fontSize: 12 },
  tickLine: false,
}

export const gridProps = { stroke: 'var(--border)', strokeDasharray: '3 3', vertical: false }

export const tooltipProps = {
  contentStyle: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text)',
    fontSize: 13,
  },
  labelStyle: { color: 'var(--text)', fontWeight: 600 },
  itemStyle: { color: 'var(--text)' },
}
