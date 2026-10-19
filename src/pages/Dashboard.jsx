// Part 2 (Person B) replaces the placeholders with live StatCards.
// Part 3 (Person C) adds the charts, ScoreGauge and BestHours timeline.
const stats = ['Temperature', 'Rain chance', 'Air quality (AQI)', 'UV index', 'GoOut Score']

export default function Dashboard() {
  return (
    <section>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Should you go out today? Live weather, air quality and your GoOut Score.</p>

      <div className="grid">
        {stats.map((label) => (
          <div key={label} className="card placeholder">
            {label}
            <br />
            Coming in Part 2
          </div>
        ))}
      </div>

      <div className="card placeholder" style={{ marginTop: '1rem' }}>
        Charts coming in Part 3
      </div>
    </section>
  )
}
