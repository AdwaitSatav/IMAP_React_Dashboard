export const DEFAULT_CITY = { name: 'Mumbai', country: 'India', latitude: 19.07, longitude: 72.88 }

async function fetchJson(url, signal) {
  let response
  try {
    response = await fetch(url, { signal })
  } catch (err) {
    // Part 4: a failed network request (e.g. offline) gets a readable message; aborts pass through.
    if (err.name === 'AbortError') throw err
    throw new Error('No connection. Check your internet and try again.')
  }
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

// Part 4: city search (autocomplete). With no match the API leaves out "results", so return [].
export async function searchCities(name, signal) {
  const params = new URLSearchParams({ name, count: 5, language: 'en', format: 'json' })
  const data = await fetchJson('https://geocoding-api.open-meteo.com/v1/search?' + params, signal)
  return (data.results ?? []).map((place) => ({
    id: place.id,
    name: place.name,
    admin1: place.admin1,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
  }))
}
