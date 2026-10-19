import { useCallback, useId, useState } from 'react'
import { searchCities } from '../api/weather.js'
import useDebounce from '../hooks/useDebounce.js'
import useFetch from '../hooks/useFetch.js'
import styles from './CitySearch.module.css'

const MIN_LENGTH = 2

// Part 4: search box with autocomplete (Open-Meteo geocoding). Used on the Dashboard and twice on Compare.
// Typing is debounced (300 ms); useFetch aborts the previous request when the query changes.
export default function CitySearch({ onSelect, label = 'Search for a city', placeholder = 'e.g. Pune, London, Tokyo' }) {
  const id = useId()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const search = useDebounce(query.trim(), 300)

  const loadCities = useCallback((signal) => search.length < MIN_LENGTH ? null
    : searchCities(search, signal), [search])
  const { data, loading, error, retry } = useFetch(loadCities)
  const results = data ?? []
  // While the user is still typing (or the request is running) the old results are stale.
  const pending = query.trim() !== search || loading
  const showList = open && query.trim().length >= MIN_LENGTH

  function choose(place) {
    onSelect(place)
    setQuery('')
    setOpen(false)
    setActive(-1)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!showList || pending || results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      choose(results[Math.max(active, 0)])
    }
  }

  let status = null
  if (pending) status = 'Searching…'
  else if (error) status = (
    <>
      {error}{' '}
      <button type="button" className={styles.retry} onMouseDown={(e) => e.preventDefault()} onClick={retry}>
        Try again
      </button>
    </>
  )
  else if (results.length === 0) status = `No cities found for "${search}".`

  return (
    <div className={styles.search}>
      <label htmlFor={`${id}-input`} className={styles.label}>{label}</label>
      <input
        id={`${id}-input`}
        className={styles.input}
        type="search"
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        role="combobox"
        aria-expanded={showList}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={showList && active >= 0 && !pending ? `${id}-option-${active}` : undefined}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      />
      {showList && (
        <div className={styles.popup}>
          {status ? (
            <p className={styles.status} role="status">{status}</p>
          ) : (
            <ul id={`${id}-list`} role="listbox" className={styles.list} aria-label="Matching cities">
              {results.map((place, i) => (
                <li
                  key={place.id ?? `${place.latitude},${place.longitude}`}
                  id={`${id}-option-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? `${styles.option} ${styles.active}` : styles.option}
                  // mousedown fires before the input's blur, so keep focus long enough for the click.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(place)}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className={styles.name}>{place.name}</span>
                  <span className={styles.place}>{[place.admin1, place.country].filter(Boolean).join(', ')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <span className={styles.srOnly} aria-live="polite">
        {showList && !pending && !error ? `${results.length} ${results.length === 1 ? 'city' : 'cities'} found` : ''}
      </span>
    </div>
  )
}
