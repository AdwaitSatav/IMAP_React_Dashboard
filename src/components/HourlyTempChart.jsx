import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { axisProps, gridProps, tooltipProps } from '../utils/chartTheme.js'

// data: rows from getNext24Hours, each with an "hour" label and "temperature" in °C.
export default function HourlyTempChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="hour" {...axisProps} minTickGap={16} />
        <YAxis {...axisProps} unit="°C" width={52} allowDecimals={false} domain={['auto', 'auto']} />
        <Tooltip {...tooltipProps} formatter={(value) => [`${value} °C`, 'Temperature']} />
        <Line type="monotone" dataKey="temperature" stroke="var(--primary)" strokeWidth={2}
          dot={false} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
