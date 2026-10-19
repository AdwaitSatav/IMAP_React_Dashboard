import { DEFAULT_CITY, fetchWeather, fetchAirQuality, getCurrentConditions } from '../api/weather.js'
import useFetch from '../hooks/useFetch.js'
import { calculateGoOutScore } from '../utils/goOutScore.js'
import styles from './Dashboard.module.css'

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

      <div className="card placeholder" style={{ marginTop: '1rem' }}>
        Charts coming in Part 3
      </div>
    </section>
  )
}
