import { useCallback } from 'react'
import { fetchAirQuality, fetchWeather, getCurrentConditions } from '../api/weather.js'
import { calculateGoOutScore } from '../utils/goOutScore.js'
import useFetch from './useFetch.js'

// Part 4: weather + air quality + current GoOut Score for one city, shared by Dashboard and Compare.
// The loaders change only when the coordinates change, and useFetch refetches when its fetcher
// changes, so picking a new city reloads everything. city = null means "nothing picked yet".
export default function useCityWeather(city) {
  const latitude = city?.latitude
  const longitude = city?.longitude
  const loadWeather = useCallback((signal) => latitude === undefined ? null
    : fetchWeather({ latitude, longitude }, signal), [latitude, longitude])
  const loadAirQuality = useCallback((signal) => latitude === undefined ? null
    : fetchAirQuality({ latitude, longitude }, signal), [latitude, longitude])

  const weather = useFetch(loadWeather)
  const air = useFetch(loadAirQuality)
  const conditions = getCurrentConditions(weather.data, air.data)
  const result = calculateGoOutScore(conditions)
  return { weather, air, conditions, result }
}
