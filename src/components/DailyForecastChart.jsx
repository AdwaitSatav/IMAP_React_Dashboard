import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { axisProps, gridProps, tooltipProps } from '../utils/chartTheme.js'

const degrees = (value) => Number.isFinite(value) ? `${Math.round(value)}°` : ''

// data: rows from getDailyForecast. Each bar floats from the day's min to its max temperature.
export default function DailyForecastChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 20, right: 12, bottom: 4, left: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="day" {...axisProps} interval={0} />
        <YAxis {...axisProps} unit="°C" width={52} allowDecimals={false}
          domain={[(min) => Math.floor(min - 3), (max) => Math.ceil(max + 2)]} />
        <Tooltip {...tooltipProps} cursor={{ fill: 'var(--border)', fillOpacity: 0.4 }}
          labelFormatter={(label, payload) => {
            const day = payload?.[0]?.payload
            if (!day) return label
            return Number.isFinite(day.rainChance)
              ? `${day.dateLabel} · rain up to ${day.rainChance}%` : day.dateLabel
          }}
          formatter={(value) => [Array.isArray(value) ? `${value[0]} °C to ${value[1]} °C` : 'No data',
            'Min to max']} />
        <Bar dataKey="range" fill="var(--primary)" radius={4} maxBarSize={28}>
          <LabelList dataKey="max" position="top" formatter={degrees}
            fill="var(--text-muted)" fontSize={12} />
          <LabelList dataKey="min" position="bottom" formatter={degrees}
            fill="var(--text-muted)" fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
