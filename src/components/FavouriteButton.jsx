import { useCity } from '../context/CityContext.jsx'
import styles from './Favourites.module.css'

// Part 4: star button that saves / removes a city from the favourites (stored in localStorage by CityContext).
export default function FavouriteButton({ city }) {
  const { isFavourite, toggleFavourite } = useCity()
  const saved = isFavourite(city)
  return (
    <button type="button" className={saved ? `${styles.star} ${styles.saved}` : styles.star}
      aria-pressed={saved} onClick={() => toggleFavourite(city)}
      title={saved ? `Remove ${city.name} from favourites` : `Save ${city.name} to favourites`}>
      <span aria-hidden="true">{saved ? '★' : '☆'}</span>
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
