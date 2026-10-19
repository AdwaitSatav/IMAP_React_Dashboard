import styles from './ScoreGauge.module.css'

const ARC = 'M 20 100 A 80 80 0 0 1 180 100'
const BANDS = [
  { tone: 'great', text: '80–100 Great' },
  { tone: 'good', text: '60–79 Good' },
  { tone: 'meh', text: '40–59 Mixed' },
  { tone: 'bad', text: '0–39 Stay in' },
]

// result: { score, label, tone } from calculateGoOutScore. pathLength="100" lets the
// coloured arc fill exactly `score` percent of the half circle via strokeDasharray.
export default function ScoreGauge({ result }) {
  const { score, label, tone } = result
  return (
    <div className={styles.gauge}>
      <svg viewBox="0 0 200 124" className={styles.svg} role="img"
        aria-label={`GoOut Score ${score} out of 100: ${label}`}>
        <path d={ARC} pathLength="100" className={styles.track} />
        {score > 0 && (
          <path d={ARC} pathLength="100" className={styles.fill}
            strokeDasharray={`${score} 100`} style={{ stroke: `var(--${tone})` }} />
        )}
        <text x="100" y="86" textAnchor="middle" className={styles.score}>{score}</text>
        <text x="100" y="104" textAnchor="middle" className={styles.scale}>out of 100</text>
        <text x="20" y="121" textAnchor="middle" className={styles.scale}>0</text>
        <text x="180" y="121" textAnchor="middle" className={styles.scale}>100</text>
      </svg>
      <p className={styles.label}>
        <span className={styles.dot} style={{ background: `var(--${tone})` }} />
        {label}
      </p>
      <ul className={styles.bands} aria-label="Score bands">
        {BANDS.map((band) => (
          <li key={band.tone}>
            <span className={styles.dot} style={{ background: `var(--${band.tone})` }} />
            {band.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
