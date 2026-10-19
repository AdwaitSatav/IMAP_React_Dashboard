import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="card" style={{ textAlign: 'center' }}>
      <h1 className="page-title">404</h1>
      <p className="page-subtitle">This page does not exist.</p>
      <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>
        Back to Dashboard
      </Link>
    </section>
  )
}
