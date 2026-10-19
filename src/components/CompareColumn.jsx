import { cityLabel } from '../context/CityContext.jsx'
import CitySearch from './CitySearch.jsx'
import FavouriteButton from './FavouriteButton.jsx'
import FavouriteChips from './FavouriteChips.jsx'
import styles from './CompareColumn.module.css'

const format = (value, unit) => Number.isFinite(value) ? String(Math.round(value * 10) / 10) + unit : 'Unavailable'

// Part 4: one side of the Compare page. Data comes from useCityWeather in Compare.jsx (this component never fetches).
export default function CompareColumn({ title, city, onSelect, data, winner }) {
  const { weather, air, conditions, result } = data
  const loading = weather.loading || air.loading
  const error = weather.error || air.error
  const retry = () => {
    if (weather.error) weather.retry()
    if (air.error) air.retry()
  }
  const rows = [
    { label: 'Temperature', value: format(conditions.temperature, '°C'), source: weather },
    { label: 'Rain chance', value: format(conditions.rainChance, '%'), source: weather },
    { label: 'Air quality', value: format(conditions.aqi, ' US AQI'), source: air },
    { label: 'UV index', value: format(conditions.uvIndex, ''), source: weather },
  ]

  return (
    <section className={`card ${styles.column} ${winner ? styles.winner : ''}`} aria-busy={city ? loading : false}>
      <h2 className={styles.title}>{title}</h2>
      <CitySearch onSelect={onSelect} label={`Choose ${title.toLowerCase()}`} />
      <FavouriteChips selected={city} onSelect={onSelect} label="Quick pick" />

      {!city ? (
        <p className={styles.state}>Search for a city to compare.</p>
      ) : (
        <>
          <div className={styles.header}>
            <p className={styles.city}>{cityLabel(city)}</p>
            <FavouriteButton city={city} />
          </div>

          {loading ? (
            <p className={styles.state}>Loading…</p>
          ) : (
            <>
              <div className={styles.score}
                style={{ borderColor: result ? `var(--${result.tone})` : 'var(--border)' }}>
                <span className={styles.scoreLabel}>GoOut Score</span>
                {result ? (
                  <>
                    <span className={styles.scoreValue} style={{ color: `var(--${result.tone})` }}>
                      {result.score}<small>/100</small>
                    </span>
                    <span style={{ color: `var(--${result.tone})` }}>{result.label}</span>
                  </>
                ) : (
                  <span className={styles.scoreValue}>–</span>
                )}
                {winner && <span className={styles.badge}>Better right now</span>}
              </div>
              <dl className={styles.stats}>
                {rows.map((row) => (
                  <div key={row.label} className={styles.row}>
                    <dt>{row.label}</dt>
                    <dd>{row.source.error ? 'Unavailable' : row.value}</dd>
                  </div>
                ))}
              </dl>
              {error && (
                <p className={styles.error} role="alert">
                  {error} <button type="button" onClick={retry}>Try again</button>
                </p>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}
