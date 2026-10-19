# GoOut Score Dashboard: Project Context

> Upload this file to Claude at the start of every part. Update it at the end of your part.

## Goal
A React dashboard (IMAP group project, "React Dashboard Consuming an API") that fetches live weather and
air-quality data from the free Open-Meteo APIs (no API key) and calculates a 0–100 **"Should I go out?"** score.

## Tech stack
- Vite + React 18
- React Router v6
- Recharts (added in Part 3)
- CSS Modules + global CSS variables in `src/index.css` (light + dark theme)
- React Context (`CityContext`) for the selected city and favourites (Part 4)
- GitHub Actions build check, Vercel hosting (Part 4)

## Folder structure
```
goout-dashboard/
  index.html                # Part 4: inline script applies saved/system theme before React loads
  package.json, vite.config.js
  vercel.json               # Part 4: SPA rewrite so /compare and /about work on reload
  .github/workflows/ci.yml  # Part 4: npm ci + npm run build on every PR and push to main (Node 20)
  README.md, PROJECT_CONTEXT.md
  public/favicon.svg
  src/
    main.jsx                # entry: BrowserRouter > CityProvider > App
    App.jsx                 # routes: / , /compare , /about , *
    index.css               # design tokens, [data-theme='dark'] overrides (incl. brighter score tones)
    api/weather.js          # DEFAULT_CITY (Mumbai, India), fetchWeather, fetchAirQuality,
                            # getCurrentConditions, searchCities (Part 4, geocoding)
    context/CityContext.jsx # Part 4: { city, setCity, favourites, isFavourite, toggleFavourite },
                            #         cityKey, cityLabel. Persists to localStorage.
    hooks/
      useFetch.js           # Part 2: { data, loading, error, retry } with timeout + abort
      useCityWeather.js     # Part 4: { weather, air, conditions, result } for one city (or null)
      useDebounce.js        # Part 4: debounced value (300 ms) for the search box
      useTheme.js           # Part 4: { theme, toggleTheme }, sets data-theme on <html>
    utils/
      goOutScore.js         # calculateGoOutScore -> { score, label, tone } or null; SCORE_LEVELS (Part 4)
      chartData.js          # Part 3: getNext24Hours, getNext24HoursAqi, getDailyForecast,
                            #         getBestHours, AQI_LEVELS, getAqiLevel
      chartTheme.js         # Part 3: shared Recharts axis / grid / tooltip styling
      storage.js            # Part 4: readStorage / writeStorage (JSON + try/catch)
    components/
      Layout.jsx (+ .module.css)   # Navbar + <Outlet/> + Footer
      Navbar.jsx (+ .module.css)   # NavLink with active pill + dark mode toggle (Part 4)
      Footer.jsx
      CitySearch.jsx (+ .module.css)       # Part 4: geocoding autocomplete combobox (debounced, keyboard)
      FavouriteButton.jsx                  # Part 4: star toggle for a city
      FavouriteChips.jsx                   # Part 4: saved cities as quick-select chips
      Favourites.module.css                # Part 4: styles for the two above
      CompareColumn.jsx (+ .module.css)    # Part 4: one city on the Compare page (presentational)
      ChartCard.jsx (+ .module.css)        # Part 3: card with title + loading / error / empty states
      HourlyTempChart.jsx                  # Part 3: next 24 h temperature line (°C)
      DailyForecastChart.jsx               # Part 3: 7-day min-max floating bars (°C)
      AqiTrendChart.jsx (+ .module.css)    # Part 3: next 24 h US AQI line with category bands + legend
      ScoreGauge.jsx (+ .module.css)       # Part 3: SVG half-circle gauge; legend from SCORE_LEVELS (Part 4)
      BestHours.jsx (+ .module.css)        # Part 3: 24 h hourly-score timeline, top 3 highlighted
    pages/
      Dashboard.jsx (+ .module.css)  # city bar (search, star, chips) + cards + gauge + best hours + charts
      Compare.jsx (+ .module.css)    # Part 4: two cities, verdict
      About.jsx (+ .module.css)      # Part 4: description, features, stack, APIs, formula, team
      NotFound.jsx
```

## Conventions
- Functional components + hooks only. One component per file.
- Use the CSS variables (`--surface`, `--primary`, `--great`, `--good`, `--meh`, `--bad`, ...) and the
  global classes `.card`, `.grid`, `.page-title`, `.page-subtitle`.
