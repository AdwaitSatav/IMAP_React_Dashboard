import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AQI_LEVELS, getAqiLevel } from '../utils/chartData.js'
import { axisProps, gridProps, tooltipProps } from '../utils/chartTheme.js'
import styles from './AqiTrendChart.module.css'

const BAND_OPACITY = [0.08, 0.1, 0.08, 0.16]

// data: rows from getNext24HoursAqi. Faint background bands show the US AQI categories.
export default function AqiTrendChart({ data }) {
  const highest = Math.max(0, ...data.map((row) => row.aqi ?? 0))
  const top = Math.max(100, Math.ceil((highest + 10) / 50) * 50)
  // Ticks every 50 line up with the category boundaries (50, 100, 150).
  const ticks = Array.from({ length: top / 50 + 1 }, (_, i) => i * 50)

  return (
    <>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          {AQI_LEVELS.map((level, i) => {
            const from = i === 0 ? 0 : AQI_LEVELS[i - 1].max
            if (from >= top) return null
            return <ReferenceArea key={level.label} y1={from} y2={Math.min(level.max, top)}
              fill={`var(--${level.tone})`} fillOpacity={BAND_OPACITY[i]} ifOverflow="hidden" />
          })}
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="hour" {...axisProps} minTickGap={16} />
          <YAxis {...axisProps} width={44} domain={[0, top]} ticks={ticks} />
          <Tooltip {...tooltipProps}
            formatter={(value) => [`${value} US AQI (${getAqiLevel(value).label})`, 'Air quality']} />
          <Line type="monotone" dataKey="aqi" stroke="var(--primary)" strokeWidth={2}
            dot={false} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
      <ul className={styles.legend} aria-label="US AQI scale">
        {AQI_LEVELS.map((level) => (
          <li key={level.label}>
            <span className={styles.swatch} style={{ background: `var(--${level.tone})` }} />
            <strong>{level.range}</strong> {level.label}
          </li>
        ))}
      </ul>
    </>
  )
}
