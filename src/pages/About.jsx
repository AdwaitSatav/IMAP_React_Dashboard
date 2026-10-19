// Part 4 (Person D) adds the team roles section.
export default function About() {
  return (
    <section>
      <h1 className="page-title">About</h1>
      <p className="page-subtitle">IMAP Group Project: React Dashboard Consuming an API</p>
      <div className="card">
        <p style={{ lineHeight: 1.7 }}>
          GoOut Score combines live temperature, rain probability, air quality (AQI) and UV index from the free
          Open-Meteo APIs into a single 0–100 score that tells you whether it is a good time to go outside.
        </p>
      </div>
    </section>
  )
}
