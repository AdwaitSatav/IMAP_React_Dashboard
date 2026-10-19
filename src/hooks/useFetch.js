import { useCallback, useEffect, useState } from 'react'

export default function useFetch(fetcher) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setLoading(true)
    setError(null)
    setData(null)
    const timeout = setTimeout(() => {
      if (active) {
        setError('Request timed out. Please try again.')
        setLoading(false)
        controller.abort()
      }
    }, 15000)

    Promise.resolve().then(() => fetcher(controller.signal))
      .then((result) => {
        if (active && !controller.signal.aborted) setData(result)
      })
      .catch((err) => {
        if (active && !controller.signal.aborted) setError(err.message || 'Could not load data.')
      })
      .finally(() => {
        clearTimeout(timeout)
        if (active && !controller.signal.aborted) setLoading(false)
      })

    return () => {
      active = false
      clearTimeout(timeout)
      controller.abort()
    }
  }, [fetcher, attempt])

  return { data, loading, error, retry }
}
