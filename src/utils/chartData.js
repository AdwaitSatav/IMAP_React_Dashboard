import { calculateGoOutScore } from './goOutScore.js'

// Helpers that reshape Part 2's API responses into rows for the Part 3 charts.
// Every request uses timezone=auto, so Open-Meteo returns the city's local time as strings
// like "2026-10-19T14:00". We read hours and dates straight from those strings and start from
// the API's current.time (never the browser clock), so labels stay right for any city.

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const AQI_LEVELS = [
  { max: 50, range: '0–50', label: 'Good', tone: 'great' },
  { max: 100, range: '51–100', label: 'Moderate', tone: 'meh' },
  { max: 150, range: '101–150', label: 'Unhealthy for Sensitive Groups', tone: 'bad' },
  { max: Infinity, range: '151+', label: 'Unhealthy', tone: 'bad' },
]

const numberOrNull = (value) => Number.isFinite(value) ? value : null

export const formatHour = (time) => time.slice(11, 16)

export function getAqiLevel(aqi) {
  return AQI_LEVELS.find((level) => aqi <= level.max)
}

// Date.UTC keeps the weekday independent of the browser's own timezone.
function describeDate(date) {
  const [year, month, day] = date.split('-').map(Number)
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]
  return { weekday, long: `${weekday} ${day} ${MONTHS[month - 1]}` }
}

// Index of the hourly slot containing current.time, matched the same way as getCurrentConditions.
function findCurrentHour(times, currentTime) {
  if (!Array.isArray(times) || typeof currentTime !== 'string') return -1
  const hour = currentTime.slice(0, 13)
  return times.findIndex((time) => time.slice(0, 13) === hour)
}

export function getNext24Hours(weather, airQuality) {
  const hourly = weather?.hourly
  const start = findCurrentHour(hourly?.time, weather?.current?.time)
  if (start === -1) return []

  // Match AQI to weather by timestamp, not array position: the two APIs can return
  // different ranges of hours, so the same index is not always the same hour.
  const aqiByTime = new Map()
  airQuality?.hourly?.time?.forEach((time, i) => aqiByTime.set(time, airQuality.hourly.us_aqi?.[i]))

  return hourly.time.slice(start, start + 24).map((time, offset) => {
    const i = start + offset
    const inputs = {
      temperature: numberOrNull(hourly.temperature_2m?.[i]),
      rainChance: numberOrNull(hourly.precipitation_probability?.[i]),
      uvIndex: numberOrNull(hourly.uv_index?.[i]),
      aqi: numberOrNull(aqiByTime.get(time)),
    }
    // calculateGoOutScore returns null when any input is missing, so gaps are skipped, not scored as 0.
    return { time, hour: formatHour(time), ...inputs, result: calculateGoOutScore(inputs) }
  })
}

export function getNext24HoursAqi(airQuality) {
  const hourly = airQuality?.hourly
  const start = findCurrentHour(hourly?.time, airQuality?.current?.time)
  if (start === -1) return []
  return hourly.time.slice(start, start + 24).map((time, offset) => ({
    time,
    hour: formatHour(time),
    aqi: numberOrNull(hourly.us_aqi?.[start + offset]),
  }))
}

// Highest scores first; ties go to the earlier hour. Unscored hours are left out.
export function getBestHours(rows, count = 3) {
  return rows.filter((row) => row.result)
    .sort((a, b) => b.result.score - a.result.score || a.time.localeCompare(b.time))
    .slice(0, count)
}

export function getDailyForecast(weather) {
  const daily = weather?.daily
  if (!Array.isArray(daily?.time)) return []
  const today = weather?.current?.time?.slice(0, 10)
  return daily.time.map((date, i) => {
    const min = numberOrNull(daily.temperature_2m_min?.[i])
    const max = numberOrNull(daily.temperature_2m_max?.[i])
    const { weekday, long } = describeDate(date)
    return {
      date,
      day: date === today ? 'Today' : weekday,
      dateLabel: long,
      min,
      max,
      range: min !== null && max !== null ? [min, max] : null,
      rainChance: numberOrNull(daily.precipitation_probability_max?.[i]),
    }
  })
}