- Component-specific styles go in `Name.module.css`.
- Don't rewrite existing files unless needed: extend them.
- Default city: Mumbai (lat 19.07, lon 72.88).
- Data is fetched through `useCityWeather(city)` (which uses `useFetch`) in the page components and passed
  down as props. Charts and `CompareColumn` never fetch.
- The selected city comes from `useCity()` (CityContext). Never hard-code a city in a page.
- localStorage only through `utils/storage.js`. Keys: `goout-city`, `goout-favourites`, `goout-theme`.
- Times: requests use `timezone=auto`, so API times are the city's local time strings ("2026-10-19T14:00").
  Read them as strings and start from `current.time`; never use the browser clock (`new Date()`) for labels.

## GoOut Score formula
```
score = 100
score -= |temperature - 25| * 2
score -= precipitation_probability * 0.4
score -= max(0, us_aqi - 50) * 0.3
score -= max(0, uv_index - 6) * 4
score  = clamp(round(score), 0, 100)
Labels (SCORE_LEVELS): 80-100 Great day to go out | 60-79 Good time to go out
        40-59 Mixed conditions | <40 Maybe stay in
```

## API endpoints
- Forecast: `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m&hourly=temperature_2m,precipitation_probability,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
- Air quality: `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=..&longitude=..&current=us_aqi&hourly=us_aqi&timezone=auto`
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=..&count=5&language=en&format=json`
  (no matches -> the response has no `results` key; `searchCities` returns `[]`)

## Part 3 notes
- Hourly rows come from `getNext24Hours(weather, airQuality)`: 24 rows starting at the hour containing
  `weather.current.time`. AQI is matched to weather **by timestamp** (a Map), not by array index.
  Each row has `{ time, hour, temperature, rainChance, uvIndex, aqi, result }`; `result` is
  `calculateGoOutScore(...)` or `null` when an input is missing (those hours are skipped, never scored 0).
- Everything is driven by the `weather` / `air` data in `Dashboard.jsx`. When city search is added, changing
  the city passed to `fetchWeather` / `fetchAirQuality` updates every chart automatically.
- US AQI scale shown on the AQI chart: 0–50 Good, 51–100 Moderate, 101–150 Unhealthy for Sensitive Groups, 151+ Unhealthy.
- Chart colours use CSS variables, so Part 4's dark theme applies to the charts too.

## Part 4 notes
- Changing the city: `setCity(place)` in CityContext -> `useCityWeather` gets new coordinates -> its
  `useCallback` loaders change -> `useFetch` refetches -> cards, gauge, best hours and charts update.
- City search: input text -> `useDebounce(300)` -> `useFetch(searchCities)`; stale requests are aborted
  by `useFetch`. Needs 2+ characters. Arrow keys / Enter / Escape supported.
- Compare: `Compare.jsx` calls `useCityWeather` twice (first city defaults to the Dashboard city) and builds
  the verdict from both `calculateGoOutScore` results. Each column has its own loading / error / retry.
- Dark mode: `useTheme` sets `data-theme` on `<html>`; saved choice wins, otherwise the system preference
  (and it follows system changes until the user picks). All colours, including Recharts, are CSS variables.
- Network failures (offline) show "No connection. Check your internet and try again." from `fetchJson`.

## Progress
- [x] **Part 1 (Person A): Foundation.** Vite setup, routing, layout, Navbar, Footer, placeholder pages, design tokens.
- [x] **Part 2 (Person B): Data & logic.** `api/weather.js`, `useFetch`, `goOutScore.js`, live StatCards for Mumbai, loading/error/timeout/retry states.
- [x] **Part 3 (Person C): Visualisation.** Recharts hourly temperature, 7-day min/max forecast, AQI trend, ScoreGauge, BestHours timeline, chart loading/error/empty states.
- [x] **Part 4 (Person D): Features & delivery.** City search (geocoding, debounced), CityContext + last city remembered, Compare page with verdict, favourites, dark mode toggle, gauge legend labels fixed, About page (team roles), GitHub Actions CI, README, `vercel.json` SPA rewrite, responsive check at phone width.

## Status
All four parts are complete. Remaining before submission: put real names in `src/pages/About.jsx` (TEAM) and the
README team table, add screenshots to the README, and check the live Vercel site after merging.
