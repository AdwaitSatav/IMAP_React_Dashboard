// Score bands, highest first. Shared with the ScoreGauge legend so the labels always match.
export const SCORE_LEVELS = [
  { min: 80, range: '80–100', label: 'Great day to go out', tone: 'great' },
  { min: 60, range: '60–79', label: 'Good time to go out', tone: 'good' },
  { min: 40, range: '40–59', label: 'Mixed conditions', tone: 'meh' },
  { min: 0, range: '0–39', label: 'Maybe stay in', tone: 'bad' },
]

export function calculateGoOutScore({ temperature, rainChance, aqi, uvIndex }) {
  if (![temperature, rainChance, aqi, uvIndex].every(Number.isFinite)) return null

  // Start at 100; subtract 2 points per degree away from 25 C,
  // 0.4 per rain-probability percent, 0.3 per US AQI point above 50,
  // and 4 per UV point above 6. Round and clamp to 0–100.
  // This is a project comfort heuristic, not an official safety index.
  const raw = 100 - Math.abs(temperature - 25) * 2 - rainChance * 0.4
    - Math.max(0, aqi - 50) * 0.3 - Math.max(0, uvIndex - 6) * 4
  const score = Math.max(0, Math.min(100, Math.round(raw)))
  const { label, tone } = SCORE_LEVELS.find((level) => score >= level.min)
  return { score, label, tone }
}
