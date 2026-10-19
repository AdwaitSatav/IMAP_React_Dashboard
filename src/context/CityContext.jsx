import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_CITY } from '../api/weather.js'
import { readStorage, writeStorage } from '../utils/storage.js'

// Part 4: the selected city and the favourite cities live here, so the search box, the Dashboard
// (cards, gauge, best hours, charts) and the Compare page all read the same state.
const CITY_KEY = 'goout-city'
const FAVOURITES_KEY = 'goout-favourites'

const CityContext = createContext(null)

// Only keep what the app needs, and reject anything malformed read back from localStorage.
function toCity(value) {
  if (!value || typeof value.name !== 'string') return null
  if (!Number.isFinite(value.latitude) || !Number.isFinite(value.longitude)) return null
  return {
    name: value.name,
    admin1: typeof value.admin1 === 'string' ? value.admin1 : undefined,
    country: typeof value.country === 'string' ? value.country : undefined,
    latitude: value.latitude,
    longitude: value.longitude,
  }
}

// Two search results for the same place can differ in the last decimals, so compare rounded coordinates.
export const cityKey = (city) => `${city.latitude.toFixed(2)},${city.longitude.toFixed(2)}`

export const cityLabel = (city) => [city.name, city.country].filter(Boolean).join(', ')

export function CityProvider({ children }) {
  const [city, setCityState] = useState(() => toCity(readStorage(CITY_KEY, null)) ?? DEFAULT_CITY)
  const [favourites, setFavourites] = useState(() => {
    const saved = readStorage(FAVOURITES_KEY, [])
    return Array.isArray(saved) ? saved.map(toCity).filter(Boolean) : []
  })

  useEffect(() => writeStorage(CITY_KEY, city), [city])
  useEffect(() => writeStorage(FAVOURITES_KEY, favourites), [favourites])

  const setCity = useCallback((next) => {
    const valid = toCity(next)
    if (valid) setCityState(valid)
  }, [])

  const isFavourite = useCallback((target) => favourites.some((fav) => cityKey(fav) === cityKey(target)),
    [favourites])

  const toggleFavourite = useCallback((target) => {
    const valid = toCity(target)
    if (!valid) return
    setFavourites((current) => current.some((fav) => cityKey(fav) === cityKey(valid))
      ? current.filter((fav) => cityKey(fav) !== cityKey(valid))
      : [...current, valid])
  }, [])

  const value = useMemo(() => ({ city, setCity, favourites, isFavourite, toggleFavourite }),
    [city, setCity, favourites, isFavourite, toggleFavourite])

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>
}

export function useCity() {
  const context = useContext(CityContext)
  if (!context) throw new Error('useCity must be used inside <CityProvider>')
  return context
}
