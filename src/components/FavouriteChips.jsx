import { cityKey, cityLabel, useCity } from '../context/CityContext.jsx'
import styles from './Favourites.module.css'

// Part 4: saved cities as quick-select chips. `selected` is highlighted; `onSelect` decides what a click does
// (the Dashboard switches the shared city, each Compare column sets its own city).
export default function FavouriteChips({ selected, onSelect, label = 'Favourites' }) {
  const { favourites } = useCity()
  if (favourites.length === 0) {
    return <p className={styles.hint}>Tip: press ☆ Save to keep a city here for one-click access.</p>
  }
  const selectedKey = selected ? cityKey(selected) : null
  return (
    <div className={styles.chips} role="group" aria-label={label}>
      <span className={styles.chipsLabel}>{label}:</span>
      {favourites.map((fav) => {
        const isSelected = cityKey(fav) === selectedKey
        return (
          <button key={cityKey(fav)} type="button" title={cityLabel(fav)} aria-pressed={isSelected}
            className={isSelected ? `${styles.chip} ${styles.chipActive}` : styles.chip}
            onClick={() => onSelect(fav)}>
            {fav.name}
          </button>
        )
      })}
    </div>
  )
}
