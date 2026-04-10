# UncleFlix

A premium Netflix-style OTT streaming PWA built with React and Vite — featuring genre-based browsing, YouTube-style player with auto-next, and smart playback memory.

## Tech Stack

- **Frontend:** React 18.3 + Vite 5
- **Styling:** Tailwind CSS with custom neon/glassmorphism theme
- **Routing:** React Router DOM v6
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **APIs:** TMDB for metadata/recommendations, VidSrc/VSEmbed for streaming

## Project Structure

```
src/
  components/
    Navbar.jsx           # Navigation bar
    HeroBanner.jsx       # Auto-cycling hero (accepts items[]), arrows + dots
    Card.jsx             # Glassmorphism card with glow hover + play button overlay
    Row.jsx              # Horizontal snap-scroll row with arrow nav
    VideoFrame.jsx       # 16:9 iframe player with back/title overlays
    Recommendations.jsx  # TMDB recommendations + trending fallback sidebar
    AutoNextOverlay.jsx  # TV auto-next countdown overlay (5s) with cancel
    GenreRow.jsx         # Horizontal genre pill strip linking to /genre/:type/:id
    SeasonSelector.jsx   # Season dropdown (standalone or inline mode)
    EpisodeSelector.jsx  # Styled episode list with active highlight
  pages/
    Home.jsx      # Hero + Continue Watching + genre rows + trending rows
    Movies.jsx    # Movies page with genre strip
    TV.jsx        # TV shows page with genre strip
    Search.jsx    # Debounced multi-search
    Watch.jsx     # Full player page: video + auto-next + TMDB recs sidebar
    MyList.jsx    # Saved watchlist
    Genre.jsx     # /genre/:type/:id grid with pagination ("Load More")
  hooks/
    useLocalStorage.js   # useRecentlyViewed, useWatchlist, usePlaybackMemory
  utils/
    tmdb.js              # All TMDB API helpers
  App.jsx         # Router including /genre/:type/:id
  main.jsx        # Entry point (StrictMode)
```

## Key Features

### Watch Page
- **Clean layout**: video player → title/meta → episodes (TV) → recommendations (mobile) | sidebar (desktop)
- **No clutter**: removed "Watch Now" button; only "Watch Trailer" pill and "Next: S1 E2" shortcut visible
- **Auto-next episode**: "Next: S1 E2" button triggers 5-second countdown overlay with cancel
- **Playback memory**: saves last watched season/episode per show to localStorage; resumes on return
- **Real TMDB recommendations**: `/movie/{id}/recommendations` and `/tv/{id}/recommendations`, falls back to trending
- **Inline season selector** next to "Episodes" heading for cleaner layout

### Genre Browsing
- **GenreRow**: horizontal scrollable pill strip with emoji + genre name + arrow
- **Genre page**: `/genre/:type/:id?name=X` — full grid, "Load More" pagination, breadcrumb back nav
- Available on Home, Movies, and TV pages

### Homepage
- Auto-cycling hero banner (8 trending items, 6s interval)
- Continue Watching row at the top
- Two genre strips (Movies + TV)
- Six content rows (trending, popular, top-rated × 2)

### Playback Memory Schema (localStorage)
```json
{ "tv-1396": { "id": "1396", "type": "tv", "season": 2, "episode": 5, "timestamp": 1234567890 } }
```

## Configuration

- **Dev server:** `0.0.0.0:5000`
- **Theme:** Primary `#0B0F1A` · Accent `#3B82F6` · Glow `#22D3EE`
- **TMDB API key:** Hardcoded in `src/utils/tmdb.js`
- **Deployment:** Static → `dist/` via `npm run build`

## Running

```bash
npm install
npm run dev     # Dev server on port 5000
npm run build   # Production build
```
