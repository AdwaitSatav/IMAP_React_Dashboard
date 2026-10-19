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
    api/weather.js          # Part 2: fetch functions (placeholder now)
    hooks/useFetch.js       # Part 2: custom hook (placeholder now)
    utils/goOutScore.js     # Part 2: score formula (placeholder now)
    components/
      Layout.jsx (+ .module.css)   # Navbar + <Outlet/> + Footer
      Navbar.jsx (+ .module.css)   # NavLink with active pill
      Footer.jsx
    pages/
      Dashboard.jsx         # placeholder cards
      Compare.jsx           # placeholder
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

## GoOut Score formula (for Part 2)
```
score = 100
score -= |temperature - 25| * 2
score -= precipitation_probability * 0.4
score -= max(0, us_aqi - 50) * 0.3
score -= max(0, uv_index - 6) * 4
score  = clamp(round(score), 0, 100)
Labels: 80-100 Great | 60-79 Good | 40-59 Meh | <40 Stay in
```

## API endpoints
- Forecast: `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,precipitation_probability,uv_index&hourly=temperature_2m,precipitation_probability,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
- Air quality: `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=..&longitude=..&current=us_aqi&hourly=us_aqi&timezone=auto`
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=..&count=5`

## Progress
- [x] **Part 1 (Person A): Foundation.** Vite setup, routing, layout, Navbar, Footer, placeholder pages, design tokens.
- [ ] **Part 2 (Person B): Data & logic.** `api/weather.js`, `useFetch`, `goOutScore.js`, live StatCards for Mumbai, loading/error states.
- [ ] **Part 3 (Person C): Visualisation.** Recharts: hourly temperature, 7-day forecast, AQI trend, ScoreGauge, BestHours timeline.
- [ ] **Part 4 (Person D): Features & delivery.** City search, Compare page, favourites, dark mode toggle, About team roles, GitHub Actions, README, Vercel deploy.

## Next task
**Part 2 (Person B).** See the Progress list above.
