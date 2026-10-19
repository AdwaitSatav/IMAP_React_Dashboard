import { useEffect, useState } from 'react'

// Part 4: returns `value` only after it has stopped changing for `delay` ms,
// so the search box sends one request per pause in typing, not one per key press.
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
