# GoOut Score Dashboard: Project Context

> Upload this file to Claude at the start of every part. Update it at the end of your part.

## Goal
A React dashboard (IMAP group project, "React Dashboard Consuming an API") that fetches live weather and
air-quality data from the free Open-Meteo APIs (no API key) and calculates a 0–100 **"Should I go out?"** score.

## Tech stack
- Vite + React 18
- React Router v6
- Recharts (added in Part 3)
- CSS Modules + global CSS variables in `src/index.css`

## Folder structure
```
goout-dashboard/
  index.html, package.json, vite.config.js
  PROJECT_CONTEXT.md        <- this file
  public/favicon.svg
  src/
    main.jsx                # entry, wraps App in BrowserRouter
    App.jsx                 # routes: / , /compare , /about , *
    index.css               # design tokens (colours, card, grid, placeholder, dark theme)
    api/weather.js          # Part 2: DEFAULT_CITY, fetchWeather, fetchAirQuality, getCurrentConditions
    hooks/useFetch.js       # Part 2: { data, loading, error, retry } with timeout + abort
    utils/
      goOutScore.js         # Part 2: calculateGoOutScore -> { score, label, tone } or null
      chartData.js          # Part 3: getNext24Hours, getNext24HoursAqi, getDailyForecast,
                            #         getBestHours, AQI_LEVELS, getAqiLevel
      chartTheme.js         # Part 3: shared Recharts axis / grid / tooltip styling
    components/
      Layout.jsx (+ .module.css)   # Navbar + <Outlet/> + Footer
      Navbar.jsx (+ .module.css)   # NavLink with active pill
      Footer.jsx
      ChartCard.jsx (+ .module.css)        # Part 3: card with title + loading / error / empty states
      HourlyTempChart.jsx                  # Part 3: next 24 h temperature line (°C)
      DailyForecastChart.jsx               # Part 3: 7-day min-max floating bars (°C)
      AqiTrendChart.jsx (+ .module.css)    # Part 3: next 24 h US AQI line with category bands + legend
      ScoreGauge.jsx (+ .module.css)       # Part 3: SVG half-circle gauge for the current score
      BestHours.jsx (+ .module.css)        # Part 3: 24 h hourly-score timeline, top 3 highlighted
    pages/
      Dashboard.jsx         # live cards (Part 2) + charts, gauge, best hours (Part 3)
      Compare.jsx           # placeholder (Part 4)
      About.jsx
      NotFound.jsx
```

## Conventions
- Functional components + hooks only. One component per file.
- Use the CSS variables (`--surface`, `--primary`, `--great`, `--good`, `--meh`, `--bad`, ...) and the
  global classes `.card`, `.grid`, `.page-title`, `.page-subtitle`.
- Component-specific styles go in `Name.module.css`.
- Don't rewrite existing files unless needed: extend them.
- Default city: Mumbai (lat 19.07, lon 72.88).
- Data is fetched once in `Dashboard.jsx` and passed to charts as props. Chart components never fetch.
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
Labels: 80-100 Great | 60-79 Good | 40-59 Mixed | <40 Stay in
```

## API endpoints
- Forecast: `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m&hourly=temperature_2m,precipitation_probability,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
- Air quality: `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=..&longitude=..&current=us_aqi&hourly=us_aqi&timezone=auto`
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=..&count=5`

## Part 3 notes (for Part 4)
- Hourly rows come from `getNext24Hours(weather, airQuality)`: 24 rows starting at the hour containing
  `weather.current.time`. AQI is matched to weather **by timestamp** (a Map), not by array index.
  Each row has `{ time, hour, temperature, rainChance, uvIndex, aqi, result }`; `result` is
  `calculateGoOutScore(...)` or `null` when an input is missing (those hours are skipped, never scored 0).
- Everything is driven by the `weather` / `air` data in `Dashboard.jsx`. When city search is added, changing
  the city passed to `fetchWeather` / `fetchAirQuality` updates every chart automatically.
- US AQI scale shown on the AQI chart: 0–50 Good, 51–100 Moderate, 101–150 Unhealthy for Sensitive Groups, 151+ Unhealthy.
- Chart colours use CSS variables, so Part 4's dark theme applies to the charts too.

## Progress
- [x] **Part 1 (Person A): Foundation.** Vite setup, routing, layout, Navbar, Footer, placeholder pages, design tokens.
- [x] **Part 2 (Person B): Data & logic.** `api/weather.js`, `useFetch`, `goOutScore.js`, live StatCards for Mumbai, loading/error/timeout/retry states.
- [x] **Part 3 (Person C): Visualisation.** Recharts hourly temperature, 7-day min/max forecast, AQI trend, ScoreGauge, BestHours timeline, chart loading/error/empty states.
- [ ] **Part 4 (Person D): Features & delivery.** City search, Compare page, favourites, dark mode toggle, About team roles, GitHub Actions, README, Vercel deployment check.

## Next task
**Part 4 (Person D).** City search (geocoding API), Compare page, favourites, dark mode toggle,
About page team roles, GitHub Actions (build check), README, and a final Vercel deployment check.
