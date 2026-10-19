export const DEFAULT_CITY = { name: 'Mumbai', latitude: 19.07, longitude: 72.88 }

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Could not load data. Please try again.')
  const data = await response.json()
  if (data.error) throw new Error(data.reason || 'The weather service returned an error.')
  return data
}

export async function fetchWeather(city = DEFAULT_CITY, signal) {
  const params = new URLSearchParams({
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: 'auto',
    current: 'temperature_2m',
    hourly: 'temperature_2m,precipitation_probability,uv_index',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
  })
  return fetchJson('https://api.open-meteo.com/v1/forecast?' + params, signal)
}

export async function fetchAirQuality(city = DEFAULT_CITY, signal) {
  const params = new URLSearchParams({
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: 'auto',
    current: 'us_aqi',
    hourly: 'us_aqi',
  })
  return fetchJson('https://air-quality-api.open-meteo.com/v1/air-quality?' + params, signal)
}

export function getCurrentConditions(weather, airQuality) {
  // Both timestamps use the city's local timezone. Match the containing hour.
  const hour = weather?.current?.time?.slice(0, 13)
  const index = hour ? weather?.hourly?.time?.findIndex((time) => time.slice(0, 13) === hour) : -1
  const numberOrNull = (value) => Number.isFinite(value) ? value : null
  return {
    temperature: numberOrNull(weather?.current?.temperature_2m),
    rainChance: numberOrNull(weather?.hourly?.precipitation_probability?.[index]),
    uvIndex: numberOrNull(weather?.hourly?.uv_index?.[index]),
    aqi: numberOrNull(airQuality?.current?.us_aqi),
  }
}
