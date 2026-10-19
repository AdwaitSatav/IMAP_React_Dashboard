export default function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
      GoOut Score · IMAP Group Project · Data from{' '}
      <a href="https://open-meteo.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
        Open-Meteo
      </a>
    </footer>
  )
}
