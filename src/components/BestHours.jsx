import { getBestHours } from '../utils/chartData.js'
import styles from './BestHours.module.css'

// rows: from getNext24Hours, each with an hourly GoOut Score (result) or null when data is missing.
export default function BestHours({ rows }) {
  const best = getBestHours(rows)
  const rankByTime = new Map(best.map((row, i) => [row.time, i + 1]))
  const today = rows[0]?.time.slice(0, 10)
  const when = (row) => (row.time.slice(0, 10) === today ? '' : 'tomorrow ') + row.hour

  return (
    <>
      <p className={styles.summary}>
        Best times: {best.map((row) => `${when(row)} (${row.result.score})`).join(', ')}
      </p>
      <ol className={styles.timeline}>
        {rows.map((row, i) => {
          const rank = rankByTime.get(row.time)
          const className = [styles.hour, rank && styles.best, !row.result && styles.missing]
            .filter(Boolean).join(' ')
          return (
            <li key={row.time} className={className}
              title={row.result ? `${when(row)}: ${row.result.score}/100, ${row.result.label}`
                : `${when(row)}: missing data, not scored`}>
              {rank && <span className={styles.badge}>#{rank}</span>}
              {i > 0 && row.hour === '00:00' && <span className={styles.day}>Tomorrow</span>}
              <span className={styles.time}>{row.hour}</span>
              <span className={styles.score}>{row.result ? row.result.score : '–'}</span>
              <span className={styles.track}>
                {row.result && <span className={styles.fill}
                  style={{ width: `${row.result.score}%`, background: `var(--${row.result.tone})` }} />}
              </span>
            </li>
          )
        })}
      </ol>
    </>
  )
}
