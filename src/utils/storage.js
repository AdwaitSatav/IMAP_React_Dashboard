// Part 4: safe localStorage helpers. Storage can be blocked (private mode, disabled cookies)
// or hold old / hand-edited data, so every read and write is wrapped in try/catch.
export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore: the app still works, the choice just isn't remembered.
  }
}
