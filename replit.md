# UncleFlix

A Netflix-style streaming PWA built with React and Vite.

## Tech Stack

- **Frontend:** React 18.3 + Vite 5
- **Styling:** Tailwind CSS with custom neon/glassmorphism theme
- **Routing:** React Router DOM v6
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **APIs:** TMDB (The Movie Database) for metadata, VidSrc/VSEmbed for streaming

## Project Structure

```
src/
  components/   # Reusable UI (Navbar, HeroBanner, Card, Row, etc.)
  pages/        # Route-level pages (Home, Movies, TV, Search, Watch, MyList)
  hooks/        # Custom hooks (useLocalStorage)
  utils/        # API helpers (tmdb.js)
  App.jsx       # Root component with routes
  main.jsx      # Entry point
public/         # Static assets, PWA manifest, service worker
```

## Configuration

- **Dev server:** Vite on `0.0.0.0:5000`
- **TMDB API key:** Hardcoded in `src/utils/tmdb.js`
- **Deployment:** Static site — builds to `dist/` via `npm run build`

## Running

```bash
npm install
npm run dev       # Development server on port 5000
npm run build     # Production build to dist/
```

## Features

- Browse trending movies and TV shows (via TMDB)
- Search for content
- Personal Watchlist (localStorage)
- Recently watched history (localStorage)
- Video player with trailer and full content support
- Season/episode selectors for TV shows
- PWA installable with offline support
