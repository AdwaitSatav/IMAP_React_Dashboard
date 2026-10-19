import styles from './ChartCard.module.css'

// Card wrapper for every chart: title, subtitle and the shared loading / error / empty states.
export default function ChartCard({ title, subtitle, loading, error, onRetry, empty,
  emptyMessage = 'No data available for this period.', className = '', children }) {
  let body = children
  if (loading) body = <p className={styles.state}>Loading…</p>
  else if (error) body = (
    <div className={styles.state} role="alert">
      <p>{error}</p>
      {onRetry && <button onClick={onRetry}>Try again</button>}
    </div>
  )
  else if (empty) body = <p className={styles.state}>{emptyMessage}</p>

  return (
    <section className={`card ${styles.card} ${className}`} aria-busy={loading}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {body}
    </section>
  )
}
