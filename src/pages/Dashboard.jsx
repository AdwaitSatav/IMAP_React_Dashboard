import { DEFAULT_CITY, fetchWeather, fetchAirQuality, getCurrentConditions } from '../api/weather.js'
import useFetch from '../hooks/useFetch.js'
import { calculateGoOutScore } from '../utils/goOutScore.js'
import { getDailyForecast, getNext24Hours, getNext24HoursAqi } from '../utils/chartData.js'
import AqiTrendChart from '../components/AqiTrendChart.jsx'
import BestHours from '../components/BestHours.jsx'
import ChartCard from '../components/ChartCard.jsx'
import DailyForecastChart from '../components/DailyForecastChart.jsx'
import HourlyTempChart from '../components/HourlyTempChart.jsx'
import ScoreGauge from '../components/ScoreGauge.jsx'
import styles from './Dashboard.module.css'

const hasValues = (rows, key) => rows.some((row) => row[key] !== null)

const loadWeather = (signal) => fetchWeather(DEFAULT_CITY, signal)
const loadAirQuality = (signal) => fetchAirQuality(DEFAULT_CITY, signal)

export default function Dashboard() {
  const weather = useFetch(loadWeather)
  const air = useFetch(loadAirQuality)
  const conditions = getCurrentConditions(weather.data, air.data)
  const result = calculateGoOutScore(conditions)
  const stats = [
    { label: 'Temperature', value: conditions.temperature, unit: '°C', source: weather },
    { label: 'Rain chance', value: conditions.rainChance, unit: '%', source: weather },
    { label: 'Air quality (AQI)', value: conditions.aqi, unit: ' US AQI', source: air },
    { label: 'UV index', value: conditions.uvIndex, unit: '', source: weather },
    { label: 'GoOut Score', value: result?.score, unit: '/100',
      source: { loading: weather.loading || air.loading, error: weather.error || air.error } },
  ]

  // Part 3: chart rows are derived from the data fetched above; charts never fetch on their own.
  const hourly = getNext24Hours(weather.data, air.data)
  const aqiHours = getNext24HoursAqi(air.data)
  const daily = getDailyForecast(weather.data)
  const both = { loading: weather.loading || air.loading, error: weather.error || air.error }
  const retryFailed = () => {
    if (weather.error) weather.retry()
    if (air.error) air.retry()
  }
  return (
    <section>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Should you go out today? Live weather, air quality and your GoOut Score.</p>

      <p className={styles.location}>Mumbai · Rain and UV: current hour forecast</p>
      <div className="grid">
        {stats.map(({ label, value, unit, source }) => (
          <div key={label} className="card" aria-busy={source.loading}>
            <h2 className={styles.label}>{label}</h2>
            <p className={styles.value} aria-live="polite">
              {source.loading ? 'Loading…' : source.error ? 'Unavailable'
                : Number.isFinite(value) ? String(Math.round(value * 10) / 10) + unit : 'Unavailable'}
            </p>
            {label === 'GoOut Score' && !source.loading && !source.error && result && (
              <p style={{ color: 'var(--' + result.tone + ')' }}>{result.label}</p>
            )}
          </div>
        ))}
      </div>

      {weather.error && <p className={styles.message} role="alert">
        Weather: {weather.error} <button onClick={weather.retry}>Try again</button>
      </p>}
      {air.error && <p className={styles.message} role="alert">
        Air quality: {air.error} <button onClick={air.retry}>Try again</button>
      </p>}

      <div className={styles.topRow}>
        <ChartCard title="GoOut Score" subtitle="Right now, 0–100 (higher is better)"
          loading={both.loading} error={both.error} onRetry={retryFailed}
          empty={!result} emptyMessage="Not enough data to calculate a score right now.">
          {result && <ScoreGauge result={result} />}
        </ChartCard>
        <ChartCard title="Best hours to go out"
          subtitle="Hourly GoOut Score for the next 24 hours (local time). Top 3 highlighted; hours with missing data are skipped."
          loading={both.loading} error={both.error} onRetry={retryFailed}
          empty={!hourly.some((row) => row.result)} emptyMessage="Not enough hourly data to score the next 24 hours.">
          <BestHours rows={hourly} />
        </ChartCard>
      </div>

      <div className={styles.charts}>
        <ChartCard title="Temperature, next 24 hours" subtitle="Hourly, °C, local time"
          loading={weather.loading} error={weather.error} onRetry={weather.retry}
          empty={!hasValues(hourly, 'temperature')}>
          <HourlyTempChart data={hourly} />
        </ChartCard>
        <ChartCard title="Air quality, next 24 hours" subtitle="Hourly US AQI, local time (lower is better)"
          loading={air.loading} error={air.error} onRetry={air.retry}
          empty={!hasValues(aqiHours, 'aqi')}>
          <AqiTrendChart data={aqiHours} />
        </ChartCard>
        <ChartCard title="7-day forecast" subtitle="Daily minimum and maximum temperature, °C"
          className={styles.wide} loading={weather.loading} error={weather.error} onRetry={weather.retry}
          empty={!daily.some((day) => day.range)}>
          <DailyForecastChart data={daily} />
        </ChartCard>
      </div>
    </section>
  )
}
