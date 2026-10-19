import { useState } from 'react'
import { cityKey, useCity } from '../context/CityContext.jsx'
import useCityWeather from '../hooks/useCityWeather.js'
import CompareColumn from '../components/CompareColumn.jsx'
import styles from './Compare.module.css'

// Part 4: plain-language verdict from the two GoOut Scores (same calculateGoOutScore as the Dashboard).
function getVerdict(cityA, cityB, a, b) {
  if (!cityA || !cityB) return { text: 'Pick two cities to see which is better for going out right now.' }
  if (cityKey(cityA) === cityKey(cityB)) return { text: 'You picked the same city twice. Choose a different second city.' }
  const loading = a.weather.loading || a.air.loading || b.weather.loading || b.air.loading
  if (loading) return { text: 'Loading both cities…' }
  if (!a.result || !b.result) {
    const missing = [!a.result && cityA.name, !b.result && cityB.name].filter(Boolean).join(' and ')
    return { text: `Can't compare yet: no score available for ${missing}.`, tone: 'bad' }
  }
  if (a.result.score === b.result.score) {
    return { text: `It's a tie: ${cityA.name} and ${cityB.name} both score ${a.result.score} right now.`, tone: a.result.tone }
  }
  const [winner, loser, win, lose] = a.result.score > b.result.score
    ? [cityA, cityB, a.result, b.result] : [cityB, cityA, b.result, a.result]
  // Same-named places (e.g. two "Springfield"s) need the country to tell them apart.
  const name = (city) => winner.name === loser.name && city.country ? `${city.name}, ${city.country}` : city.name
  return {
    text: `${name(winner)} is better for going out right now (score ${win.score} vs ${lose.score}).`,
    tone: win.tone,
    winner: cityKey(winner),
  }
}

export default function Compare() {
  const { city } = useCity()
  const [cityA, setCityA] = useState(city)
  const [cityB, setCityB] = useState(null)
  const a = useCityWeather(cityA)
  const b = useCityWeather(cityB)
  const verdict = getVerdict(cityA, cityB, a, b)

  return (
    <section>
      <h1 className="page-title">Compare Cities</h1>
      <p className="page-subtitle">See which city is better for going out right now.</p>

      <p className={`card ${styles.verdict}`} role="status" aria-live="polite"
        style={verdict.tone ? { borderLeftColor: `var(--${verdict.tone})` } : undefined}>
        {verdict.text}
      </p>

      <div className={styles.columns}>
        <CompareColumn title="First city" city={cityA} onSelect={setCityA} data={a}
          winner={cityA && verdict.winner === cityKey(cityA)} />
        <CompareColumn title="Second city" city={cityB} onSelect={setCityB} data={b}
          winner={cityB && verdict.winner === cityKey(cityB)} />
      </div>
    </section>
  )
}
