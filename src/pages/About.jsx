import { SCORE_LEVELS } from '../utils/goOutScore.js'
import styles from './About.module.css'

// Part 4 (Person D): full About page. Edit the names in TEAM before submitting.
const TEAM = [
  { part: 1, name: 'Person 1 (your name)', role: 'Project setup, routing and layout',
    detail: 'Vite + React, React Router pages, Navbar, Footer, design tokens' },
  { part: 2, name: 'Person 2 (your name)', role: 'API layer and scoring',
    detail: 'Open-Meteo requests, useFetch hook, GoOut Score formula, live cards' },
  { part: 3, name: 'Person 3 (your name)', role: 'Charts and visualisation',
    detail: 'Recharts temperature, forecast and AQI charts, score gauge, best hours' },
  { part: 4, name: 'Person 4 (your name)', role: 'Features and delivery',
    detail: 'City search, Compare page, favourites, dark mode, CI, README, deployment' },
]

const FEATURES = [
  'Live temperature, rain chance, air quality (US AQI) and UV index for any city',
  'GoOut Score from 0 to 100 with a colour-coded gauge',
  'Best hours to go out in the next 24 hours',
  'Charts: hourly temperature, 7-day forecast and AQI trend',
  'City search with autocomplete',
  'Compare two cities side by side with a clear verdict',
  'Favourite cities saved in your browser',
  'Light and dark mode (follows your system setting by default)',
  'Works on phones, tablets and desktops',
]

const STACK = ['React 18', 'Vite', 'React Router v6', 'Recharts', 'CSS Modules + CSS variables',
  'GitHub Actions (CI)', 'Vercel (hosting)']

const APIS = [
  { name: 'Open-Meteo Forecast API', url: 'https://open-meteo.com/en/docs', use: 'temperature, rain probability, UV index, 7-day forecast' },
  { name: 'Open-Meteo Air Quality API', url: 'https://open-meteo.com/en/docs/air-quality-api', use: 'current and hourly US AQI' },
  { name: 'Open-Meteo Geocoding API', url: 'https://open-meteo.com/en/docs/geocoding-api', use: 'city search and coordinates' },
]

export default function About() {
  return (
    <section className={styles.about}>
      <header>
        <h1 className="page-title">About</h1>
        <p className={`page-subtitle ${styles.subtitle}`}>IMAP Group Project: React Dashboard Consuming an API</p>
      </header>

      <div className="card">
        <h2 className={styles.heading}>What is GoOut Score?</h2>
        <p className={styles.text}>
          GoOut Score combines live temperature, rain probability, air quality (AQI) and UV index from the free
          Open-Meteo APIs into a single 0–100 score that tells you whether it is a good time to go outside.
          Search any city, compare two cities, and save your favourites. No account or API key is needed.
        </p>
      </div>

      <div className={styles.columns}>
        <div className="card">
          <h2 className={styles.heading}>Features</h2>
          <ul className={styles.list}>
            {FEATURES.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
        </div>
        <div className="card">
          <h2 className={styles.heading}>Tech stack</h2>
          <ul className={styles.tags}>
            {STACK.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h2 className={`${styles.heading} ${styles.spaced}`}>APIs used</h2>
          <ul className={styles.list}>
            {APIS.map((api) => (
              <li key={api.name}>
                <a href={api.url} target="_blank" rel="noreferrer">{api.name}</a>: {api.use}
              </li>
            ))}
          </ul>
          <p className={styles.credit}>
            Weather, air-quality and geocoding data by{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo.com</a>,
            licensed under CC BY 4.0.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className={styles.heading}>How the GoOut Score is calculated</h2>
        <p className={styles.text}>Every city starts at 100 points. Points are taken away for each condition that makes going out less pleasant:</p>
        <ul className={styles.list}>
          <li><strong>Temperature:</strong> −2 points for every °C away from a comfortable 25 °C</li>
          <li><strong>Rain:</strong> −0.4 points for every % of rain probability</li>
          <li><strong>Air quality:</strong> −0.3 points for every US AQI point above 50</li>
          <li><strong>UV index:</strong> −4 points for every UV point above 6</li>
        </ul>
        <p className={styles.text}>The result is rounded and kept between 0 and 100. If any value is missing, no score is shown.</p>
        <ul className={styles.bands}>
          {SCORE_LEVELS.map((level) => (
            <li key={level.tone}>
              <span className={styles.dot} style={{ background: `var(--${level.tone})` }} />
              <strong>{level.range}</strong> {level.label}
            </li>
          ))}
        </ul>
        <p className={styles.note}>This is a comfort heuristic made for this project, not an official health or safety index.</p>
      </div>

      <div className="card">
        <h2 className={styles.heading}>Team</h2>
        <ul className={styles.team}>
          {TEAM.map((member) => (
            <li key={member.part} className={styles.member}>
              <span className={styles.part}>Part {member.part}</span>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
              <span className={styles.detail}>{member.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
